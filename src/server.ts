import { createServer } from "http";
import { parse } from "url";
import next from "next";

import { Scheduler } from "./server/scheduler";

const port = parseInt(process.env.PORT ?? "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, turbo: true, customServer: true });
const handle = app.getRequestHandler();

void app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    void handle(req, res, parsedUrl);
  }).listen(port);

  const scheduler = new Scheduler();

  scheduler.start();

  process.on("SIGINT", () => {
    scheduler.stop();
    process.exit(0);
  });

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`,
  );
});
