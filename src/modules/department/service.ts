import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Department } from './model';


import { CreateDepartmentInput, UpdateDepartmentInput, QueryDepartmentInput } from './types';

export const fetchDepartmentList = async (params: QueryDepartmentInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const { count, rows } = await Department.findAndCountAll({
		attributes: [
// departmentId, departmentName, createdAt, updatedAt
			[Sequelize.col('Department.department_id'), 'departmentId'],
			[Sequelize.col('Department.department_name'), 'departmentName'],
			[Sequelize.col('Department.created_at'), 'createdAt'],
			[Sequelize.col('Department.updated_at'), 'updatedAt'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectDepartment = async () => {

	const results = await Department.findAll({
		attributes: [
			[Sequelize.col('Department.department_id'), 'value'],
			[Sequelize.col('Department.department_name'), 'label'],
		],
	});

	const plainRows = results.map((item) => item.get({ plain: true }));
	return plainRows;
};

export const addDepartment = async (payload: CreateDepartmentInput): Promise<any> => {
	// Prepare payload data and add properties

	const department = await Department.create(payload);

	return department.get({ plain: true });
};

export const editDepartment = async (params: any): Promise<Department | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [];

	const department = await Department.findOne({
		attributes: [
// departmentName
			[Sequelize.col('Department.department_name'), 'departmentName'],
		],
		where: {
			departmentId: params.departmentId,
			...where,
		},
	});

	if (!department) {
		return { errorCode: 'INVALID_DEPARTMENT_ID', message: 'Invalid department ID' };
	}

	return department.get({ plain: true }) as Department;
};

export const updateDepartment = async (params: any, payload: UpdateDepartmentInput): Promise<any> => {
	let where: any = {};

	const department = await Department.findOne({
		where: {
			departmentId: params.departmentId,
			...where,
		},
	});

	if (!department) {
		return { errorCode: 'INVALID_DEPARTMENT_ID', message: 'Invalid department ID' };
	}

	await department.update(payload);

	return {
		message: 'Department updated successfully',
		data: department.get({ plain: true }),
	};
};

export const getDepartment = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [];

	const department = await Department.findOne({
		attributes: [
// departmentId, departmentName, createdAt, updatedAt
			[Sequelize.col('Department.department_id'), 'departmentId'],
			[Sequelize.col('Department.department_name'), 'departmentName'],
			[Sequelize.col('Department.created_at'), 'createdAt'],
			[Sequelize.col('Department.updated_at'), 'updatedAt'],
		],
		where: {
			departmentId: params.departmentId,
			...where,
		},
		include: [...include],
	});

	if (!department) {
		return { errorCode: 'INVALID_DEPARTMENT_ID', message: 'Invalid department ID' };
	}

	return {
		data: department.get({ plain: true }),
	};
};

export const deleteDepartment = async (params: any): Promise<any> => {
	let where: any = {};

	const department = await Department.findOne({
		where: {
			departmentId: params.departmentId,
			...where,
		},
	});

	if (!department) {
		return { errorCode: 'INVALID_DEPARTMENT_ID', message: 'Invalid department ID' };
	}

	await department.destroy();

	return { messageCode: 'DEPARTMENT_DELETED_SUCCESSFULLY',  message: 'department Deleted Successfully' };
};

