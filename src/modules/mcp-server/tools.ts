import { MCPTool } from './types';

/**
 * MCP Tools that Claude can use to interact with the HRM system
 * These tools expose HRM functionality to Claude AI
 */
export const mcpTools: MCPTool[] = [
  {
    name: 'get_employee_info',
    description: 'Get detailed information about an employee by ID or email. Returns employee profile, department, designation, and employment details.',
    inputSchema: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
          description: 'Employee ID (UUID) or email address',
        },
        includeAttendance: {
          type: 'boolean',
          description: 'Include recent attendance data',
          default: false,
        },
      },
      required: ['identifier'],
    },
  },
  {
    name: 'get_department_employees',
    description: 'Get a list of all employees in a specific department with their basic information.',
    inputSchema: {
      type: 'object',
      properties: {
        departmentId: {
          type: 'string',
          description: 'Department UUID',
        },
        includeInactive: {
          type: 'boolean',
          description: 'Include inactive employees',
          default: false,
        },
      },
      required: ['departmentId'],
    },
  },
  {
    name: 'search_employees',
    description: 'Search for employees by name, email, department, or designation. Supports partial matching.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (name, email, etc.)',
        },
        filters: {
          type: 'object',
          description: 'Optional filters',
          properties: {
            departmentId: { type: 'string' },
            designationId: { type: 'string' },
            locationId: { type: 'string' },
          },
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results',
          default: 10,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_attendance_summary',
    description: 'Get attendance summary for a date range. Can filter by employee, department, or get company-wide statistics.',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: {
          type: 'string',
          description: 'Start date (ISO format)',
        },
        endDate: {
          type: 'string',
          description: 'End date (ISO format)',
        },
        employeeId: {
          type: 'string',
          description: 'Optional: specific employee UUID',
        },
        departmentId: {
          type: 'string',
          description: 'Optional: specific department UUID',
        },
      },
      required: ['startDate', 'endDate'],
    },
  },
  {
    name: 'get_leave_requests',
    description: 'Get leave requests with optional filters for status, employee, or date range.',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['pending', 'approved', 'rejected', 'cancelled'],
          description: 'Filter by leave status',
        },
        employeeId: {
          type: 'string',
          description: 'Filter by employee UUID',
        },
        startDate: {
          type: 'string',
          description: 'Filter from this date',
        },
        endDate: {
          type: 'string',
          description: 'Filter until this date',
        },
        limit: {
          type: 'number',
          default: 20,
        },
      },
    },
  },
  {
    name: 'get_job_openings',
    description: 'Get active job openings with details about required skills, department, and application statistics.',
    inputSchema: {
      type: 'object',
      properties: {
        departmentId: {
          type: 'string',
          description: 'Filter by department UUID',
        },
        status: {
          type: 'string',
          enum: ['open', 'closed', 'on_hold'],
          description: 'Filter by job opening status',
        },
        includeApplications: {
          type: 'boolean',
          description: 'Include candidate application statistics',
          default: false,
        },
      },
    },
  },
  {
    name: 'get_candidates',
    description: 'Get candidates for recruitment. Can filter by job opening, status, or search by skills.',
    inputSchema: {
      type: 'object',
      properties: {
        jobOpeningId: {
          type: 'string',
          description: 'Filter by job opening UUID',
        },
        status: {
          type: 'string',
          description: 'Filter by candidate status (applied, screening, interview, etc.)',
        },
        skills: {
          type: 'array',
          items: { type: 'string' },
          description: 'Filter by required skills',
        },
        limit: {
          type: 'number',
          default: 20,
        },
      },
    },
  },
  {
    name: 'get_performance_reviews',
    description: 'Get performance reviews for employees. Can filter by employee, review period, or status.',
    inputSchema: {
      type: 'object',
      properties: {
        employeeId: {
          type: 'string',
          description: 'Filter by employee UUID',
        },
        reviewPeriod: {
          type: 'string',
          description: 'Review period (e.g., Q1 2025, Annual 2024)',
        },
        status: {
          type: 'string',
          enum: ['draft', 'submitted', 'completed'],
        },
      },
    },
  },
  {
    name: 'get_hyper_insights',
    description: 'Get intelligent insights from the HYPER agentic layer. This provides automated HR analytics like missing documents, incomplete onboarding, attendance patterns, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        insightType: {
          type: 'string',
          enum: [
            'missing_documents',
            'incomplete_onboarding',
            'attendance_summary',
            'absentee_patterns',
            'recruitment_pipeline',
            'pending_feedback',
            'quick_stats',
          ],
          description: 'Type of insight to retrieve',
        },
        filters: {
          type: 'object',
          description: 'Optional filters specific to the insight type',
          properties: {
            departmentId: { type: 'string' },
            days: { type: 'number' },
            date: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
          },
        },
      },
      required: ['insightType'],
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
    },
  },
  {
    name: 'create_leave_request',
    description: 'Create a new leave request for an employee. Requires employee ID, leave type, dates, and reason.',
    inputSchema: {
      type: 'object',
      properties: {
        employeeId: {
          type: 'string',
          description: 'Employee UUID',
        },
        leaveTypeId: {
          type: 'string',
          description: 'Leave type UUID',
        },
        startDate: {
          type: 'string',
          description: 'Leave start date (ISO format)',
        },
        endDate: {
          type: 'string',
          description: 'Leave end date (ISO format)',
        },
        reason: {
          type: 'string',
          description: 'Reason for leave',
        },
      },
      required: ['employeeId', 'leaveTypeId', 'startDate', 'endDate', 'reason'],
    },
  },
  {
    name: 'get_employee_goals',
    description: 'Get goals and objectives for an employee with progress tracking.',
    inputSchema: {
      type: 'object',
      properties: {
        employeeId: {
          type: 'string',
          description: 'Employee UUID',
        },
        status: {
          type: 'string',
          enum: ['active', 'completed', 'overdue'],
          description: 'Filter by goal status',
        },
      },
      required: ['employeeId'],
    },
  },
  {
    name: 'generate_dynamic_report',
    description: 'POWERFUL: Generate a comprehensive HRM report based on ANY natural language prompt. Claude will analyze the prompt, fetch relevant data, and generate a professional report in JSON, Markdown (.md), and PDF formats. Perfect for custom reports, analytics, and executive summaries.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Natural language description of the report you want. Examples: "Employee headcount by department", "Attendance analysis for last month", "Recruitment pipeline status", "Performance review summary"',
        },
        includeCharts: {
          type: 'boolean',
          description: 'Include data visualizations in the report (future feature)',
          default: false,
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'generate_quick_report',
    description: 'Generate predefined standard reports quickly. Available types: headcount, attendance, recruitment, performance, leaves, onboarding, payroll.',
    inputSchema: {
      type: 'object',
      properties: {
        reportType: {
          type: 'string',
          enum: ['headcount', 'attendance', 'recruitment', 'performance', 'leaves', 'onboarding', 'payroll'],
          description: 'Type of predefined report to generate',
        },
        filters: {
          type: 'object',
          description: 'Optional filters for the report',
          properties: {
            departmentId: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
          },
        },
      },
      required: ['reportType'],
    },
  },
];

/**
 * Get tool by name
 */
export function getToolByName(name: string): MCPTool | undefined {
  return mcpTools.find((tool) => tool.name === name);
}

/**
 * Validate tool arguments against schema
 */
export function validateToolArguments(tool: MCPTool, args: any): boolean {
  try {
    // Basic validation - in production you'd want more robust validation
    const schema = tool.inputSchema as any;
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
