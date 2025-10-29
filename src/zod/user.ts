import { z } from "zod";

export const zUpdateMeInput = z.object({
  name: z.string().min(4).optional(),
  email: z.string().email().optional(),
  image: z.string().optional().nullable(),
});

export const zGetAllUserInput = z.object({
  limit: z.number().default(10),
  page: z.number().default(1),
  query: z.string().optional(),
});
