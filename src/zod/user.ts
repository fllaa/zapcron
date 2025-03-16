import { z } from "zod";

export const zUpdateMeInput = z.object({
  name: z.string().min(4).optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
});
