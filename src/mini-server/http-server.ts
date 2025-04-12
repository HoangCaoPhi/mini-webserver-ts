import { createServer, IncomingMessage, ServerResponse } from "http";
import { Router } from "./router/router.ts";
import { parseQuery } from "./http-parser/query.ts";
import { parseCookies } from "./http-parser/cookie.ts";
import type { Middleware } from "./abstractions/middleware.ts";
import type { RouteHandler } from "./abstractions/http_handler.ts";
import { getHeader, getHeaders, parseHeaderValue } from "./http-parser/headers.ts";
import type { RouteContext } from "./abstractions/http_context.ts";
import { json, text, html, redirect } from "./http-parser/respond.ts";  
import { Container } from "./abstractions/container.ts";

export class HttpServer {
  private middlewares: Middleware[] = [];
  private router = new Router();
  private container = new Container();
  private port: number;

  constructor(port: number) {
    this.port = port;
  }

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  get(path: string, ...handlers: (Middleware | RouteHandler)[]) {
    this.addRoute("GET", path, handlers);
  }

  post(path: string, ...handlers: (Middleware | RouteHandler)[]) {
    this.addRoute("POST", path, handlers);
  }

  put(path: string, ...handlers: (Middleware | RouteHandler)[]) {
    this.addRoute("PUT", path, handlers);
  }

  delete(path: string, ...handlers: (Middleware | RouteHandler)[]) {
    this.addRoute("DELETE", path, handlers);
  }

  group(prefix: string, fn: (r: Router) => void) {
    const sub = new Router();
    fn(sub);
    this.router.use(prefix, sub);
  }

  private addRoute(
    method: string,
    path: string,
    handlers: (Middleware | RouteHandler)[]
  ) {
    const handler = handlers.pop() as RouteHandler;
    const middleware = handlers as Middleware[];
    this.router.add(method, path, handler, middleware);
  }

  listen(callback?: () => void) {
    const server = createServer(this.handleRequest.bind(this));
    server.listen(this.port, () => {
      console.log(`🚀 Server listening on http://localhost:${this.port}`);
      callback?.();
    });
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const method = req.method || "";
    const url = req.url || "";

    const match = this.router.find(method, url);
    const query = parseQuery(url);
    const cookies = parseCookies(req.headers.cookie || "");

    const getHeaderFn = (key: string) => getHeader(req.headers, key);
    const getHeadersFn = () => getHeaders(req.headers);
    const parseHeader = (key: string) => {
      const raw = getHeader(req.headers, key);
      return raw ? parseHeaderValue(raw) : undefined;
    };

    const ctx: RouteContext = {
      req,
      res,
      params: match?.params || {},
      query,
      cookies,
      identity: {},
      container: this.container, 

      json: (data, status = 200) => json(res, data, status),
      text: (body, status = 200) => text(res, body, status),
      html: (body, status = 200) => html(res, body, status),
      redirect: (url, status = 302) => redirect(res, url, status),

      getHeader: getHeaderFn,
      getHeaders: getHeadersFn,
      parseHeader,
    };

    const chain = [...this.middlewares, ...(match?.middleware || [])];

    let i = 0;
    const next = async () => {
      const mw = chain[i++];
      if (mw) {
        await mw(ctx, next);
      } else if (match?.handler) {
        await match.handler(ctx);
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
    };

    try {
      await next();
    } catch (err: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ error: "Internal Server Error", detail: err.message })
      );
    }
  }
}


