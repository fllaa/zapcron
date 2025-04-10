import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITHUB_SECRET: z.string(),
    AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID: z.string(),
    AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET: z.string(),
    AUTH_MICROSOFT_ENTRA_ID_TENANT_ID: z.string(),
    DATABASE_URL: z.string().url(),
    DEBUG: z.boolean().optional().default(false),
    ENABLE_QUERY_LOGGING: z.boolean().optional().default(false),
    REDIS_HOST: z.string().optional().default("localhost"),
    REDIS_PORT: z.number().optional().default(6379),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.number().optional().default(0),
    SECRET_CLIENT_COOKIE_VAR: z.string(),
    S3_BUCKET: z.string(),
    S3_ENDPOINT: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_PUBLIC_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID:
      process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID,
    AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET:
      process.env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
    AUTH_MICROSOFT_ENTRA_ID_TENANT_ID:
      process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
    DATABASE_URL: process.env.DATABASE_URL,
    DEBUG: process.env.DEBUG === "true",
    ENABLE_QUERY_LOGGING: process.env.ENABLE_QUERY_LOGGING === "true",
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT
      ? parseInt(process.env.REDIS_PORT)
      : undefined,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_DB: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : undefined,
    SECRET_CLIENT_COOKIE_VAR: process.env.SECRET_CLIENT_COOKIE_VAR,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_PUBLIC_URL: process.env.S3_PUBLIC_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
