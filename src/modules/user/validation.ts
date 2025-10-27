import { z } from "zod";
import { Op } from "sequelize";
import { User } from "./model";

export const userQueryValidator = z.object({
	page: z.coerce.number().optional().nullable(),
	pageSize: z.coerce.number().optional().nullable(),
});


export const userParamValidator = z.object({
	userId: z.uuid("Invalid UUID format"),
});


export const createUserPayloadValidator = z.object({
	email: z.email("Invalid email format").refine(async (value) => {
				const existingUser = await User.findOne({ where: { email: value } });
				return !existingUser;
			}, "Email already exists"),
	username: z.string({error: "Username is required"}).refine(async (value) => {
				const existingUser = await User.findOne({ where: { username: value } });
				return !existingUser;
			}, "Username already exists"),
	password: z.string({error: "Password is required"}),
	role: z.string({error: "Role is required"}),
});


export const updateUserPayloadValidator = (userId: string) => z.object({
	email: z.email("Invalid email format").refine(async (value) => {
		const existingUser = await User.findOne({ 
			where: { 
				email: value,
				userId:  { [Op.ne]: userId }
			} 
		});
		return !existingUser;
	}, "Email already exists"),
	username: z.string({error: "Username is required"}).refine(async (value) => {
		const existingUser = await User.findOne({ 
			where: { 
				username: value,
				userId:  { [Op.ne]: userId }
			} 
		});
		return !existingUser;
	}, "Username already exists"),
	password: z.string({error: "Password is required"}),
	role: z.string({error: "Role is required"}),
});


