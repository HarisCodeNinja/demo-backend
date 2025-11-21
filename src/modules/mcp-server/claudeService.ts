import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../config/env';
import { mcpTools } from './tools';
import { ClaudeMessage, ClaudeRequest, ClaudeResponse } from './types';
import { ToolExecutor } from './toolExecutor';
import { Request } from 'express';
import { selectRelevantTools } from './toolSelector';

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

    // Select only relevant tools based on query (reduces token usage by 40-60%)
    const relevantTools = selectRelevantTools(message);

    // Get current date for relative date calculations
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentYear = now.getFullYear();
    const currentMonth = now.toLocaleString('default', { month: 'long' });

    // System prompt for HRM context
    const systemPrompt = `You are a proactive HRM AI assistant. NEVER ask for permission or clarification - just execute the required tools immediately.

IMPORTANT: Current Date is ${currentDate} (${currentMonth} ${currentYear}). Use this for all relative date calculations.

CRITICAL ACTION RULES - FOLLOW THESE EXACTLY:
1. NEVER say "I cannot", "Would you like me to", or ask for confirmation
2. If user wants "all employees" → Call search_employees with query="" (empty string) to get ALL employees
3. If user wants employees by department → Call get_departments, then get_department_employees for EACH department
4. If no IDs/filters → fetch ALL data (use empty/null parameters)
5. Multiple tool calls are REQUIRED and EXPECTED - do them automatically
6. SQL queries for complex data (skills, salaries, JOINs) → get_database_schema then execute_sql_query
7. Reports → call generate_quick_report or generate_dynamic_report immediately

EMPLOYEE QUERY EXAMPLES (EXECUTE IMMEDIATELY):
- "Show all employees" → search_employees(query="")
- "All employees with departments" → search_employees(query="") with include department
- "Employees by department" → get_departments() then get_department_employees() for each
- "Employee skills and salaries" → get_database_schema() then execute_sql_query with JOIN

NEVER EXPLAIN WHAT YOU'RE GOING TO DO - JUST DO IT.
If a task requires 5 tool calls, make all 5 calls without asking.
If a task requires 10 tool calls, make all 10 calls without asking.

Available data domains: employees, departments, attendance, leaves, recruitment, performance, HYPER insights.
Tools available: ${relevantTools.length} selected for this query.

Execute immediately. No explanations. No confirmations. Just action.`;

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
  private convertToolsToClaudeFormat(tools = mcpTools): any[] {
    return tools.map((tool) => ({
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
