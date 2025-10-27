import { z } from "zod";
import { Op } from "sequelize";
import { Skill } from "./model";

export const skillQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const skillParamValidator = z.object({
	skillId: z.uuid("Invalid UUID format"),
});


export const createSkillPayloadValidator = z.object({
	skillName: z.string({error: "Skill Name is required"}).refine(async (value) => {
				const existingSkill = await Skill.findOne({ where: { skillName: value } });
				return !existingSkill;
			}, "SkillName already exists"),
});


export const updateSkillPayloadValidator = (skillId: string) => z.object({
	skillName: z.string({error: "Skill Name is required"}).refine(async (value) => {
		const existingSkill = await Skill.findOne({ 
			where: { 
				skillName: value,
				skillId:  { [Op.ne]: skillId }
			} 
		});
		return !existingSkill;
	}, "SkillName already exists"),
});


