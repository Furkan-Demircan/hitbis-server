import { z } from "zod";

const gpsPointSchema = z.object({
    lat: z.number(),
    lng: z.number(),
    timestamp: z.coerce.date(),
});

const heartRateSchema = z.object({
    bpm: z.number().min(20).max(220),
    timestamp: z.coerce.date(),
});

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
    gpsTrack: z.array(gpsPointSchema).min(2),
    heartRateData: z.array(heartRateSchema).optional(),
});
