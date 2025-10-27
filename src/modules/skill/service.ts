import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Skill } from './model';


import { CreateSkillInput, UpdateSkillInput, QuerySkillInput } from './types';

export const fetchSkillList = async (params: QuerySkillInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const { count, rows } = await Skill.findAndCountAll({
		attributes: [
// skillId, skillName, createdAt, updatedAt
			[Sequelize.col('Skill.skill_id'), 'skillId'],
			[Sequelize.col('Skill.skill_name'), 'skillName'],
			[Sequelize.col('Skill.created_at'), 'createdAt'],
			[Sequelize.col('Skill.updated_at'), 'updatedAt'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectSkill = async () => {

	const results = await Skill.findAll({
		attributes: [
			[Sequelize.col('Skill.skill_id'), 'value'],
			[Sequelize.col('Skill.skill_name'), 'label'],
		],
	});

	const plainRows = results.map((item) => item.get({ plain: true }));
	return plainRows;
};

export const addSkill = async (payload: CreateSkillInput): Promise<any> => {
	// Prepare payload data and add properties

	const skill = await Skill.create(payload);

	return skill.get({ plain: true });
};

export const editSkill = async (params: any): Promise<Skill | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [];

	const skill = await Skill.findOne({
		attributes: [
// skillName
			[Sequelize.col('Skill.skill_name'), 'skillName'],
		],
		where: {
			skillId: params.skillId,
			...where,
		},
	});

	if (!skill) {
		return { errorCode: 'INVALID_SKILL_ID', message: 'Invalid skill ID' };
	}

	return skill.get({ plain: true }) as Skill;
};

export const updateSkill = async (params: any, payload: UpdateSkillInput): Promise<any> => {
	let where: any = {};

	const skill = await Skill.findOne({
		where: {
			skillId: params.skillId,
			...where,
		},
	});

	if (!skill) {
		return { errorCode: 'INVALID_SKILL_ID', message: 'Invalid skill ID' };
	}

	await skill.update(payload);

	return {
		message: 'Skill updated successfully',
		data: skill.get({ plain: true }),
	};
};

export const getSkill = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [];

	const skill = await Skill.findOne({
		attributes: [
// skillId, skillName, createdAt, updatedAt
			[Sequelize.col('Skill.skill_id'), 'skillId'],
			[Sequelize.col('Skill.skill_name'), 'skillName'],
			[Sequelize.col('Skill.created_at'), 'createdAt'],
			[Sequelize.col('Skill.updated_at'), 'updatedAt'],
		],
		where: {
			skillId: params.skillId,
			...where,
		},
		include: [...include],
	});

	if (!skill) {
		return { errorCode: 'INVALID_SKILL_ID', message: 'Invalid skill ID' };
	}

	return {
		data: skill.get({ plain: true }),
	};
};

export const deleteSkill = async (params: any): Promise<any> => {
	let where: any = {};

	const skill = await Skill.findOne({
		where: {
			skillId: params.skillId,
			...where,
		},
	});

	if (!skill) {
		return { errorCode: 'INVALID_SKILL_ID', message: 'Invalid skill ID' };
	}

	await skill.destroy();

	return { messageCode: 'SKILL_DELETED_SUCCESSFULLY',  message: 'skill Deleted Successfully' };
};

