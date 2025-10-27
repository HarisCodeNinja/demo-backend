import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { PerformanceReview } from './model';
import { Employee } from '../employee/model';


import { CreatePerformanceReviewInput, UpdatePerformanceReviewInput, QueryPerformanceReviewInput } from './types';

export const fetchPerformanceReviewList = async (params: QueryPerformanceReviewInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const include = [
		{
			model: Employee,
			as: 'employee',
		},
		{
			model: Employee,
			as: 'reviewer',
		},
	];

	const { count, rows } = await PerformanceReview.findAndCountAll({
		attributes: [
// performanceReviewId, employeeId, reviewerId, reviewPeriod, reviewDate, selfAssessment, managerFeedback, overallRating, recommendations, status, createdAt, updatedAt
			[Sequelize.col('PerformanceReview.performance_review_id'), 'performanceReviewId'],
			[Sequelize.col('PerformanceReview.employee_id'), 'employeeId'],
			[Sequelize.col('PerformanceReview.reviewer_id'), 'reviewerId'],
			[Sequelize.col('PerformanceReview.review_period'), 'reviewPeriod'],
			[Sequelize.col('PerformanceReview.review_date'), 'reviewDate'],
			[Sequelize.col('PerformanceReview.self_assessment'), 'selfAssessment'],
			[Sequelize.col('PerformanceReview.manager_feedback'), 'managerFeedback'],
			[Sequelize.col('PerformanceReview.overall_rating'), 'overallRating'],
			[Sequelize.col('PerformanceReview.recommendation'), 'recommendation'],
			[Sequelize.col('PerformanceReview.status'), 'status'],
			[Sequelize.col('PerformanceReview.created_at'), 'createdAt'],
			[Sequelize.col('PerformanceReview.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'employeeFirstName'],
			[Sequelize.col('employee.last_name'), 'employeeLastName'],
			[Sequelize.col('reviewer.first_name'), 'reviewerFirstName'],
			[Sequelize.col('reviewer.last_name'), 'reviewerLastName'],
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
		include: [...include],
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addPerformanceReview = async (payload: CreatePerformanceReviewInput): Promise<any> => {
	// Prepare payload data and add properties

	const performanceReviewDefaultPayload = {
			reviewDate: payload.reviewDate ?? new Date(),
			status: payload.status ?? "Pending"
	};
	const performanceReview = await PerformanceReview.create({...payload, ...performanceReviewDefaultPayload});

	return performanceReview.get({ plain: true });
};

export const editPerformanceReview = async (params: any): Promise<PerformanceReview | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
		{
			model: Employee,
			as: 'reviewer',
		},
	];

	const performanceReview = await PerformanceReview.findOne({
		attributes: [
// employeeId, reviewerId, reviewPeriod, reviewDate, selfAssessment, managerFeedback, overallRating, recommendations, status
			[Sequelize.col('PerformanceReview.employee_id'), 'employeeId'],
			[Sequelize.col('PerformanceReview.reviewer_id'), 'reviewerId'],
			[Sequelize.col('PerformanceReview.review_period'), 'reviewPeriod'],
			[Sequelize.col('PerformanceReview.review_date'), 'reviewDate'],
			[Sequelize.col('PerformanceReview.self_assessment'), 'selfAssessment'],
			[Sequelize.col('PerformanceReview.manager_feedback'), 'managerFeedback'],
			[Sequelize.col('PerformanceReview.overall_rating'), 'overallRating'],
			[Sequelize.col('PerformanceReview.recommendation'), 'recommendation'],
			[Sequelize.col('PerformanceReview.status'), 'status'],
			[Sequelize.col('employee.first_name'), 'employeeFirstName'],
			[Sequelize.col('employee.last_name'), 'employeeLastName'],
			[Sequelize.col('reviewer.first_name'), 'reviewerFirstName'],
			[Sequelize.col('reviewer.last_name'), 'reviewerLastName'],
		],
		where: {
			performanceReviewId: params.performanceReviewId,
			...where,
		},
		include: [...include],
	});

	if (!performanceReview) {
		return { errorCode: 'INVALID_PERFORMANCE_REVIEW_ID', message: 'Invalid performanceReview ID' };
	}

	return performanceReview.get({ plain: true }) as PerformanceReview;
};

export const updatePerformanceReview = async (params: any, payload: UpdatePerformanceReviewInput): Promise<any> => {
	let where: any = {};

	const performanceReview = await PerformanceReview.findOne({
		where: {
			performanceReviewId: params.performanceReviewId,
			...where,
		},
	});

	if (!performanceReview) {
		return { errorCode: 'INVALID_PERFORMANCE_REVIEW_ID', message: 'Invalid performanceReview ID' };
	}

	await performanceReview.update(payload);

	return {
		message: 'PerformanceReview updated successfully',
		data: performanceReview.get({ plain: true }),
	};
};

export const getPerformanceReview = async (params: any): Promise<any> => {
	let where: any = {};
	const include = [
		{
			model: Employee,
			as: 'employee',
		},
		{
			model: Employee,
			as: 'reviewer',
		},
	];

	const performanceReview = await PerformanceReview.findOne({
		attributes: [
// performanceReviewId, employeeId, reviewerId, reviewPeriod, reviewDate, selfAssessment, managerFeedback, overallRating, recommendations, status, createdAt, updatedAt
			[Sequelize.col('PerformanceReview.performance_review_id'), 'performanceReviewId'],
			[Sequelize.col('PerformanceReview.employee_id'), 'employeeId'],
			[Sequelize.col('PerformanceReview.reviewer_id'), 'reviewerId'],
			[Sequelize.col('PerformanceReview.review_period'), 'reviewPeriod'],
			[Sequelize.col('PerformanceReview.review_date'), 'reviewDate'],
			[Sequelize.col('PerformanceReview.self_assessment'), 'selfAssessment'],
			[Sequelize.col('PerformanceReview.manager_feedback'), 'managerFeedback'],
			[Sequelize.col('PerformanceReview.overall_rating'), 'overallRating'],
			[Sequelize.col('PerformanceReview.recommendation'), 'recommendation'],
			[Sequelize.col('PerformanceReview.status'), 'status'],
			[Sequelize.col('PerformanceReview.created_at'), 'createdAt'],
			[Sequelize.col('PerformanceReview.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'employeeFirstName'],
			[Sequelize.col('employee.last_name'), 'employeeLastName'],
			[Sequelize.col('reviewer.first_name'), 'reviewerFirstName'],
			[Sequelize.col('reviewer.last_name'), 'reviewerLastName'],
		],
		where: {
			performanceReviewId: params.performanceReviewId,
			...where,
		},
		include: [...include],
	});

	if (!performanceReview) {
		return { errorCode: 'INVALID_PERFORMANCE_REVIEW_ID', message: 'Invalid performanceReview ID' };
	}

	return {
		data: performanceReview.get({ plain: true }),
	};
};

export const deletePerformanceReview = async (params: any): Promise<any> => {
	let where: any = {};

	const performanceReview = await PerformanceReview.findOne({
		where: {
			performanceReviewId: params.performanceReviewId,
			...where,
		},
	});

	if (!performanceReview) {
		return { errorCode: 'INVALID_PERFORMANCE_REVIEW_ID', message: 'Invalid performanceReview ID' };
	}

	await performanceReview.destroy();

	return { messageCode: 'PERFORMANCE_REVIEW_DELETED_SUCCESSFULLY',  message: 'performanceReview Deleted Successfully' };
};

