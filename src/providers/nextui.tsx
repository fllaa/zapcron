"use client";

import { HeroUIProvider as HUIProvider } from "@heroui/system";
import { useIsClient, useIsMobile } from "@zapcron/hooks";
import { useRouter } from "next/navigation";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import type * as React from "react";
import { Toaster } from "sonner";

export interface HeroUIProviderProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function HeroUIProvider({
  children,
  themeProps,
}: Readonly<HeroUIProviderProps>) {
  const isClient = useIsClient();
  const isMobile = useIsMobile();
  const router = useRouter();

  return !isClient ? (
    children
  ) : (
    <HUIProvider navigate={(path: string) => router.push(path)}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      <Toaster
        theme="system"
        position={isMobile ? "top-center" : "bottom-right"}
        richColors
      />
    </HUIProvider>
  );
}
