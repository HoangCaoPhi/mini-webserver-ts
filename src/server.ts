import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { logger } from "./middlewares/logger.ts";
import { bodyParser } from "./middlewares/bodyParser.ts";
import type { Middleware, RouteContext, RouteHandler } from "./router/abstraction.ts"; 
import { Router } from "./router/router.ts";
import { parseQuery } from "./utils/query.ts";
import { parseCookies } from "./utils/cookie.ts";

export class HttpServer {
  private port: number; 
  private globalMiddlewares: Middleware[] = [];
  private router = new Router();
  
  constructor(port: number) {
    this.port = port;
  }

  use(middleware: Middleware) {
    this.globalMiddlewares.push(middleware);
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

  private addRoute(method: string, path: string, handlers: (Middleware | RouteHandler)[]) {
    const routeHandler = handlers.pop() as RouteHandler;
    const middleware = handlers as Middleware[];
    this.router.add(method, path, routeHandler, middleware);
  }

  listen() {
    const server = createServer(this.handleRequest.bind(this));
    server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const method = req.method || '';
    const url = req.url || '';

    const route = this.router.find(method, url);
    if (!route) {
      res.writeHead(404);
      return res.end('Not Found');
    }
    
    const query = parseQuery(url);
    const cookies = parseCookies(req.headers.cookie || '');
  
    const ctx: RouteContext = {
      req,
      res,
      params: route.params,
      query,
      cookies,
    };

    const allMiddleware = [...this.globalMiddlewares, ...route.middleware];

    let i = 0;
    const next = async () => {
      const mw = allMiddleware[i++];
      if (mw) {
        await mw(ctx, next);
      } else {
        await route.handler(ctx);
      }
    };

    return next();
  }
}
const app = new HttpServer(3000);

app.use(logger);
app.use(bodyParser);

app.get("test", async (ctx: RouteContext) => {
  ctx.res.writeHead(200, { "Content-Type": "text/plain" });
  ctx.res.end("Hello World");
});

app.listen();

 
