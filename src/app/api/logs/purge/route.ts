import { env } from "@zapcron/env";
import { db } from "@zapcron/server/db";
import {
  getLogRetentionCutoffDate,
  purgeExpiredLogs,
} from "@zapcron/server/logs/retention";

export const POST = async (request: Request) => {
  if (!env.LOG_RETENTION_CRON_SECRET) {
    return Response.json(
      { error: "Log retention cron is not configured" },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  const cronSecret = request.headers.get("x-log-retention-secret");

  if (
    bearerToken !== env.LOG_RETENTION_CRON_SECRET &&
    cronSecret !== env.LOG_RETENTION_CRON_SECRET
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await purgeExpiredLogs(db);
  const cutoffDate = getLogRetentionCutoffDate();

  return Response.json({
    success: true,
    ...result,
    cutoffDate: cutoffDate?.toISOString() ?? null,
  });
};
