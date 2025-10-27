import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { JobOpening } from './model';
import { Designation } from '../designation/model';
import { Department } from '../department/model';
import { Location } from '../location/model';


import { CreateJobOpeningInput, UpdateJobOpeningInput, QueryJobOpeningInput } from './types';

export const fetchJobOpeningList = async (params: QueryJobOpeningInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include: any[] = [
		{
			model: Department,
			as: 'department',
		},
		{
			model: Designation,
			as: 'designation',
		},
		{
			model: Location,
			as: 'location',
		},
	];

	const { count, rows } = await JobOpening.findAndCountAll({
		attributes: [
// jobOpeningId, title, description, departmentId, designationId, locationId, requiredExperience, status, publishedAt, closedAt, createdById, createdAt, updatedAt
			[Sequelize.col('JobOpening.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('JobOpening.title'), 'title'],
			[Sequelize.col('JobOpening.description'), 'description'],
			[Sequelize.col('JobOpening.department_id'), 'departmentId'],
			[Sequelize.col('JobOpening.designation_id'), 'designationId'],
			[Sequelize.col('JobOpening.location_id'), 'locationId'],
			[Sequelize.col('JobOpening.required_experience'), 'requiredExperience'],
			[Sequelize.col('JobOpening.status'), 'status'],
			[Sequelize.col('JobOpening.published_at'), 'publishedAt'],
			[Sequelize.col('JobOpening.closed_at'), 'closedAt'],
			[Sequelize.col('JobOpening.created_by'), 'createdBy'],
			[Sequelize.col('JobOpening.created_at'), 'createdAt'],
			[Sequelize.col('JobOpening.updated_at'), 'updatedAt'],
			[Sequelize.col('department.department_name'), 'departmentName'],
			[Sequelize.col('designation.designation_name'), 'designationName'],
			[Sequelize.col('location.location_name'), 'locationName'],
		],
		include: [...include],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const selectJobOpening = async () => {

	const results = await JobOpening.findAll({
		attributes: [
			[Sequelize.col('JobOpening.job_opening_id'), 'value'],
			[Sequelize.col('JobOpening.title'), 'label'],
		],
	});

	const plainRows = results.map((item) => item.get({ plain: true }));
	return plainRows;
};

export const addJobOpening = async (payload: CreateJobOpeningInput): Promise<any> => {
	// Prepare payload data and add properties

	const jobOpeningDefaultPayload = {
			requiredExperience: payload.requiredExperience ?? 0,
			status: payload.status ?? "draft",
			publishedAt: payload.publishedAt ?? new Date(),
			closedAt: payload.closedAt ?? new Date()
	};
	const jobOpening = await JobOpening.create({...payload, ...jobOpeningDefaultPayload});

	return jobOpening.get({ plain: true });
};

export const editJobOpening = async (params: any): Promise<JobOpening | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [
		{
			model: Department,
			as: 'department',
		},
		{
			model: Designation,
			as: 'designation',
		},
		{
			model: Location,
			as: 'location',
		},
	];

	const jobOpening = await JobOpening.findOne({
		attributes: [
// title, description, departmentId, designationId, locationId, requiredExperience, status, publishedAt, closedAt
			[Sequelize.col('JobOpening.title'), 'title'],
			[Sequelize.col('JobOpening.description'), 'description'],
			[Sequelize.col('JobOpening.department_id'), 'departmentId'],
			[Sequelize.col('JobOpening.designation_id'), 'designationId'],
			[Sequelize.col('JobOpening.location_id'), 'locationId'],
			[Sequelize.col('JobOpening.required_experience'), 'requiredExperience'],
			[Sequelize.col('JobOpening.status'), 'status'],
			[Sequelize.col('JobOpening.published_at'), 'publishedAt'],
			[Sequelize.col('JobOpening.closed_at'), 'closedAt'],
			[Sequelize.col('department.department_name'), 'departmentName'],
			[Sequelize.col('designation.designation_name'), 'designationName'],
			[Sequelize.col('location.location_name'), 'locationName'],
		],
		include: [...include],
		where: {
			jobOpeningId: params.jobOpeningId,
			...where,
		},
	});

	if (!jobOpening) {
		return { errorCode: 'INVALID_JOB_OPENING_ID', message: 'Invalid jobOpening ID' };
	}

	return jobOpening.get({ plain: true }) as JobOpening;
};

export const updateJobOpening = async (params: any, payload: UpdateJobOpeningInput): Promise<any> => {
	let where: any = {};

	const jobOpening = await JobOpening.findOne({
		where: {
			jobOpeningId: params.jobOpeningId,
			...where,
		},
	});

	if (!jobOpening) {
		return { errorCode: 'INVALID_JOB_OPENING_ID', message: 'Invalid jobOpening ID' };
	}

	await jobOpening.update(payload);

	return {
		message: 'JobOpening updated successfully',
		data: jobOpening.get({ plain: true }),
	};
};

export const getJobOpening = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [
		{
			model: Department,
			as: 'department',
		},
		{
			model: Designation,
			as: 'designation',
		},
		{
			model: Location,
			as: 'location',
		},
	];

	const jobOpening = await JobOpening.findOne({
		attributes: [
// jobOpeningId, title, description, departmentId, designationId, locationId, requiredExperience, status, publishedAt, closedAt, createdById, createdAt, updatedAt
			[Sequelize.col('JobOpening.job_opening_id'), 'jobOpeningId'],
			[Sequelize.col('JobOpening.title'), 'title'],
			[Sequelize.col('JobOpening.description'), 'description'],
			[Sequelize.col('JobOpening.department_id'), 'departmentId'],
			[Sequelize.col('JobOpening.designation_id'), 'designationId'],
			[Sequelize.col('JobOpening.location_id'), 'locationId'],
			[Sequelize.col('JobOpening.required_experience'), 'requiredExperience'],
			[Sequelize.col('JobOpening.status'), 'status'],
			[Sequelize.col('JobOpening.published_at'), 'publishedAt'],
			[Sequelize.col('JobOpening.closed_at'), 'closedAt'],
			[Sequelize.col('JobOpening.created_by'), 'createdBy'],
			[Sequelize.col('JobOpening.created_at'), 'createdAt'],
			[Sequelize.col('JobOpening.updated_at'), 'updatedAt'],
			[Sequelize.col('department.department_name'), 'departmentName'],
			[Sequelize.col('designation.designation_name'), 'designationName'],
			[Sequelize.col('location.location_name'), 'locationName'],
		],
		include: [...include],
		where: {
			jobOpeningId: params.jobOpeningId,
			...where,
		},
	});

	if (!jobOpening) {
		return { errorCode: 'INVALID_JOB_OPENING_ID', message: 'Invalid jobOpening ID' };
	}

	return {
		data: jobOpening.get({ plain: true }),
	};
};

export const deleteJobOpening = async (params: any): Promise<any> => {
	let where: any = {};

	const jobOpening = await JobOpening.findOne({
		where: {
			jobOpeningId: params.jobOpeningId,
			...where,
		},
	});

	if (!jobOpening) {
		return { errorCode: 'INVALID_JOB_OPENING_ID', message: 'Invalid jobOpening ID' };
	}

	await jobOpening.destroy();

	return { messageCode: 'JOB_OPENING_DELETED_SUCCESSFULLY',  message: 'jobOpening Deleted Successfully' };
};

