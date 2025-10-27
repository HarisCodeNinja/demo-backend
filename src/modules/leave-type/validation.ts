import { z } from "zod";
import { Op } from "sequelize";
import { LeaveType } from "./model";

export const leaveTypeQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const leaveTypeParamValidator = z.object({
	leaveTypeId: z.uuid("Invalid UUID format"),
});


export const createLeaveTypePayloadValidator = z.object({
	typeName: z.string({error: "Type Name is required"}).refine(async (value) => {
				const existingLeaveType = await LeaveType.findOne({ where: { typeName: value } });
				return !existingLeaveType;
			}, "TypeName already exists"),
	maxDaysPerYear: z.number().int({error: "Max Days Per Year is required"}),
	isPaid: z.boolean().refine(val => val === true || val === false, "Must be yes or no"),
});


export const updateLeaveTypePayloadValidator = (leaveTypeId: string) => z.object({
	typeName: z.string({error: "Type Name is required"}).refine(async (value) => {
		const existingLeaveType = await LeaveType.findOne({ 
			where: { 
				typeName: value,
				leaveTypeId:  { [Op.ne]: leaveTypeId }
			} 
		});
		return !existingLeaveType;
	}, "TypeName already exists"),
	maxDaysPerYear: z.number().int({error: "Max Days Per Year is required"}),
	isPaid: z.boolean().refine(val => val === true || val === false, "Must be yes or no"),
});


