import parser from "cron-parser";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@bolabali/server/api/trpc";
import { jobs } from "@bolabali/server/db/schema";
import { eq } from "drizzle-orm";
import {
  zCreateJobInput,
  zGetAllJobInput,
  zGetJobInput,
} from "@bolabali/zod/job";

export const jobRouter = createTRPCRouter({
  create: protectedProcedure
    .input(zCreateJobInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(jobs).values({
        name: input.name,
        description: input.description,
        cronspec: input.cronspec,
        url: input.url,
        method: input.method,
        headers: input.headers,
        body: input.body,
        executeAt: parser.parseExpression(input.cronspec).next().toDate(),
        createdById: ctx.session.user.id,
      });
    }),

  getAll: protectedProcedure
    .input(zGetAllJobInput)
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.jobs.findMany({
        orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
      });
    }),

  get: protectedProcedure.input(zGetJobInput).query(async ({ ctx, input }) => {
    return await ctx.db.query.jobs.findFirst({
      where: eq(jobs.id, input.id),
      with: {
        logs: true,
      },
    });
  }),
});
