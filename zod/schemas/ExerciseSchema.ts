import { z } from "zod";

export const ExerciseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1),
    isFavorite: z.boolean().default(false),
  })
  .strict();

export type Exercise = z.infer<typeof ExerciseSchema>;
