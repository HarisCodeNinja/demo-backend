import { Request } from 'express';

export interface OAuthTokenRequest {
  grant_type: string;
  client_id: string;
  client_secret: string;
}

export interface JWTPayload {
  client_id: string;
  type: string;
  roles: string[];
  iat: number;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export interface RPCRequest {
  jsonrpc: string;
  id: string | number | null;
  method: string;
  params?: {
    name?: string;
    arguments?: Record<string, any>;
  };
}

export interface RPCResponse {
  jsonrpc: string;
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export interface ToolProperty {
  type: string;
  description: string;
  default?: any;
  properties?: Record<string, ToolProperty>;
}

export interface ToolInputSchema {
  type: string;
  properties: Record<string, ToolProperty>;
  required: string[];
}

export interface Tool {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  requiredRoles?: string[];
}

export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError: boolean;
}
