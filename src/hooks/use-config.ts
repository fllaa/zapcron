import { type Config, ConfigContext } from "@zapcron/providers";
import { useContext } from "react";

/**
 * Access app config
 */
export const useConfig = (): Config => {
  return useContext(ConfigContext);
};
