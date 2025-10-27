import { z } from "zod";
import { Op } from "sequelize";
import { AuditLog } from "./model";

export const auditLogQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const auditLogParamValidator = z.object({
	auditLogId: z.uuid("Invalid UUID format"),
});


export const createAuditLogPayloadValidator = z.object({
	userId: z.uuid("Invalid UUID format"),
	action: z.string({error: "Action is required"}),
	tableName: z.string({error: "Table Name is required"}),
	recordId: z.string({error: "Record Id is required"}),
	oldValue: z.any().nullish(),
	newValue: z.any().nullish(),
});


export const updateAuditLogPayloadValidator = (auditLogId: string) => z.object({
	userId: z.uuid("Invalid UUID format"),
	action: z.string({error: "Action is required"}),
	tableName: z.string({error: "Table Name is required"}),
	recordId: z.string({error: "Record Id is required"}),
	oldValue: z.any().nullish(),
	newValue: z.any().nullish(),
});


