import { z } from "zod";
import { Op } from "sequelize";
import { JobLevel } from "./model";

export const jobLevelQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const jobLevelParamValidator = z.object({
	jobLevelId: z.uuid("Invalid UUID format"),
});


export const createJobLevelPayloadValidator = z.object({
	levelName: z.string({error: "Level Name is required"}).refine(async (value) => {
				const existingJobLevel = await JobLevel.findOne({ where: { levelName: value } });
				return !existingJobLevel;
			}, "LevelName already exists"),
	description: z.string().nullish().or(z.literal('')),
});


export const updateJobLevelPayloadValidator = (jobLevelId: string) => z.object({
	levelName: z.string({error: "Level Name is required"}).refine(async (value) => {
		const existingJobLevel = await JobLevel.findOne({ 
			where: { 
				levelName: value,
				jobLevelId:  { [Op.ne]: jobLevelId }
			} 
		});
		return !existingJobLevel;
	}, "LevelName already exists"),
	description: z.string().nullish().or(z.literal('')),
});


