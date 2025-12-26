/**
 * Tool Executor
 *
 * Executes MCP tools and returns results
 * This is a simplified version without database - uses mock data
 */

// Mock database data
const mockEmployees = [
  {
    employeeId: '550e8400-e29b-41d4-a716-446655440001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    departmentId: '650e8400-e29b-41d4-a716-446655440001',
    departmentName: 'Engineering',
    designationId: '750e8400-e29b-41d4-a716-446655440001',
    designationName: 'Senior Engineer',
    status: 'active',
  },
  {
    employeeId: '550e8400-e29b-41d4-a716-446655440002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    departmentId: '650e8400-e29b-41d4-a716-446655440001',
    departmentName: 'Engineering',
    designationId: '750e8400-e29b-41d4-a716-446655440002',
    designationName: 'Tech Lead',
    status: 'active',
  },
  {
    employeeId: '550e8400-e29b-41d4-a716-446655440003',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@company.com',
    departmentId: '650e8400-e29b-41d4-a716-446655440002',
    departmentName: 'Human Resources',
    designationId: '750e8400-e29b-41d4-a716-446655440003',
    designationName: 'HR Manager',
    status: 'active',
  },
  {
    employeeId: '550e8400-e29b-41d4-a716-446655440004',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice.williams@company.com',
    departmentId: '650e8400-e29b-41d4-a716-446655440003',
    departmentName: 'Marketing',
    designationId: '750e8400-e29b-41d4-a716-446655440004',
    designationName: 'Marketing Manager',
    status: 'active',
  },
  {
    employeeId: '550e8400-e29b-41d4-a716-446655440005',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@company.com',
    departmentId: '650e8400-e29b-41d4-a716-446655440001',
    departmentName: 'Engineering',
    designationId: '750e8400-e29b-41d4-a716-446655440005',
    designationName: 'Junior Engineer',
    status: 'inactive',
  },
];

const mockDepartments = [
  {
    departmentId: '650e8400-e29b-41d4-a716-446655440001',
    departmentName: 'Engineering',
    description: 'Software development and engineering',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    departmentId: '650e8400-e29b-41d4-a716-446655440002',
    departmentName: 'Human Resources',
    description: 'HR and people operations',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    departmentId: '650e8400-e29b-41d4-a716-446655440003',
    departmentName: 'Marketing',
    description: 'Marketing and communications',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * Search employees
 */
async function searchEmployees(args) {
  const { query = '', filters = {}, limit = 20 } = args;

  console.log('[Tool] searchEmployees:', { query, filters, limit });

  let results = [...mockEmployees];

  // Apply search filter
  if (query && query.trim()) {
    const searchLower = query.toLowerCase();
    results = results.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower)
    );
  }

  // Apply department filter
  if (filters.departmentId) {
    results = results.filter((emp) => emp.departmentId === filters.departmentId);
  }

  // Apply status filter
  if (filters.status) {
    results = results.filter((emp) => emp.status === filters.status);
  }

  // Apply limit
  const totalCount = results.length;
  results = results.slice(0, limit);

  const response = {
    data: {
      employees: results,
      count: results.length,
      total: totalCount,
      query: query,
    },
    meta: {
      message: `Found ${totalCount} employee(s)${query ? ` matching "${query}"` : ''}`,
      timestamp: new Date().toISOString(),
      filters: filters,
      limit: limit,
    },
  };

  return createToolResponse(response);
}

/**
 * Get departments
 */
async function getDepartments(args) {
  const { includeEmployeeCount = true } = args;

  console.log('[Tool] getDepartments:', { includeEmployeeCount });

  const departments = mockDepartments.map((dept) => {
    const result = { ...dept };

    if (includeEmployeeCount) {
      result.employeeCount = mockEmployees.filter(
        (emp) => emp.departmentId === dept.departmentId && emp.status === 'active'
      ).length;
    }

    return result;
  });

  const response = {
    data: {
      departments: departments,
      count: departments.length,
    },
    meta: {
      message: `Found ${departments.length} department(s)`,
      timestamp: new Date().toISOString(),
      includeEmployeeCount: includeEmployeeCount,
    },
  };

  return createToolResponse(response);
}

/**
 * Create standardized tool response
 */
function createToolResponse(data, message, meta = {}) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            ...data,
            meta: {
              ...data.meta,
              ...meta,
            },
          },
          null,
          2
        ),
      },
    ],
    isError: false,
  };
}

/**
 * Main tool executor
 */
async function execute(toolName, args, req) {
  try {
    console.log(`[ToolExecutor] Executing: ${toolName}`);

    switch (toolName) {
      case 'search_employees':
        return await searchEmployees(args);

      case 'get_departments':
        return await getDepartments(args);

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    console.error(`[ToolExecutor] Error executing ${toolName}:`, error.message);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: true,
              message: error.message,
              tool: toolName,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

module.exports = {
  execute,
};
