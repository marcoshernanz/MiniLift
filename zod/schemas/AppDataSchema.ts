import { z } from "zod";
import { BodyweightSchema } from "./BodyweightSchema";
import { ExerciseSchema } from "./ExerciseSchema";
import { LiftLogSchema } from "./LiftLogSchema";

export const AppDataSchema = z
  .object({
    hasCompletedOnboarding: z.boolean().default(false),
    exercises: z.record(ExerciseSchema).default({}),
    liftLogs: z.array(LiftLogSchema).default([]),
    bodyweightLogs: z.array(BodyweightSchema).default([]),
  })
  .strict()
  .default({
    hasCompletedOnboarding: false,
    exercises: {},
    liftLogs: [],
    bodyweightLogs: [],
  });

export type AppData = z.infer<typeof AppDataSchema>;
