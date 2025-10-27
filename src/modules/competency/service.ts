import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Competency } from './model';


import { CreateCompetencyInput, UpdateCompetencyInput, QueryCompetencyInput } from './types';

export const fetchCompetencyList = async (params: QueryCompetencyInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const { count, rows } = await Competency.findAndCountAll({
		attributes: [
// competencyId, competencyName, description, createdAt, updatedAt
			[Sequelize.col('Competency.competency_id'), 'competencyId'],
			[Sequelize.col('Competency.competency_name'), 'competencyName'],
			[Sequelize.col('Competency.description'), 'description'],
			[Sequelize.col('Competency.created_at'), 'createdAt'],
			[Sequelize.col('Competency.updated_at'), 'updatedAt'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectCompetency = async () => {

	const results = await Competency.findAll({
		attributes: [
			[Sequelize.col('Competency.competency_id'), 'value'],
			[Sequelize.col('Competency.competency_name'), 'label'],
		],
	});

	const plainRows = results.map((item) => item.get({ plain: true }));
	return plainRows;
};

export const addCompetency = async (payload: CreateCompetencyInput): Promise<any> => {
	// Prepare payload data and add properties

	const competency = await Competency.create(payload);

	return competency.get({ plain: true });
};

export const editCompetency = async (params: any): Promise<Competency | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [];

	const competency = await Competency.findOne({
		attributes: [
// competencyName, description
			[Sequelize.col('Competency.competency_name'), 'competencyName'],
			[Sequelize.col('Competency.description'), 'description'],
		],
		where: {
			competencyId: params.competencyId,
			...where,
		},
	});

	if (!competency) {
		return { errorCode: 'INVALID_COMPETENCY_ID', message: 'Invalid competency ID' };
	}

	return competency.get({ plain: true }) as Competency;
};

export const updateCompetency = async (params: any, payload: UpdateCompetencyInput): Promise<any> => {
	let where: any = {};

	const competency = await Competency.findOne({
		where: {
			competencyId: params.competencyId,
			...where,
		},
	});

	if (!competency) {
		return { errorCode: 'INVALID_COMPETENCY_ID', message: 'Invalid competency ID' };
	}

	await competency.update(payload);

	return {
		message: 'Competency updated successfully',
		data: competency.get({ plain: true }),
	};
};

export const getCompetency = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [];

	const competency = await Competency.findOne({
		attributes: [
// competencyId, competencyName, description, createdAt, updatedAt
			[Sequelize.col('Competency.competency_id'), 'competencyId'],
			[Sequelize.col('Competency.competency_name'), 'competencyName'],
			[Sequelize.col('Competency.description'), 'description'],
			[Sequelize.col('Competency.created_at'), 'createdAt'],
			[Sequelize.col('Competency.updated_at'), 'updatedAt'],
		],
		where: {
			competencyId: params.competencyId,
			...where,
		},
		include: [...include],
	});

	if (!competency) {
		return { errorCode: 'INVALID_COMPETENCY_ID', message: 'Invalid competency ID' };
	}

	return {
		data: competency.get({ plain: true }),
	};
};

export const deleteCompetency = async (params: any): Promise<any> => {
	let where: any = {};

	const competency = await Competency.findOne({
		where: {
			competencyId: params.competencyId,
			...where,
		},
	});

	if (!competency) {
		return { errorCode: 'INVALID_COMPETENCY_ID', message: 'Invalid competency ID' };
	}

	await competency.destroy();

	return { messageCode: 'COMPETENCY_DELETED_SUCCESSFULLY',  message: 'competency Deleted Successfully' };
};

