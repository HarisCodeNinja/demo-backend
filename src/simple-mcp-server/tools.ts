/**
 * MCP Tools Definition
 *
 * Define all available tools with their schemas
 */

import { Tool } from './types';

export const tools: Tool[] = [
  {
    name: 'search_employees',
    description: 'Get paginated employee list from the real HRM database. Returns employees with department and designation info.',
    requiredRoles: ['user:hr', 'user:manager'], // HR, Manager, or Admin access
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (name or email). Leave empty for all employees.',
          default: '',
        },
        filters: {
          type: 'object',
          description: 'Optional filters',
          properties: {
            departmentId: {
              type: 'string',
              description: 'Filter by department UUID',
            },
            status: {
              type: 'string',
              description: 'Filter by status (active, inactive)',
            },
          },
        },
        pageSize: {
          type: 'number',
          description: 'Maximum number of results per page (default 20, max 100)',
          default: 20,
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default 0)',
          default: 0,
        },
      },
      required: [],
    },
  },
  {
    name: 'get_departments',
    description: 'Get paginated department list from the real HRM database.',
    requiredRoles: ['user:viewer', 'user:hr', 'user:manager', 'user:admin'], // All authenticated users
    inputSchema: {
      type: 'object',
      properties: {
        includeEmployeeCount: {
          type: 'boolean',
          description: 'Include number of active employees in each department',
          default: true,
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default 0)',
          default: 0,
        },
        pageSize: {
          type: 'number',
          description: 'Maximum number of results per page (default 20, max 100)',
          default: 20,
        },
      },
      required: [],
    },
  },
];

/**
 * Get tool by name
 */
export function getToolByName(name: string): Tool | undefined {
  return tools.find((tool) => tool.name === name);
}
