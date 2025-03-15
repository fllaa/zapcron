import { useEffect, useState } from "react";

/**
 * Check resolution of the device.
 * @returns {boolean} Whether the device is mobile.
 * @example
 * ```tsx
 * import { useIsMobile } from "@zapcron/hooks";
 *
 * export default function MyComponent() {
 * const isMobile = useIsMobile();
 *
 * return <p>{isMobile ? "Mobile" : "Desktop"}</p>;
 * }
 * ```
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
