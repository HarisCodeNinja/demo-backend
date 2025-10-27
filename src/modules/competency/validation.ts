import { z } from "zod";
import { Op } from "sequelize";
import { Competency } from "./model";

export const competencyQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const competencyParamValidator = z.object({
	competencyId: z.uuid("Invalid UUID format"),
});


export const createCompetencyPayloadValidator = z.object({
	competencyName: z.string({error: "Competency Name is required"}).refine(async (value) => {
				const existingCompetency = await Competency.findOne({ where: { competencyName: value } });
				return !existingCompetency;
			}, "CompetencyName already exists"),
	description: z.string().nullish().or(z.literal('')),
});


export const updateCompetencyPayloadValidator = (competencyId: string) => z.object({
	competencyName: z.string({error: "Competency Name is required"}).refine(async (value) => {
		const existingCompetency = await Competency.findOne({ 
			where: { 
				competencyName: value,
				competencyId:  { [Op.ne]: competencyId }
			} 
		});
		return !existingCompetency;
	}, "CompetencyName already exists"),
	description: z.string().nullish().or(z.literal('')),
});


