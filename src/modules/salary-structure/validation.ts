import { z } from "zod";
import { Op } from "sequelize";
import { SalaryStructure } from "./model";

export const salaryStructureQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const salaryStructureParamValidator = z.object({
	salaryStructureId: z.uuid("Invalid UUID format"),
});


export const createSalaryStructurePayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	basicSalary: z.number({error: "Basic Salary is required"}),
	allowance: z.any().nullish(),
	deduction: z.any().nullish(),
	effectiveDate: z.coerce.date({error: "Effective Date is required"}),
	status: z.string({error: "Status is required"}),
});


export const updateSalaryStructurePayloadValidator = (salaryStructureId: string) => z.object({
	employeeId: z.uuid("Invalid UUID format"),
	basicSalary: z.number({error: "Basic Salary is required"}),
	allowance: z.any().nullish(),
	deduction: z.any().nullish(),
	effectiveDate: z.coerce.date({error: "Effective Date is required"}),
	status: z.string({error: "Status is required"}),
});


