import { z } from "zod";

export const createEventValidation = z.object({
    title: z.string().min(5).max(100),
    description: z.string().optional(),
    startDate: z.coerce.date(),
    location: z.object({
        latitude: z.string(),
        longitude: z.string(),
    }),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    isActive: z.boolean().optional(),
    isPublic: z.boolean().optional(),
});
