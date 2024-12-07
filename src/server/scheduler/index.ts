import { CronJob } from "cron";
import parser from "cron-parser";
import { eq, lte } from "drizzle-orm";
import ky, { type Options } from "ky";
import { db } from "@bolabali/server/db";
import { jobs, logs } from "@bolabali/server/db/schema";

export class Scheduler {
  private job: CronJob;

  constructor() {
    this.job = new CronJob("* * * * *", async () => {
      console.log("[Scheduler] Checking jobs to run");
      const result = await db
        .select()
        .from(jobs)
        .where(lte(jobs.executeAt, new Date()));
      if (result.length === 0) {
        console.log("[Scheduler] No jobs to run, skipping...");
        return;
      }
      console.log("[Scheduler] Found jobs to run, executing...");
      for (const job of result) {
        const options: Options = {
          method: job.method,
        };
        if (job.headers)
          options.headers = job.headers as Record<string, string>;
        if (job.body) options.body = job.body as BodyInit;
        const response = await ky(job.url, {});
        await db.insert(logs).values({
          jobId: job.id,
          status: response.status.toString(),
          response: await response.json(),
        });
        await db
          .update(jobs)
          .set({
            executeAt: parser.parseExpression(job.cronspec).next().toDate(),
          })
          .where(eq(jobs.id, job.id));
      }
      console.log("[Scheduler] Finished executing jobs");
    });
  }

  start() {
    this.job.start();
    console.log("[Scheduler] Started job scheduler");
  }

  stop() {
    this.job.stop();
    console.log("[Scheduler] Stopped job scheduler");
  }
}
