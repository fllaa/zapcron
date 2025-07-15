/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { db } from "@zapcron/server/db";
import { sql } from "drizzle-orm";
import os from "os-utils";

export const GET = async () => {
  // Check if the database is connected, and response time
  const start = Date.now();
  await db.execute(sql`SELECT 1`);
  const end = Date.now();

  // Monitor system resources
  const uptime = os.sysUptime();
  const processUptime = os.processUptime();
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  const freeMemoryPercentage = os.freememPercentage();
  const loadAverage = os.allLoadavg();
  const cpuUsagePercentage = await new Promise<number>((resolve) => {
    os.cpuUsage((v) => resolve(v));
  });

  return Response.json({
    status: "ok",
    db: {
      connected: true,
      responseTime: `${end - start}ms`,
    },
    system: {
      uptime,
      processUptime,
      freeMemory,
      totalMemory,
      freeMemoryPercentage,
      loadAverage,
      cpuUsagePercentage,
    },
  });
};
