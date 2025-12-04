#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Logging
const logFile = 'C:\\Users\\HarisShahid\\Downloads\\mcp-server.log';
const log = (msg: string) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
  console.error(msg);
};

log('=== MCP Unified Server Starting ===');

// Check if we should run in proxy mode or direct mode
const MODE = process.env.MCP_MODE || 'proxy'; // 'direct' or 'proxy'
const REMOTE_SERVER = process.env.REMOTE_MCP_URL;

log(`Mode: ${MODE}`);
if (MODE === 'proxy' && REMOTE_SERVER) {
  log(`Remote server: ${REMOTE_SERVER}`);
}

import dotenv from 'dotenv';

// Derive __dirname in a way compatible with CommonJS output
const scriptPath = process.argv[1] ? path.resolve(process.argv[1]) : process.cwd();
const __dirname = path.dirname(scriptPath);

// Now dotenv.config will work
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

// Only import these if running in direct mode
let mcpTools: any;
let ToolExecutor: any;
let initializeDatabase: any;

async function loadDirectModeDependencies() {
  if (MODE === 'direct') {
    const toolsModule = await import('./tools.js');
    mcpTools = toolsModule.mcpTools;

    const executorModule = await import('./toolExecutor.js');
    ToolExecutor = executorModule.ToolExecutor;

    const dbModule = await import('../../config/db-lazy.js');
    initializeDatabase = dbModule.initializeDatabase;

    log(`Loaded ${mcpTools.length} tools in direct mode`);
  }
}

let accessToken: string | null = null;
let requestId = 0;

async function getAccessToken() {
  if (accessToken) return accessToken;

  log('[Proxy] Getting access token...');

  const CLIENT_ID = process.env.MCP_CLIENT_ID || 'hrm-mcp-client-2024';
  const CLIENT_SECRET = process.env.MCP_CLIENT_SECRET || 'your-very-secure-secret-change-this';

  const response = await fetch(`${REMOTE_SERVER}/mcp/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status}`);
  }

  const data: any = await response.json();
  accessToken = data.access_token;

  log('[Proxy] ✓ Token obtained');

  setTimeout(
    () => {
      accessToken = null;
    },
    (data.expires_in - 60) * 1000,
  );

  return accessToken;
}

async function rpcCall(method: string, params?: any) {
  const token = await getAccessToken();
  const id = ++requestId;

  log(`[Proxy] → ${method}`);

  const response = await fetch(`${REMOTE_SERVER}/mcp/rpc`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id,
      method,
      params: params || {},
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RPC failed: ${response.status} - ${text}`);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(`RPC error: ${result.error.message}`);
  }

  log(`[Proxy] ✓ ${method}`);
  return result.result;
}

// Create server
const server = new Server(
  {
    name: MODE === 'proxy' ? 'hrm-mcp-proxy' : 'hrm-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  },
);

// Handle list tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('ListTools handler called');

  if (MODE === 'proxy') {
    return await rpcCall('tools/list');
  } else {
    // Direct mode
    const tools = mcpTools.map((tool: any) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));
    log(`Returning ${tools.length} tools`);
    return { tools };
  }
});

// Handle call tool
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  log(`CallTool: ${name}`);

  if (MODE === 'proxy') {
    return await rpcCall('tools/call', { name, arguments: args });
  } else {
    // Direct mode
    try {
      await initializeDatabase();

      const mockReq: any = {
        headers: {},
        body: args,
        query: {},
        params: {},
        user: {
          id: 'mcp-service',
          roles: ['user:admin', 'user:manager', 'user:hr'],
        },
      };

      const result = await ToolExecutor.execute(name, args || {}, mockReq, 'mcp-stdio');
      log(`✓ Tool ${name} executed`);

      return {
        content: result.content || [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      log(`✗ Tool error: ${error.message}`);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
});

// Handle list prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  log('ListPrompts handler called');

  if (MODE === 'proxy') {
    return await rpcCall('prompts/list');
  } else {
    // Direct mode - hardcoded prompts
    return {
      prompts: [
        {
          name: 'employee_overview',
          description: 'Get comprehensive employee overview',
          arguments: [
            {
              name: 'department',
              description: 'Optional: Filter by department',
              required: false,
            },
          ],
        },
        {
          name: 'attendance_analysis',
          description: 'Analyze attendance patterns',
          arguments: [
            {
              name: 'start_date',
              description: 'Start date (YYYY-MM-DD)',
              required: true,
            },
            {
              name: 'end_date',
              description: 'End date (YYYY-MM-DD)',
              required: true,
            },
          ],
        },
      ],
    };
  }
});

// Handle get prompt
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  log(`GetPrompt: ${name}`);

  if (MODE === 'proxy') {
    return await rpcCall('prompts/get', { name, arguments: args });
  } else {
    // Direct mode
    switch (name) {
      case 'employee_overview':
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Provide employee overview${args?.department ? ` for ${args.department}` : ''}`,
              },
            },
          ],
        };

      case 'attendance_analysis':
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Analyze attendance from ${args?.start_date} to ${args?.end_date}`,
              },
            },
          ],
        };

      default:
        throw new Error(`Unknown prompt: ${name}`);
    }
  }
});

// Error handlers
process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  log(`Unhandled rejection: ${reason}`);
  process.exit(1);
});

// Start server
async function main() {
  // Load dependencies if in direct mode
  await loadDirectModeDependencies();

  log('╔════════════════════════════════════════╗');
  log(`║   HRM MCP Server (${MODE.toUpperCase()})${' '.repeat(20 - MODE.length)}║`);
  log('╚════════════════════════════════════════╝');

  if (MODE === 'proxy') {
    log(`Remote: ${REMOTE_SERVER}`);
    log('Transport: stdio → HTTP');
  } else {
    log('Transport: stdio (direct)');
    log(`Tools: ${mcpTools.length}`);
  }

  log('════════════════════════════════════════\n');

  const transport = new StdioServerTransport();
  await server.connect(transport);

  log('✓ Server connected and ready\n');
}

main().catch((error) => {
  log(`Fatal: ${error.message}`);
  process.exit(1);
});
