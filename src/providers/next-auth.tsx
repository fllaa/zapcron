"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type * as React from "react";

export interface NextAuthProviderProps {
  children: React.ReactNode;
  session: Session;
}

export function NextAuthProvider({
  children,
  session,
}: Readonly<NextAuthProviderProps>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
