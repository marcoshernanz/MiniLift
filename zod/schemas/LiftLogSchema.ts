import { z } from "zod";
import { ExerciseSchema } from "./ExerciseSchema";

export const LiftLogSchema = z
  .object({
    id: z.string().uuid(),
    date: z.coerce.date(),
    reps: z.number().int().min(1),
    weight: z.number().nonnegative(),
    exercise: ExerciseSchema,
  })
  .strict();
