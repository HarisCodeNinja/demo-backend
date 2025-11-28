import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../config/env';
import { mcpTools } from './tools';
import { ClaudeMessage, ClaudeRequest, ClaudeResponse } from './types';
import { ToolExecutor } from './toolExecutor';
import { Request } from 'express';
import { selectRelevantTools } from './toolSelector';
import { sanitizeToolDefinition } from './toolSchemaUtils';

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
    const limitedHistory = conversationHistory.slice(-4);
    const messages = [
      ...limitedHistory,
      {
        role: 'user' as const,
        content: message,
      },
    ];

    // Select only relevant tools based on query (reduces token usage by 40-60%)
    const relevantTools = selectRelevantTools(message);

    // Get current date for relative date calculations
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentYear = now.getFullYear();
    const currentMonth = now.toLocaleString('default', { month: 'long' });

    // System prompt for HRM context
    const systemPrompt = `You are an HRM assistant. Today is ${currentDate} (${currentMonth} ${currentYear}).
Act decisively but keep responses compact:
- Prefer focused filters and fetch no more than ~50 rows unless the user passes a higher "limit".
- Summaries and counts beat raw dumps; explain how to request more detail when needed.
- Use SQL tools only for multi-table joins or aggregations.
- Respond directly without meta commentary.`;
    try {
      // Initial API call
      let response = await this.client.messages.create({
        model: this.defaultModel,
        max_tokens: this.maxTokens,
        system: systemPrompt,
        messages: messages as any,
        tools: useTools ? this.convertToolsToClaudeFormat(relevantTools) : undefined,
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
          const toolResult = await ToolExecutor.execute(toolUse.name, toolUse.input, req, 'claude');

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
          tools: useTools ? this.convertToolsToClaudeFormat(relevantTools) : undefined,
        });
      }

      // Extract final text response
      const textBlocks = response.content.filter((block: any) => block.type === 'text');
      finalResponse = textBlocks.map((block: any) => block.text).join('\n');

      if (response.usage) {
        console.log(`[MCP][Claude] Token usage - input: ${response.usage.input_tokens ?? 0}, output: ${response.usage.output_tokens ?? 0}`);
      }

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
  private convertToolsToClaudeFormat(tools = mcpTools): any[] {
    return tools.map((tool) => {
      const sanitized = sanitizeToolDefinition(tool);
      return {
        name: sanitized.name,
        description: sanitized.description,
        input_schema: sanitized.inputSchema,
      };
    });
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
