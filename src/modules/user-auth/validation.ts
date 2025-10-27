import { z } from "zod";
import { Op } from "sequelize";
import { User } from "../user/model";

export const userLoginValidation = z.object({
	email: z.email("Invalid email format"),
	password: z.string({error: "Password is required"}).min(1, "Password is required"),
});


export const userRegisterValidation = z.object({
	email: z.email("Invalid email format").refine(async (value) => {
				const existingUser = await User.findOne({ where: { email: value } });
				return !existingUser;
			}, "Email already exists"),
	username: z.string({error: "Username is required"}).refine(async (value) => {
				const existingUser = await User.findOne({ where: { username: value } });
				return !existingUser;
			}, "Username already exists"),
	password: z.string({error: "Password is required"}).min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});


export const userProfileUpdateValidation = (userId: string) =>  z.object({
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


export const userForgotPasswordValidation = z.object({
  email: z.string().email().describe('User email address')
});

export const userResetPasswordValidation = z.object({
  token: z.string().describe('Password reset token'),
  newPassword: z.string({error: "Password is required"}).min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character").describe('New password')
});

export const userChangePasswordValidation = z.object({
  currentPassword: z.string().describe('Current password'),
  newPassword: z.string({error: "Password is required"}).min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character").describe('New password')
});

export const userParamValidator = z.object({
	userId: z.uuid("Invalid UUID format"),
});
