import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { createTRPCRouter, protectedProcedure } from "@zapcron/server/api/trpc";
import { users } from "@zapcron/server/db/schema";
import { zUpdateMeInput } from "@zapcron/zod/user";
import { dataUrlToFile } from "@zapcron/utils/file";

export const userRouter = createTRPCRouter({
  updateMe: protectedProcedure
    .input(zUpdateMeInput)
    .mutation(async ({ ctx, input }) => {
      if (input.image) {
        const file = await dataUrlToFile(
          input.image,
          `${randomUUID()}.png`,
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
