import { jobRouter } from "@zapcron/server/api/routers/job";
import { logRouter } from "@zapcron/server/api/routers/log";
import { postRouter } from "@zapcron/server/api/routers/post";
import {
  createCallerFactory,
  createTRPCRouter,
} from "@zapcron/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  job: jobRouter,
  log: logRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
