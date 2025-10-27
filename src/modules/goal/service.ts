import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Goal } from './model';
import { Employee } from '../employee/model';


import { CreateGoalInput, UpdateGoalInput, QueryGoalInput } from './types';

export const fetchGoalList = async (params: QueryGoalInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const { count, rows } = await Goal.findAndCountAll({
		attributes: [
// goalId, employeeId, title, description, kpis, period, startDate, endDate, status, assignedById, createdAt, updatedAt
			[Sequelize.col('Goal.goal_id'), 'goalId'],
			[Sequelize.col('Goal.employee_id'), 'employeeId'],
			[Sequelize.col('Goal.title'), 'title'],
			[Sequelize.col('Goal.description'), 'description'],
			[Sequelize.col('Goal.kpi'), 'kpi'],
			[Sequelize.col('Goal.period'), 'period'],
			[Sequelize.col('Goal.start_date'), 'startDate'],
			[Sequelize.col('Goal.end_date'), 'endDate'],
			[Sequelize.col('Goal.status'), 'status'],
			[Sequelize.col('Goal.assigned_by'), 'assignedBy'],
			[Sequelize.col('Goal.created_at'), 'createdAt'],
			[Sequelize.col('Goal.updated_at'), 'updatedAt'],
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

export const addGoal = async (payload: CreateGoalInput): Promise<any> => {
	// Prepare payload data and add properties

	const goalDefaultPayload = {
			kpi: payload.kpi ?? {},
			startDate: payload.startDate ?? new Date(),
			endDate: payload.endDate ?? new Date(),
			status: payload.status ?? "Draft"
	};
	const goal = await Goal.create({...payload, ...goalDefaultPayload});

	return goal.get({ plain: true });
};

export const editGoal = async (params: any): Promise<Goal | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const goal = await Goal.findOne({
		attributes: [
// employeeId, title, description, kpis, period, startDate, endDate, status
			[Sequelize.col('Goal.employee_id'), 'employeeId'],
			[Sequelize.col('Goal.title'), 'title'],
			[Sequelize.col('Goal.description'), 'description'],
			[Sequelize.col('Goal.kpi'), 'kpi'],
			[Sequelize.col('Goal.period'), 'period'],
			[Sequelize.col('Goal.start_date'), 'startDate'],
			[Sequelize.col('Goal.end_date'), 'endDate'],
			[Sequelize.col('Goal.status'), 'status'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			goalId: params.goalId,
			...where,
		},
		include: [...include],
	});

	if (!goal) {
		return { errorCode: 'INVALID_GOAL_ID', message: 'Invalid goal ID' };
	}

	return goal.get({ plain: true }) as Goal;
};

export const updateGoal = async (params: any, payload: UpdateGoalInput): Promise<any> => {
	let where: any = {};

	const goal = await Goal.findOne({
		where: {
			goalId: params.goalId,
			...where,
		},
	});

	if (!goal) {
		return { errorCode: 'INVALID_GOAL_ID', message: 'Invalid goal ID' };
	}

	await goal.update(payload);

	return {
		message: 'Goal updated successfully',
		data: goal.get({ plain: true }),
	};
};

export const getGoal = async (params: any): Promise<any> => {
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const goal = await Goal.findOne({
		attributes: [
// goalId, employeeId, title, description, kpis, period, startDate, endDate, status, assignedById, createdAt, updatedAt
			[Sequelize.col('Goal.goal_id'), 'goalId'],
			[Sequelize.col('Goal.employee_id'), 'employeeId'],
			[Sequelize.col('Goal.title'), 'title'],
			[Sequelize.col('Goal.description'), 'description'],
			[Sequelize.col('Goal.kpi'), 'kpi'],
			[Sequelize.col('Goal.period'), 'period'],
			[Sequelize.col('Goal.start_date'), 'startDate'],
			[Sequelize.col('Goal.end_date'), 'endDate'],
			[Sequelize.col('Goal.status'), 'status'],
			[Sequelize.col('Goal.assigned_by'), 'assignedBy'],
			[Sequelize.col('Goal.created_at'), 'createdAt'],
			[Sequelize.col('Goal.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			goalId: params.goalId,
			...where,
		},
		include: [...include],
	});

	if (!goal) {
		return { errorCode: 'INVALID_GOAL_ID', message: 'Invalid goal ID' };
	}

	return {
		data: goal.get({ plain: true }),
	};
};

export const deleteGoal = async (params: any): Promise<any> => {
	let where: any = {};

	const goal = await Goal.findOne({
		where: {
			goalId: params.goalId,
			...where,
		},
	});

	if (!goal) {
		return { errorCode: 'INVALID_GOAL_ID', message: 'Invalid goal ID' };
	}

	await goal.destroy();

	return { messageCode: 'GOAL_DELETED_SUCCESSFULLY',  message: 'goal Deleted Successfully' };
};

