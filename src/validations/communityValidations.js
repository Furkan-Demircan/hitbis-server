import { z } from "zod";

export const createCommunityValidation = z.object({
	name: z.string().min(1).max(100),
	description: z.string().optional(),
	isPublic: z.boolean(),
	countryId: z.string(),
	cityId: z.string(),
});
