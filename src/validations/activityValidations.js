import { z } from "zod";

export const createActivityValidation = z.object({
    routeId: z.string().optional(),
    startTime: z.coerce.date(),
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    endTime: z.coerce.date(),
    duration: z.number().min(1),
    distance: z.number().min(0),
    avgSpeed: z.number().min(0),
    elevationGain: z.number().min(0),
    burnedCalories: z.number().min(0).optional(),
});
