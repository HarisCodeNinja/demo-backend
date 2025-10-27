import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { LeaveType } from './model';


import { CreateLeaveTypeInput, UpdateLeaveTypeInput, QueryLeaveTypeInput } from './types';

export const fetchLeaveTypeList = async (params: QueryLeaveTypeInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const { count, rows } = await LeaveType.findAndCountAll({
		attributes: [
// leaveTypeId, typeName, maxDaysPerYear, isPaid, createdAt, updatedAt
			[Sequelize.col('LeaveType.leave_type_id'), 'leaveTypeId'],
			[Sequelize.col('LeaveType.type_name'), 'typeName'],
			[Sequelize.col('LeaveType.max_days_per_year'), 'maxDaysPerYear'],
			[Sequelize.col('LeaveType.is_paid'), 'isPaid'],
			[Sequelize.col('LeaveType.created_at'), 'createdAt'],
			[Sequelize.col('LeaveType.updated_at'), 'updatedAt'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectLeaveType = async () => {

	const results = await LeaveType.findAll({
		attributes: [
			[Sequelize.col('LeaveType.leave_type_id'), 'value'],
			[Sequelize.col('LeaveType.type_name'), 'label'],
		],
	});

	const plainRows = results.map((item) => item.get({ plain: true }));
	return plainRows;
};

export const addLeaveType = async (payload: CreateLeaveTypeInput): Promise<any> => {
	// Prepare payload data and add properties

	const leaveTypeDefaultPayload = {
			maxDaysPerYear: payload.maxDaysPerYear ?? 0,
			isPaid: payload.isPaid ?? true
	};
	const leaveType = await LeaveType.create({...payload, ...leaveTypeDefaultPayload});

	return leaveType.get({ plain: true });
};

export const editLeaveType = async (params: any): Promise<LeaveType | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [];

	const leaveType = await LeaveType.findOne({
		attributes: [
// typeName, maxDaysPerYear, isPaid
			[Sequelize.col('LeaveType.type_name'), 'typeName'],
			[Sequelize.col('LeaveType.max_days_per_year'), 'maxDaysPerYear'],
			[Sequelize.col('LeaveType.is_paid'), 'isPaid'],
		],
		where: {
			leaveTypeId: params.leaveTypeId,
			...where,
		},
	});

	if (!leaveType) {
		return { errorCode: 'INVALID_LEAVE_TYPE_ID', message: 'Invalid leaveType ID' };
	}

	return leaveType.get({ plain: true }) as LeaveType;
};

export const updateLeaveType = async (params: any, payload: UpdateLeaveTypeInput): Promise<any> => {
	let where: any = {};

	const leaveType = await LeaveType.findOne({
		where: {
			leaveTypeId: params.leaveTypeId,
			...where,
		},
	});

	if (!leaveType) {
		return { errorCode: 'INVALID_LEAVE_TYPE_ID', message: 'Invalid leaveType ID' };
	}

	await leaveType.update(payload);

	return {
		message: 'LeaveType updated successfully',
		data: leaveType.get({ plain: true }),
	};
};

export const getLeaveType = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [];

	const leaveType = await LeaveType.findOne({
		attributes: [
// leaveTypeId, typeName, maxDaysPerYear, isPaid, createdAt, updatedAt
			[Sequelize.col('LeaveType.leave_type_id'), 'leaveTypeId'],
			[Sequelize.col('LeaveType.type_name'), 'typeName'],
			[Sequelize.col('LeaveType.max_days_per_year'), 'maxDaysPerYear'],
			[Sequelize.col('LeaveType.is_paid'), 'isPaid'],
			[Sequelize.col('LeaveType.created_at'), 'createdAt'],
			[Sequelize.col('LeaveType.updated_at'), 'updatedAt'],
		],
		where: {
			leaveTypeId: params.leaveTypeId,
			...where,
		},
		include: [...include],
	});

	if (!leaveType) {
		return { errorCode: 'INVALID_LEAVE_TYPE_ID', message: 'Invalid leaveType ID' };
	}

	return {
		data: leaveType.get({ plain: true }),
	};
};

export const deleteLeaveType = async (params: any): Promise<any> => {
	let where: any = {};

	const leaveType = await LeaveType.findOne({
		where: {
			leaveTypeId: params.leaveTypeId,
			...where,
		},
	});

	if (!leaveType) {
		return { errorCode: 'INVALID_LEAVE_TYPE_ID', message: 'Invalid leaveType ID' };
	}

	await leaveType.destroy();

	return { messageCode: 'LEAVE_TYPE_DELETED_SUCCESSFULLY',  message: 'leaveType Deleted Successfully' };
};

