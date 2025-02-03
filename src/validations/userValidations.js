import { z } from "zod";

export const createUserValidation = z.object({
	name: z.string().min(1).max(100),
	email: z.string().email(),
	password: z.string().min(2).max(100),
	username: z.string().min(5).max(31),
	surname: z.string().min(1).max(100),
});

export const loginValidation = z.object({
	email: z.string().email(),
	password: z.string().min(2).max(100),
});

export const editUserValidation = z.object({
	name: z.string().min(1).max(100).optional(),
	email: z.string().email().optional(),
	username: z.string().min(5).max(31).optional(),
	surname: z.string().min(1).max(100).optional(),
	birthDate: z.string().date().optional(),
	height: z.string().min().max().optional(),
	weigth: z.string().min().max().optional(),
});

export const resetPasswordValidation = z.object({
	oldPassword: z.string().min(1).max(),
	newPassword: z.string().min(1).max(),
});
