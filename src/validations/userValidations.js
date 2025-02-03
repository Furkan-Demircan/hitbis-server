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
