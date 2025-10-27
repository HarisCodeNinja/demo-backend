import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { AuditLog } from './model';
import { User } from '../user/model';


import { CreateAuditLogInput, UpdateAuditLogInput, QueryAuditLogInput } from './types';

export const fetchAuditLogList = async (params: QueryAuditLogInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const { count, rows } = await AuditLog.findAndCountAll({
		attributes: [
// auditLogId, userId, action, tableName, recordId, oldValue, newValue, ipAddress, timestamp, createdAt, updatedAt
			[Sequelize.col('AuditLog.audit_log_id'), 'auditLogId'],
			[Sequelize.col('AuditLog.user_id'), 'userId'],
			[Sequelize.col('AuditLog.action'), 'action'],
			[Sequelize.col('AuditLog.table_name'), 'tableName'],
			[Sequelize.col('AuditLog.record_id'), 'recordId'],
			[Sequelize.col('AuditLog.old_value'), 'oldValue'],
			[Sequelize.col('AuditLog.new_value'), 'newValue'],
			[Sequelize.col('AuditLog.ip_address'), 'ipAddress'],
			[Sequelize.col('AuditLog.timestamp'), 'timestamp'],
			[Sequelize.col('AuditLog.created_at'), 'createdAt'],
			[Sequelize.col('AuditLog.updated_at'), 'updatedAt'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addAuditLog = async (payload: CreateAuditLogInput): Promise<any> => {
	// Prepare payload data and add properties

	const auditLogDefaultPayload = {
			oldValue: payload.oldValue ?? {},
			newValue: payload.newValue ?? {}
	};
	const auditLog = await AuditLog.create({...payload, ...auditLogDefaultPayload});

	return auditLog.get({ plain: true });
};

export const editAuditLog = async (params: any): Promise<AuditLog | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [];

	const auditLog = await AuditLog.findOne({
		attributes: [
// userId, action, tableName, recordId, oldValue, newValue
			[Sequelize.col('AuditLog.user_id'), 'userId'],
			[Sequelize.col('AuditLog.action'), 'action'],
			[Sequelize.col('AuditLog.table_name'), 'tableName'],
			[Sequelize.col('AuditLog.record_id'), 'recordId'],
			[Sequelize.col('AuditLog.old_value'), 'oldValue'],
			[Sequelize.col('AuditLog.new_value'), 'newValue'],
		],
		where: {
			auditLogId: params.auditLogId,
			...where,
		},
	});

	if (!auditLog) {
		return { errorCode: 'INVALID_AUDIT_LOG_ID', message: 'Invalid auditLog ID' };
	}

	return auditLog.get({ plain: true }) as AuditLog;
};

export const updateAuditLog = async (params: any, payload: UpdateAuditLogInput): Promise<any> => {
	let where: any = {};

	const auditLog = await AuditLog.findOne({
		where: {
			auditLogId: params.auditLogId,
			...where,
		},
	});

	if (!auditLog) {
		return { errorCode: 'INVALID_AUDIT_LOG_ID', message: 'Invalid auditLog ID' };
	}

	await auditLog.update(payload);

	return {
		message: 'AuditLog updated successfully',
		data: auditLog.get({ plain: true }),
	};
};

export const getAuditLog = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [];

	const auditLog = await AuditLog.findOne({
		attributes: [
// auditLogId, userId, action, tableName, recordId, oldValue, newValue, ipAddress, timestamp, createdAt, updatedAt
			[Sequelize.col('AuditLog.audit_log_id'), 'auditLogId'],
			[Sequelize.col('AuditLog.user_id'), 'userId'],
			[Sequelize.col('AuditLog.action'), 'action'],
			[Sequelize.col('AuditLog.table_name'), 'tableName'],
			[Sequelize.col('AuditLog.record_id'), 'recordId'],
			[Sequelize.col('AuditLog.old_value'), 'oldValue'],
			[Sequelize.col('AuditLog.new_value'), 'newValue'],
			[Sequelize.col('AuditLog.ip_address'), 'ipAddress'],
			[Sequelize.col('AuditLog.timestamp'), 'timestamp'],
			[Sequelize.col('AuditLog.created_at'), 'createdAt'],
			[Sequelize.col('AuditLog.updated_at'), 'updatedAt'],
		],
		where: {
			auditLogId: params.auditLogId,
			...where,
		},
		include: [...include],
	});

	if (!auditLog) {
		return { errorCode: 'INVALID_AUDIT_LOG_ID', message: 'Invalid auditLog ID' };
	}

	return {
		data: auditLog.get({ plain: true }),
	};
};

export const deleteAuditLog = async (params: any): Promise<any> => {
	let where: any = {};

	const auditLog = await AuditLog.findOne({
		where: {
			auditLogId: params.auditLogId,
			...where,
		},
	});

	if (!auditLog) {
		return { errorCode: 'INVALID_AUDIT_LOG_ID', message: 'Invalid auditLog ID' };
	}

	await auditLog.destroy();

	return { messageCode: 'AUDIT_LOG_DELETED_SUCCESSFULLY',  message: 'auditLog Deleted Successfully' };
};

