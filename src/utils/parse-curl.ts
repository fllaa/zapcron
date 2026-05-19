import { HttpMethod } from "@zapcron/constants/http";
import { parseJSONValid } from "@zapcron/utils/validate-value";
import parseCurl from "parse-curl";

export interface ParsedCurlJobRequest {
  url: string;
  method: HttpMethod;
  headers: Array<{ key: string; value: string }>;
  body?: string;
}

const HTTP_METHODS = new Set<string>(Object.values(HttpMethod));

function normalizeMethod(method: string | undefined): HttpMethod {
  const upper = (method ?? HttpMethod.GET).toUpperCase();
  if (HTTP_METHODS.has(upper)) {
    return upper as HttpMethod;
  }
  throw new Error(`Unsupported HTTP method: ${method}`);
}

function normalizeBody(body: string | undefined): string | undefined {
  if (!body) {
    return undefined;
  }
  if (!parseJSONValid(body, { ignoreEmpty: true })) {
    throw new Error("Request body is not valid JSON");
  }
  return JSON.stringify(JSON.parse(body) as unknown, null, 2);
}

export function parseCurlCommand(curl: string): ParsedCurlJobRequest {
  const trimmed = curl.trim();
  if (!trimmed) {
    throw new Error("cURL command is empty");
  }

  const parsed = parseCurl(trimmed) as {
    url?: string;
    method?: string;
    header?: Record<string, string>;
    body?: string;
  };

  if (!parsed.url) {
    throw new Error("Could not find URL in cURL command");
  }

  try {
    new URL(parsed.url);
  } catch {
    throw new Error("Invalid URL in cURL command");
  }

  const headers = Object.entries(parsed.header ?? {}).map(([key, value]) => ({
    key,
    value: String(value),
  }));

  return {
    url: parsed.url,
    method: normalizeMethod(parsed.method),
    headers,
    body: normalizeBody(parsed.body),
  };
}
