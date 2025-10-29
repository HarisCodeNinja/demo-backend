import { z } from "zod";
import { Op } from "sequelize";
import { Interview } from "./model";

export const interviewQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const interviewParamValidator = z.object({
	interviewId: z.uuid("Invalid UUID format"),
});


export const createInterviewPayloadValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
	jobOpeningId: z.uuid("Invalid UUID format"),
	interviewerId: z.uuid("Invalid UUID format"),
	interviewDate: z.coerce.date({error: "Interview Date is required"}),
	feedback: z.string().nullish().or(z.literal('')),
	rating: z.number().int().nullish(),
	status: z.string({error: "Status is required"}),
});


export const updateInterviewPayloadValidator = (interviewId: string) => z.object({
	candidateId: z.uuid("Invalid UUID format"),
	jobOpeningId: z.uuid("Invalid UUID format"),
	interviewerId: z.uuid("Invalid UUID format"),
	interviewDate: z.coerce.date({error: "Interview Date is required"}),
	feedback: z.string().nullish().or(z.literal('')),
	rating: z.number().int().nullish(),
	status: z.string({error: "Status is required"}),
});


