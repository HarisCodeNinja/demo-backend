import { z } from "zod";
import { Op } from "sequelize";
import { OfferLetter } from "./model";

export const offerLetterQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const offerLetterParamValidator = z.object({
	offerLetterId: z.uuid("Invalid UUID format"),
});


export const createOfferLetterPayloadValidator = z.object({
	candidateId: z.uuid("Invalid UUID format"),
	jobOpeningId: z.uuid("Invalid UUID format"),
	salaryOffered: z.number({error: "Salary Offered is required"}),
	joiningDate: z.date({error: "Joining Date is required"}),
	termsAndCondition: z.string().nullish().or(z.literal('')),
	status: z.string({error: "Status is required"}),
	approvedBy: z.any().nullish(),
});


export const updateOfferLetterPayloadValidator = (offerLetterId: string) => z.object({
	candidateId: z.uuid("Invalid UUID format"),
	jobOpeningId: z.uuid("Invalid UUID format"),
	salaryOffered: z.number({error: "Salary Offered is required"}),
	joiningDate: z.date({error: "Joining Date is required"}),
	termsAndCondition: z.string().nullish().or(z.literal('')),
	status: z.string({error: "Status is required"}),
	approvedBy: z.any().nullish(),
});


