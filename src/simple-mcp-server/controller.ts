/**
 * Simple MCP Server Controller
 * Handles all route handlers for simple MCP server
 */

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { tools, getToolByName } from './tools';
import { execute as executeTool } from './toolExecutor';
import { AuthRequest, RPCRequest, RPCResponse } from './types';

/**
 * Simple MCP Controller
 * All route handlers as static methods
 */
export class SimpleMCPController {
  static handleRPC = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { jsonrpc, id, method, params } = req.body as RPCRequest;

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

          // Get user roles from authenticated request
          const userRoles = req.user?.roles || [];

          // Execute tool with role-based access control
          const toolResult = await executeTool(params.name, params.arguments || {}, req, userRoles);

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
