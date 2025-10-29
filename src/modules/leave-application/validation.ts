import { z } from "zod";
import { Op } from "sequelize";
import { LeaveApplication } from "./model";

export const leaveApplicationQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const leaveApplicationParamValidator = z.object({
	leaveApplicationId: z.uuid("Invalid UUID format"),
});


export const createLeaveApplicationPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	leaveTypeId: z.uuid("Invalid UUID format"),
	startDate: z.coerce.date({error: "Start Date is required"}),
	endDate: z.coerce.date({error: "End Date is required"}),
	reason: z.string({error: "Reason is required"}),
	status: z.string({error: "Status is required"}),
	approvedBy: z.any().nullish(),
});


export const updateLeaveApplicationPayloadValidator = (leaveApplicationId: string) => z.object({
	employeeId: z.uuid("Invalid UUID format"),
	leaveTypeId: z.uuid("Invalid UUID format"),
	startDate: z.coerce.date({error: "Start Date is required"}),
	endDate: z.coerce.date({error: "End Date is required"}),
	reason: z.string({error: "Reason is required"}),
	status: z.string({error: "Status is required"}),
	approvedBy: z.any().nullish(),
});


