import { z } from "zod";
import { Op } from "sequelize";
import { Department } from "./model";

export const departmentQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const departmentParamValidator = z.object({
	departmentId: z.uuid("Invalid UUID format"),
});


export const createDepartmentPayloadValidator = z.object({
	departmentName: z.string({error: "Department Name is required"}).refine(async (value) => {
				const existingDepartment = await Department.findOne({ where: { departmentName: value } });
				return !existingDepartment;
			}, "DepartmentName already exists"),
});


export const updateDepartmentPayloadValidator = (departmentId: string) => z.object({
	departmentName: z.string({error: "Department Name is required"}).refine(async (value) => {
		const existingDepartment = await Department.findOne({ 
			where: { 
				departmentName: value,
				departmentId:  { [Op.ne]: departmentId }
			} 
		});
		return !existingDepartment;
	}, "DepartmentName already exists"),
});


