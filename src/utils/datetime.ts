export const getClientTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
