export interface MatchResult {
  matched: boolean;
  params: Record<string, string>;
}

export function matchRoute(url: string, routePath: string): MatchResult | null {
  const [urlPath] = url.split("?");  

  const urlSegments = urlPath.split("/").filter(Boolean); // ["users", "123"]
  const routeSegments = routePath.split("/").filter(Boolean); // ["users", ":id"]

  if (urlSegments.length !== routeSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeSegments.length; i++) {
    const r = routeSegments[i];
    const u = urlSegments[i];

    if (r.startsWith(":")) {
      const key = r.slice(1);
      params[key] = decodeURIComponent(u);
    } else if (r !== u) {
      return null;
    }
  }

  return { matched: true, params };
}
