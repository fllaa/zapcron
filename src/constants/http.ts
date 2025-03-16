export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export const httpColors: Record<HttpMethod, string> = {
  [HttpMethod.GET]: "primary",
  [HttpMethod.POST]: "success",
  [HttpMethod.PUT]: "info",
  [HttpMethod.PATCH]: "warning",
  [HttpMethod.DELETE]: "danger",
};
