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
  private readonly defaultModel = 'models/gemini-2.0-flash'; // FREE, STABLE & OPTIMIZED

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

    // For Gemini 2.5, we need to create a new model instance with system instruction
    const modelWithSystem = this.client.getGenerativeModel({
      model: this.defaultModel,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
      systemInstruction: {
        parts: [{
          text: `You are a proactive HRM AI assistant. Always take action first, don't ask for clarification unless absolutely necessary.

Action Rules:
1. If no IDs/filters specified → fetch ALL data (use empty filters or omit parameters)
2. If date range unclear → use current quarter or last 30 days
3. If report type requested → immediately call generate_dynamic_report or generate_quick_report
4. For data queries → use appropriate tool with broad defaults
5. Make reasonable assumptions and execute

Tools Available (${relevantTools.length} selected for this query):
- generate_dynamic_report: Custom reports from natural language
- generate_quick_report: Predefined reports (performance, attendance, etc.)
- execute_sql_query: Complex queries (use get_database_schema first)
- Standard queries: employees, departments, attendance, leaves, etc.

Examples:
- "Performance dashboard Q4 2025" → Call generate_quick_report with reportType='performance'
- "Show employees" → Call get_departments with includeEmployeeCount=true, then list all
- "Employee skills and salaries" → get_database_schema then execute_sql_query with JOIN

Be proactive. Execute tools immediately with smart defaults.`
        }],
        role: 'user'
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
