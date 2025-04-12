import type { RouteContext } from "./http_context.ts";
import type { Middleware } from "./middleware.ts";

export type RouteHandler = (ctx: RouteContext) => Promise<void>;

export interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
  middleware: Middleware[];
}
