import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

/**
 * Create a debounced state.
 * @param initialValue The initial value of the state.
 * @param delay The delay in milliseconds.
 * @returns The debounced state and the setter.
 * @example
 * ```tsx
 * import { useDebouncedState } from "@zapcron/hooks";
 *
 * export default function MyComponent() {
 * const [value, setValue, debouncedValue] = useDebouncedState("", 500);
 *
 * return (
 *  <>
 *   <input
 *   value={value}
 *  onChange={(e) => setValue(e.target.value)}
 * />
 * <p>Debounced value: {debouncedValue}</p>
 * </>
 * );
 * }
 * ```
 */
export const useDebouncedState = <T>(
  initialValue: T | (() => T),
  delay: number,
): [T, Dispatch<SetStateAction<T>>, T] => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, setValue, value];
};
