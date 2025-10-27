import { z } from "zod";
import { Op } from "sequelize";
import { Attendance } from "./model";

export const attendanceQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const attendanceParamValidator = z.object({
	attendanceId: z.uuid("Invalid UUID format"),
});


export const createAttendancePayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	attendanceDate: z.date({error: "Attendance Date is required"}),
	checkInTime: z.date({error: "Check In Time is required"}),
	checkOutTime: z.date().nullish(),
	status: z.string({error: "Status is required"}),
});


export const updateAttendancePayloadValidator = (attendanceId: string) => z.object({
	employeeId: z.uuid("Invalid UUID format"),
	attendanceDate: z.date({error: "Attendance Date is required"}),
	checkInTime: z.date({error: "Check In Time is required"}),
	checkOutTime: z.date().nullish(),
	status: z.string({error: "Status is required"}),
});


