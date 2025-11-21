import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { env } from '../../config/env';
import { mcpTools } from './tools';
import { ClaudeMessage } from './types';
import { ToolExecutor } from './toolExecutor';
import { Request } from 'express';
import { selectRelevantTools } from './toolSelector';

/**
 * Service for interacting with Google Gemini AI API
 * Parallel implementation to Claude service - both can coexist
 */
export class GenaiService {
  private client: GoogleGenerativeAI;
  private model: GenerativeModel;
  private readonly defaultModel = 'models/gemini-2.5-flash'; // FREE, STABLE & OPTIMIZED

  constructor(apiKey?: string) {
    this.client = new GoogleGenerativeAI(apiKey || env.GEMINI_API_KEY || '');
    this.model = this.client.getGenerativeModel({
      model: this.defaultModel,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });
  }

  /**
   * Send a chat message to Gemini with MCP tool support
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
    // Build conversation history in Gemini format
    const history = conversationHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Select only relevant tools based on query (reduces token usage by 40-60%)
    const relevantTools = selectRelevantTools(message);

    // Get current date for relative date calculations
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentYear = now.getFullYear();
    const currentMonth = now.toLocaleString('default', { month: 'long' });

    // For Gemini 2.5, we need to create a new model instance with system instruction
    const modelWithSystem = this.client.getGenerativeModel({
      model: this.defaultModel,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
      systemInstruction: {
        parts: [
          {
            text: `You are a proactive HRM AI assistant. NEVER ask for permission or clarification - just execute the required tools immediately.

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

Tools available: ${relevantTools.length} selected for this query.

Execute immediately. No explanations. No confirmations. Just action.`,
          },
        ],
        role: 'user',
      },
    });

    const chat = modelWithSystem.startChat({
      history,
      tools: useTools ? this.convertToolsToGeminiFormat(relevantTools) : undefined,
    });

    let finalResponse = '';
    const toolCalls: Array<{ name: string; input: any; result: any }> = [];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    try {
      // Send initial message
      let result = await chat.sendMessage(message);

      // Track token usage
      if (result.response.usageMetadata) {
        totalInputTokens += result.response.usageMetadata.promptTokenCount || 0;
        totalOutputTokens += result.response.usageMetadata.candidatesTokenCount || 0;
      }

      // Handle function calls in a loop
      let maxIterations = 5; // Prevent infinite loops
      while (maxIterations > 0) {
        const response = result.response;
        const functionCalls = response.functionCalls();

        if (!functionCalls || functionCalls.length === 0) {
          // No more function calls, we have the final response
          finalResponse = response.text();
          break;
        }

        // Execute all function calls
        const functionResponses = [];
        for (const call of functionCalls) {
          try {
            const toolResult = await ToolExecutor.execute(call.name, call.args, req, 'gemini');

            toolCalls.push({
              name: call.name,
              input: call.args,
              result: toolResult,
            });

            // Gemini 2.5 expects functionResponse format
            functionResponses.push({
              functionResponse: {
                name: call.name,
                response: {
                  result: toolResult.content[0].text || JSON.stringify(toolResult),
                },
              },
            });
          } catch (error: any) {
            functionResponses.push({
              functionResponse: {
                name: call.name,
                response: {
                  result: `Error: ${error.message}`,
                },
              },
            });
          }
        }

        // Send function results back to Gemini
        result = await chat.sendMessage(functionResponses);

        // Track token usage
        if (result.response.usageMetadata) {
          totalInputTokens += result.response.usageMetadata.promptTokenCount || 0;
          totalOutputTokens += result.response.usageMetadata.candidatesTokenCount || 0;
        }

        maxIterations--;
      }

      return {
        response: finalResponse,
        toolCalls,
        usage: {
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
        },
      };
    } catch (error: any) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  /**
   * Convert MCP tools to Gemini function calling format
   */
  private convertToolsToGeminiFormat(tools = mcpTools): any[] {
    return [
      {
        functionDeclarations: tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema,
        })),
      },
    ];
  }

  /**
   * Stream a chat response (for real-time responses)
   */
  async streamChat(message: string, conversationHistory: ClaudeMessage[] = [], useTools: boolean = true): Promise<AsyncIterable<any>> {
    const history = conversationHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = this.model.startChat({
      history,
      tools: useTools ? this.convertToolsToGeminiFormat() : undefined,
    });

    const result = await chat.sendMessageStream(message);
    return result.stream;
  }

  /**
   * Get list of available models
   */
  getAvailableModels(): string[] {
    return [
      'models/gemini-2.5-flash', // FREE - Fast & Recommended (DEFAULT)
      'models/gemini-2.5-pro', // FREE - More capable
      'models/gemini-2.0-flash', // FREE - Latest stable
      'models/gemini-flash-latest', // FREE - Always latest
      'models/gemini-2.0-flash-exp', // FREE - Experimental
    ];
  }
}

// Export singleton instance
export const genaiService = new GenaiService();
