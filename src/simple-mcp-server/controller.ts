/**
 * Simple MCP Server Controller
 * Handles all route handlers for simple MCP server
 */

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { tools, getToolByName } from './tools';
import { execute as executeTool } from './toolExecutor';
import { AuthRequest, JWTPayload } from './middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'simple-mcp-secret-key';
const CLIENT_ID = 'simple-mcp-client';
const CLIENT_SECRET = 'simple-mcp-secret-123';

interface OAuthTokenRequest {
  grant_type: string;
  client_id: string;
  client_secret: string;
}

interface RPCRequest {
  jsonrpc: string;
  id: string | number | null;
  method: string;
  params?: {
    name?: string;
    arguments?: Record<string, any>;
  };
}

interface RPCResponse {
  jsonrpc: string;
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Simple MCP Controller
 * All route handlers as static methods
 */
export class SimpleMCPController {
  /**
   * POST /oauth/token
   * Get OAuth access token using client credentials
   */
  static getOAuthToken = asyncHandler(async (req: Request<{}, {}, OAuthTokenRequest>, res: Response) => {
    const { grant_type, client_id, client_secret } = req.body;

    console.log('[OAuth] Token request:', { grant_type, client_id });

    // Validate grant type
    if (grant_type !== 'client_credentials') {
      res.status(400).json({
        error: 'unsupported_grant_type',
        error_description: 'Only client_credentials grant type is supported',
      });
      return;
    }

    // Validate credentials
    if (client_id !== CLIENT_ID || client_secret !== CLIENT_SECRET) {
      console.log('[OAuth] Invalid credentials');
      res.status(401).json({
        error: 'invalid_client',
        error_description: 'Invalid client credentials',
      });
      return;
    }

    // Generate JWT token
    const payload: JWTPayload = {
      client_id: client_id,
      type: 'mcp_client',
      roles: ['user:manager', 'user:hr'],
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn: '1h' });

    console.log('[OAuth] ✅ Token generated successfully');

    res.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600,
    });
  });

  static handleRPC = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { jsonrpc, id, method, params } = req.body as RPCRequest;

    console.log(`[RPC] Request: ${method}`, params ? JSON.stringify(params).substring(0, 100) : '');

    // Validate JSON-RPC version
    if (jsonrpc !== '2.0') {
      res.status(400).json({
        jsonrpc: '2.0',
        id: id || null,
        error: {
          code: -32600,
          message: 'Invalid Request: jsonrpc must be "2.0"',
        },
      } as RPCResponse);
      return;
    }

    let result: any;

    try {
      switch (method) {
        case 'initialize':
          result = {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
              prompts: {},
            },
            serverInfo: {
              name: 'simple-mcp-server',
              version: '1.0.0',
              description: 'Mini MCP server with HRM tools',
            },
          };
          break;

        case 'tools/list':
          result = {
            tools: tools.map((tool) => ({
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
            })),
          };
          break;

        case 'tools/call':
          if (!params || !params.name) {
            throw new Error('Tool name is required');
          }

          // Validate tool exists
          const tool = getToolByName(params.name);
          if (!tool) {
            throw new Error(`Unknown tool: ${params.name}`);
          }

          // Execute tool (validation happens in toolExecutor with Zod schemas)
          const toolResult = await executeTool(params.name, params.arguments || {}, req);

          result = toolResult;
          break;

        case 'prompts/list':
          result = {
            prompts: [],
          };
          break;

        default:
          res.status(400).json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`,
            },
          } as RPCResponse);
          return;
      }

      console.log(`[RPC] ✅ Success: ${method}`);

      res.json({
        jsonrpc: '2.0',
        id,
        result,
      } as RPCResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[RPC] ❌ Error: ${errorMessage}`);

      res.status(500).json({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: errorMessage,
        },
      } as RPCResponse);
    }
  });

  /**
   * GET /health
   * Health check endpoint
   */
  static getHealth = asyncHandler(async (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      server: 'simple-mcp-server',
      toolsCount: tools.length,
      timestamp: new Date().toISOString(),
    });
  });
}
