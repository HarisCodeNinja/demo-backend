import { z } from "zod";
import { Op } from "sequelize";
import { RoleCompetency } from "./model";

export const roleCompetencyQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const roleCompetencyParamValidator = z.object({
	roleCompetencyId: z.uuid("Invalid UUID format"),
});


export const createRoleCompetencyPayloadValidator = z.object({
	designationId: z.uuid("Invalid UUID format"),
	competencyId: z.uuid("Invalid UUID format"),
	requiredProficiency: z.string().nullish(),
});


export const updateRoleCompetencyPayloadValidator = (roleCompetencyId: string) => z.object({
	designationId: z.uuid("Invalid UUID format"),
	competencyId: z.uuid("Invalid UUID format"),
	requiredProficiency: z.string().nullish(),
});


