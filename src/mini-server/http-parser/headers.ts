import type { IncomingHttpHeaders } from "http";

 
export function getHeader(headers: IncomingHttpHeaders, key: string): string | undefined {
  const lowerKey = key.toLowerCase();
  for (const k in headers) {
    if (k.toLowerCase() === lowerKey) {
      const value = headers[k];
      return Array.isArray(value) ? value.join(", ") : value;
    }
  }
  return undefined;
}

 
export function getHeaders(headers: IncomingHttpHeaders): Record<string, string> {
  const result: Record<string, string> = {};
  for (const k in headers) {
    const value = headers[k];
    result[k.toLowerCase()] = Array.isArray(value) ? value.join(", ") : value || "";
  }
  return result;
}

/**
 * Parse header dạng: `value; param=value` → object.
 * Ví dụ: Content-Type: application/json; charset=utf-8
 */
export function parseHeaderValue(header: string): {
  value: string;
  params: Record<string, string>;
} {
  const [main, ...rest] = header.split(";").map(p => p.trim());
  const params: Record<string, string> = {};

  for (const param of rest) {
    const [k, v] = param.split("=");
    if (k && v) {
      params[k.trim()] = v.trim();
    }
  }

  return { value: main, params };
}
