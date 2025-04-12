import type { Route, RouteHandler } from "../abstractions/http_handler.ts";
import type { Middleware } from "../abstractions/middleware.ts";
import { matchRoute } from "./matcher.ts";

export class Router {
  private routes: Route[] = [];

  add(
    method: string,
    path: string,
    handler: RouteHandler,
    middleware: Middleware[] = []
  ) {
    this.routes.push({ method, path, handler, middleware });
  }

  get(path: string, handler: RouteHandler, middleware: Middleware[] = []) {
    this.add("GET", path, handler, middleware);
  }

  post(path: string, handler: RouteHandler, middleware: Middleware[] = []) {
    this.add("POST", path, handler, middleware);
  }

  put(path: string, handler: RouteHandler, middleware: Middleware[] = []) {
    this.add("PUT", path, handler, middleware);
  }

  delete(path: string, handler: RouteHandler, middleware: Middleware[] = []) {
    this.add("DELETE", path, handler, middleware);
  }

  use(prefix: string, subRouter: Router) {
    for (const route of subRouter.routes) {
      const fullPath = `${prefix}${route.path}`.replace(/\/+/g, "/");
      this.add(route.method, fullPath, route.handler, route.middleware);
    }
  }

  find(
    method: string,
    pathname: string
  ): {
    handler: RouteHandler;
    middleware: Middleware[];
    params: Record<string, string>;
  } | null {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      const match = matchRoute(pathname, route.path);
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

  asMiddleware(): Middleware {
    return async (ctx, next) => {
      const method = ctx.req.method || "";
      const url = new URL(ctx.req.url || "", "http://localhost");  
      const pathname = url.pathname;

      const matched = this.find(method, pathname);

      if (matched) {
        ctx.params = matched.params;

        const stack = [...matched.middleware, matched.handler];
        let i = 0;

        const run = async () => {
          const layer = stack[i++];
          if (layer) {
            await layer(ctx, run);
          }
        };

        await run();
      } else {
        await next();  
      }
    };
  }
}
