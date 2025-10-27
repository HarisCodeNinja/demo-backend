import { z } from "zod";
import { Op } from "sequelize";
import { Candidate } from "./model";

export const candidateQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const candidateParamValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
});


export const createCandidatePayloadValidator = z.object({
	firstName: z.string({error: "First Name is required"}),
	lastName: z.string({error: "Last Name is required"}),
	email: z.email("Invalid email format").refine(async (value) => {
				const existingCandidate = await Candidate.findOne({ where: { email: value } });
				return !existingCandidate;
			}, "Email already exists"),
	phoneNumber: z.string().nullish().or(z.literal('')),
	resumeText: z.string().nullish().or(z.literal('')),
	source: z.string().nullish().or(z.literal('')),
	currentStatus: z.string({error: "Current Status is required"}),
	jobOpeningId: z.uuid("Invalid UUID format").nullish(),
	referredByEmployeeId: z.uuid("Invalid UUID format").nullish(),
});


export const updateCandidatePayloadValidator = (candidateId: string) => z.object({
	firstName: z.string({error: "First Name is required"}),
	lastName: z.string({error: "Last Name is required"}),
	email: z.email("Invalid email format").refine(async (value) => {
		const existingCandidate = await Candidate.findOne({ 
			where: { 
				email: value,
				candidateId:  { [Op.ne]: candidateId }
			} 
		});
		return !existingCandidate;
	}, "Email already exists"),
	phoneNumber: z.string().nullish().or(z.literal('')),
	resumeText: z.string().nullish().or(z.literal('')),
	source: z.string().nullish().or(z.literal('')),
	currentStatus: z.string({error: "Current Status is required"}),
	jobOpeningId: z.uuid("Invalid UUID format").nullish(),
	referredByEmployeeId: z.uuid("Invalid UUID format").nullish(),
});


