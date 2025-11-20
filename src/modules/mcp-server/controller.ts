import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { claudeService } from './claudeService';
import { mcpTools } from './tools';
import { ToolExecutor } from './toolExecutor';
import { ChatRequestSchema, ToolCallRequestSchema, PromptRequestSchema } from './types';

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

    const result = await claudeService.chat(
      message,
      conversationHistory,
      useTools,
      req
    );

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
}
