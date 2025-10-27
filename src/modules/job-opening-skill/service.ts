import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { JobOpeningSkill } from './model';
import { Skill } from '../skill/model';
import { JobOpening } from '../job-opening/model';


import { CreateJobOpeningSkillInput, UpdateJobOpeningSkillInput, QueryJobOpeningSkillInput } from './types';

export const fetchJobOpeningSkillList = async (params: QueryJobOpeningSkillInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include = [
		{
			model: JobOpening,
			as: 'jobOpening',
		},
		{
			model: Skill,
			as: 'skill',
		},
	];

	const { count, rows } = await JobOpeningSkill.findAndCountAll({
		attributes: [
// jobOpeningSkillId, jobOpeningId, skillId, requiredLevel, createdAt, updatedAt
			[Sequelize.col('JobOpeningSkill.job_opening_skill_id'), 'jobOpeningSkillId'],
			[Sequelize.col('JobOpeningSkill.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('JobOpeningSkill.skill_id'), 'skillId'],
			[Sequelize.col('JobOpeningSkill.required_level'), 'requiredLevel'],
			[Sequelize.col('JobOpeningSkill.created_at'), 'createdAt'],
			[Sequelize.col('JobOpeningSkill.updated_at'), 'updatedAt'],
			[Sequelize.col('jobOpening.title'), 'jobTitle'],
			[Sequelize.col('skill.skill_name'), 'skillName'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
		include: [...include],
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addJobOpeningSkill = async (payload: CreateJobOpeningSkillInput): Promise<any> => {
	// Prepare payload data and add properties

	const jobOpeningSkill = await JobOpeningSkill.create(payload);

	return jobOpeningSkill.get({ plain: true });
};

export const editJobOpeningSkill = async (params: any): Promise<JobOpeningSkill | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [
		{
			model: JobOpening,
			as: 'jobOpening',
		},
		{
			model: Skill,
			as: 'skill',
		},
	];

	const jobOpeningSkill = await JobOpeningSkill.findOne({
		attributes: [
// jobOpeningId, skillId, requiredLevel
			[Sequelize.col('JobOpeningSkill.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('JobOpeningSkill.skill_id'), 'skillId'],
			[Sequelize.col('JobOpeningSkill.required_level'), 'requiredLevel'],
			[Sequelize.col('jobOpening.title'), 'jobTitle'],
			[Sequelize.col('skill.skill_name'), 'skillName'],
		],
		where: {
			jobOpeningSkillId: params.jobOpeningSkillId,
			...where,
		},
		include: [...include],
	});

	if (!jobOpeningSkill) {
		return { errorCode: 'INVALID_JOB_OPENING_SKILL_ID', message: 'Invalid jobOpeningSkill ID' };
	}

	return jobOpeningSkill.get({ plain: true }) as JobOpeningSkill;
};

export const updateJobOpeningSkill = async (params: any, payload: UpdateJobOpeningSkillInput): Promise<any> => {
	let where: any = {};

	const jobOpeningSkill = await JobOpeningSkill.findOne({
		where: {
			jobOpeningSkillId: params.jobOpeningSkillId,
			...where,
		},
	});

	if (!jobOpeningSkill) {
		return { errorCode: 'INVALID_JOB_OPENING_SKILL_ID', message: 'Invalid jobOpeningSkill ID' };
	}

	await jobOpeningSkill.update(payload);

	return {
		message: 'JobOpeningSkill updated successfully',
		data: jobOpeningSkill.get({ plain: true }),
	};
};

export const getJobOpeningSkill = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [
		{
			model: JobOpening,
			as: 'jobOpening',
		},
		{
			model: Skill,
			as: 'skill',
		},
	];

	const jobOpeningSkill = await JobOpeningSkill.findOne({
		attributes: [
// jobOpeningSkillId, jobOpeningId, skillId, requiredLevel, createdAt, updatedAt
			[Sequelize.col('JobOpeningSkill.job_opening_skill_id'), 'jobOpeningSkillId'],
			[Sequelize.col('JobOpeningSkill.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('JobOpeningSkill.skill_id'), 'skillId'],
			[Sequelize.col('JobOpeningSkill.required_level'), 'requiredLevel'],
			[Sequelize.col('JobOpeningSkill.created_at'), 'createdAt'],
			[Sequelize.col('JobOpeningSkill.updated_at'), 'updatedAt'],
			[Sequelize.col('jobOpening.title'), 'jobTitle'],
			[Sequelize.col('skill.skill_name'), 'skillName'],
		],
		where: {
			jobOpeningSkillId: params.jobOpeningSkillId,
			...where,
		},
		include: [...include],
	});

	if (!jobOpeningSkill) {
		return { errorCode: 'INVALID_JOB_OPENING_SKILL_ID', message: 'Invalid jobOpeningSkill ID' };
	}

	return {
		data: jobOpeningSkill.get({ plain: true }),
	};
};

export const deleteJobOpeningSkill = async (params: any): Promise<any> => {
	let where: any = {};

	const jobOpeningSkill = await JobOpeningSkill.findOne({
		where: {
			jobOpeningSkillId: params.jobOpeningSkillId,
			...where,
		},
	});

	if (!jobOpeningSkill) {
		return { errorCode: 'INVALID_JOB_OPENING_SKILL_ID', message: 'Invalid jobOpeningSkill ID' };
	}

	await jobOpeningSkill.destroy();

	return { messageCode: 'JOB_OPENING_SKILL_DELETED_SUCCESSFULLY',  message: 'jobOpeningSkill Deleted Successfully' };
};

