/**
 * Simple MCP Server Routes
 * Express router for simple MCP server endpoints
 */

import { Router } from 'express';
import { SimpleMCPController } from './controller';
import { authenticateToken } from './middleware';

const router = Router();

/**
 * Simple MCP Server Routes
 * All routes are prefixed with /simple-mcp
 */

// OAuth token endpoint (public)
router.post('/oauth/token', SimpleMCPController.getOAuthToken);

// Health check endpoint (public)
router.get('/health', SimpleMCPController.getHealth);

// JSON-RPC endpoint (requires authentication)
router.post('/rpc', authenticateToken, SimpleMCPController.handleRPC);

export default router;
