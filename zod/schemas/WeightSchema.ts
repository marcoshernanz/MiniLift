import { z } from "zod";

export const WeightSchema = z
  .object({
    id: z.string().uuid(),
    date: z.coerce.date(),
    weight: z.number().positive(),
  })
  .strict();
