import { useEffect, useState } from "react";

/**
 * Get the current date.
 *
 * @returns {Date} The current date.
 * @example
 * ```tsx
 * import { useCurrentDate } from "@zapcron/hooks";
 *
 * export default function MyComponent() {
 * const date = useCurrentDate();
 *
 * return <p>{date.toString()}</p>;
 * }
 * ```
 */
export const useCurrentDate = (): Date => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return date;
};
