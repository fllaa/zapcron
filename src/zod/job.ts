import { z } from "zod";
import { parseCronValid, parseJSONValid } from "@bolabali/utils/validate-value";

export const zCreateJobInput = z.object({
  name: z.string().min(1),
  description: z.optional(z.string()),
  isEnabled: z.boolean().default(true),
  cronspec: z
    .string()
    .refine((value) => parseCronValid(value, { ignoreEmpty: true }), {
      message: "Invalid cronspec",
    }),
  url: z.string().url(),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  headers: z.optional(
    z.string().refine((value) => parseJSONValid(value, { ignoreEmpty: true }), {
      message: "Invalid JSON",
    }),
  ),
  body: z.optional(
    z.string().refine((value) => parseJSONValid(value, { ignoreEmpty: true }), {
      message: "Invalid JSON",
    }),
  ),
});

export const zUpdateJobInput = z.object({
  id: z.number(),
  name: z.optional(z.string().min(1)),
  description: z.optional(z.string()),
  isEnabled: z.optional(z.boolean()),
  cronspec: z
    .string()
    .refine((value) => parseCronValid(value, { ignoreEmpty: true }), {
      message: "Invalid cronspec",
    }),
  url: z.optional(z.string().url()),
  method: z.optional(z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"])),
  headers: z.optional(
    z.string().refine((value) => parseJSONValid(value, { ignoreEmpty: true }), {
      message: "Invalid JSON",
    }),
  ),
  body: z.optional(
    z.string().refine((value) => parseJSONValid(value, { ignoreEmpty: true }), {
      message: "Invalid JSON",
    }),
  ),
});

export const zGetAllJobInput = z.object({
  limit: z.number().default(10),
  page: z.number().default(1),
  query: z.string().optional(),
});
export const zGetJobInput = z.object({ id: z.number() });
