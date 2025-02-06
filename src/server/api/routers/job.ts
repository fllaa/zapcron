import parser from "cron-parser";
import { count, eq, ilike, or } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@zapcron/server/api/trpc";
import { jobs } from "@zapcron/server/db/schema";
import {
  zBulkCreateJobInput,
  zCreateJobInput,
  zGetAllJobInput,
  zGetJobInput,
  zUpdateJobInput,
} from "@zapcron/zod/job";

export const jobRouter = createTRPCRouter({
  bulkCreate: protectedProcedure
    .input(zBulkCreateJobInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(jobs).values(
        input.map((job) => ({
          ...job,
          executeAt: parser.parseExpression(job.cronspec).next().toDate(),
          createdById: ctx.session.user.id,
        })),
      );
    }),

  create: protectedProcedure
    .input(zCreateJobInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(jobs).values({
        name: input.name,
        description: input.description,
        isEnabled: input.isEnabled,
        cronspec: input.cronspec,
        url: input.url,
        method: input.method,
        headers: input.headers,
        body: input.body,
        executeAt: parser.parseExpression(input.cronspec).next().toDate(),
        createdById: ctx.session.user.id,
      });
    }),

  update: protectedProcedure
    .input(zUpdateJobInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(jobs)
        .set({
          ...input,
          executeAt: parser.parseExpression(input.cronspec).next().toDate(),
        })
        .where(eq(jobs.id, input.id));
    }),

  delete: protectedProcedure
    .input(zGetJobInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(jobs).where(eq(jobs.id, input.id));
    }),

  executeNow: protectedProcedure
    .input(zGetJobInput)
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.db.query.jobs.findFirst({
        where: eq(jobs.id, input.id),
      });
      if (!job) {
        throw new Error("Job not found");
      }
      await ctx.queue.add("execute", {
        ...job,
        triggeredBy: ctx.session.user.id,
      });
    }),

  getAll: protectedProcedure
    .input(zGetAllJobInput)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.jobs.findMany({
        columns: {
          id: true,
          name: true,
          isEnabled: true,
          cronspec: true,
          url: true,
          executeAt: true,
        },
        orderBy: (jobs, { desc }) => [
          desc(jobs.isEnabled),
          desc(jobs.createdAt),
        ],
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
        where: input.query
          ? or(
              ilike(jobs.name, `%${input.query}%`),
              ilike(jobs.description, `%${input.query}%`),
              ilike(jobs.url, `%${input.query}%`),
            )
          : undefined,
        with: {
          logs: {
            columns: {
              status: true,
            },
            orderBy: (logs, { desc }) => [desc(logs.createdAt)],
            limit: 5,
          },
        },
      });
      const total =
        (
          await ctx.db
            .select({ count: count() })
            .from(jobs)
            .where(
              input.query
                ? or(
                    ilike(jobs.name, `%${input.query}%`),
                    ilike(jobs.description, `%${input.query}%`),
                    ilike(jobs.url, `%${input.query}%`),
                  )
                : undefined,
            )
        )[0]?.count ?? 0;
      return {
        data,
        _meta: {
          total,
          page: input.page,
          limit: input.limit,
          totalPages: Math.ceil(total / input.limit),
        },
      };
    }),

  get: protectedProcedure.input(zGetJobInput).query(async ({ ctx, input }) => {
    return await ctx.db.query.jobs.findFirst({
      where: eq(jobs.id, input.id),
      with: {
        logs: {
          orderBy: (logs, { desc }) => [desc(logs.createdAt)],
          limit: 10,
          with: {
            createdBy: {
              columns: {
                name: true,
              },
            },
          },
        },
        createdBy: {
          columns: {
            name: true,
          },
        },
      },
    });
  }),
});
