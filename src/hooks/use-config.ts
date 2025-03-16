import { ConfigContext, type Config } from "@zapcron/providers";
import { useContext } from "react";

/**
 * Access app config
 */
export const useConfig = (): Config => {
  return useContext(ConfigContext);
};
