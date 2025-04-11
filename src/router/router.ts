import type { Middleware, Route, RouteHandler } from "./abstraction.ts";
import { matchRoute } from "./matcher.ts";

export class Router {
    private routes: Route[] = [];
  
    add(method: string, path: string, handler: RouteHandler, middleware: Middleware[] = []) {
      this.routes.push({ method, path, handler, middleware });
    }
  
    find(method: string, url: string): {
      handler: RouteHandler;
      middleware: Middleware[];
      params: Record<string, string>;
    } | null {
      for (const route of this.routes) {
        if (route.method !== method) continue;
  
        const match = matchRoute(url, route.path);
        if (match) {
          return {
            handler: route.handler,
            middleware: route.middleware,
            params: match.params,
          };
        }
      }
      return null;
    }
  }