import { HttpMethod } from "@zapcron/constants/http";

import { parseCronValid, parseJSONValid } from "@zapcron/utils/validate-value";
import { z } from "zod";

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
  method: z.enum([
    HttpMethod.GET,
    HttpMethod.POST,
    HttpMethod.PUT,
    HttpMethod.PATCH,
    HttpMethod.DELETE,
  ]),
  headers: z.optional(
    z.array(
      z.object({
        key: z.string().min(1),
        value: z.string().min(1),
      }),
    ),
  ),
  body: z.optional(
    z.string().refine((value) => parseJSONValid(value, { ignoreEmpty: true }), {
      message: "Invalid JSON",
    }),
  ),
});

export const zBulkCreateJobInput = z.array(zCreateJobInput);

export const zUpdateJobInput = z.object({
  id: z.number(),
  name: z.optional(z.string().min(1)),
  description: z.optional(z.string()).nullable(),
  isEnabled: z.optional(z.boolean()),
  cronspec: z
    .string()
    .refine((value) => parseCronValid(value, { ignoreEmpty: true }), {
      message: "Invalid cronspec",
    }),
  url: z.optional(z.string().url()),
  method: z.optional(
    z.enum([
      HttpMethod.GET,
      HttpMethod.POST,
      HttpMethod.PUT,
      HttpMethod.PATCH,
      HttpMethod.DELETE,
    ]),
  ),
  headers: z.optional(
    z.array(
      z.object({
        key: z.string().min(1),
        value: z.string().min(1),
      }),
    ),
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
