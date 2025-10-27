import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Candidate } from './model';
import { JobOpening } from '../job-opening/model';
import { Employee } from '../employee/model';


import { CreateCandidateInput, UpdateCandidateInput, QueryCandidateInput } from './types';

export const fetchCandidateList = async (params: QueryCandidateInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include: any[] = [
		{
			model: JobOpening,
			as: 'jobOpening',
		},
		{
			model: Employee,
			as: 'referredByEmployee',
		},
	];

	const { count, rows } = await Candidate.findAndCountAll({
		attributes: [
// candidateId, firstName, lastName, email, phoneNumber, resumeText, source, currentStatus, jobOpeningId, referredByEmployeeId, createdAt, updatedAt
			[Sequelize.col('Candidate.candidate_id'), 'candidateId'],
			[Sequelize.col('Candidate.first_name'), 'firstName'],
			[Sequelize.col('Candidate.last_name'), 'lastName'],
			[Sequelize.col('Candidate.email'), 'email'],
			[Sequelize.col('Candidate.phone_number'), 'phoneNumber'],
			[Sequelize.col('Candidate.resume_text'), 'resumeText'],
			[Sequelize.col('Candidate.source'), 'source'],
			[Sequelize.col('Candidate.current_status'), 'currentStatus'],
			[Sequelize.col('Candidate.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('Candidate.referred_by_employee_id'), 'referredByEmployeeId'],
			[Sequelize.col('Candidate.created_at'), 'createdAt'],
			[Sequelize.col('Candidate.updated_at'), 'updatedAt'],
			[Sequelize.col('jobOpening.title'), 'jobTitle'],
			[Sequelize.col('referredByEmployee.first_name'), 'referredByFirstName'],
			[Sequelize.col('referredByEmployee.last_name'), 'referredByLastName'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
		include: [...include],
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectCandidate = async () => {

	const results = await Candidate.findAll({
		attributes: [
			[Sequelize.col('Candidate.candidate_id'), 'value'],
			[Sequelize.col('Candidate.first_name'), 'label'],
		],
	});

	const plainRows = results.map((item) => item.get({ plain: true }));
	return plainRows;
};

export const addCandidate = async (payload: CreateCandidateInput): Promise<any> => {
	// Prepare payload data and add properties

	const candidateDefaultPayload = {
			currentStatus: payload.currentStatus ?? "Applied"
	};
	const candidate = await Candidate.create({...payload, ...candidateDefaultPayload});

	return candidate.get({ plain: true });
};

export const editCandidate = async (params: any): Promise<Candidate | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [
		{
			model: JobOpening,
			as: 'jobOpening',
		},
		{
			model: Employee,
			as: 'referredByEmployee',
		},
	];

	const candidate = await Candidate.findOne({
		attributes: [
// firstName, lastName, email, phoneNumber, resumeText, source, currentStatus, jobOpeningId, referredByEmployeeId
			[Sequelize.col('Candidate.first_name'), 'firstName'],
			[Sequelize.col('Candidate.last_name'), 'lastName'],
			[Sequelize.col('Candidate.email'), 'email'],
			[Sequelize.col('Candidate.phone_number'), 'phoneNumber'],
			[Sequelize.col('Candidate.resume_text'), 'resumeText'],
			[Sequelize.col('Candidate.source'), 'source'],
			[Sequelize.col('Candidate.current_status'), 'currentStatus'],
			[Sequelize.col('Candidate.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('Candidate.referred_by_employee_id'), 'referredByEmployeeId'],
			[Sequelize.col('jobOpening.title'), 'jobTitle'],
			[Sequelize.col('referredByEmployee.first_name'), 'referredByFirstName'],
			[Sequelize.col('referredByEmployee.last_name'), 'referredByLastName'],
		],
		where: {
			candidateId: params.candidateId,
			...where,
		},
		include: [...include],
	});

	if (!candidate) {
		return { errorCode: 'INVALID_CANDIDATE_ID', message: 'Invalid candidate ID' };
	}

	return candidate.get({ plain: true }) as Candidate;
};

export const updateCandidate = async (params: any, payload: UpdateCandidateInput): Promise<any> => {
	let where: any = {};

	const candidate = await Candidate.findOne({
		where: {
			candidateId: params.candidateId,
			...where,
		},
	});

	if (!candidate) {
		return { errorCode: 'INVALID_CANDIDATE_ID', message: 'Invalid candidate ID' };
	}

	await candidate.update(payload);

	return {
		message: 'Candidate updated successfully',
		data: candidate.get({ plain: true }),
	};
};

export const getCandidate = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [
		{
			model: JobOpening,
			as: 'jobOpening',
		},
		{
			model: Employee,
			as: 'referredByEmployee',
		},
	];

	const candidate = await Candidate.findOne({
		attributes: [
// candidateId, firstName, lastName, email, phoneNumber, resumeText, source, currentStatus, jobOpeningId, referredByEmployeeId, createdAt, updatedAt
			[Sequelize.col('Candidate.candidate_id'), 'candidateId'],
			[Sequelize.col('Candidate.first_name'), 'firstName'],
			[Sequelize.col('Candidate.last_name'), 'lastName'],
			[Sequelize.col('Candidate.email'), 'email'],
			[Sequelize.col('Candidate.phone_number'), 'phoneNumber'],
			[Sequelize.col('Candidate.resume_text'), 'resumeText'],
			[Sequelize.col('Candidate.source'), 'source'],
			[Sequelize.col('Candidate.current_status'), 'currentStatus'],
			[Sequelize.col('Candidate.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('Candidate.referred_by_employee_id'), 'referredByEmployeeId'],
			[Sequelize.col('Candidate.created_at'), 'createdAt'],
			[Sequelize.col('Candidate.updated_at'), 'updatedAt'],
			[Sequelize.col('jobOpening.title'), 'jobTitle'],
			[Sequelize.col('referredByEmployee.first_name'), 'referredByFirstName'],
			[Sequelize.col('referredByEmployee.last_name'), 'referredByLastName'],
		],
		where: {
			candidateId: params.candidateId,
			...where,
		},
		include: [...include],
	});

	if (!candidate) {
		return { errorCode: 'INVALID_CANDIDATE_ID', message: 'Invalid candidate ID' };
	}

	return {
		data: candidate.get({ plain: true }),
	};
};

export const deleteCandidate = async (params: any): Promise<any> => {
	let where: any = {};

	const candidate = await Candidate.findOne({
		where: {
			candidateId: params.candidateId,
			...where,
		},
	});

	if (!candidate) {
		return { errorCode: 'INVALID_CANDIDATE_ID', message: 'Invalid candidate ID' };
	}

	await candidate.destroy();

	return { messageCode: 'CANDIDATE_DELETED_SUCCESSFULLY',  message: 'candidate Deleted Successfully' };
};

