import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import { claudeService } from './claudeService';
import { mcpTools } from './tools';
import { ToolExecutor } from './toolExecutor';
import { ChatRequestSchema, ToolCallRequestSchema, PromptRequestSchema } from './types';
import { generateAccessToken } from '../../helper/auth';

type AuthorizationCodeRecord = {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  scope: string;
  expiresAt: number;
};

const authorizationCodes = new Map<string, AuthorizationCodeRecord>();

const base64UrlEncode = (buffer: Buffer) => buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/**
 * MCP Server Controller
 * Handles all MCP-related endpoints
 */
export class MCPController {
  /**
   * Get MCP server capabilities
   * Returns information about available tools, resources, and prompts
   */
  static getCapabilities = asyncHandler(async (req: Request, res: Response) => {
    res.json({
      status: 'success',
      data: {
        serverInfo: {
          name: 'HRM MCP Server',
          version: '1.0.0',
          description: 'Model Context Protocol server for HRM system integration with Claude AI',
        },
        capabilities: {
          tools: {
            available: true,
            count: mcpTools.length,
          },
          resources: {
            available: true,
            count: 0, // Can be expanded later
          },
          prompts: {
            available: true,
            count: 3, // Predefined prompts
          },
        },
        protocolVersion: '2024-11-05',
      },
    });
  });

