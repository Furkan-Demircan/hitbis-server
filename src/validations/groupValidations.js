import { z } from "zod";

export const createGroupValidation = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    isPublic: z.boolean(),
    countryId: z.string(),
    cityId: z.string(),
});

export const updateGroupValidation = z.object({
    name: z.string().min(3).max(50).optional(),
    description: z.string().max(300).optional(),
    isPublic: z.boolean().optional(),
    country: z.string().optional(), // eğer country/city string ID ise
    city: z.string().optional(),
});
