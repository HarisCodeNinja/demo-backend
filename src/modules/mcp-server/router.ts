import { Router } from 'express';
import { MCPController } from './controller';
import { validateAccessToken, requireRoles } from '../../helper/auth';

const router = Router();

/**
 * MCP Server Routes
 * All routes are prefixed with /mcp
 */

// Public health check
router.get('/status', MCPController.getStatus);

// Protected routes require authentication
// Most MCP endpoints require at least manager role
const mcpAuth = [validateAccessToken, requireRoles(['user:manager', 'user:hr', 'user:admin'])];

// Server capabilities
router.get('/capabilities', ...mcpAuth, MCPController.getCapabilities);

// Tools
router.get('/tools', ...mcpAuth, MCPController.listTools);
router.post('/tools/call', ...mcpAuth, MCPController.callTool);

// Prompts
router.get('/prompts', ...mcpAuth, MCPController.listPrompts);
router.post('/prompts/get', ...mcpAuth, MCPController.getPrompt);

// Chat with Claude
router.post('/chat', ...mcpAuth, MCPController.chat);

// Models
router.get('/models', ...mcpAuth, MCPController.getModels);

export default router;
