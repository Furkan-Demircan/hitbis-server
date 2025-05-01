import { z } from "zod";

export const createRouteValidation = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    waypoints: z
        .array(
            z.object({
                lat: z.number(),
                lng: z.number(),
            })
        )
        .min(2),
    distance: z.number().optional(),
    elevationGain: z.number().optional(),
    isPublic: z.boolean().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    estimatedTime: z.number().optional(),
});

export const updateRouteValidation = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    waypoints: z
        .array(
            z.object({
                lat: z.number(),
                lng: z.number(),
            })
        )
        .min(2)
        .optional(),
    distance: z.number().optional(),
    elevationGain: z.number().optional(),
    isPublic: z.boolean().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    estimatedTime: z.number().optional(),
});
