import { MCPTool } from './types';

const DEFAULT_DESCRIPTION_LIMIT = 140;

export function trimDescription(text: string = '', limit: number = DEFAULT_DESCRIPTION_LIMIT): string {
  if (!text) return '';
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 3))}...`;
}

export function stripSchemaDescriptions(schema: any): any {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  if (Array.isArray(schema)) {
    return schema.map((item) => stripSchemaDescriptions(item));
  }

  const result: any = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key === 'description') {
      continue;
    }
    result[key] = stripSchemaDescriptions(value);
  }
  return result;
}

export function sanitizeToolDefinition(tool: MCPTool, descriptionLimit?: number) {
  return {
    name: tool.name,
    description: trimDescription(tool.description, descriptionLimit),
    inputSchema: stripSchemaDescriptions(tool.inputSchema),
  };
}
