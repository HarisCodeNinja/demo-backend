import { z } from 'zod';

// MCP Tool definitions
export const MCPToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.record(z.string(), z.any()),
});

export type MCPTool = z.infer<typeof MCPToolSchema>;

// MCP Resource definitions
export const MCPResourceSchema = z.object({
  uri: z.string(),
  name: z.string(),
  description: z.string().optional(),
  mimeType: z.string().optional(),
});

export type MCPResource = z.infer<typeof MCPResourceSchema>;

// MCP Prompt definitions
export const MCPPromptSchema = z.object({
  name: z.string(),
  description: z.string(),
  arguments: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      required: z.boolean(),
    })
  ).optional(),
});

export type MCPPrompt = z.infer<typeof MCPPromptSchema>;

// Tool call request/response
export const ToolCallRequestSchema = z.object({
  name: z.string(),
  arguments: z.record(z.string(), z.any()).optional(),
});

export type ToolCallRequest = z.infer<typeof ToolCallRequestSchema>;

export interface ToolCallResponse {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

// Resource request/response
export const ResourceRequestSchema = z.object({
  uri: z.string(),
});

export type ResourceRequest = z.infer<typeof ResourceRequestSchema>;

export interface ResourceResponse {
  contents: Array<{
    uri: string;
    mimeType?: string;
    text?: string;
    blob?: string;
  }>;
}

// Prompt request/response
export const PromptRequestSchema = z.object({
  name: z.string(),
  arguments: z.record(z.string(), z.string()).optional(),
});

export type PromptRequest = z.infer<typeof PromptRequestSchema>;

export interface PromptResponse {
  description?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: {
      type: 'text' | 'image' | 'resource';
      text?: string;
      data?: string;
      mimeType?: string;
    };
  }>;
}

// Claude AI Message types
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeRequest {
  model?: string;
  messages: ClaudeMessage[];
  max_tokens?: number;
  temperature?: number;
  tools?: MCPTool[];
  system?: string;
}

export interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text?: string;
    id?: string;
    name?: string;
    input?: any;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// Chat request from frontend
export const ChatRequestSchema = z.object({
  message: z.string(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).optional(),
  useTools: z.boolean().optional().default(true),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
