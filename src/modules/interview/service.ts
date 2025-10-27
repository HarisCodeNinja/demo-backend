import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Interview } from './model';
import { Employee } from '../employee/model';
import { JobOpening } from '../job-opening/model';
import { Candidate } from '../candidate/model';


import { CreateInterviewInput, UpdateInterviewInput, QueryInterviewInput } from './types';

export const fetchInterviewList = async (params: QueryInterviewInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include: any[] = [
		{
			model: Candidate,
			as: 'candidate',
		},
		{
			model: JobOpening,
			as: 'jobOpening',
		},
		{
			model: Employee,
			as: 'interviewer',
		},
	];

	const { count, rows } = await Interview.findAndCountAll({
		attributes: [
// interviewId, candidateId, jobOpeningId, interviewerId, interviewDate, feedback, rating, status, createdAt, updatedAt
			[Sequelize.col('Interview.interview_id'), 'interviewId'],
			[Sequelize.col('Interview.candidate_id'), 'candidateId'],
			[Sequelize.col('Interview.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('Interview.interviewer_id'), 'interviewerId'],
			[Sequelize.col('Interview.interview_date'), 'interviewDate'],
			[Sequelize.col('Interview.feedback'), 'feedback'],
			[Sequelize.col('Interview.rating'), 'rating'],
			[Sequelize.col('Interview.status'), 'status'],
			[Sequelize.col('Interview.created_at'), 'createdAt'],
			[Sequelize.col('Interview.updated_at'), 'updatedAt'],
			[Sequelize.col('candidate.first_name'), 'candidateFirstName'],
			[Sequelize.col('candidate.last_name'), 'candidateLastName'],
			[Sequelize.col('jobOpening.title'), 'jobTitle'],
			[Sequelize.col('interviewer.first_name'), 'interviewerFirstName'],
			[Sequelize.col('interviewer.last_name'), 'interviewerLastName'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
		include: [...include],
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addInterview = async (payload: CreateInterviewInput): Promise<any> => {
	// Prepare payload data and add properties

	const interviewDefaultPayload = {
			interviewDate: payload.interviewDate ?? new Date(),
			status: payload.status ?? "Scheduled"
	};
	const interview = await Interview.create({...payload, ...interviewDefaultPayload});

	return interview.get({ plain: true });
};

export const editInterview = async (params: any): Promise<Interview | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [
		{
			model: Candidate,
			as: 'candidate',
		},
		{
			model: JobOpening,
			as: 'jobOpening',
		},
		{
			model: Employee,
			as: 'interviewer',
		},
	];

	const interview = await Interview.findOne({
		attributes: [
// candidateId, jobOpeningId, interviewerId, interviewDate, feedback, rating, status
			[Sequelize.col('Interview.candidate_id'), 'candidateId'],
			[Sequelize.col('Interview.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('Interview.interviewer_id'), 'interviewerId'],
			[Sequelize.col('Interview.interview_date'), 'interviewDate'],
			[Sequelize.col('Interview.feedback'), 'feedback'],
			[Sequelize.col('Interview.rating'), 'rating'],
			[Sequelize.col('Interview.status'), 'status'],
			[Sequelize.col('candidate.first_name'), 'candidateFirstName'],
			[Sequelize.col('candidate.last_name'), 'candidateLastName'],
			[Sequelize.col('jobOpening.title'), 'jobTitle'],
			[Sequelize.col('interviewer.first_name'), 'interviewerFirstName'],
			[Sequelize.col('interviewer.last_name'), 'interviewerLastName'],
		],
		where: {
			interviewId: params.interviewId,
			...where,
		},
		include: [...include],
	});

	if (!interview) {
		return { errorCode: 'INVALID_INTERVIEW_ID', message: 'Invalid interview ID' };
	}

	return interview.get({ plain: true }) as Interview;
};

export const updateInterview = async (params: any, payload: UpdateInterviewInput): Promise<any> => {
	let where: any = {};

	const interview = await Interview.findOne({
		where: {
			interviewId: params.interviewId,
			...where,
		},
	});

	if (!interview) {
		return { errorCode: 'INVALID_INTERVIEW_ID', message: 'Invalid interview ID' };
	}

	await interview.update(payload);

	return {
		message: 'Interview updated successfully',
		data: interview.get({ plain: true }),
	};
};

export const getInterview = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [
		{
			model: Candidate,
			as: 'candidate',
		},
		{
			model: JobOpening,
			as: 'jobOpening',
		},
		{
			model: Employee,
			as: 'interviewer',
		},
	];

	const interview = await Interview.findOne({
		attributes: [
// interviewId, candidateId, jobOpeningId, interviewerId, interviewDate, feedback, rating, status, createdAt, updatedAt
			[Sequelize.col('Interview.interview_id'), 'interviewId'],
			[Sequelize.col('Interview.candidate_id'), 'candidateId'],
			[Sequelize.col('Interview.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('Interview.interviewer_id'), 'interviewerId'],
			[Sequelize.col('Interview.interview_date'), 'interviewDate'],
			[Sequelize.col('Interview.feedback'), 'feedback'],
			[Sequelize.col('Interview.rating'), 'rating'],
			[Sequelize.col('Interview.status'), 'status'],
			[Sequelize.col('Interview.created_at'), 'createdAt'],
			[Sequelize.col('Interview.updated_at'), 'updatedAt'],
			[Sequelize.col('candidate.first_name'), 'candidateFirstName'],
			[Sequelize.col('candidate.last_name'), 'candidateLastName'],
			[Sequelize.col('jobOpening.title'), 'jobTitle'],
			[Sequelize.col('interviewer.first_name'), 'interviewerFirstName'],
			[Sequelize.col('interviewer.last_name'), 'interviewerLastName'],
		],
		where: {
			interviewId: params.interviewId,
			...where,
		},
		include: [...include],
	});

	if (!interview) {
		return { errorCode: 'INVALID_INTERVIEW_ID', message: 'Invalid interview ID' };
	}

	return {
		data: interview.get({ plain: true }),
	};
};

export const deleteInterview = async (params: any): Promise<any> => {
	let where: any = {};

	const interview = await Interview.findOne({
		where: {
			interviewId: params.interviewId,
			...where,
		},
	});

	if (!interview) {
		return { errorCode: 'INVALID_INTERVIEW_ID', message: 'Invalid interview ID' };
	}

	await interview.destroy();

	return { messageCode: 'INTERVIEW_DELETED_SUCCESSFULLY',  message: 'interview Deleted Successfully' };
};

