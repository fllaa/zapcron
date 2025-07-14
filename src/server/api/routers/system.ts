import { createTRPCRouter, publicProcedure } from "@zapcron/server/api/trpc";
import { execSync } from "child_process";

export const systemRouter = createTRPCRouter({
  get: publicProcedure.query(() => {
    const commitSha = execSync("git rev-parse HEAD")
      .toString()
      .trim()
      .slice(0, 7);

    return {
      version: process.env.npm_package_version ?? "unknown",
      environment: process.env.NODE_ENV ?? "development",
      uptime: process.uptime(),
      commitSha,
    };
  }),
});
