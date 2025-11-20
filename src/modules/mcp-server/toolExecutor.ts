import { ToolCallResponse } from './types';
import { Request } from 'express';
import { Op } from 'sequelize';
import { reportGenerator } from './reportGenerator';
import { genaiReportGenerator } from './genaiReportGenerator';
import { DynamicSqlExecutor } from './dynamicSqlExecutor';
import {
  getIncompleteOnboarding,
  getMissingDocuments,
  getPendingVerifications,
} from '../hyper/employee-lifecycle/service';

// Import models as needed
import { Employee } from '../employee/model';
import { Department } from '../department/model';
import { Designation } from '../designation/model';
import { Location } from '../location/model';
import { Attendance } from '../attendance/model';
import { LeaveApplication } from '../leave-application/model';
import { JobOpening } from '../job-opening/model';
import { Candidate } from '../candidate/model';
import { PerformanceReview } from '../performance-review/model';
import { Goal } from '../goal/model';

/**
 * Execute MCP tools and return results
 * This maps tool calls to actual HRM API operations
 */
export class ToolExecutor {
  /**
   * Create standardized response format with data and meta
   */
  private static createResponse(data: any, message: string, additionalMeta?: any): ToolCallResponse {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              data,
              meta: {
                message,
                timestamp: new Date().toISOString(),
                ...additionalMeta,
              },
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Execute a tool with given arguments
   */
  static async execute(
    toolName: string,
    args: any,
    req: Request,
    aiProvider: 'claude' | 'gemini' = 'gemini'
  ): Promise<ToolCallResponse> {
    try {
      switch (toolName) {
        case 'get_employee_info':
          return await this.getEmployeeInfo(args, req);

        case 'get_department_employees':
          return await this.getDepartmentEmployees(args, req);

        case 'search_employees':
          return await this.searchEmployees(args, req);

        case 'get_attendance_summary':
          return await this.getAttendanceSummary(args, req);

        case 'get_leave_requests':
          return await this.getLeaveRequests(args, req);

        case 'get_job_openings':
          return await this.getJobOpenings(args, req);

        case 'get_candidates':
          return await this.getCandidates(args, req);

        case 'get_performance_reviews':
          return await this.getPerformanceReviews(args, req);

        case 'get_hyper_insights':
          return await this.getHyperInsights(args, req);

        case 'get_departments':
          return await this.getDepartments(args, req);

        case 'create_leave_request':
          return await this.createLeaveRequest(args, req);

        case 'get_employee_goals':
          return await this.getEmployeeGoals(args, req);

        case 'generate_dynamic_report':
          return await this.generateDynamicReport(args, req, aiProvider);

        case 'generate_quick_report':
          return await this.generateQuickReport(args, req, aiProvider);

        case 'get_database_schema':
          return await this.getDatabaseSchema(args, req);

        case 'execute_sql_query':
          return await this.executeSqlQuery(args, req);

        case 'get_table_info':
          return await this.getTableInfo(args, req);

        default:
          return {
            content: [
              {
                type: 'text',
                text: `Unknown tool: ${toolName}`,
              },
            ],
            isError: true,
          };
      }
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing tool ${toolName}: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Get employee information
   */
  private static async getEmployeeInfo(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { identifier, includeAttendance } = args;

    const whereClause: any = {};

    // Check if identifier is UUID or email
    if (identifier.includes('@')) {
      whereClause.email = identifier;
    } else {
      whereClause.employeeId = identifier;
    }

    const employee = await Employee.findOne({
      where: whereClause,
      include: [
        { model: Department, as: 'department' },
        { model: Designation, as: 'designation' },
        { model: Location, as: 'location' },
      ],
    });

    if (!employee) {
      return {
        content: [
          {
            type: 'text',
            text: `Employee not found: ${identifier}`,
          },
        ],
        isError: true,
      };
    }

    let attendanceData = null;
    if (includeAttendance) {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      attendanceData = await Attendance.findAll({
        where: {
          employeeId: employee.employeeId,
          attendanceDate: {
            [Op.gte]: last30Days,
          },
        },
        order: [['attendanceDate', 'DESC']],
        limit: 30,
      });
    }

    const data = {
      employee: employee.toJSON(),
      attendance: attendanceData ? attendanceData.map((a) => a.toJSON()) : null,
    };

    const message = attendanceData
      ? `Retrieved employee ${employee.firstName} ${employee.lastName} with ${attendanceData.length} attendance records (last 30 days)`
      : `Retrieved employee ${employee.firstName} ${employee.lastName}`;

    return this.createResponse(data, message);
  }

  /**
   * Get department employees
   */
  private static async getDepartmentEmployees(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { departmentId, includeInactive } = args;

    const whereClause: any = { departmentId };
    if (!includeInactive) {
      whereClause.status = 'active';
    }

    const employees = await Employee.findAll({
      where: whereClause,
      include: [
        { model: Designation, as: 'designation' },
      ],
      order: [['firstName', 'ASC']],
    });

    const data = {
      departmentId,
      employees: employees.map((e) => e.toJSON()),
    };

    const message = `Found ${employees.length} employee${employees.length !== 1 ? 's' : ''} in the department`;

    return this.createResponse(data, message, { count: employees.length });
  }

  /**
   * Search employees
   */
  private static async searchEmployees(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { query, filters, limit = 10 } = args;

    const whereClause: any = {
      [Op.or]: [
        { firstName: { [Op.iLike]: `%${query}%` } },
        { lastName: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (filters) {
      if (filters.departmentId) whereClause.departmentId = filters.departmentId;
      if (filters.designationId) whereClause.designationId = filters.designationId;
      if (filters.locationId) whereClause.locationId = filters.locationId;
    }

    const employees = await Employee.findAll({
      where: whereClause,
      include: [
        { model: Department, as: 'department' },
        { model: Designation, as: 'designation' },
      ],
      limit,
    });

    const data = {
      query,
      employees: employees.map((e) => e.toJSON()),
    };

    const message = `Found ${employees.length} employee${employees.length !== 1 ? 's' : ''} matching "${query}"`;

    return this.createResponse(data, message, { count: employees.length });
  }

  /**
   * Get attendance summary
   */
  private static async getAttendanceSummary(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { startDate, endDate, employeeId, departmentId } = args;

    const whereClause: any = {
      attendanceDate: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    };

    if (employeeId) whereClause.employeeId = employeeId;
    if (departmentId) {
      // Join with Employee to filter by department
      const employees = await Employee.findAll({
        where: { departmentId },
        attributes: ['employeeId'],
      });
      whereClause.employeeId = {
        [Op.in]: employees.map((e) => e.employeeId),
      };
    }

    const attendanceRecords = await Attendance.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{ model: Department, as: 'department' }],
        },
      ],
    });

    const presentCount = attendanceRecords.filter((a) => a.status === 'present').length;
    const absentCount = attendanceRecords.filter((a) => a.status === 'absent').length;
    const lateCount = attendanceRecords.filter((a) => a.status === 'late').length;
    const onLeaveCount = attendanceRecords.filter((a) => a.status === 'on_leave').length;

    const data = {
      totalRecords: attendanceRecords.length,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      onLeave: onLeaveCount,
      records: attendanceRecords.map((a) => a.toJSON()),
    };

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const message = `Attendance summary for ${formatDate(new Date(startDate))} to ${formatDate(new Date(endDate))}: ${attendanceRecords.length} total record${attendanceRecords.length !== 1 ? 's' : ''}, ${presentCount} present, ${absentCount} absent, ${lateCount} late, ${onLeaveCount} on leave`;

    return this.createResponse(data, message);
  }

  /**
   * Get leave requests
   */
  private static async getLeaveRequests(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { status, employeeId, startDate, endDate, limit = 20 } = args;

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (employeeId) whereClause.employeeId = employeeId;
    if (startDate && endDate) {
      whereClause.startDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const leaveRequests = await LeaveApplication.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{ model: Department, as: 'department' }],
        },
      ],
      limit,
      order: [['createdAt', 'DESC']],
    });

    const data = {
      leaveRequests: leaveRequests.map((l) => l.toJSON()),
    };

    const statusText = status ? ` with status "${status}"` : '';
    const message = `Found ${leaveRequests.length} leave request${leaveRequests.length !== 1 ? 's' : ''}${statusText}`;

    return this.createResponse(data, message, { count: leaveRequests.length });
  }

  /**
   * Get job openings
   */
  private static async getJobOpenings(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { departmentId, status, includeApplications } = args;

    const whereClause: any = {};
    if (departmentId) whereClause.departmentId = departmentId;
    if (status) whereClause.status = status;

    const jobOpenings = await JobOpening.findAll({
      where: whereClause,
      include: [
        { model: Department, as: 'department' },
      ],
    });

    const jobOpeningsList = jobOpenings.map((j) => j.toJSON());

    if (includeApplications) {
      // Add candidate counts for each job opening
      for (const job of jobOpeningsList) {
        const candidateCount = await Candidate.count({
          where: { jobOpeningId: job.jobOpeningId },
        });
        (job as any).candidateCount = candidateCount;
      }
    }

    const data = {
      jobOpenings: jobOpeningsList,
    };

    const statusText = status ? ` with status "${status}"` : '';
    const applicationsText = includeApplications ? ' with application counts' : '';
    const message = `Found ${jobOpenings.length} job opening${jobOpenings.length !== 1 ? 's' : ''}${statusText}${applicationsText}`;

    return this.createResponse(data, message, { count: jobOpenings.length });
  }

  /**
   * Get candidates
   */
  private static async getCandidates(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { jobOpeningId, status, skills, limit = 20 } = args;

    const whereClause: any = {};
    if (jobOpeningId) whereClause.jobOpeningId = jobOpeningId;
    if (status) whereClause.status = status;

    const candidates = await Candidate.findAll({
      where: whereClause,
      include: [
        {
          model: JobOpening,
          as: 'jobOpening',
          include: [{ model: Department, as: 'department' }],
        },
      ],
      limit,
      order: [['createdAt', 'DESC']],
    });

    const data = {
      candidates: candidates.map((c) => c.toJSON()),
    };

    const statusText = status ? ` with status "${status}"` : '';
    const message = `Found ${candidates.length} candidate${candidates.length !== 1 ? 's' : ''}${statusText}`;

    return this.createResponse(data, message, { count: candidates.length });
  }

  /**
   * Get performance reviews
   */
  private static async getPerformanceReviews(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { employeeId, reviewPeriod, status } = args;

    const whereClause: any = {};
    if (employeeId) whereClause.employeeId = employeeId;
    if (reviewPeriod) whereClause.reviewPeriod = reviewPeriod;
    if (status) whereClause.status = status;

    const reviews = await PerformanceReview.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [
            { model: Department, as: 'department' },
            { model: Designation, as: 'designation' },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const data = {
      reviews: reviews.map((r) => r.toJSON()),
    };

    const periodText = reviewPeriod ? ` for period "${reviewPeriod}"` : '';
    const statusText = status ? ` with status "${status}"` : '';
    const message = `Found ${reviews.length} performance review${reviews.length !== 1 ? 's' : ''}${periodText}${statusText}`;

    return this.createResponse(data, message, { count: reviews.length });
  }

  /**
   * Get HYPER insights
   * This proxies to existing HYPER endpoints
   */
  private static async getHyperInsights(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { insightType, filters = {} } = args;

    const endpointMap: Record<string, string> = {
      missing_documents: '/hyper/employee-lifecycle/missing-documents',
      incomplete_onboarding: '/hyper/employee-lifecycle/incomplete-onboarding',
      attendance_summary: '/hyper/attendance/today-summary',
      absentee_patterns: '/hyper/attendance/absentee-patterns',
      recruitment_pipeline: '/hyper/recruitment/pipeline-summary',
      pending_feedback: '/hyper/recruitment/pending-feedback',
      quick_stats: '/hyper/dashboard/quick-stats',
    };

    const serviceMap: Record<string, (req: Request, query: any) => Promise<any>> = {
      missing_documents: getMissingDocuments,
      incomplete_onboarding: getIncompleteOnboarding,
      pending_verifications: getPendingVerifications,
    };

    const handler = serviceMap[insightType];

    if (handler) {
      try {
        const safeFilters = filters || {};
        const result = await handler(req, safeFilters);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  insightType,
                  filters: safeFilters,
                  data: result?.data || [],
                  meta: result?.meta || {},
                  source: 'HYPER employee lifecycle service',
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to fetch ${insightType} insight: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }

    const endpoint = endpointMap[insightType];
    if (!endpoint) {
      return {
        content: [
          {
            type: 'text',
            text: `Unknown insight type: ${insightType}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              insightType,
              endpoint,
              filters,
              message: 'HYPER insights are available via the API endpoints',
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Get departments
   */
  private static async getDepartments(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { includeEmployeeCount = true } = args;

    const departments = await Department.findAll({
      order: [['departmentName', 'ASC']],
    });

    const departmentsList = departments.map((d) => d.toJSON());

    if (includeEmployeeCount) {
      for (const dept of departmentsList) {
        const count = await Employee.count({
          where: { departmentId: dept.departmentId },
        });
        (dept as any).employeeCount = count;
      }
    }

    const data = {
      departments: departmentsList,
    };

    const countsText = includeEmployeeCount ? ' with employee counts' : '';
    const message = `Found ${departments.length} department${departments.length !== 1 ? 's' : ''}${countsText}`;

    return this.createResponse(data, message, { count: departments.length });
  }

  /**
   * Create leave request
   */
  private static async createLeaveRequest(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { employeeId, leaveTypeId, startDate, endDate, reason } = args;

    try {
      const leaveRequest = await LeaveApplication.create({
        employeeId,
        leaveTypeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: 'pending',
      });

      const data = {
        leaveRequest: leaveRequest.toJSON(),
      };

      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const message = `Leave request created successfully for ${formatDate(new Date(startDate))} to ${formatDate(new Date(endDate))}`;

      return this.createResponse(data, message);
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to create leave request: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Get employee goals
   */
  private static async getEmployeeGoals(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { employeeId, status } = args;

    const whereClause: any = { employeeId };
    if (status) whereClause.status = status;

    const goals = await Goal.findAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'employee',
          include: [{ model: Department, as: 'department' }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const data = {
      employeeId,
      goals: goals.map((g) => g.toJSON()),
    };

    const statusText = status ? ` with status "${status}"` : '';
    const message = `Found ${goals.length} goal${goals.length !== 1 ? 's' : ''} for employee${statusText}`;

    return this.createResponse(data, message, { count: goals.length });
  }

  /**
   * Generate dynamic report
   */
  private static async generateDynamicReport(
    args: any,
    req: Request,
    aiProvider: 'claude' | 'gemini' = 'gemini'
  ): Promise<ToolCallResponse> {
    const { prompt } = args;

    try {
      // Use appropriate report generator based on AI provider
      const generator = aiProvider === 'claude' ? reportGenerator : genaiReportGenerator;
      const report = await generator.generateReport(prompt, req);

      // Convert PDF buffer to base64 for transmission
      const pdfBase64 = report.pdf.toString('base64');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Report generated successfully: ${report.metadata.title}`,
                metadata: report.metadata,
                formats: {
                  json: report.json,
                  markdown: report.markdown,
                  pdf: {
                    base64: pdfBase64,
                    size: report.pdf.length,
                    encoding: 'base64',
                  },
                },
                downloadInstructions: {
                  markdown: 'Save the markdown content to a .md file',
                  pdf: 'Decode the base64 string and save as .pdf',
                  json: 'The json object contains all structured data',
                },
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to generate report: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Generate quick report
   */
  private static async generateQuickReport(
    args: any,
    req: Request,
    aiProvider: 'claude' | 'gemini' = 'gemini'
  ): Promise<ToolCallResponse> {
    const { reportType, filters = {} } = args;

    try {
      // Use appropriate report generator based on AI provider
      const generator = aiProvider === 'claude' ? reportGenerator : genaiReportGenerator;
      const report = await generator.generateQuickReport(reportType, filters, req);

      // Convert PDF buffer to base64
      const pdfBase64 = report.pdf.toString('base64');

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `${reportType} report generated successfully`,
                reportType,
                formats: {
                  json: report.json,
                  markdown: report.markdown,
                  pdf: {
                    base64: pdfBase64,
                    size: report.pdf.length,
                    encoding: 'base64',
                  },
                },
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to generate quick report: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Get database schema (optimized - returns compact schema)
   */
  private static async getDatabaseSchema(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    try {
      // Use compact schema to reduce token usage
      const schema = await DynamicSqlExecutor.getDatabaseSchemaCompact();

      const data = {
        schema,
        hint: 'Use get_table_info for detailed column information on specific tables',
      };

      const message = `Database schema retrieved: ${schema.tables.length} table${schema.tables.length !== 1 ? 's' : ''} with key columns and relationships`;

      return this.createResponse(data, message);
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to get database schema: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Execute SQL query
   */
  private static async executeSqlQuery(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { sqlQuery } = args;

    try {
      const result = await DynamicSqlExecutor.executeDynamicQuery(sqlQuery, req);

      return {
        content: [
          {
            type: 'text',
            text: [
              'SUCCESS: SQL query executed successfully.',
              result.formattedResult.summary,
              `Rows returned: ${result.rowCount}`,
              `Execution time: ${result.executionTime}ms`,
              result.formattedResult.columns.length
                ? `Columns: ${result.formattedResult.columns.join(', ')}`
                : 'Columns: Not available',
              '',
              result.formattedResult.markdownTable,
              '',
              'JSON preview:',
              '```json',
              JSON.stringify(
                result.data.slice(
                  0,
                  Math.max(result.formattedResult.previewRowCount, 5)
                ),
                null,
                2
              ),
              '```',
            ].join('\n'),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to execute SQL query: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Get table info
   */
  private static async getTableInfo(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { tableName } = args;

    try {
      const tableInfo = await DynamicSqlExecutor.getTableInfo(tableName);

      const data = {
        tableName,
        tableInfo,
      };

      const columnCount = tableInfo.columns?.length || 0;
      const sampleCount = tableInfo.sampleData?.length || 0;
      const message = `Table information for "${tableName}": ${columnCount} column${columnCount !== 1 ? 's' : ''}, ${sampleCount} sample row${sampleCount !== 1 ? 's' : ''}`;

      return this.createResponse(data, message);
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to get table info: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
}
