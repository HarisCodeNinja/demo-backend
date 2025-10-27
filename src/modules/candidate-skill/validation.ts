import { z } from "zod";
import { Op } from "sequelize";
import { CandidateSkill } from "./model";

export const candidateSkillQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const candidateSkillParamValidator = z.object({
	candidateSkillId: z.uuid("Invalid UUID format"),
});


export const createCandidateSkillPayloadValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
	skillId: z.uuid("Invalid UUID format"),
	proficiency: z.string().nullish(),
});


export const updateCandidateSkillPayloadValidator = (candidateSkillId: string) => z.object({
	candidateId: z.uuid("Invalid UUID format"),
	skillId: z.uuid("Invalid UUID format"),
	proficiency: z.string().nullish(),
});


