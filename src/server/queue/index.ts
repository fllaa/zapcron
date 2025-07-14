import { env } from "@zapcron/env";
import { Queue } from "bullmq";
import IORedis from "ioredis";

/**
 * Cache the redis connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  redisConn: IORedis | undefined;
};

const redisConn =
  globalForDb.redisConn ??
  new IORedis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
    maxRetriesPerRequest: null,
  });
if (env.NODE_ENV !== "production") globalForDb.redisConn = redisConn;

export const queue = new Queue("jobs", { connection: redisConn });
