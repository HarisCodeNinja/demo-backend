#!/usr/bin/env node

/**
 * Simple STDIO Proxy for MCP
 *
 * This proxy connects Claude Desktop to the remote MCP server via RPC
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const fetch = require('node-fetch');

// Configuration
const REMOTE_SERVER = process.env.REMOTE_MCP_URL || 'http://localhost:3001';
const CLIENT_ID = process.env.MCP_CLIENT_ID || 'simple-mcp-client';
const CLIENT_SECRET = process.env.MCP_CLIENT_SECRET || 'simple-mcp-secret-123';

let accessToken = null;
let requestId = 0;

// ============================================
// OAUTH TOKEN MANAGEMENT
// ============================================

async function getAccessToken() {
  if (accessToken) return accessToken;

  console.error('[Proxy] Getting access token...');

  const response = await fetch(`${REMOTE_SERVER}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token request failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  accessToken = data.access_token;

  console.error('[Proxy] ✅ Token obtained');

  // Auto-refresh before expiry
  setTimeout(() => {
    accessToken = null;
    console.error('[Proxy] Token expired, will refresh on next request');
  }, (data.expires_in - 60) * 1000);

  return accessToken;
}

// ============================================
// RPC CALL HANDLER
// ============================================

async function rpcCall(method, params) {
  const token = await getAccessToken();
  const id = ++requestId;

  console.error(`[RPC] Calling ${method}...`);

  const response = await fetch(`${REMOTE_SERVER}/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id,
      method,
      params,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`RPC failed: ${response.status} - ${error}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`);
  }

  console.error(`[RPC] ✅ ${method} succeeded`);

  return data.result;
}

// ============================================
// MCP SERVER SETUP
// ============================================

const server = new Server(
  {
    name: 'simple-mcp-proxy',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const result = await rpcCall('tools/list');
  return result;
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const result = await rpcCall('tools/call', {
    name: request.params.name,
    arguments: request.params.arguments,
  });
  return result;
});

// ============================================
// START STDIO SERVER
// ============================================

async function main() {
  console.error('');
  console.error('═══════════════════════════════════════');
  console.error('   Simple MCP STDIO Proxy Starting');
  console.error('═══════════════════════════════════════');
  console.error('');
  console.error(`🌐 Remote Server: ${REMOTE_SERVER}`);
  console.error(`🔐 Client ID: ${CLIENT_ID}`);
  console.error('');

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('✅ STDIO server ready and listening');
  console.error('');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
