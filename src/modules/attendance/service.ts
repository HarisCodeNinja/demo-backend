import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Attendance } from './model';
import { Employee } from '../employee/model';
import { checkAccess, applyRoleFilter } from '../../util/roleFilterHelpers';

import { CreateAttendanceInput, UpdateAttendanceInput, QueryAttendanceInput } from './types';

export const fetchAttendanceList = async (params: QueryAttendanceInput, req: any) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	// Early return if user has no access
	if (!checkAccess(req)) {
		return { data: [], meta: { total: 0, page: curPage, pageSize } };
	}

	// Build where clause with role-based filtering
	const whereClause = applyRoleFilter(req);

	const { count, rows } = await Attendance.findAndCountAll({
		attributes: [
// attendanceId, employeeId, attendanceDate, checkInTime, checkOutTime, status, totalHours, createdAt, updatedAt
			[Sequelize.col('Attendance.attendance_id'), 'attendanceId'],
			[Sequelize.col('Attendance.employee_id'), 'employeeId'],
			[Sequelize.col('Attendance.attendance_date'), 'attendanceDate'],
			[Sequelize.col('Attendance.check_in_time'), 'checkInTime'],
			[Sequelize.col('Attendance.check_out_time'), 'checkOutTime'],
			[Sequelize.col('Attendance.status'), 'status'],
			[Sequelize.col('Attendance.total_hour'), 'totalHour'],
			[Sequelize.col('Attendance.created_at'), 'createdAt'],
			[Sequelize.col('Attendance.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: whereClause, // Role-based filtering applied automatically
		include: [
			{
				model: Employee,
				as: 'employee',
			},
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addAttendance = async (payload: CreateAttendanceInput): Promise<any> => {
	// Prepare payload data and add properties

	const attendanceDefaultPayload = {
			attendanceDate: payload.attendanceDate ?? new Date(),
			checkInTime: payload.checkInTime ?? new Date(),
			checkOutTime: payload.checkOutTime ?? new Date(),
			status: payload.status ?? "Present"
	};
	const attendance = await Attendance.create({...payload, ...attendanceDefaultPayload});

	return attendance.get({ plain: true });
};

export const editAttendance = async (params: any): Promise<Attendance | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const attendance = await Attendance.findOne({
		attributes: [
// employeeId, attendanceDate, checkInTime, checkOutTime, status
			[Sequelize.col('Attendance.employee_id'), 'employeeId'],
			[Sequelize.col('Attendance.attendance_date'), 'attendanceDate'],
			[Sequelize.col('Attendance.check_in_time'), 'checkInTime'],
			[Sequelize.col('Attendance.check_out_time'), 'checkOutTime'],
			[Sequelize.col('Attendance.status'), 'status'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			attendanceId: params.attendanceId,
			...where,
		},
		include: [...include],
	});

	if (!attendance) {
		return { errorCode: 'INVALID_ATTENDANCE_ID', message: 'Invalid attendance ID' };
	}

	return attendance.get({ plain: true }) as Attendance;
};

export const updateAttendance = async (params: any, payload: UpdateAttendanceInput): Promise<any> => {
	let where: any = {};

	const attendance = await Attendance.findOne({
		where: {
			attendanceId: params.attendanceId,
			...where,
		},
	});

	if (!attendance) {
		return { errorCode: 'INVALID_ATTENDANCE_ID', message: 'Invalid attendance ID' };
	}

	await attendance.update(payload);

	return {
		message: 'Attendance updated successfully',
		data: attendance.get({ plain: true }),
	};
};

export const getAttendance = async (params: any, req: any): Promise<any> => {
	// Early return if user has no access
	if (!checkAccess(req)) {
		return { errorCode: 'FORBIDDEN', message: 'You do not have permission to view this attendance record' };
	}

	// Build where clause with role-based filtering
	const roleFilterWhere = applyRoleFilter(req);

	const include: any[] = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const attendance = await Attendance.findOne({
		attributes: [
// attendanceId, employeeId, attendanceDate, checkInTime, checkOutTime, status, totalHours, createdAt, updatedAt
			[Sequelize.col('Attendance.attendance_id'), 'attendanceId'],
			[Sequelize.col('Attendance.employee_id'), 'employeeId'],
			[Sequelize.col('Attendance.attendance_date'), 'attendanceDate'],
			[Sequelize.col('Attendance.check_in_time'), 'checkInTime'],
			[Sequelize.col('Attendance.check_out_time'), 'checkOutTime'],
			[Sequelize.col('Attendance.status'), 'status'],
			[Sequelize.col('Attendance.total_hour'), 'totalHour'],
			[Sequelize.col('Attendance.created_at'), 'createdAt'],
			[Sequelize.col('Attendance.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			attendanceId: params.attendanceId,
			...roleFilterWhere, // Role-based filtering applied
		},
		include: [...include],
	});

	if (!attendance) {
		return { errorCode: 'INVALID_ATTENDANCE_ID', message: 'Invalid attendance ID' };
	}

	return {
		data: attendance.get({ plain: true }),
	};
};

export const deleteAttendance = async (params: any): Promise<any> => {
	let where: any = {};

	const attendance = await Attendance.findOne({
		where: {
			attendanceId: params.attendanceId,
			...where,
		},
	});

	if (!attendance) {
		return { errorCode: 'INVALID_ATTENDANCE_ID', message: 'Invalid attendance ID' };
	}

	await attendance.destroy();

	return { messageCode: 'ATTENDANCE_DELETED_SUCCESSFULLY',  message: 'attendance Deleted Successfully' };
};

