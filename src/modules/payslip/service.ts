import { Op, Sequelize, fn, BaseError } from 'sequelize';
import { Payslip } from './model';
import { Employee } from '../employee/model';
import { convertStringFieldsToNumbers } from '../../util/dataTransform';


import { CreatePayslipInput, UpdatePayslipInput, QueryPayslipInput } from './types';

export const fetchPayslipList = async (params: QueryPayslipInput) => {
	const pageSize = Math.min(params.pageSize || 10, 1000);
	const curPage = params.page || 0;

	const { count, rows } = await Payslip.findAndCountAll({
		attributes: [
// payslipId, employeeId, payPeriodStart, payPeriodEnd, grossSalary, netSalary, deductionsAmount, allowancesAmount, pdfUrl, generatedById, createdAt, updatedAt
			[Sequelize.col('Payslip.payslip_id'), 'payslipId'],
			[Sequelize.col('Payslip.employee_id'), 'employeeId'],
			[Sequelize.col('Payslip.pay_period_start'), 'payPeriodStart'],
			[Sequelize.col('Payslip.pay_period_end'), 'payPeriodEnd'],
			[Sequelize.col('Payslip.gross_salary'), 'grossSalary'],
			[Sequelize.col('Payslip.net_salary'), 'netSalary'],
			[Sequelize.col('Payslip.deductions_amount'), 'deductionsAmount'],
			[Sequelize.col('Payslip.allowances_amount'), 'allowancesAmount'],
			[Sequelize.col('Payslip.pdf_url'), 'pdfUrl'],
			[Sequelize.col('Payslip.generated_by'), 'generatedBy'],
			[Sequelize.col('Payslip.created_at'), 'createdAt'],
			[Sequelize.col('Payslip.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		include: [
			{
				model: Employee,
				as: 'employee',
			},
		],
		offset: Number(curPage) * Number(pageSize),
		limit: Number(pageSize),
	});

	const plainRows = rows.map((row) => row.get({ plain: true }));
	return {data: plainRows, meta: { total: count, page: curPage, pageSize } };
};

export const addPayslip = async (payload: CreatePayslipInput): Promise<any> => {
	// Prepare payload data and add properties

	const payslipDefaultPayload = {
			payPeriodStart: payload.payPeriodStart ?? new Date(),
			payPeriodEnd: payload.payPeriodEnd ?? new Date()
	};
	const payslip = await Payslip.create({...payload, ...payslipDefaultPayload});

	return payslip.get({ plain: true });
};

export const editPayslip = async (params: any): Promise<Payslip | { errorCode: string, message: string }> => {
	// Initialize filters and include relationships
	let where: any = {};
	const include: any[] = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const payslip = await Payslip.findOne({
		attributes: [
// employeeId, payPeriodStart, payPeriodEnd, grossSalary, netSalary, deductionsAmount, allowancesAmount, pdfUrl
			[Sequelize.col('Payslip.employee_id'), 'employeeId'],
			[Sequelize.col('Payslip.pay_period_start'), 'payPeriodStart'],
			[Sequelize.col('Payslip.pay_period_end'), 'payPeriodEnd'],
			[Sequelize.col('Payslip.gross_salary'), 'grossSalary'],
			[Sequelize.col('Payslip.net_salary'), 'netSalary'],
			[Sequelize.col('Payslip.deductions_amount'), 'deductionsAmount'],
			[Sequelize.col('Payslip.allowances_amount'), 'allowancesAmount'],
			[Sequelize.col('Payslip.pdf_url'), 'pdfUrl'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			payslipId: params.payslipId,
			...where,
		},
		include: [...include],
	});

	if (!payslip) {
		return { errorCode: 'INVALID_PAYSLIP_ID', message: 'Invalid payslip ID' };
	}

	const payslipData = payslip.get({ plain: true });
	return convertStringFieldsToNumbers(payslipData, ['grossSalary', 'netSalary', 'deductionsAmount', 'allowancesAmount']) as Payslip;
};

export const updatePayslip = async (params: any, payload: UpdatePayslipInput): Promise<any> => {
	let where: any = {};

	const payslip = await Payslip.findOne({
		where: {
			payslipId: params.payslipId,
			...where,
		},
	});

	if (!payslip) {
		return { errorCode: 'INVALID_PAYSLIP_ID', message: 'Invalid payslip ID' };
	}

	await payslip.update(payload);

	return {
		message: 'Payslip updated successfully',
		data: payslip.get({ plain: true }),
	};
};

export const getPayslip = async (params: any): Promise<any> => {
	let where: any = {};
	const include: any[] = [
		{
			model: Employee,
			as: 'employee',
		},
	];

	const payslip = await Payslip.findOne({
		attributes: [
// payslipId, employeeId, payPeriodStart, payPeriodEnd, grossSalary, netSalary, deductionsAmount, allowancesAmount, pdfUrl, generatedById, createdAt, updatedAt
			[Sequelize.col('Payslip.payslip_id'), 'payslipId'],
			[Sequelize.col('Payslip.employee_id'), 'employeeId'],
			[Sequelize.col('Payslip.pay_period_start'), 'payPeriodStart'],
			[Sequelize.col('Payslip.pay_period_end'), 'payPeriodEnd'],
			[Sequelize.col('Payslip.gross_salary'), 'grossSalary'],
			[Sequelize.col('Payslip.net_salary'), 'netSalary'],
			[Sequelize.col('Payslip.deductions_amount'), 'deductionsAmount'],
			[Sequelize.col('Payslip.allowances_amount'), 'allowancesAmount'],
			[Sequelize.col('Payslip.pdf_url'), 'pdfUrl'],
			[Sequelize.col('Payslip.generated_by'), 'generatedBy'],
			[Sequelize.col('Payslip.created_at'), 'createdAt'],
			[Sequelize.col('Payslip.updated_at'), 'updatedAt'],
			[Sequelize.col('employee.first_name'), 'firstName'],
			[Sequelize.col('employee.last_name'), 'lastName'],
		],
		where: {
			payslipId: params.payslipId,
			...where,
		},
		include: [...include],
	});

	if (!payslip) {
		return { errorCode: 'INVALID_PAYSLIP_ID', message: 'Invalid payslip ID' };
	}

	return {
		data: payslip.get({ plain: true }),
	};
};

export const deletePayslip = async (params: any): Promise<any> => {
	let where: any = {};

	const payslip = await Payslip.findOne({
		where: {
			payslipId: params.payslipId,
			...where,
		},
	});

	if (!payslip) {
		return { errorCode: 'INVALID_PAYSLIP_ID', message: 'Invalid payslip ID' };
	}

	await payslip.destroy();

	return { messageCode: 'PAYSLIP_DELETED_SUCCESSFULLY',  message: 'payslip Deleted Successfully' };
};

