import { z } from "zod";

export const zGetAllLogByJobInput = z.object({
  jobId: z.number(),
  cursor: z.optional(z.number()).nullable(),
  filter: z
    .object({
      startDate: z.optional(z.string()),
      endDate: z.optional(z.string()),
    })
    .optional(),
});

export const zClearLog = z.object({
  startDate: z.optional(z.string()),
  endDate: z.optional(z.string()),
});
