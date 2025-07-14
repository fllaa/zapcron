import { createTRPCRouter, protectedProcedure } from "@zapcron/server/api/trpc";
import { logs } from "@zapcron/server/db/schema";
import { zGetAllLogByJobInput } from "@zapcron/zod/log";
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
});
