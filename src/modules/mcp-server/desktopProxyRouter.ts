import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.post(
  '/desktop-proxy/chat',
  asyncHandler(async (req, res) => {
    const { message, streaming = false } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // For now, return a helpful message
    // Full implementation would require IPC with Claude Desktop
    res.json({
      success: false,
      message: 'Desktop proxy requires Claude Desktop to be running',
      recommendation: {
        fast: 'Use Claude Desktop directly (already connected via stdio-server)',
        alternative: 'Use /mcp/chat/conversational for web access (slower but works anywhere)',
      },
      setup: {
        step1: 'Claude Desktop is already configured with your stdio-server',
        step2: 'Open Claude Desktop',
        step3: 'Ask: "give me list of employees who got increment between 5 to 10 percent"',
        step4: 'Get instant results with all your tools',
      },
    });
  }),
);

export default router;
