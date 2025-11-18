import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../config/env';
import { mcpTools } from './tools';
import { ClaudeMessage, ClaudeRequest, ClaudeResponse } from './types';
import { ToolExecutor } from './toolExecutor';
import { Request } from 'express';

/**
 * Service for interacting with Claude AI API
 */
export class ClaudeService {
  private client: Anthropic;
  private readonly defaultModel = 'claude-3-5-sonnet-20241022';
  private readonly maxTokens = 4096;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || env.CLAUDE_API_KEY,
    });
  }

  /**
   * Send a chat message to Claude with MCP tool support
   */
  async chat(
    message: string,
    conversationHistory: ClaudeMessage[] = [],
    useTools: boolean = true,
    req: Request,
  ): Promise<{
    response: string;
    toolCalls: Array<{ name: string; input: any; result: any }>;
    usage: { input_tokens: number; output_tokens: number };
  }> {
    // Build messages array
    const messages = [
      ...conversationHistory,
      {
        role: 'user' as const,
        content: message,
      },
    ];

    // System prompt for HRM context
    const systemPrompt = `You are an AI assistant integrated with an HRM (Human Resource Management) system.
You have access to various tools that allow you to query and interact with employee data, attendance records,
leave applications, recruitment information, performance reviews, and more.

When users ask questions about employees, departments, attendance, leaves, or any HR-related data,
use the available tools to fetch accurate information from the HRM database.

Always provide clear, professional, and helpful responses. When displaying data, format it in a
readable way. If you need to perform calculations or analysis, explain your reasoning.

Available data domains:
- Employee information and profiles
- Department and organizational structure
- Attendance and time tracking
- Leave management
- Recruitment and candidates
- Performance reviews and goals
- HYPER intelligent insights (automated HR analytics)

Be proactive in using tools to provide accurate, data-driven answers.`;

    try {
      // Initial API call
      let response = await this.client.messages.create({
        model: this.defaultModel,
        max_tokens: this.maxTokens,
        system: systemPrompt,
        messages: messages as any,
        tools: useTools ? this.convertToolsToClaudeFormat() : undefined,
      });

      const toolCalls: Array<{ name: string; input: any; result: any }> = [];
      let finalResponse = '';

      // Handle tool use loop
      while (response.stop_reason === 'tool_use') {
        // Extract tool uses
        const toolUseBlocks = response.content.filter((block: any) => block.type === 'tool_use');

        if (toolUseBlocks.length === 0) break;

        // Execute tools
        const toolResults = [];
        for (const toolUse of toolUseBlocks as any[]) {
          const toolResult = await ToolExecutor.execute(toolUse.name, toolUse.input, req);

          toolCalls.push({
            name: toolUse.name,
            input: toolUse.input,
            result: toolResult,
          });

          toolResults.push({
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: toolResult.content[0].text || JSON.stringify(toolResult),
          });
        }

        // Continue conversation with tool results
        messages.push({
          role: 'assistant',
          content: response.content as any,
        } as any);

        messages.push({
          role: 'user',
          content: toolResults as any,
        } as any);

        // Get next response
        response = await this.client.messages.create({
          model: this.defaultModel,
          max_tokens: this.maxTokens,
          system: systemPrompt,
          messages: messages as any,
          tools: useTools ? this.convertToolsToClaudeFormat() : undefined,
        });
      }

      // Extract final text response
      const textBlocks = response.content.filter((block: any) => block.type === 'text');
      finalResponse = textBlocks.map((block: any) => block.text).join('\n');

      return {
        response: finalResponse,
        toolCalls,
        usage: response.usage,
      };
    } catch (error: any) {
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  /**
   * Convert MCP tools to Claude API format
   */
  private convertToolsToClaudeFormat(): any[] {
    return mcpTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema,
    }));
  }

  /**
   * Stream a chat response (for real-time responses)
   */
  async streamChat(message: string, conversationHistory: ClaudeMessage[] = [], useTools: boolean = true): Promise<AsyncIterable<any>> {
    const messages = [
      ...conversationHistory,
      {
        role: 'user' as const,
        content: message,
      },
    ];

    const systemPrompt = `You are an AI assistant for an HRM system. Use available tools to provide accurate information.`;

    return this.client.messages.stream({
      model: this.defaultModel,
      max_tokens: this.maxTokens,
      system: systemPrompt,
      messages: messages as any,
      tools: useTools ? this.convertToolsToClaudeFormat() : undefined,
    });
  }

  /**
   * Get list of available models
   */
  getAvailableModels(): string[] {
    return ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'];
  }
}

// Export singleton instance
export const claudeService = new ClaudeService();
