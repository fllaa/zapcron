import { createTRPCRouter, protectedProcedure } from "@zapcron/server/api/trpc";
import { users } from "@zapcron/server/db/schema";
import { dataUrlToFile } from "@zapcron/utils/file";
import { zUpdateMeInput } from "@zapcron/zod/user";
import { eq } from "drizzle-orm";
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
});
