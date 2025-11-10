import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { LeaveApplication } from './model';
import { Employee } from '../employee/model';
import { LeaveType } from '../leave-type/model';
import { User } from '../user/model';

import { CreateLeaveApplicationInput, UpdateLeaveApplicationInput, QueryLeaveApplicationInput } from './types';

// Interface for user context from JWT token
interface UserContext {
  userId: string;
  role: string;
  scope?: string[];
}

/**
 * Helper function to build role-based where conditions for leave applications
 *
 * @param userContext - The authenticated user's context (userId, role, scope)
 * @returns Object with employeeIds array that the user is allowed to see
 */
const getRoleBasedFilter = async (userContext: UserContext): Promise<{ allowedEmployeeIds: string[] } | null> => {
  const { userId, role } = userContext;

  // HR and Admin can see all leave applications - no filtering needed
  if (role === 'hr' || role === 'admin') {
    return null; // null means no filtering
  }

  // For employee and manager roles, we need to find their employee record
  const currentEmployee = await Employee.findOne({
    where: { userId },
    attributes: ['employeeId'],
  });

  if (!currentEmployee) {
    // If no employee record found, they can't see any leave applications
    return { allowedEmployeeIds: [] };
  }

  const currentEmployeeId = currentEmployee.employeeId;

  // For employee role - can only see their own leave applications
  if (role === 'employee') {
    return { allowedEmployeeIds: [currentEmployeeId] };
  }

  // For manager role - can see their own + their team members' leave applications
  if (role === 'manager') {
    const teamMembers = await Employee.findAll({
      where: { reportingManagerId: currentEmployeeId },
      attributes: ['employeeId'],
    });

    const teamMemberIds = teamMembers.map((emp) => emp.employeeId);
    // Include manager's own employeeId + all team members
    return { allowedEmployeeIds: [currentEmployeeId, ...teamMemberIds] };
  }

  // Default: no access
  return { allowedEmployeeIds: [] };
};

