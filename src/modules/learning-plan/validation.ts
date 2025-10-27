import { z } from "zod";
import { Op } from "sequelize";
import { LearningPlan } from "./model";

export const learningPlanQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const learningPlanParamValidator = z.object({
	learningPlanId: z.uuid("Invalid UUID format"),
});


export const createLearningPlanPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	title: z.string({error: "Title is required"}),
	description: z.string().nullish().or(z.literal('')),
	startDate: z.date({error: "Start Date is required"}),
	endDate: z.date({error: "End Date is required"}),
	status: z.string({error: "Status is required"}),
});


export const updateLearningPlanPayloadValidator = (learningPlanId: string) => z.object({
	employeeId: z.uuid("Invalid UUID format"),
	title: z.string({error: "Title is required"}),
	description: z.string().nullish().or(z.literal('')),
	startDate: z.date({error: "Start Date is required"}),
	endDate: z.date({error: "End Date is required"}),
	status: z.string({error: "Status is required"}),
});


