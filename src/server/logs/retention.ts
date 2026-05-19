import { env } from "@zapcron/env";
import type { db } from "@zapcron/server/db";
import { logs } from "@zapcron/server/db/schema";
import { count, lt } from "drizzle-orm";

export function getLogRetentionDays(): number {
  return env.LOG_RETENTION_DAYS;
}

export function isLogRetentionEnabled(): boolean {
  return getLogRetentionDays() > 0;
}

export function getLogRetentionCutoffDate(): Date | null {
  const retentionDays = getLogRetentionDays();
  if (retentionDays <= 0) {
    return null;
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);
  return cutoff;
}

export async function purgeExpiredLogs(database: typeof db) {
  const retentionDays = getLogRetentionDays();
  const cutoff = getLogRetentionCutoffDate();

  if (!cutoff) {
    return { deleted: 0, retentionDays };
  }

  const deleted = await database
    .delete(logs)
    .where(lt(logs.createdAt, cutoff))
    .returning({ id: logs.id });

  if (deleted.length > 0) {
    await database.execute("VACUUM ANALYZE zc_log");
  }

  return { deleted: deleted.length, retentionDays };
}

export async function countExpiredLogs(database: typeof db) {
  const cutoff = getLogRetentionCutoffDate();
  if (!cutoff) {
    return 0;
  }

  const [result] = await database
    .select({ value: count() })
    .from(logs)
    .where(lt(logs.createdAt, cutoff));

  return result?.value ?? 0;
}
