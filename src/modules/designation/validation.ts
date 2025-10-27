import { z } from "zod";
import { Op } from "sequelize";
import { Designation } from "./model";

export const designationQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const designationParamValidator = z.object({
	designationId: z.uuid("Invalid UUID format"),
});


export const createDesignationPayloadValidator = z.object({
	designationName: z.string({error: "Designation Name is required"}).refine(async (value) => {
				const existingDesignation = await Designation.findOne({ where: { designationName: value } });
				return !existingDesignation;
			}, "DesignationName already exists"),
});


export const updateDesignationPayloadValidator = (designationId: string) => z.object({
	designationName: z.string({error: "Designation Name is required"}).refine(async (value) => {
		const existingDesignation = await Designation.findOne({ 
			where: { 
				designationName: value,
				designationId:  { [Op.ne]: designationId }
			} 
		});
		return !existingDesignation;
	}, "DesignationName already exists"),
});


