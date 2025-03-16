import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import GithubProvider from "next-auth/providers/github";

import { db } from "@zapcron/server/db";
import { env } from "@zapcron/env";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@zapcron/server/db/schema";
import { Role } from "@zapcron/constants/role";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: Role;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GithubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    MicrosoftEntraID({
      clientId: env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_ID,
      clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_CLIENT_SECRET,
      issuer: `https://login.microsoftonline.com/${env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        const data = await db.select().from(users);
        if (data.length === 1) {
          await db
            .update(users)
            .set({ role: Role.ADMIN })
            .where(eq(users.id, user.id!));
        }
      }
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
