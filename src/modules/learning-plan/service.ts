import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { LearningPlan } from './model';
import { Employee } from '../employee/model';


import { CreateLearningPlanInput, UpdateLearningPlanInput, QueryLearningPlanInput } from './types';

export const fetchLearningPlanList = async (params: QueryLearningPlanInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const { count, rows } = await LearningPlan.findAndCountAll({
		attributes: [
// learningPlanId, employeeId, title, description, startDate, endDate, status, assignedById, createdAt, updatedAt
			[Sequelize.col('LearningPlan.learning_plan_id'), 'learningPlanId'],
			[Sequelize.col('LearningPlan.employee_id'), 'employeeId'],
			[Sequelize.col('LearningPlan.title'), 'title'],
			[Sequelize.col('LearningPlan.description'), 'description'],
			[Sequelize.col('LearningPlan.start_date'), 'startDate'],
			[Sequelize.col('LearningPlan.end_date'), 'endDate'],
			[Sequelize.col('LearningPlan.status'), 'status'],
			[Sequelize.col('LearningPlan.assigned_by'), 'assignedBy'],
			[Sequelize.col('LearningPlan.created_at'), 'createdAt'],
			[Sequelize.col('LearningPlan.updated_at'), 'updatedAt'],
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

export const addLearningPlan = async (payload: CreateLearningPlanInput): Promise<any> => {
	// Prepare payload data and add properties

	const learningPlanDefaultPayload = {
			startDate: payload.startDate ?? new Date(),
			endDate: payload.endDate ?? new Date(),
			status: payload.status ?? "Pending"
	};
	const learningPlan = await LearningPlan.create({...payload, ...learningPlanDefaultPayload});

	return learningPlan.get({ plain: true });
};

export const editLearningPlan = async (params: any): Promise<LearningPlan | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const learningPlan = await LearningPlan.findOne({
		attributes: [
// employeeId, title, description, startDate, endDate, status
			[Sequelize.col('LearningPlan.employee_id'), 'employeeId'],
			[Sequelize.col('LearningPlan.title'), 'title'],
			[Sequelize.col('LearningPlan.description'), 'description'],
			[Sequelize.col('LearningPlan.start_date'), 'startDate'],
			[Sequelize.col('LearningPlan.end_date'), 'endDate'],
			[Sequelize.col('LearningPlan.status'), 'status'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			learningPlanId: params.learningPlanId,
			...where,
		},
		include: [...include],
	});

	if (!learningPlan) {
		return { errorCode: 'INVALID_LEARNING_PLAN_ID', message: 'Invalid learningPlan ID' };
	}

	return learningPlan.get({ plain: true }) as LearningPlan;
};

export const updateLearningPlan = async (params: any, payload: UpdateLearningPlanInput): Promise<any> => {
	let where: any = {};

	const learningPlan = await LearningPlan.findOne({
		where: {
			learningPlanId: params.learningPlanId,
			...where,
		},
	});

	if (!learningPlan) {
		return { errorCode: 'INVALID_LEARNING_PLAN_ID', message: 'Invalid learningPlan ID' };
	}

	await learningPlan.update(payload);

	return {
		message: 'LearningPlan updated successfully',
		data: learningPlan.get({ plain: true }),
	};
};

export const getLearningPlan = async (params: any): Promise<any> => {
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const learningPlan = await LearningPlan.findOne({
		attributes: [
// learningPlanId, employeeId, title, description, startDate, endDate, status, assignedById, createdAt, updatedAt
			[Sequelize.col('LearningPlan.learning_plan_id'), 'learningPlanId'],
			[Sequelize.col('LearningPlan.employee_id'), 'employeeId'],
			[Sequelize.col('LearningPlan.title'), 'title'],
			[Sequelize.col('LearningPlan.description'), 'description'],
			[Sequelize.col('LearningPlan.start_date'), 'startDate'],
			[Sequelize.col('LearningPlan.end_date'), 'endDate'],
			[Sequelize.col('LearningPlan.status'), 'status'],
			[Sequelize.col('LearningPlan.assigned_by'), 'assignedBy'],
			[Sequelize.col('LearningPlan.created_at'), 'createdAt'],
			[Sequelize.col('LearningPlan.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			learningPlanId: params.learningPlanId,
			...where,
		},
		include: [...include],
	});

	if (!learningPlan) {
		return { errorCode: 'INVALID_LEARNING_PLAN_ID', message: 'Invalid learningPlan ID' };
	}

	return {
		data: learningPlan.get({ plain: true }),
	};
};

export const deleteLearningPlan = async (params: any): Promise<any> => {
	let where: any = {};

	const learningPlan = await LearningPlan.findOne({
		where: {
			learningPlanId: params.learningPlanId,
			...where,
		},
	});

	if (!learningPlan) {
		return { errorCode: 'INVALID_LEARNING_PLAN_ID', message: 'Invalid learningPlan ID' };
	}

	await learningPlan.destroy();

	return { messageCode: 'LEARNING_PLAN_DELETED_SUCCESSFULLY',  message: 'learningPlan Deleted Successfully' };
};

