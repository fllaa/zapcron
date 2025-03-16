"use client";

import { createContext } from "react";

const defaultValue = {
  debug: false,
};
export type Config = typeof defaultValue;

export const ConfigContext = createContext(defaultValue);

export interface ConfigProviderProps {
  children: React.ReactNode;
  config: Config;
}

export function ConfigProvider({
  children,
  config,
}: Readonly<ConfigProviderProps>) {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
}
