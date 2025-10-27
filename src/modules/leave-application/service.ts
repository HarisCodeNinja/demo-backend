import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { LeaveApplication } from './model';
import { Employee } from '../employee/model';
import { LeaveType } from '../leave-type/model';

import { CreateLeaveApplicationInput, UpdateLeaveApplicationInput, QueryLeaveApplicationInput } from './types';

export const fetchLeaveApplicationList = async (params: QueryLeaveApplicationInput) => {
  const pageSize = Math.min(params.pageSize || 10, 1000);
  const curPage = params.page || 0;

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

export const editLeaveApplication = async (params: any): Promise<LeaveApplication | { errorCode: string; message: string }> => {
  // Initialize filters and include relationships
  let where: any = {};
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
      // employeeId, leaveTypeId, startDate, endDate, reason, status, approvedById
      [Sequelize.col('LeaveApplication.employee_id'), 'employeeId'],
      [Sequelize.col('LeaveApplication.leave_type_id'), 'leaveTypeId'],
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

export const updateLeaveApplication = async (params: any, payload: UpdateLeaveApplicationInput): Promise<any> => {
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

  await leaveApplication.update(payload);

  return {
    message: 'LeaveApplication updated successfully',
    data: leaveApplication.get({ plain: true }),
  };
};

export const getLeaveApplication = async (params: any): Promise<any> => {
  let where: any = {};
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
