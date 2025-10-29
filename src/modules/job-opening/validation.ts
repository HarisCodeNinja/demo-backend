import { z } from "zod";
import { Op } from "sequelize";
import { JobOpening } from "./model";

export const jobOpeningQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const jobOpeningParamValidator = z.object({
	jobOpeningId: z.uuid("Invalid UUID format"),
});


export const createJobOpeningPayloadValidator = z.object({
	title: z.string({error: "Title is required"}),
	description: z.string({error: "Description is required"}),
	departmentId: z.uuid("Invalid UUID format"),
	designationId: z.uuid("Invalid UUID format"),
	locationId: z.uuid("Invalid UUID format"),
	requiredExperience: z.number().int({error: "Required Experience is required"}),
	status: z.string({error: "Status is required"}),
	publishedAt: z.coerce.date().nullish(),
	closedAt: z.coerce.date().nullish(),
});


export const updateJobOpeningPayloadValidator = (jobOpeningId: string) => z.object({
	title: z.string({error: "Title is required"}),
	description: z.string({error: "Description is required"}),
	departmentId: z.uuid("Invalid UUID format"),
	designationId: z.uuid("Invalid UUID format"),
	locationId: z.uuid("Invalid UUID format"),
	requiredExperience: z.number().int({error: "Required Experience is required"}),
	status: z.string({error: "Status is required"}),
	publishedAt: z.coerce.date().nullish(),
	closedAt: z.coerce.date().nullish(),
});


