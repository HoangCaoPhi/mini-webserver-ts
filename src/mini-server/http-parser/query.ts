export function parseQuery(url: string): Record<string, string> {
  const queryStr = url.split("?")[1];
  if (!queryStr) return {};

  return Object.fromEntries(new URLSearchParams(queryStr).entries());
}
