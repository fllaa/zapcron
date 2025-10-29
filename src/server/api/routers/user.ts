import {
  createTRPCRouter,
  privilegedProcedure,
  protectedProcedure,
} from "@zapcron/server/api/trpc";
import { users } from "@zapcron/server/db/schema";
import { dataUrlToFile } from "@zapcron/utils/file";
import { zGetAllUserInput, zUpdateMeInput } from "@zapcron/zod/user";
import { count, eq, ilike, or } from "drizzle-orm";
import { v4 } from "uuid";

export const userRouter = createTRPCRouter({
  updateMe: protectedProcedure
    .input(zUpdateMeInput)
    .mutation(async ({ ctx, input }) => {
      if (input.image) {
        const file = await dataUrlToFile(
          input.image,
          `${v4()}.png`,
          "image/png",
        );
        const { url } = await ctx.s3.uploadFile(file);
        input.image = url;
      }
      await ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.session.user.id));
    }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });
  }),

  getAll: privilegedProcedure
    .input(zGetAllUserInput)
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.query.users.findMany({
        orderBy: (users, { asc }) => [asc(users.name)],
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
        where: input.query
          ? or(
              ilike(users.name, `%${input.query}%`),
              ilike(users.email, `%${input.query}%`),
            )
          : undefined,
      });
      const total =
        (
          await ctx.db
            .select({ count: count() })
            .from(users)
            .where(
              input.query
                ? or(
                    ilike(users.name, `%${input.query}%`),
                    ilike(users.email, `%${input.query}%`),
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
});
