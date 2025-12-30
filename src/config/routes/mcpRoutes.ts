/**
 * Simple MCP Server Routes
 * Express router for simple MCP server endpoints
 */

import { Router } from 'express';
import { SimpleMCPController } from '../../simple-mcp-server/controller';
import { authenticateToken, getOAuthToken } from '../../simple-mcp-server/middleware';

const mcpRouter = Router();

/**
 * Simple MCP Server Routes
 * All routes are prefixed with /simple-mcp
 */

// OAuth token endpoint (public)
mcpRouter.post('/oauth/token', getOAuthToken);

// Health check endpoint (public)
mcpRouter.get('/health', SimpleMCPController.getHealth);

// JSON-RPC endpoint (requires authentication)
mcpRouter.post('/rpc', authenticateToken, SimpleMCPController.handleRPC);

export { mcpRouter };
