import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Employee } from './model';
import { User } from '../user/model';
import { Designation } from '../designation/model';
import { Department } from '../department/model';
import { cache } from '../../util/cache';

import { CreateEmployeeInput, UpdateEmployeeInput, QueryEmployeeInput } from './types';
import { uuid } from 'uuidv4';

export const fetchEmployeeList = async (params: QueryEmployeeInput) => {
  const pageSize = Math.min(params.pageSize || 10, 1000);
  const curPage = params.page || 0;

  const { count, rows } = await Employee.findAndCountAll({
    attributes: [
      // employeeId, userId, employeeUniqueId, firstName, lastName, dateOfBirth, gender, phoneNumber, address, personalEmail, employmentStartDate, employmentEndDate, departmentId, designationId, reportingManagerId, status, createdAt, updatedAt
      [Sequelize.col('Employee.employee_id'), 'employeeId'],
      [Sequelize.col('Employee.user_id'), 'userId'],
      [Sequelize.col('Employee.employee_unique_id'), 'employeeUniqueId'],
      [Sequelize.col('Employee.first_name'), 'firstName'],
      [Sequelize.col('Employee.last_name'), 'lastName'],
      [Sequelize.col('Employee.date_of_birth'), 'dateOfBirth'],
      [Sequelize.col('Employee.gender'), 'gender'],
      [Sequelize.col('Employee.phone_number'), 'phoneNumber'],
      [Sequelize.col('Employee.address'), 'address'],
      [Sequelize.col('Employee.personal_email'), 'personalEmail'],
      [Sequelize.col('Employee.employment_start_date'), 'employmentStartDate'],
      [Sequelize.col('Employee.employment_end_date'), 'employmentEndDate'],
      [Sequelize.col('Employee.department_id'), 'departmentId'],
      [Sequelize.col('Employee.designation_id'), 'designationId'],
      [Sequelize.col('Employee.reporting_manager_id'), 'reportingManagerId'],
      [Sequelize.col('Employee.status'), 'status'],
      [Sequelize.col('Employee.created_at'), 'createdAt'],
      [Sequelize.col('Employee.updated_at'), 'updatedAt'],
      [Sequelize.col('user.email'), 'email'],
      [Sequelize.col('user.username'), 'username'],
      [Sequelize.col('department.department_name'), 'departmentName'],
      [Sequelize.col('designation.designation_name'), 'designationName'],
      [Sequelize.col('reportingManager.first_name'), 'reportingManagerFirstName'],
      [Sequelize.col('reportingManager.last_name'), 'reportingManagerLastName'],
    ],
    include: [
      {
        model: User,
        as: 'user',
      },
      {
        model: Department,
        as: 'department',
      },
      {
        model: Designation,
        as: 'designation',
      },
      {
        model: Employee,
        as: 'reportingManager',
      },
    ],
    offset: Number(curPage) * Number(pageSize),
    limit: Number(pageSize),
  });

  const plainRows = rows.map((row) => row.get({ plain: true }));
  return { data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectEmployee = async () => {
  // Check cache first - employee list changes less frequently
  const cacheKey = 'select:employees';
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const results = await Employee.findAll({
    attributes: [
      [Sequelize.col('Employee.employee_id'), 'value'],
      [Sequelize.col('Employee.first_name'), 'label'],
    ],
    raw: true, // Faster - no Sequelize model overhead
  });

  // Cache for 2 minutes (120 seconds) - shorter TTL as employees change more often
  cache.set(cacheKey, results, 120);
  return results;
};

export const selectManagers = async () => {
  // Check cache first
  const cacheKey = 'select:managers';
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const results = await Employee.findAll({
    attributes: [
      [Sequelize.col('Employee.employee_id'), 'value'],
      [Sequelize.col('Employee.first_name'), 'label'],
    ],
    include: [
      {
        model: User,
        as: 'user',
        where: {
          role: 'manager',
        },
        attributes: [], // Don't need user attributes in response
      },
    ],
    raw: true, // Faster - no Sequelize model overhead
  });

  // Cache for 2 minutes (120 seconds)
  cache.set(cacheKey, results, 120);
  return results;
};

export const addEmployee = async (payload: CreateEmployeeInput): Promise<any> => {
  // Prepare payload data and add properties

  const employeeDefaultPayload = {
    dateOfBirth: payload.dateOfBirth ?? new Date(),
    employmentStartDate: payload.employmentStartDate ?? new Date(),
    employmentEndDate: payload.employmentEndDate ?? new Date(),
    status: payload.status ?? 'active',
    employeeUniqueId: `EMP-${uuid()}`,
  };
  const employee = await Employee.create({ ...payload, ...employeeDefaultPayload });

  // Invalidate cache when employee is added
  cache.delete('select:employees');
  cache.delete('select:managers');

  return employee.get({ plain: true });
};

export const editEmployee = async (params: any): Promise<Employee | { errorCode: string; message: string }> => {
  // Initialize filters and include relationships
  let where: any = {};
  const include: any[] = [
    {
      model: User,
      as: 'user',
    },
    {
      model: Department,
      as: 'department',
    },
    {
      model: Designation,
      as: 'designation',
    },
    {
      model: Employee,
      as: 'reportingManager',
    },
  ];

  const employee = await Employee.findOne({
    attributes: [
      // userId, firstName, lastName, dateOfBirth, gender, phoneNumber, address, personalEmail, employmentStartDate, employmentEndDate, departmentId, designationId, reportingManagerId, status
      [Sequelize.col('Employee.user_id'), 'userId'],
      [Sequelize.col('Employee.first_name'), 'firstName'],
      [Sequelize.col('Employee.last_name'), 'lastName'],
      [Sequelize.col('Employee.date_of_birth'), 'dateOfBirth'],
      [Sequelize.col('Employee.gender'), 'gender'],
      [Sequelize.col('Employee.phone_number'), 'phoneNumber'],
      [Sequelize.col('Employee.address'), 'address'],
      [Sequelize.col('Employee.personal_email'), 'personalEmail'],
      [Sequelize.col('Employee.employment_start_date'), 'employmentStartDate'],
      [Sequelize.col('Employee.employment_end_date'), 'employmentEndDate'],
      [Sequelize.col('Employee.department_id'), 'departmentId'],
      [Sequelize.col('Employee.designation_id'), 'designationId'],
      [Sequelize.col('Employee.reporting_manager_id'), 'reportingManagerId'],
      [Sequelize.col('Employee.status'), 'status'],
      [Sequelize.col('user.email'), 'email'],
      [Sequelize.col('user.username'), 'username'],
      [Sequelize.col('department.department_name'), 'departmentName'],
      [Sequelize.col('designation.designation_name'), 'designationName'],
      [Sequelize.col('reportingManager.first_name'), 'reportingManagerFirstName'],
      [Sequelize.col('reportingManager.last_name'), 'reportingManagerLastName'],
    ],
    where: {
      employeeId: params.employeeId,
      ...where,
    },
    include: [...include],
  });

  if (!employee) {
    return { errorCode: 'INVALID_EMPLOYEE_ID', message: 'Invalid employee ID' };
  }

  return employee.get({ plain: true }) as Employee;
};

export const updateEmployee = async (params: any, payload: UpdateEmployeeInput): Promise<any> => {
  let where: any = {};

  const employee = await Employee.findOne({
    where: {
      employeeId: params.employeeId,
      ...where,
    },
  });

  if (!employee) {
    return { errorCode: 'INVALID_EMPLOYEE_ID', message: 'Invalid employee ID' };
  }

  await employee.update(payload);

  // Invalidate cache when employee is updated
  cache.delete('select:employees');
  cache.delete('select:managers');

  return {
    message: 'Employee updated successfully',
    data: employee.get({ plain: true }),
  };
};

export const getEmployee = async (params: any): Promise<any> => {
  let where: any = {};
  const include: any[] = [
    {
      model: User,
      as: 'user',
    },
    {
      model: Department,
      as: 'department',
    },
    {
      model: Designation,
      as: 'designation',
    },
    {
      model: Employee,
      as: 'reportingManager',
    },
  ];

  const employee = await Employee.findOne({
    attributes: [
      // employeeId, userId, employeeUniqueId, firstName, lastName, dateOfBirth, gender, phoneNumber, address, personalEmail, employmentStartDate, employmentEndDate, departmentId, designationId, reportingManagerId, status, createdAt, updatedAt
      [Sequelize.col('Employee.employee_id'), 'employeeId'],
      [Sequelize.col('Employee.user_id'), 'userId'],
      [Sequelize.col('Employee.employee_unique_id'), 'employeeUniqueId'],
      [Sequelize.col('Employee.first_name'), 'firstName'],
      [Sequelize.col('Employee.last_name'), 'lastName'],
      [Sequelize.col('Employee.date_of_birth'), 'dateOfBirth'],
      [Sequelize.col('Employee.gender'), 'gender'],
      [Sequelize.col('Employee.phone_number'), 'phoneNumber'],
      [Sequelize.col('Employee.address'), 'address'],
      [Sequelize.col('Employee.personal_email'), 'personalEmail'],
      [Sequelize.col('Employee.employment_start_date'), 'employmentStartDate'],
      [Sequelize.col('Employee.employment_end_date'), 'employmentEndDate'],
      [Sequelize.col('Employee.department_id'), 'departmentId'],
      [Sequelize.col('Employee.designation_id'), 'designationId'],
      [Sequelize.col('Employee.reporting_manager_id'), 'reportingManagerId'],
      [Sequelize.col('Employee.status'), 'status'],
      [Sequelize.col('Employee.created_at'), 'createdAt'],
      [Sequelize.col('Employee.updated_at'), 'updatedAt'],
      [Sequelize.col('user.email'), 'email'],
      [Sequelize.col('user.username'), 'username'],
      [Sequelize.col('department.department_name'), 'departmentName'],
      [Sequelize.col('designation.designation_name'), 'designationName'],
      [Sequelize.col('reportingManager.first_name'), 'reportingManagerFirstName'],
      [Sequelize.col('reportingManager.last_name'), 'reportingManagerLastName'],
    ],
    where: {
      employeeId: params.employeeId,
      ...where,
    },
    include: [...include],
  });

  if (!employee) {
    return { errorCode: 'INVALID_EMPLOYEE_ID', message: 'Invalid employee ID' };
  }

  return {
    data: employee.get({ plain: true }),
  };
};

export const deleteEmployee = async (params: any): Promise<any> => {
  let where: any = {};

  const employee = await Employee.findOne({
    where: {
      employeeId: params.employeeId,
      ...where,
    },
  });

  if (!employee) {
    return { errorCode: 'INVALID_EMPLOYEE_ID', message: 'Invalid employee ID' };
  }

  await employee.destroy();

  // Invalidate cache when employee is deleted
  cache.delete('select:employees');
  cache.delete('select:managers');

  return { messageCode: 'EMPLOYEE_DELETED_SUCCESSFULLY', message: 'employee Deleted Successfully' };
};
