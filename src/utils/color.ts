export const colorByStatus = (status: number) => {
  // if 2xx or 3xx, color success, if 4xx, color warning, if 5xx, color danger
  let color = "default";
  if (status >= 200 && status < 400) {
    color = "success";
  } else if (status >= 400 && status < 500) {
    color = "warning";
  } else if (status >= 500) {
    color = "danger";
  }
  return color as "default" | "success" | "warning" | "danger";
};
