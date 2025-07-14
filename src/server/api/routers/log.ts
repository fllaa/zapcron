import { createTRPCRouter, protectedProcedure } from "@zapcron/server/api/trpc";
import { logs } from "@zapcron/server/db/schema";
import { zClearLog, zGetAllLogByJobInput } from "@zapcron/zod/log";
import { and, eq, gte, lt, lte } from "drizzle-orm";

export const logRouter = createTRPCRouter({
  getAllByJob: protectedProcedure
    .input(zGetAllLogByJobInput)
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.logs.findMany({
        where: and(
          eq(logs.jobId, input.jobId),
          input?.cursor ? lt(logs.id, input.cursor) : undefined,
          // set time to 00:00:00
          input?.filter?.startDate
            ? gte(
                logs.createdAt,
                new Date(`${input.filter.startDate}T00:00:00`),
              )
            : undefined,
          input?.filter?.endDate
            ? // set time to 23:59:59
              lte(logs.createdAt, new Date(`${input.filter.endDate}T23:59:59`))
            : undefined,
        ),
        orderBy: (logs, { desc }) => [desc(logs.createdAt)],
        limit: 20,
        with: {
          createdBy: {
            columns: {
              name: true,
            },
          },
        },
      });
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    let size = "Unknown";
    const total = await ctx.db.$count(logs);
    const sizeResult = await ctx.db.execute(
      "SELECT pg_size_pretty(pg_total_relation_size('zc_log')) AS size",
    );
    const oldest = await ctx.db.query.logs.findFirst({
      orderBy: (logs, { asc }) => [asc(logs.createdAt)],
      columns: {
        createdAt: true,
      },
    });
    const newest = await ctx.db.query.logs.findFirst({
      orderBy: (logs, { desc }) => [desc(logs.createdAt)],
      columns: {
        createdAt: true,
      },
    });
    if (sizeResult.length > 0) {
      size = sizeResult[0]?.size as string;
    }
    return {
      total,
      size,
      oldest: oldest?.createdAt.toISOString(),
      newest: newest?.createdAt.toISOString(),
    };
  }),

  clear: protectedProcedure
    .input(zClearLog)
    .mutation(async ({ ctx, input }) => {
      const whereConditions = [];
      if (input.startDate) {
        whereConditions.push(
          gte(logs.createdAt, new Date(`${input.startDate}T00:00:00`)),
        );
      }
      if (input.endDate) {
        whereConditions.push(
          lte(logs.createdAt, new Date(`${input.endDate}T23:59:59`)),
        );
      }
      await ctx.db
        .delete(logs)
        .where(
          whereConditions.length === 0 ? undefined : and(...whereConditions),
        );
      return { success: true };
    }),
});
