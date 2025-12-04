import { Router } from 'express';
import { GenaiController } from './genaiController';
import { validateAccessToken, requireRoles } from '../../helper/auth';

const router = Router();

/**
 * Genai (Google Gemini) MCP Server Routes
 * All routes are prefixed with /mcp-genai
 * Separate from Claude routes (/mcp)
 */

// Public health check
router.get('/status', GenaiController.getStatus);

// Protected routes require authentication
const mcpAuth = [validateAccessToken, requireRoles(['user:manager', 'user:hr', 'user:admin'])];

// Server capabilities
router.get('/capabilities', ...mcpAuth, GenaiController.getCapabilities);

// Tools
router.get('/tools', ...mcpAuth, GenaiController.listTools);
router.post('/tools/call', ...mcpAuth, GenaiController.callTool);

// Prompts
router.get('/prompts', ...mcpAuth, GenaiController.listPrompts);
router.post('/prompts/get', ...mcpAuth, GenaiController.getPrompt);

// Chat with Gemini
router.post('/chat', ...mcpAuth, GenaiController.chat);

// Models
router.get('/models', ...mcpAuth, GenaiController.getModels);

// Report Generation
router.post('/generate-report', ...mcpAuth, GenaiController.generateReport);
router.post('/generate-quick-report', ...mcpAuth, GenaiController.generateQuickReport);

export default router;