export const fetchLeaveApplicationList = async (params: QueryLeaveApplicationInput, userContext: UserContext) => {
  const pageSize = Math.min(params.pageSize || 10, 1000);
  const curPage = params.page || 0;

  // Apply role-based filtering
  const roleFilter = await getRoleBasedFilter(userContext);
  let whereClause: any = {};

  // If roleFilter is not null, apply the employeeId filter
  if (roleFilter !== null) {
    if (roleFilter.allowedEmployeeIds.length === 0) {
      // User has no access to any leave applications
      return { data: [], meta: { total: 0, page: curPage, pageSize } };
    }
    whereClause.employeeId = { [Op.in]: roleFilter.allowedEmployeeIds };
  }
  // If roleFilter is null (HR/Admin), no where clause needed - they see all

  const { count, rows } = await LeaveApplication.findAndCountAll({
    attributes: [
      // leaveApplicationId, employeeId, leaveTypeId, startDate, endDate, numberOfDays, reason, status, appliedById, approvedById, createdAt, updatedAt
      [Sequelize.col('LeaveApplication.leave_application_id'), 'leaveApplicationId'],
      [Sequelize.col('LeaveApplication.employee_id'), 'employeeId'],
      [Sequelize.col('LeaveApplication.leave_type_id'), 'leaveTypeId'],
      [Sequelize.col('LeaveApplication.start_date'), 'startDate'],
      [Sequelize.col('LeaveApplication.end_date'), 'endDate'],
      [Sequelize.col('LeaveApplication.number_of_day'), 'numberOfDay'],
      [Sequelize.col('LeaveApplication.reason'), 'reason'],
      [Sequelize.col('LeaveApplication.status'), 'status'],
      [Sequelize.col('LeaveApplication.applied_by'), 'appliedBy'],
      [Sequelize.col('LeaveApplication.created_at'), 'createdAt'],
      [Sequelize.col('LeaveApplication.updated_at'), 'updatedAt'],
      [Sequelize.col('leaveType.type_name'), 'typeName'],
      [Sequelize.col('employee.first_name'), 'firstName'],
      [Sequelize.col('employee.last_name'), 'lastName'],
    ],
    where: whereClause, // Apply role-based filtering here
    include: [
      {
        model: Employee,
        as: 'employee',
      },
      {
        model: LeaveType,
        as: 'leaveType',
      },
    ],
    offset: Number(curPage) * Number(pageSize),
    limit: Number(pageSize),
  });

  const plainRows = rows.map((row) => row.get({ plain: true }));
  return { data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addLeaveApplication = async (payload: CreateLeaveApplicationInput): Promise<any> => {
  // Prepare payload data and add properties

  const leaveApplicationDefaultPayload = {
    startDate: payload.startDate ?? new Date(),
    endDate: payload.endDate ?? new Date(),
    status: payload.status ?? 'Pending',
  };
  const leaveApplication = await LeaveApplication.create({ ...payload, ...leaveApplicationDefaultPayload });

  return leaveApplication.get({ plain: true });
};

export const editLeaveApplication = async (params: any, userContext: UserContext): Promise<LeaveApplication | { errorCode: string; message: string }> => {
  // Initialize filters and include relationships
  let where: any = {};

  // Apply role-based filtering
  const roleFilter = await getRoleBasedFilter(userContext);

  // If roleFilter is not null, apply the employeeId filter
  if (roleFilter !== null) {
    if (roleFilter.allowedEmployeeIds.length === 0) {
      // User has no access to any leave applications
      return { errorCode: 'FORBIDDEN', message: 'You do not have permission to view this leave application' };
    }
    where.employeeId = { [Op.in]: roleFilter.allowedEmployeeIds };
  }
  // If roleFilter is null (HR/Admin), no where clause needed - they see all

  const include: any[] = [
    {
      model: Employee,
      as: 'employee',
      attributes: ['employeeId', 'firstName', 'lastName'],
    },
    {
      model: LeaveType,
      as: 'leaveType',
      attributes: ['leaveTypeId', 'typeName'],
    },
  ];

  const leaveApplication = await LeaveApplication.findOne({
    attributes: [
      // employeeId, leaveTypeId, startDate, endDate, reason, status, approvedById
      [Sequelize.col('employee.employee_id'), 'employeeId'],
      [Sequelize.col('leaveType.leave_type_id'), 'leaveTypeId'],
      [Sequelize.col('LeaveApplication.start_date'), 'startDate'],
      [Sequelize.col('LeaveApplication.end_date'), 'endDate'],
      [Sequelize.col('LeaveApplication.reason'), 'reason'],
      [Sequelize.col('LeaveApplication.status'), 'status'],
    ],
    where: {
      leaveApplicationId: params.leaveApplicationId,
      ...where,
    },
    include: [...include],
  });

  if (!leaveApplication) {
    return { errorCode: 'INVALID_LEAVE_APPLICATION_ID', message: 'Invalid leaveApplication ID' };
  }

  return leaveApplication.get({ plain: true }) as LeaveApplication;
};

export const updateLeaveApplication = async (params: any, payload: UpdateLeaveApplicationInput, userContext: UserContext): Promise<any> => {
  let where: any = {};

  // Apply role-based filtering
  const roleFilter = await getRoleBasedFilter(userContext);

  // If roleFilter is not null, apply the employeeId filter
  if (roleFilter !== null) {
    if (roleFilter.allowedEmployeeIds.length === 0) {
      // User has no access to any leave applications
      return { errorCode: 'FORBIDDEN', message: 'You do not have permission to update this leave application' };
    }
    where.employeeId = { [Op.in]: roleFilter.allowedEmployeeIds };
  }
  // If roleFilter is null (HR/Admin), no where clause needed - they can update all

  const leaveApplication = await LeaveApplication.findOne({
    where: {
      leaveApplicationId: params.leaveApplicationId,
      ...where,
    },
  });

  if (!leaveApplication) {
    return { errorCode: 'INVALID_LEAVE_APPLICATION_ID', message: 'Invalid leaveApplication ID' };
  }

  await leaveApplication.update(payload);

  return {
    message: 'LeaveApplication updated successfully',
    data: leaveApplication.get({ plain: true }),
  };
};

export const getLeaveApplication = async (params: any, userContext: UserContext): Promise<any> => {
  let where: any = {};

  // Apply role-based filtering
  const roleFilter = await getRoleBasedFilter(userContext);

  // If roleFilter is not null, apply the employeeId filter
  if (roleFilter !== null) {
    if (roleFilter.allowedEmployeeIds.length === 0) {
      // User has no access to any leave applications
      return { errorCode: 'FORBIDDEN', message: 'You do not have permission to view this leave application' };
    }
    where.employeeId = { [Op.in]: roleFilter.allowedEmployeeIds };
  }
  // If roleFilter is null (HR/Admin), no where clause needed - they see all

  const include: any[] = [
    {
      model: Employee,
      as: 'employee',
      attributes: [
        [Sequelize.col('employee.employee_id'), 'employeeId'],
        [Sequelize.col('employee.first_name'), 'firstName'],
        [Sequelize.col('employee.last_name'), 'lastName'],
      ],
    },
    {
      model: LeaveType,
      as: 'leaveType',
      attributes: [
        [Sequelize.col('leaveType.leave_type_id'), 'leaveTypeId'],
        [Sequelize.col('leaveType.type_name'), 'typeName'],
      ],
    },
  ];

  const leaveApplication = await LeaveApplication.findOne({
    attributes: [
      // leaveApplicationId, employeeId, leaveTypeId, startDate, endDate, numberOfDays, reason, status, appliedById, approvedById, createdAt, updatedAt
      [Sequelize.col('LeaveApplication.leave_application_id'), 'leaveApplicationId'],
      [Sequelize.col('LeaveApplication.employee_id'), 'employeeId'],
      [Sequelize.col('LeaveApplication.leave_type_id'), 'leaveTypeId'],
      [Sequelize.col('LeaveApplication.start_date'), 'startDate'],
      [Sequelize.col('LeaveApplication.end_date'), 'endDate'],
      [Sequelize.col('LeaveApplication.number_of_day'), 'numberOfDay'],
      [Sequelize.col('LeaveApplication.reason'), 'reason'],
      [Sequelize.col('LeaveApplication.status'), 'status'],
      [Sequelize.col('LeaveApplication.applied_by'), 'appliedBy'],
      [Sequelize.col('LeaveApplication.created_at'), 'createdAt'],
      [Sequelize.col('LeaveApplication.updated_at'), 'updatedAt'],
    ],
    where: {
      leaveApplicationId: params.leaveApplicationId,
      ...where,
    },
    include: [...include],
  });

  if (!leaveApplication) {
    return { errorCode: 'INVALID_LEAVE_APPLICATION_ID', message: 'Invalid leaveApplication ID' };
  }

  return {
    data: leaveApplication.get({ plain: true }),
  };
};

export const deleteLeaveApplication = async (params: any): Promise<any> => {
  let where: any = {};

  const leaveApplication = await LeaveApplication.findOne({
    where: {
      leaveApplicationId: params.leaveApplicationId,
      ...where,
    },
  });

  if (!leaveApplication) {
    return { errorCode: 'INVALID_LEAVE_APPLICATION_ID', message: 'Invalid leaveApplication ID' };
  }

  await leaveApplication.destroy();

  return { messageCode: 'LEAVE_APPLICATION_DELETED_SUCCESSFULLY', message: 'leaveApplication Deleted Successfully' };
};
