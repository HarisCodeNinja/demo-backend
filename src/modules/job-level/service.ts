import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { JobLevel } from './model';


import { CreateJobLevelInput, UpdateJobLevelInput, QueryJobLevelInput } from './types';

export const fetchJobLevelList = async (params: QueryJobLevelInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const { count, rows } = await JobLevel.findAndCountAll({
		attributes: [
// jobLevelId, levelName, description, createdAt, updatedAt
			[Sequelize.col('JobLevel.job_level_id'), 'jobLevelId'],
			[Sequelize.col('JobLevel.level_name'), 'levelName'],
			[Sequelize.col('JobLevel.description'), 'description'],
			[Sequelize.col('JobLevel.created_at'), 'createdAt'],
			[Sequelize.col('JobLevel.updated_at'), 'updatedAt'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addJobLevel = async (payload: CreateJobLevelInput): Promise<any> => {
	// Prepare payload data and add properties

	const jobLevel = await JobLevel.create(payload);

	return jobLevel.get({ plain: true });
};

export const editJobLevel = async (params: any): Promise<JobLevel | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [];

	const jobLevel = await JobLevel.findOne({
		attributes: [
// levelName, description
			[Sequelize.col('JobLevel.level_name'), 'levelName'],
			[Sequelize.col('JobLevel.description'), 'description'],
		],
		where: {
			jobLevelId: params.jobLevelId,
			...where,
		},
	});

	if (!jobLevel) {
		return { errorCode: 'INVALID_JOB_LEVEL_ID', message: 'Invalid jobLevel ID' };
	}

	return jobLevel.get({ plain: true }) as JobLevel;
};

export const updateJobLevel = async (params: any, payload: UpdateJobLevelInput): Promise<any> => {
	let where: any = {};

	const jobLevel = await JobLevel.findOne({
		where: {
			jobLevelId: params.jobLevelId,
			...where,
		},
	});

	if (!jobLevel) {
		return { errorCode: 'INVALID_JOB_LEVEL_ID', message: 'Invalid jobLevel ID' };
	}

	await jobLevel.update(payload);

	return {
		message: 'JobLevel updated successfully',
		data: jobLevel.get({ plain: true }),
	};
};

export const getJobLevel = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [];

	const jobLevel = await JobLevel.findOne({
		attributes: [
// jobLevelId, levelName, description, createdAt, updatedAt
			[Sequelize.col('JobLevel.job_level_id'), 'jobLevelId'],
			[Sequelize.col('JobLevel.level_name'), 'levelName'],
			[Sequelize.col('JobLevel.description'), 'description'],
			[Sequelize.col('JobLevel.created_at'), 'createdAt'],
			[Sequelize.col('JobLevel.updated_at'), 'updatedAt'],
		],
		where: {
			jobLevelId: params.jobLevelId,
			...where,
		},
		include: [...include],
	});

	if (!jobLevel) {
		return { errorCode: 'INVALID_JOB_LEVEL_ID', message: 'Invalid jobLevel ID' };
	}

	return {
		data: jobLevel.get({ plain: true }),
	};
};

export const deleteJobLevel = async (params: any): Promise<any> => {
	let where: any = {};

	const jobLevel = await JobLevel.findOne({
		where: {
			jobLevelId: params.jobLevelId,
			...where,
		},
	});

	if (!jobLevel) {
		return { errorCode: 'INVALID_JOB_LEVEL_ID', message: 'Invalid jobLevel ID' };
	}

	await jobLevel.destroy();

	return { messageCode: 'JOB_LEVEL_DELETED_SUCCESSFULLY',  message: 'jobLevel Deleted Successfully' };
};

