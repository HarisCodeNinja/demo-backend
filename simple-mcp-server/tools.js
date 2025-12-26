/**
 * MCP Tools Definition
 *
 * Define all available tools with their schemas
 */

const tools = [
  {
    name: 'search_employees',
    description: 'Search employees by name or email. Returns employee list with department and designation info.',
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
        limit: {
          type: 'number',
          description: 'Maximum number of results (default 20)',
          default: 20,
        },
      },
      required: [],
    },
  },
  {
    name: 'get_departments',
    description: 'Get list of all departments in the organization with employee counts.',
    inputSchema: {
      type: 'object',
      properties: {
        includeEmployeeCount: {
          type: 'boolean',
          description: 'Include number of employees in each department',
          default: true,
        },
      },
      required: [],
    },
  },
];

/**
 * Get tool by name
 */
function getToolByName(name) {
  return tools.find((tool) => tool.name === name);
}

/**
 * Validate tool arguments against schema
 */
function validateToolArguments(tool, args) {
  try {
    const schema = tool.inputSchema;
    if (schema.required && Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (!(field in args)) {
          return false;
        }
      }
    }
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  tools,
  getToolByName,
  validateToolArguments,
};
