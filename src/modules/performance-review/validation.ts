import { z } from "zod";
import { Op } from "sequelize";
import { PerformanceReview } from "./model";

export const performanceReviewQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const performanceReviewParamValidator = z.object({
	performanceReviewId: z.uuid("Invalid UUID format"),
});


export const createPerformanceReviewPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	reviewerId: z.uuid("Invalid UUID format"),
	reviewPeriod: z.string({error: "Review Period is required"}),
	reviewDate: z.coerce.date({error: "Review Date is required"}),
	selfAssessment: z.string().nullish().or(z.literal('')),
	managerFeedback: z.string().nullish().or(z.literal('')),
	overallRating: z.number().int().nullish(),
	recommendation: z.string().nullish().or(z.literal('')),
	status: z.string({error: "Status is required"}),
});


export const updatePerformanceReviewPayloadValidator = (performanceReviewId: string) => z.object({
	employeeId: z.uuid("Invalid UUID format"),
	reviewerId: z.uuid("Invalid UUID format"),
	reviewPeriod: z.string({error: "Review Period is required"}),
	reviewDate: z.coerce.date({error: "Review Date is required"}),
	selfAssessment: z.string().nullish().or(z.literal('')),
	managerFeedback: z.string().nullish().or(z.literal('')),
	overallRating: z.number().int().nullish(),
	recommendation: z.string().nullish().or(z.literal('')),
	status: z.string({error: "Status is required"}),
});


