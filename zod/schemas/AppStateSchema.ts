import { z } from "zod";

export const AppStateSchema = z.object({
  hasCompletedOnboarding: z.boolean(),
});
