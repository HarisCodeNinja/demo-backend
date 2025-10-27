import { z } from "zod";
import { Op } from "sequelize";
import { JobOpeningSkill } from "./model";

export const jobOpeningSkillQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const jobOpeningSkillParamValidator = z.object({
	jobOpeningSkillId: z.uuid("Invalid UUID format"),
});


export const createJobOpeningSkillPayloadValidator = z.object({
	jobOpeningId: z.uuid("Invalid UUID format"),
	skillId: z.uuid("Invalid UUID format"),
	requiredLevel: z.string().nullish(),
});


export const updateJobOpeningSkillPayloadValidator = (jobOpeningSkillId: string) => z.object({
	jobOpeningId: z.uuid("Invalid UUID format"),
	skillId: z.uuid("Invalid UUID format"),
	requiredLevel: z.string().nullish(),
});


