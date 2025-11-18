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
   */
  static chat = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = ChatRequestSchema.parse(req.body);
    const { message, conversationHistory = [], useTools = true } = validatedData;

    const result = await claudeService.chat(
      message,
      conversationHistory,
      useTools,
      req
    );

    res.json({
      status: 'success',
      data: {
        response: result.response,
        toolCalls: result.toolCalls,
        usage: result.usage,
      },
    });
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
