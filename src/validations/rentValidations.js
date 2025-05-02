import { z } from "zod";

export const bikeRentalValidation = z.object({
    slotCode: z
        .string()
        .length(6, { message: "Slot code must be 6 characters long" }),
});
