import { IncomingMessage, ServerResponse } from "http";

export interface RouteContext {
  req: IncomingMessage;
  res: ServerResponse;
  params: Record<string, string>;
  query: Record<string, string>;
  cookies: Record<string, string>;
  body?: any;
}

export type RouteHandler = (ctx: RouteContext) => Promise<void>;

export interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
  middleware: Middleware[];
}

export type Middleware = (
  ctx: RouteContext,
  next: () => Promise<void>
) => Promise<void>;
 