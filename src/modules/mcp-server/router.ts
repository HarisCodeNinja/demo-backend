import { Router } from 'express';
import { MCPController } from './controller';
import { validateAccessToken, requireRoles } from '../../helper/auth';

const router = Router();

/**
 * MCP Server Routes
 * All routes are prefixed with /mcp
 */

// OAuth token endpoint for client_credentials flow
router.post('/oauth/token', MCPController.getOAuthToken);

// Public health check (Claude Desktop sometimes probes with both GET and POST)
router.get('/status', MCPController.getStatus);
router.post('/status', MCPController.getStatus);

// Protected routes require authentication
// Most MCP endpoints require at least manager role
const mcpAuth = [validateAccessToken, requireRoles(['user:manager', 'user:hr', 'user:admin'])];

// Server capabilities
router.get('/capabilities', MCPController.getCapabilities);
router.get('/stream', ...mcpAuth, MCPController.stream);
// Tools
router.get('/tools', ...mcpAuth, MCPController.listTools);
router.post('/tools/call', ...mcpAuth, MCPController.callTool);

// Prompts
router.get('/prompts', ...mcpAuth, MCPController.listPrompts);
router.post('/prompts/get', ...mcpAuth, MCPController.getPrompt);

router.post('/chat', MCPController.chat);

router.post('/chat/conversational', MCPController.conversationalChat);
router.post('/chat/stream', MCPController.streamingChat);
router.get('/chat/health', MCPController.getChatHealth);

router.post('/analyze-query', MCPController.analyzeQuery);
router.post('/complexity-check', MCPController.quickComplexityCheck);
router.get('/routing-config', MCPController.getRoutingConfig);

// Models
router.get('/models', ...mcpAuth, MCPController.getModels);

export default router;
