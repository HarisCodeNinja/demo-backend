import { ToolCallResponse } from './types';
import { Request } from 'express';
import { Op } from 'sequelize';
import { reportGenerator } from './reportGenerator';

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
   * Execute a tool with given arguments
   */
  static async execute(
    toolName: string,
    args: any,
    req: Request
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
          return await this.generateDynamicReport(args, req);

        case 'generate_quick_report':
          return await this.generateQuickReport(args, req);

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

    const result = {
      employee: employee.toJSON(),
      attendance: attendanceData ? attendanceData.map((a) => a.toJSON()) : null,
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
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

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              departmentId,
              count: employees.length,
              employees: employees.map((e) => e.toJSON()),
            },
            null,
            2
          ),
        },
      ],
    };
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

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              query,
              count: employees.length,
              employees: employees.map((e) => e.toJSON()),
            },
            null,
            2
          ),
        },
      ],
    };
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

    const summary = {
      totalRecords: attendanceRecords.length,
      present: attendanceRecords.filter((a) => a.status === 'present').length,
      absent: attendanceRecords.filter((a) => a.status === 'absent').length,
      late: attendanceRecords.filter((a) => a.status === 'late').length,
      onLeave: attendanceRecords.filter((a) => a.status === 'on_leave').length,
      records: attendanceRecords.map((a) => a.toJSON()),
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(summary, null, 2),
        },
      ],
    };
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

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              count: leaveRequests.length,
              leaveRequests: leaveRequests.map((l) => l.toJSON()),
            },
            null,
            2
          ),
        },
      ],
    };
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

    const result: any = {
      count: jobOpenings.length,
      jobOpenings: jobOpenings.map((j) => j.toJSON()),
    };

    if (includeApplications) {
      // Add candidate counts for each job opening
      for (const job of result.jobOpenings) {
        const candidateCount = await Candidate.count({
          where: { jobOpeningId: job.jobOpeningId },
        });
        job.candidateCount = candidateCount;
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
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

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              count: candidates.length,
              candidates: candidates.map((c) => c.toJSON()),
            },
            null,
            2
          ),
        },
      ],
    };
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

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              count: reviews.length,
              reviews: reviews.map((r) => r.toJSON()),
            },
            null,
            2
          ),
        },
      ],
    };
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

    // Map insight types to HYPER endpoints
    const endpointMap: Record<string, string> = {
      missing_documents: '/hyper/employee-lifecycle/missing-documents',
      incomplete_onboarding: '/hyper/employee-lifecycle/incomplete-onboarding',
      attendance_summary: '/hyper/attendance/today-summary',
      absentee_patterns: '/hyper/attendance/absentee-patterns',
      recruitment_pipeline: '/hyper/recruitment/pipeline-summary',
      pending_feedback: '/hyper/recruitment/pending-feedback',
      quick_stats: '/hyper/dashboard/quick-stats',
    };

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

    // Note: In a real implementation, you would import and call the actual
    // service functions rather than making HTTP calls
    // For now, return a placeholder
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

    const result = departments.map((d) => d.toJSON());

    if (includeEmployeeCount) {
      for (const dept of result) {
        const count = await Employee.count({
          where: { departmentId: dept.departmentId },
        });
        (dept as any).employeeCount = count;
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              count: departments.length,
              departments: result,
            },
            null,
            2
          ),
        },
      ],
    };
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

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                leaveRequest: leaveRequest.toJSON(),
                message: 'Leave request created successfully',
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

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              employeeId,
              count: goals.length,
              goals: goals.map((g) => g.toJSON()),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Generate dynamic report
   */
  private static async generateDynamicReport(
    args: any,
    req: Request
  ): Promise<ToolCallResponse> {
    const { prompt } = args;

    try {
      const report = await reportGenerator.generateReport(prompt, req);

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
    req: Request
  ): Promise<ToolCallResponse> {
    const { reportType, filters = {} } = args;

    try {
      const report = await reportGenerator.generateQuickReport(reportType, filters, req);

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
}
