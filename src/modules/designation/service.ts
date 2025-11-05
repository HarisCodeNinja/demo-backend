import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Designation } from './model';
import { cache } from '../../util/cache';

import { CreateDesignationInput, UpdateDesignationInput, QueryDesignationInput } from './types';

export const fetchDesignationList = async (params: QueryDesignationInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const { count, rows } = await Designation.findAndCountAll({
		attributes: [
// designationId, designationName, createdAt, updatedAt
			[Sequelize.col('Designation.designation_id'), 'designationId'],
			[Sequelize.col('Designation.designation_name'), 'designationName'],
			[Sequelize.col('Designation.created_at'), 'createdAt'],
			[Sequelize.col('Designation.updated_at'), 'updatedAt'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectDesignation = async () => {
	const cacheKey = 'select:designations';
	const cached = cache.get(cacheKey);
	if (cached) return cached;

	const results = await Designation.findAll({
		attributes: [
			[Sequelize.col('Designation.designation_id'), 'value'],
			[Sequelize.col('Designation.designation_name'), 'label'],
		],
		raw: true,
	});

	cache.set(cacheKey, results, 300);
	return results;
};

export const addDesignation = async (payload: CreateDesignationInput): Promise<any> => {
	const designation = await Designation.create(payload);
	cache.delete('select:designations');
	return designation.get({ plain: true });
};

export const editDesignation = async (params: any): Promise<Designation | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [];

	const designation = await Designation.findOne({
		attributes: [
// designationName
			[Sequelize.col('Designation.designation_name'), 'designationName'],
		],
		where: {
			designationId: params.designationId,
			...where,
		},
	});

	if (!designation) {
		return { errorCode: 'INVALID_DESIGNATION_ID', message: 'Invalid designation ID' };
	}

	return designation.get({ plain: true }) as Designation;
};

export const updateDesignation = async (params: any, payload: UpdateDesignationInput): Promise<any> => {
	let where: any = {};

	const designation = await Designation.findOne({
		where: {
			designationId: params.designationId,
			...where,
		},
	});

	if (!designation) {
		return { errorCode: 'INVALID_DESIGNATION_ID', message: 'Invalid designation ID' };
	}

	await designation.update(payload);
	cache.delete('select:designations');

	return {
		message: 'Designation updated successfully',
		data: designation.get({ plain: true }),
	};
};

export const getDesignation = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [];

	const designation = await Designation.findOne({
		attributes: [
// designationId, designationName, createdAt, updatedAt
			[Sequelize.col('Designation.designation_id'), 'designationId'],
			[Sequelize.col('Designation.designation_name'), 'designationName'],
			[Sequelize.col('Designation.created_at'), 'createdAt'],
			[Sequelize.col('Designation.updated_at'), 'updatedAt'],
		],
		where: {
			designationId: params.designationId,
			...where,
		},
		include: [...include],
	});

	if (!designation) {
		return { errorCode: 'INVALID_DESIGNATION_ID', message: 'Invalid designation ID' };
	}

	return {
		data: designation.get({ plain: true }),
	};
};

export const deleteDesignation = async (params: any): Promise<any> => {
	let where: any = {};

	const designation = await Designation.findOne({
		where: {
			designationId: params.designationId,
			...where,
		},
	});

	if (!designation) {
		return { errorCode: 'INVALID_DESIGNATION_ID', message: 'Invalid designation ID' };
	}

	await designation.destroy();
	cache.delete('select:designations');

	return { messageCode: 'DESIGNATION_DELETED_SUCCESSFULLY',  message: 'designation Deleted Successfully' };
};

