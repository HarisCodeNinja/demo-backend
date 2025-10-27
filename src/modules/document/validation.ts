import { z } from "zod";
import { Op } from "sequelize";
import { Document } from "./model";

export const documentQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const documentParamValidator = z.object({
	documentId: z.uuid("Invalid UUID format"),
});


export const createDocumentPayloadValidator = z.object({
	employeeId: z.uuid("Invalid UUID format"),
	documentType: z.string({error: "Document Type is required"}),
	fileName: z.string({error: "File Name is required"}),
	fileUrl: z.url("Invalid URL format"),
});


export const updateDocumentPayloadValidator = (documentId: string) => z.object({
	employeeId: z.uuid("Invalid UUID format"),
	documentType: z.string({error: "Document Type is required"}),
	fileName: z.string({error: "File Name is required"}),
	fileUrl: z.url("Invalid URL format"),
});


