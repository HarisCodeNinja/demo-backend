import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { EmployeeCompetency } from './model';
import { Employee } from '../employee/model';
import { Competency } from '../competency/model';


import { CreateEmployeeCompetencyInput, UpdateEmployeeCompetencyInput, QueryEmployeeCompetencyInput } from './types';

export const fetchEmployeeCompetencyList = async (params: QueryEmployeeCompetencyInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include = [
		{
			model: Employee,
			as: 'employee',
		},
		{
			model: Competency,
			as: 'competency',
		},
	];

	const { count, rows } = await EmployeeCompetency.findAndCountAll({
		attributes: [
// employeeCompetencyId, employeeId, competencyId, currentProficiency, lastEvaluated, createdAt, updatedAt
			[Sequelize.col('EmployeeCompetency.employee_competency_id'), 'employeeCompetencyId'],
			[Sequelize.col('EmployeeCompetency.employee_id'), 'employeeId'],
			[Sequelize.col('EmployeeCompetency.competency_id'), 'competencyId'],
			[Sequelize.col('EmployeeCompetency.current_proficiency'), 'currentProficiency'],
			[Sequelize.col('EmployeeCompetency.last_evaluated'), 'lastEvaluated'],
			[Sequelize.col('EmployeeCompetency.created_at'), 'createdAt'],
			[Sequelize.col('EmployeeCompetency.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'employeeFirstName'],
			[Sequelize.col('employee.last_name'), 'employeeLastName'],
			[Sequelize.col('competency.competency_name'), 'competencyName'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
		include: [...include],
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addEmployeeCompetency = async (payload: CreateEmployeeCompetencyInput): Promise<any> => {
	// Prepare payload data and add properties

	const employeeCompetencyDefaultPayload = {
			lastEvaluated: payload.lastEvaluated ?? new Date()
	};
	const employeeCompetency = await EmployeeCompetency.create({...payload, ...employeeCompetencyDefaultPayload});

	return employeeCompetency.get({ plain: true });
};

export const editEmployeeCompetency = async (params: any): Promise<EmployeeCompetency | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [
		{
			model: Employee,
			as: 'employee',
		},
		{
			model: Competency,
			as: 'competency',
		},
	];

	const employeeCompetency = await EmployeeCompetency.findOne({
		attributes: [
// employeeId, competencyId, currentProficiency, lastEvaluated
			[Sequelize.col('EmployeeCompetency.employee_id'), 'employeeId'],
			[Sequelize.col('EmployeeCompetency.competency_id'), 'competencyId'],
			[Sequelize.col('EmployeeCompetency.current_proficiency'), 'currentProficiency'],
			[Sequelize.col('EmployeeCompetency.last_evaluated'), 'lastEvaluated'],
			[Sequelize.col('employee.first_name'), 'employeeFirstName'],
			[Sequelize.col('employee.last_name'), 'employeeLastName'],
			[Sequelize.col('competency.competency_name'), 'competencyName'],
		],
		where: {
			employeeCompetencyId: params.employeeCompetencyId,
			...where,
		},
		include: [...include],
	});

	if (!employeeCompetency) {
		return { errorCode: 'INVALID_EMPLOYEE_COMPETENCY_ID', message: 'Invalid employeeCompetency ID' };
	}

	return employeeCompetency.get({ plain: true }) as EmployeeCompetency;
};

export const updateEmployeeCompetency = async (params: any, payload: UpdateEmployeeCompetencyInput): Promise<any> => {
	let where: any = {};

	const employeeCompetency = await EmployeeCompetency.findOne({
		where: {
			employeeCompetencyId: params.employeeCompetencyId,
			...where,
		},
	});

	if (!employeeCompetency) {
		return { errorCode: 'INVALID_EMPLOYEE_COMPETENCY_ID', message: 'Invalid employeeCompetency ID' };
	}

	await employeeCompetency.update(payload);

	return {
		message: 'EmployeeCompetency updated successfully',
		data: employeeCompetency.get({ plain: true }),
	};
};

export const getEmployeeCompetency = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [
		{
			model: Employee,
			as: 'employee',
		},
		{
			model: Competency,
			as: 'competency',
		},
	];

	const employeeCompetency = await EmployeeCompetency.findOne({
		attributes: [
// employeeCompetencyId, employeeId, competencyId, currentProficiency, lastEvaluated, createdAt, updatedAt
			[Sequelize.col('EmployeeCompetency.employee_competency_id'), 'employeeCompetencyId'],
			[Sequelize.col('EmployeeCompetency.employee_id'), 'employeeId'],
			[Sequelize.col('EmployeeCompetency.competency_id'), 'competencyId'],
			[Sequelize.col('EmployeeCompetency.current_proficiency'), 'currentProficiency'],
			[Sequelize.col('EmployeeCompetency.last_evaluated'), 'lastEvaluated'],
			[Sequelize.col('EmployeeCompetency.created_at'), 'createdAt'],
			[Sequelize.col('EmployeeCompetency.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'employeeFirstName'],
			[Sequelize.col('employee.last_name'), 'employeeLastName'],
			[Sequelize.col('competency.competency_name'), 'competencyName'],
		],
		where: {
			employeeCompetencyId: params.employeeCompetencyId,
			...where,
		},
		include: [...include],
	});

	if (!employeeCompetency) {
		return { errorCode: 'INVALID_EMPLOYEE_COMPETENCY_ID', message: 'Invalid employeeCompetency ID' };
	}

	return {
		data: employeeCompetency.get({ plain: true }),
	};
};

export const deleteEmployeeCompetency = async (params: any): Promise<any> => {
	let where: any = {};

	const employeeCompetency = await EmployeeCompetency.findOne({
		where: {
			employeeCompetencyId: params.employeeCompetencyId,
			...where,
		},
	});

	if (!employeeCompetency) {
		return { errorCode: 'INVALID_EMPLOYEE_COMPETENCY_ID', message: 'Invalid employeeCompetency ID' };
	}

	await employeeCompetency.destroy();

	return { messageCode: 'EMPLOYEE_COMPETENCY_DELETED_SUCCESSFULLY',  message: 'employeeCompetency Deleted Successfully' };
};

