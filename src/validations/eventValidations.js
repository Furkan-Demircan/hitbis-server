import { z } from "zod";

export const createEventValidation = z.object({
    title: z.string().min(5).max(100).optional(),
    description: z.string().optional(),
    startDate: z.coerce.date().optional(),
    location: z
        .object({
            latitude: z.string(),
            longitude: z.string(),
        })
        .optional(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
    isActive: z.boolean().optional(),
    isPublic: z.boolean().optional(),
});
