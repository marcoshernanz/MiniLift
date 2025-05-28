import { z } from "zod";
import { ExerciseSchema } from "./ExerciseSchema";
import { LiftLogSchema } from "./LiftLogSchema";
import { WeightSchema } from "./WeightSchema";

export const AppDataSchema = z
  .object({
    hasCompletedOnboarding: z.boolean().default(false),
    exercises: z.record(ExerciseSchema).default({}),
    liftLogs: z.array(LiftLogSchema).default([]),
    weightLogs: z.array(WeightSchema).default([]),
  })
  .strict()
  .default({
    hasCompletedOnboarding: false,
    exercises: {},
    liftLogs: [],
    weightLogs: [],
  });

export type AppData = z.infer<typeof AppDataSchema>;
