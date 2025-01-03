import { useEffect, useState } from "react";

/**
 * Check if the code is running on the client side.
 * @returns {boolean} Whether the code is running on the client side.
 * @example
 * ```tsx
 * import { useIsClient } from "@zapcron/hooks";
 *
 * export default function MyComponent() {
 *  const isClient = useIsClient();
 *
 * return <p>{isClient ? "Client" : "Server"}</p>;
 * }
 * ```
 */
export const useIsClient = (): boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
