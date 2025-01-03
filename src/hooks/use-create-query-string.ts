import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Create a query string with the given name and value.
 * @returns {Function} Function to create a query string.
 * @example
 * ```tsx
 * import { useCreateQueryString } from "@zapcron/hooks";
 *
 * export default function MyComponent() {
 *  const createQueryString = useCreateQueryString();
 *
 *  const queryString = createQueryString("name", "value");
 *
 *  return <p>{queryString}</p>;
 * }
 * ```
 */
export const useCreateQueryString = (): ((
  name: string,
  value: string,
) => string) => {
  const searchParams = useSearchParams();
  return useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
};
