#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Create log file
const logFile = 'C:\\Users\\HarisShahid\\Downloads\\mcp-server.log';
const log = (msg: string) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
  console.error(msg);
};

log('=== MCP Server Starting ===');

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../../.env') });
log('Environment loaded');

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, Tool } from '@modelcontextprotocol/sdk/types.js';
log('SDK imports done');

import { mcpTools } from './tools';
log(`Tools imported: ${mcpTools.length} tools`);

import { ToolExecutor } from './toolExecutor';
log('ToolExecutor imported');

import { initializeDatabase } from '../../config/db-lazy';
log('DB lazy import done');

process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`);
  log(error.stack || '');
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise) => {
  log(`Unhandled rejection: ${reason}`);
  process.exit(1);
});

process.on('SIGINT', () => {
  log('Received SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM');
  process.exit(0);
});

log('Creating server...');
const server = new Server(
  {
    name: 'hrm-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);
log('Server created');

const convertToMCPTools = (): Tool[] => {
  return mcpTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: {
      type: 'object' as const,
      properties: tool.inputSchema.properties || {},
      required: tool.inputSchema.required || [],
    },
  }));
};

server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('ListTools handler called');
  const tools = convertToMCPTools();
  log(`Returning ${tools.length} tools`);
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  log(`CallTool handler called: ${name}`);

  try {
    await initializeDatabase();
    log('Database initialized');

    const mockReq: any = {
      headers: {},
      body: args,
      query: {},
      params: {},
    };

    const result = await ToolExecutor.execute(name, args || {}, mockReq, 'claude');
    log('Tool executed successfully');

    return {
      content: result.content || [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    log(`Tool execution error: ${error.message}`);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message || 'Tool execution failed',
            isError: true,
          }),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  log('In main()');

  try {
    log('Creating transport...');
    const transport = new StdioServerTransport();

    log('Connecting server to transport...');
    await server.connect(transport);

    log('HRM MCP Server running on stdio');
    log(`Available tools: ${mcpTools.length}`);

    // Keep process alive
    setInterval(() => {
      log('Server heartbeat - still running');
    }, 30000); // Log every 30 seconds
  } catch (error: any) {
    log(`Failed to start server: ${error.message}`);
    log(error.stack || '');
    throw error;
  }
}

log('Calling main()...');
main().catch((error) => {
  log(`Fatal error in main(): ${error.message}`);
  log(error.stack || '');
  process.exit(1);
});
