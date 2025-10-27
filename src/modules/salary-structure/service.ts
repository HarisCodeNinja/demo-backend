import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { SalaryStructure } from './model';
import { Employee } from '../employee/model';
import { convertStringFieldsToNumbers } from '../../util/dataTransform';


import { CreateSalaryStructureInput, UpdateSalaryStructureInput, QuerySalaryStructureInput } from './types';

export const fetchSalaryStructureList = async (params: QuerySalaryStructureInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const { count, rows } = await SalaryStructure.findAndCountAll({
		attributes: [
// salaryStructureId, employeeId, basicSalary, allowances, deductions, effectiveDate, status, createdAt, updatedAt
			[Sequelize.col('SalaryStructure.salary_structure_id'), 'salaryStructureId'],
			[Sequelize.col('SalaryStructure.employee_id'), 'employeeId'],
			[Sequelize.col('SalaryStructure.basic_salary'), 'basicSalary'],
			[Sequelize.col('SalaryStructure.allowance'), 'allowance'],
			[Sequelize.col('SalaryStructure.deduction'), 'deduction'],
			[Sequelize.col('SalaryStructure.effective_date'), 'effectiveDate'],
			[Sequelize.col('SalaryStructure.status'), 'status'],
			[Sequelize.col('SalaryStructure.created_at'), 'createdAt'],
			[Sequelize.col('SalaryStructure.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
		include: [...include],
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addSalaryStructure = async (payload: CreateSalaryStructureInput): Promise<any> => {
	// Prepare payload data and add properties

	const salaryStructureDefaultPayload = {
			allowance: payload.allowance ?? {},
			deduction: payload.deduction ?? {},
			effectiveDate: payload.effectiveDate ?? new Date(),
			status: payload.status ?? "active"
	};
	const salaryStructure = await SalaryStructure.create({...payload, ...salaryStructureDefaultPayload});

	return salaryStructure.get({ plain: true });
};

export const editSalaryStructure = async (params: any): Promise<SalaryStructure | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const salaryStructure = await SalaryStructure.findOne({
		attributes: [
// employeeId, basicSalary, allowances, deductions, effectiveDate, status
			[Sequelize.col('SalaryStructure.employee_id'), 'employeeId'],
			[Sequelize.col('SalaryStructure.basic_salary'), 'basicSalary'],
			[Sequelize.col('SalaryStructure.allowance'), 'allowance'],
			[Sequelize.col('SalaryStructure.deduction'), 'deduction'],
			[Sequelize.col('SalaryStructure.effective_date'), 'effectiveDate'],
			[Sequelize.col('SalaryStructure.status'), 'status'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			salaryStructureId: params.salaryStructureId,
			...where,
		},
		include: [...include],
	});

	if (!salaryStructure) {
		return { errorCode: 'INVALID_SALARY_STRUCTURE_ID', message: 'Invalid salaryStructure ID' };
	}

	const salaryStructureData = salaryStructure.get({ plain: true });
	return convertStringFieldsToNumbers(salaryStructureData, ['basicSalary']) as SalaryStructure;
};

export const updateSalaryStructure = async (params: any, payload: UpdateSalaryStructureInput): Promise<any> => {
	let where: any = {};

	const salaryStructure = await SalaryStructure.findOne({
		where: {
			salaryStructureId: params.salaryStructureId,
			...where,
		},
	});

	if (!salaryStructure) {
		return { errorCode: 'INVALID_SALARY_STRUCTURE_ID', message: 'Invalid salaryStructure ID' };
	}

	await salaryStructure.update(payload);

	return {
		message: 'SalaryStructure updated successfully',
		data: salaryStructure.get({ plain: true }),
	};
};

export const getSalaryStructure = async (params: any): Promise<any> => {
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const salaryStructure = await SalaryStructure.findOne({
		attributes: [
// salaryStructureId, employeeId, basicSalary, allowances, deductions, effectiveDate, status, createdAt, updatedAt
			[Sequelize.col('SalaryStructure.salary_structure_id'), 'salaryStructureId'],
			[Sequelize.col('SalaryStructure.employee_id'), 'employeeId'],
			[Sequelize.col('SalaryStructure.basic_salary'), 'basicSalary'],
			[Sequelize.col('SalaryStructure.allowance'), 'allowance'],
			[Sequelize.col('SalaryStructure.deduction'), 'deduction'],
			[Sequelize.col('SalaryStructure.effective_date'), 'effectiveDate'],
			[Sequelize.col('SalaryStructure.status'), 'status'],
			[Sequelize.col('SalaryStructure.created_at'), 'createdAt'],
			[Sequelize.col('SalaryStructure.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			salaryStructureId: params.salaryStructureId,
			...where,
		},
		include: [...include],
	});

	if (!salaryStructure) {
		return { errorCode: 'INVALID_SALARY_STRUCTURE_ID', message: 'Invalid salaryStructure ID' };
	}

	return {
		data: salaryStructure.get({ plain: true }),
	};
};

export const deleteSalaryStructure = async (params: any): Promise<any> => {
	let where: any = {};

	const salaryStructure = await SalaryStructure.findOne({
		where: {
			salaryStructureId: params.salaryStructureId,
			...where,
		},
	});

	if (!salaryStructure) {
		return { errorCode: 'INVALID_SALARY_STRUCTURE_ID', message: 'Invalid salaryStructure ID' };
	}

	await salaryStructure.destroy();

	return { messageCode: 'SALARY_STRUCTURE_DELETED_SUCCESSFULLY',  message: 'salaryStructure Deleted Successfully' };
};

