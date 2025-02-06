import { and, eq, gte, lt, lte } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@zapcron/server/api/trpc";
import { logs } from "@zapcron/server/db/schema";
import { zGetAllLogByJobInput } from "@zapcron/zod/log";

export const logRouter = createTRPCRouter({
  getAllByJob: protectedProcedure
    .input(zGetAllLogByJobInput)
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.logs.findMany({
        where: and(
          eq(logs.jobId, input.jobId),
          input?.cursor ? lt(logs.id, input.cursor) : undefined,
          input?.filter?.startDate
            ? gte(logs.createdAt, new Date(input.filter.startDate))
            : undefined,
          input?.filter?.endDate
            ? lte(logs.createdAt, new Date(input.filter.endDate))
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
