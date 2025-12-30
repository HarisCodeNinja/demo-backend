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
        searchTerm: {
          type: 'string',
          description: 'Search query (name or email). Leave empty for all employees.',
          default: '',
        },
        departmentId: {
            type: 'string',
            description: 'Filter by department UUID',
            },
        status: {
          type: 'string',
          description: 'Filter by status (active, inactive)',
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
  {
    name: 'add_department',
    description: 'Create a new department in the HRM database. Requires a unique department name.',
    requiredRoles: ['user:hr', 'user:admin'], // HR or Admin access
    inputSchema: {
      type: 'object',
      properties: {
        departmentName: {
          type: 'string',
          description: 'Unique name for the new department (e.g., "Engineering", "Sales")',
        },
      },
      required: ['departmentName'],
    },
  },
  {
    name: 'edit_department',
    description: 'Update an existing department name. Requires department UUID and new department name.',
    requiredRoles: ['user:hr', 'user:admin'], // HR or Admin access
    inputSchema: {
      type: 'object',
      properties: {
        departmentId: {
          type: 'string',
          description: 'UUID of the department to update',
        },
        departmentName: {
          type: 'string',
          description: 'New unique name for the department',
        },
      },
      required: ['departmentId', 'departmentName'],
    },
  },
  {
    name: 'delete_department',
    description: 'Delete a department from the HRM database. Requires department UUID. WARNING: This is a destructive operation.',
    requiredRoles: ['user:admin'], // Admin only
    inputSchema: {
      type: 'object',
      properties: {
        departmentId: {
          type: 'string',
          description: 'UUID of the department to delete',
        },
      },
      required: ['departmentId'],
    },
  },
];

/**
 * Get tool by name
 */
export function getToolByName(name: string): Tool | undefined {
  return tools.find((tool) => tool.name === name);
}
