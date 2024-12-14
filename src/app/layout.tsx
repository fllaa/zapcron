import "@bolabali/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { NextUIProvider } from "@bolabali/providers";
import { TRPCReactProvider } from "@bolabali/trpc/react";
import { TimeInfo } from "@bolabali/components/common";

export const metadata: Metadata = {
  title: "Bolabali",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const date = new Date();
  return (
    <html lang="en" className={`overflow-x-hidden ${GeistSans.variable}`}>
      <body className="overflow-x-hidden bg-gray-50 dark:bg-black">
        <TRPCReactProvider>
          <NextUIProvider>{children}</NextUIProvider>
        </TRPCReactProvider>
        <TimeInfo serverDate={date.toISOString()} />
      </body>
    </html>
  );
}
