/* eslint-disable @typescript-eslint/no-unused-vars */
import cronParser from "cron-parser";

interface Options {
  ignoreEmpty?: boolean;
}

export const parseCronValid = (cron: string, opts?: Options): boolean => {
  if (opts?.ignoreEmpty && !cron) {
    return true;
  }
  try {
    cronParser.parseExpression(cron);
    return true;
  } catch (_) {
    return false;
  }
};

export const parseJSONValid = (json: string, opts?: Options): boolean => {
  if (opts?.ignoreEmpty && !json) {
    return true;
  }
  try {
    JSON.parse(json);
    return true;
  } catch (_) {
    return false;
  }
};
