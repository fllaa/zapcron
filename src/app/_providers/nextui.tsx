"use client";

import * as React from "react";
import { NextUIProvider as NUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useIsClient } from "@bolabali/app/_hooks";

export interface NextUIProviderProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function NextUIProvider({
  children,
  themeProps,
}: Readonly<NextUIProviderProps>) {
  const isClient = useIsClient();
  const router = useRouter();

  return !isClient ? (
    children
  ) : (
    <NUIProvider navigate={(path: string) => router.push(path)}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </NUIProvider>
  );
}
