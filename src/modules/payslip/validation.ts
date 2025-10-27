import { z } from "zod";
import { Op } from "sequelize";
import { Payslip } from "./model";

export const payslipQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const payslipParamValidator = z.object({
	payslipId: z.uuid("Invalid UUID format"),
});


export const createPayslipPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	payPeriodStart: z.date({error: "Pay Period Start is required"}),
	payPeriodEnd: z.date({error: "Pay Period End is required"}),
	grossSalary: z.number({error: "Gross Salary is required"}),
	netSalary: z.number({error: "Net Salary is required"}),
	deductionsAmount: z.number({error: "Deductions Amount is required"}),
	allowancesAmount: z.number({error: "Allowances Amount is required"}),
	pdfUrl: z.url("Invalid URL format"),
});


export const updatePayslipPayloadValidator = (payslipId: string) => z.object({
	employeeId: z.uuid("Invalid UUID format"),
	payPeriodStart: z.date({error: "Pay Period Start is required"}),
	payPeriodEnd: z.date({error: "Pay Period End is required"}),
	grossSalary: z.number({error: "Gross Salary is required"}),
	netSalary: z.number({error: "Net Salary is required"}),
	deductionsAmount: z.number({error: "Deductions Amount is required"}),
	allowancesAmount: z.number({error: "Allowances Amount is required"}),
	pdfUrl: z.url("Invalid URL format"),
});


