import { z } from "zod";

export const BodyweightSchema = z
  .object({
    id: z.string().uuid(),
    date: z.coerce.date(),
    bodyweight: z.number().positive(),
  })
  .strict();
