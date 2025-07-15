import { createTRPCRouter, publicProcedure } from "@zapcron/server/api/trpc";

export const systemRouter = createTRPCRouter({
  get: publicProcedure.query(() => {
    return {
      version: process.env.VERSION ?? "unknown",
      environment: process.env.NODE_ENV ?? "development",
      commitSha: process.env.COMMIT_SHA ?? "latest",
    };
  }),
});
