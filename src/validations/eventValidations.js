import { z } from "zod";

export const createEventValidation = z.object({
    title: z.string().min(5).max(100),
    description: z.string().optional(),
    startDate: z.string(),
    location: z.object({
        longitude: z.string(),
        altitude: z.string(),
    }),
    isActive: z.boolean(),
    isPublic: z.boolean(),
});