  /**
   * List all available tools
   */
  static listTools = asyncHandler(async (req: Request, res: Response) => {
    res.json({
      status: 'success',
      data: {
        tools: mcpTools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })),
      },
    });
  });

  static async stream(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial connection event
    res.write('data: {"type":"connected"}\n\n');

    // Keep connection alive
    const keepAlive = setInterval(() => {
      res.write(':keepalive\n\n');
    }, 30000);

    req.on('close', () => {
      clearInterval(keepAlive);
    });
  }

  /**
   * Call a specific tool
   */
  static callTool = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = ToolCallRequestSchema.parse(req.body);
    const { name, arguments: args = {} } = validatedData;

    const result = await ToolExecutor.execute(name, args, req);

    res.json({
      status: result.isError ? 'error' : 'success',
      data: result,
    });
  });

  /**
   * List available prompts
   */
  static listPrompts = asyncHandler(async (req: Request, res: Response) => {
    const prompts = [
      {
        name: 'employee_onboarding_check',
        description: 'Check onboarding status and identify any incomplete items',
        arguments: [
          {
            name: 'days',
            description: 'Number of days since joining to check',
            required: false,
          },
        ],
      },
      {
        name: 'attendance_analysis',
        description: 'Analyze attendance patterns and identify issues',
        arguments: [
          {
            name: 'departmentId',
            description: 'Specific department to analyze',
            required: false,
          },
          {
            name: 'days',
            description: 'Number of days to analyze',
            required: false,
          },
        ],
      },
      {
        name: 'recruitment_pipeline_review',
        description: 'Review recruitment pipeline and provide insights',
        arguments: [
          {
            name: 'jobOpeningId',
            description: 'Specific job opening to review',
            required: false,
          },
        ],
      },
    ];

    res.json({
      status: 'success',
      data: { prompts },
    });
  });

  /**
   * Get a specific prompt
   */
  static getPrompt = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = PromptRequestSchema.parse(req.body);
    const { name, arguments: args = {} } = validatedData;

    let promptMessages: any[] = [];

    switch (name) {
      case 'employee_onboarding_check':
        promptMessages = [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Please check the onboarding status of employees who joined in the last ${args.days || 30} days. Identify anyone with incomplete onboarding and list what items are pending.`,
            },
          },
        ];
        break;

      case 'attendance_analysis':
        promptMessages = [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Analyze attendance patterns for ${args.departmentId ? 'the specified department' : 'the company'} over the last ${args.days || 30} days. Identify any concerning patterns like frequent absences, late arrivals, or anomalies.`,
            },
          },
        ];
        break;

      case 'recruitment_pipeline_review':
        promptMessages = [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Review the recruitment pipeline${args.jobOpeningId ? ' for the specified job opening' : ''}. Provide insights on candidate flow, bottlenecks, pending feedback, and recommendations.`,
            },
          },
        ];
        break;

      default:
        res.status(404).json({
          status: 'error',
          message: `Prompt not found: ${name}`,
        });
        return;
    }

    res.json({
      status: 'success',
      data: {
        description: `Prompt: ${name}`,
        messages: promptMessages,
      },
    });
  });

  /**
   * Chat with Claude AI
   * Main endpoint for conversational interactions
   * Supports typeOfResponse: 'json' (default), 'md', 'pdf'
   */
  static chat = asyncHandler(async (req: Request, res: Response) => {
    const { message, conversationHistory = [], useTools = true, typeOfResponse = 'json' } = req.body;

    const result = await claudeService.chat(message, conversationHistory, useTools, req);

    // If tool(s) were called, try to return structured data instead of AI's text summary
    const shouldReturnRawData = result.toolCalls.length > 0 && typeOfResponse.toLowerCase() === 'json';

    if (shouldReturnRawData) {
      try {
        // Single tool call - return its data directly
        if (result.toolCalls.length === 1) {
          const toolResult = result.toolCalls[0].result;

          if (toolResult.content && toolResult.content[0] && toolResult.content[0].text) {
            const parsedData = JSON.parse(toolResult.content[0].text);

            // Ensure meta field is always present
            if (!parsedData.meta) {
              parsedData.meta = {
                message: result.response || `Query results retrieved successfully`,
              };
            }

            res.json(parsedData);
            return;
          }
        }

        // Multiple tool calls - combine their results
        if (result.toolCalls.length > 1) {
          const combinedData: any = {};
          const toolMessages: string[] = [];

          for (const toolCall of result.toolCalls) {
            if (toolCall.result.content && toolCall.result.content[0] && toolCall.result.content[0].text) {
              const parsed = JSON.parse(toolCall.result.content[0].text);

              // Merge data from each tool
              if (parsed.data) {
                Object.assign(combinedData, parsed.data);
              }

              // Collect messages
              if (parsed.meta && parsed.meta.message) {
                toolMessages.push(parsed.meta.message);
              }
            }
          }

          // Return combined structured data
          res.json({
            data: combinedData,
            meta: {
              message: result.response || toolMessages.join('; '),
              timestamp: new Date().toISOString(),
              toolsCalled: result.toolCalls.length,
            },
          });
          return;
        }
      } catch {
        // If parsing fails, fall through to text response
      }
    }

    // Format response based on typeOfResponse (like HYPER modules - clean responses)
    switch (typeOfResponse.toLowerCase()) {
      case 'md':
      case 'markdown':
        // Return markdown formatted response
        res.setHeader('Content-Type', 'text/markdown');
        res.send(result.response);
        break;

      case 'pdf':
        // For PDF, we'd need to generate it from the response
        // For now, return JSON with PDF generation instructions
        res.json({
          message: 'PDF generation requires using generate_dynamic_report or generate_quick_report tools',
          response: result.response,
        });
        break;

      case 'json':
      default:
        // Return AI's text response
        res.json({
          data: result.response,
        });
        break;
    }
  });

  /**
   * Get MCP server status and health
   */
  static getStatus = asyncHandler(async (req: Request, res: Response) => {
    res.json({
      status: 'success',
      data: {
        serverStatus: 'online',
        claudeApiConnected: true,
        availableTools: mcpTools.length,
        timestamp: new Date().toISOString(),
      },
    });
  });

  /**
   * Get available Claude models
   */
  static getModels = asyncHandler(async (req: Request, res: Response) => {
    const models = claudeService.getAvailableModels();

    res.json({
      status: 'success',
      data: {
        models: models.map((model) => ({
          id: model,
          name: model,
          provider: 'Anthropic',
        })),
      },
    });
  });
  /**
   * OAuth2 token endpoint supporting client_credentials and authorization_code (PKCE) grants
   */
  // static getOAuthToken = asyncHandler(async (req: Request, res: Response) => {
  //   const expectedClientId = process.env.MCP_OAUTH_CLIENT_ID;
  //   const expectedClientSecret = process.env.MCP_OAUTH_CLIENT_SECRET;

  //   if (!expectedClientId || !expectedClientSecret) {
  //     res.status(500).json({
  //       error: 'oauth_not_configured',
  //       error_description: 'MCP_OAUTH_CLIENT_ID/SECRET environment variables are not configured',
  //     });
  //     return;
  //   }

  //   const grantTypeRaw = (req.body?.grant_type || req.query?.grant_type) as string | undefined;
  //   const grantType = grantTypeRaw || 'client_credentials';

  //   let clientId = req.body?.client_id || req.query?.client_id;
  //   let clientSecret = req.body?.client_secret || req.query?.client_secret;

  //   const authHeader = req.headers.authorization;
  //   if (authHeader?.startsWith('Basic ')) {
  //     try {
  //       const decoded = Buffer.from(authHeader.replace('Basic ', ''), 'base64').toString('utf8');
  //       const [id, secret] = decoded.split(':');
  //       clientId = id || clientId;
  //       clientSecret = secret || clientSecret;
  //     } catch {
  //       // ignore errors
  //     }
  //   }

  //   if (!clientId || !clientSecret) {
  //     res.status(400).json({
  //       error: 'invalid_request',
  //       error_description: 'Missing client_id or client_secret',
  //     });
  //     return;
  //   }

  //   if (clientId !== expectedClientId || clientSecret !== expectedClientSecret) {
  //     res.status(401).json({
  //       error: 'invalid_client',
  //       error_description: 'Client authentication failed',
  //     });
  //     return;
  //   }

  //   const scopeFromEnv = process.env.MCP_OAUTH_SCOPE || 'user:manager user:hr user:admin';

  //   if (grantType === 'client_credentials') {
  //     const scope = scopeFromEnv.split(/\s+/).filter(Boolean);

  //     const payload = {
  //       userId: 'mcp-oauth-service',
  //       username: 'mcp-oauth-service',
  //       role: 'system',
  //       scope,
  //     };

  //     const accessToken = generateAccessToken(payload);
  //     const expiresInEnv = Number(process.env.JWT_EXPIRATION_SECONDS);
  //     const expiresIn = Number.isFinite(expiresInEnv) && expiresInEnv > 0 ? expiresInEnv : 86400;

  //     res.json({
  //       access_token: accessToken,
  //       token_type: 'Bearer',
  //       expires_in: expiresIn,
  //       scope: scope.join(' '),
  //     });
  //     return;
  //   }

  //   if (grantType === 'authorization_code') {
  //     const code = (req.body?.code || req.query?.code) as string | undefined;
  //     const redirectUri = (req.body?.redirect_uri || req.query?.redirect_uri) as string | undefined;
  //     const codeVerifier = (req.body?.code_verifier || req.query?.code_verifier) as string | undefined;

  //     if (!code || !redirectUri || !codeVerifier) {
  //       res.status(400).json({
  //         error: 'invalid_request',
  //         error_description: 'Missing code, redirect_uri, or code_verifier',
  //       });
  //       return;
  //     }

  //     const record = authorizationCodes.get(code);
  //     authorizationCodes.delete(code);

  //     if (!record) {
  //       res.status(400).json({
  //         error: 'invalid_grant',
  //         error_description: 'Authorization code is invalid or has already been used',
  //       });
  //       return;
  //     }

  //     if (record.expiresAt < Date.now()) {
  //       res.status(400).json({
  //         error: 'invalid_grant',
  //         error_description: 'Authorization code has expired',
  //       });
  //       return;
  //     }

  //     if (record.clientId !== clientId) {
  //       res.status(400).json({
  //         error: 'invalid_grant',
  //         error_description: 'Authorization code was not issued to this client',
  //       });
  //       return;
  //     }

  //     if (record.redirectUri !== redirectUri) {
  //       res.status(400).json({
  //         error: 'invalid_grant',
  //         error_description: 'redirect_uri does not match original request',
  //       });
  //       return;
  //     }

  //     if (record.codeChallengeMethod !== 'S256') {
  //       res.status(400).json({
  //         error: 'invalid_grant',
  //         error_description: 'Unsupported PKCE code challenge method',
  //       });
  //       return;
  //     }

  //     const expectedChallenge = base64UrlEncode(crypto.createHash('sha256').update(codeVerifier).digest());
  //     if (expectedChallenge !== record.codeChallenge) {
  //       res.status(400).json({
  //         error: 'invalid_grant',
  //         error_description: 'PKCE verification failed',
  //       });
  //       return;
  //     }

  //     const scope = record.scope.split(/\s+/).filter(Boolean);
  //     const payload = {
  //       userId: 'mcp-oauth-user',
  //       username: 'mcp-oauth-user',
  //       role: 'system',
  //       scope,
  //     };

  //     const accessToken = generateAccessToken(payload);
  //     const expiresInEnv = Number(process.env.JWT_EXPIRATION_SECONDS);
  //     const expiresIn = Number.isFinite(expiresInEnv) && expiresInEnv > 0 ? expiresInEnv : 86400;

  //     res.json({
  //       access_token: accessToken,
  //       token_type: 'Bearer',
  //       expires_in: expiresIn,
  //       scope: scope.join(' '),
  //     });
  //     return;
  //   }

  //   res.status(400).json({
  //     error: 'unsupported_grant_type',
  //     error_description: 'Supported grant types: client_credentials, authorization_code',
  //   });
  // });

  // static async getOAuthToken(req: Request, res: Response) {
  //   try {
  //     const { grant_type, client_id, client_secret, scope } = req.body;

  //     // Validate grant type
  //     if (grant_type !== 'client_credentials') {
  //       return res.status(400).json({
  //         error: 'unsupported_grant_type',
  //         error_description: 'Only client_credentials grant type is supported',
  //       });
  //     }

  //     // Verify client credentials
  //     const validClientId = process.env.MCP_CLIENT_ID || 'mcpOauthClinetId123';
  //     const validClientSecret = process.env.MCP_CLIENT_SECRET || 'mcpOauthClientSecret456';

  //     if (client_id !== validClientId || client_secret !== validClientSecret) {
  //       return res.status(401).json({
  //         error: 'invalid_client',
  //         error_description: 'Invalid client credentials',
  //       });
  //     }

  //     // Generate JWT token with appropriate roles
  //     const payload = {
  //       clientId: client_id,
  //       roles: ['user:manager', 'user:hr'],
  //       type: 'mcp_client',
  //       iat: Math.floor(Date.now() / 1000),
  //     };

  //     const accessToken = generateAccessToken(payload);

  //     return res.json({
  //       access_token: accessToken,
  //       token_type: 'Bearer',
  //       expires_in: 36000,
  //       scope: scope || 'mcp:tools mcp:prompts',
  //     });
  //   } catch (error: any) {
  //     console.error('OAuth token error:', error);
  //     return res.status(500).json({
  //       error: 'server_error',
  //       error_description: error.message,
  //     });
  //   }
  // }

  static async getOAuthToken(req: Request, res: Response) {
    try {
      const { grant_type, client_id, client_secret } = req.body;

      console.log('=== MCP OAuth Request ===');
      console.log('grant_type:', grant_type);
      console.log('client_id:', client_id);
      console.log('client_secret:', client_secret ? '***provided***' : 'missing');

      // Validate grant type
      if (grant_type !== 'client_credentials') {
        return res.status(400).json({
          error: 'unsupported_grant_type',
        });
      }

      // Match EXACTLY what's in your config.json
      const VALID_CLIENT_ID = 'mcpOauthClinetId123';
      const VALID_CLIENT_SECRET = 'mcpOauthClientSecret456';

      // Validate credentials
      if (client_id !== VALID_CLIENT_ID || client_secret !== VALID_CLIENT_SECRET) {
        console.error('❌ Invalid credentials');
        console.error('Expected client_id:', VALID_CLIENT_ID);
        console.error('Received client_id:', client_id);
        console.error('Secrets match:', client_secret === VALID_CLIENT_SECRET);

        return res.status(401).json({
          error: 'invalid_client',
          error_description: 'Invalid client credentials',
        });
      }

      console.log('✅ Credentials valid');

      // Generate JWT token
      const payload = {
        clientId: client_id,
        roles: ['user:manager', 'user:hr', 'user:admin'],
        type: 'mcp_client',
        iat: Math.floor(Date.now() / 1000),
      };

      const accessToken = generateAccessToken(payload);

      console.log('✅ Token generated successfully');

      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
      });
    } catch (error: any) {
      console.error('❌ OAuth error:', error);
      return res.status(500).json({
        error: 'server_error',
        error_description: error.message,
      });
    }
  }
  /**
   * OAuth2 authorization endpoint (Authorization Code + PKCE)
   */
  static authorize = asyncHandler(async (req: Request, res: Response) => {
    const expectedClientId = process.env.MCP_OAUTH_CLIENT_ID;
    if (!expectedClientId) {
      res.status(500).send('OAuth is not configured on this server.');
      return;
    }

    const clientId = req.query.client_id as string | undefined;
    const responseType = req.query.response_type as string | undefined;
    const redirectUri = (req.query.redirect_uri as string | undefined) || process.env.MCP_OAUTH_DEFAULT_REDIRECT_URI;
    const codeChallenge = req.query.code_challenge as string | undefined;
    const codeChallengeMethod = (req.query.code_challenge_method as string | undefined)?.toUpperCase();
    const state = req.query.state as string | undefined;
    const scope = (req.query.scope as string | undefined) || process.env.MCP_OAUTH_SCOPE || 'claudeai';

    if (!clientId || clientId !== expectedClientId) {
      res.status(400).send('Invalid client_id');
      return;
    }

    if (responseType !== 'code') {
      res.status(400).send('Unsupported response_type');
      return;
    }

    if (!redirectUri) {
      res.status(400).send('Missing redirect_uri');
      return;
    }

    const allowedRedirectsEnv = process.env.MCP_OAUTH_ALLOWED_REDIRECTS || 'https://claude.ai/api/mcp/auth_callback';
    const allowedRedirects = allowedRedirectsEnv
      .split(',')
      .map((uri) => uri.trim())
      .filter(Boolean);
    if (allowedRedirects.length && !allowedRedirects.includes(redirectUri)) {
      res.status(400).send('redirect_uri is not allowed');
      return;
    }

    if (!codeChallenge || codeChallengeMethod !== 'S256') {
      res.status(400).send('PKCE code_challenge with method S256 is required');
      return;
    }

    const authorizationCode = crypto.randomBytes(32).toString('base64url');
    authorizationCodes.set(authorizationCode, {
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      scope,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    const redirectUrl = new URL(redirectUri);
    redirectUrl.searchParams.set('code', authorizationCode);
    if (state) {
      redirectUrl.searchParams.set('state', state);
    }

    res.redirect(302, redirectUrl.toString());
  });
}
