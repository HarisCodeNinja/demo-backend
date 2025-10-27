import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { CandidateSkill } from './model';
import { Skill } from '../skill/model';
import { Candidate } from '../candidate/model';


import { CreateCandidateSkillInput, UpdateCandidateSkillInput, QueryCandidateSkillInput } from './types';

export const fetchCandidateSkillList = async (params: QueryCandidateSkillInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include = [
		{
			model: Candidate,
			as: 'candidate',
		},
		{
			model: Skill,
			as: 'skill',
		},
	];

	const { count, rows } = await CandidateSkill.findAndCountAll({
		attributes: [
// candidateSkillId, candidateId, skillId, proficiency, createdAt, updatedAt
			[Sequelize.col('CandidateSkill.candidate_skill_id'), 'candidateSkillId'],
			[Sequelize.col('CandidateSkill.candidate_id'), 'candidateId'],
			[Sequelize.col('CandidateSkill.skill_id'), 'skillId'],
			[Sequelize.col('CandidateSkill.proficiency'), 'proficiency'],
			[Sequelize.col('CandidateSkill.created_at'), 'createdAt'],
			[Sequelize.col('CandidateSkill.updated_at'), 'updatedAt'],
			[Sequelize.col('candidate.first_name'), 'candidateFirstName'],
			[Sequelize.col('candidate.last_name'), 'candidateLastName'],
			[Sequelize.col('skill.skill_name'), 'skillName'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
		include: [...include],
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addCandidateSkill = async (payload: CreateCandidateSkillInput): Promise<any> => {
	// Prepare payload data and add properties

	const candidateSkill = await CandidateSkill.create(payload);

	return candidateSkill.get({ plain: true });
};

export const editCandidateSkill = async (params: any): Promise<CandidateSkill | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [
		{
			model: Candidate,
			as: 'candidate',
		},
		{
			model: Skill,
			as: 'skill',
		},
	];

	const candidateSkill = await CandidateSkill.findOne({
		attributes: [
// candidateId, skillId, proficiency
			[Sequelize.col('CandidateSkill.candidate_id'), 'candidateId'],
			[Sequelize.col('CandidateSkill.skill_id'), 'skillId'],
			[Sequelize.col('CandidateSkill.proficiency'), 'proficiency'],
			[Sequelize.col('candidate.first_name'), 'candidateFirstName'],
			[Sequelize.col('candidate.last_name'), 'candidateLastName'],
			[Sequelize.col('skill.skill_name'), 'skillName'],
		],
		where: {
			candidateSkillId: params.candidateSkillId,
			...where,
		},
		include: [...include],
	});

	if (!candidateSkill) {
		return { errorCode: 'INVALID_CANDIDATE_SKILL_ID', message: 'Invalid candidateSkill ID' };
	}

	return candidateSkill.get({ plain: true }) as CandidateSkill;
};

export const updateCandidateSkill = async (params: any, payload: UpdateCandidateSkillInput): Promise<any> => {
	let where: any = {};

	const candidateSkill = await CandidateSkill.findOne({
		where: {
			candidateSkillId: params.candidateSkillId,
			...where,
		},
	});

	if (!candidateSkill) {
		return { errorCode: 'INVALID_CANDIDATE_SKILL_ID', message: 'Invalid candidateSkill ID' };
	}

	await candidateSkill.update(payload);

	return {
		message: 'CandidateSkill updated successfully',
		data: candidateSkill.get({ plain: true }),
	};
};

export const getCandidateSkill = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [
		{
			model: Candidate,
			as: 'candidate',
		},
		{
			model: Skill,
			as: 'skill',
		},
	];

	const candidateSkill = await CandidateSkill.findOne({
		attributes: [
// candidateSkillId, candidateId, skillId, proficiency, createdAt, updatedAt
			[Sequelize.col('CandidateSkill.candidate_skill_id'), 'candidateSkillId'],
			[Sequelize.col('CandidateSkill.candidate_id'), 'candidateId'],
			[Sequelize.col('CandidateSkill.skill_id'), 'skillId'],
			[Sequelize.col('CandidateSkill.proficiency'), 'proficiency'],
			[Sequelize.col('CandidateSkill.created_at'), 'createdAt'],
			[Sequelize.col('CandidateSkill.updated_at'), 'updatedAt'],
			[Sequelize.col('candidate.first_name'), 'candidateFirstName'],
			[Sequelize.col('candidate.last_name'), 'candidateLastName'],
			[Sequelize.col('skill.skill_name'), 'skillName'],
		],
		where: {
			candidateSkillId: params.candidateSkillId,
			...where,
		},
		include: [...include],
	});

	if (!candidateSkill) {
		return { errorCode: 'INVALID_CANDIDATE_SKILL_ID', message: 'Invalid candidateSkill ID' };
	}

	return {
		data: candidateSkill.get({ plain: true }),
	};
};

export const deleteCandidateSkill = async (params: any): Promise<any> => {
	let where: any = {};

	const candidateSkill = await CandidateSkill.findOne({
		where: {
			candidateSkillId: params.candidateSkillId,
			...where,
		},
	});

	if (!candidateSkill) {
		return { errorCode: 'INVALID_CANDIDATE_SKILL_ID', message: 'Invalid candidateSkill ID' };
	}

	await candidateSkill.destroy();

	return { messageCode: 'CANDIDATE_SKILL_DELETED_SUCCESSFULLY',  message: 'candidateSkill Deleted Successfully' };
};

