/**
 * Get client timezone
 * @returns client timezone
 */
export const getClientTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Format time
 * @param number - time in milliseconds
 * @returns formatted time
 */
export const formatTime = (number: number) => {
  if (number < 1000) {
    return `${number}ms`;
  }

  const seconds = number / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${Math.floor(minutes)}m`;
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return `${Math.floor(hours)}h`;
  }

  const days = hours / 24;
  if (days < 30) {
    return `${Math.floor(days)}d`;
  }
};
