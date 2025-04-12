import type { Middleware } from "../abstractions/middleware.ts";

type OriginOption =
  | string
  | RegExp
  | string[]
  | ((origin: string | undefined) => boolean);

type CORSOptions = {
  origin?: OriginOption;
  methods?: string[];
  headers?: string[];
  credentials?: boolean;
  exposeHeaders?: string[];
  maxAge?: number;  
  debug?: boolean;  
};

export function cors(options: CORSOptions = {}): Middleware {
  const {
    origin = "*",
    methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    headers = ["Content-Type", "Authorization"],
    credentials = false,
    exposeHeaders = [],
    maxAge = 86400,  
    debug = false,
  } = options;

  function resolveOrigin(requestOrigin: string | undefined): string | null {
    if (!requestOrigin) return null;

    if (typeof origin === "string") return origin === "*" ? "*" : requestOrigin;
    if (origin instanceof RegExp)
      return origin.test(requestOrigin) ? requestOrigin : null;
    if (Array.isArray(origin))
      return origin.includes(requestOrigin) ? requestOrigin : null;
    if (typeof origin === "function")
      return origin(requestOrigin) ? requestOrigin : null;

    return null;
  }

  return async (ctx, next) => {
    const reqOrigin = ctx.req.headers.origin;
    const allowedOrigin = resolveOrigin(reqOrigin);
 
    ctx.res.setHeader("Vary", "Origin");

    if (allowedOrigin) {
      ctx.res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
      if (credentials) {
        ctx.res.setHeader("Access-Control-Allow-Credentials", "true");
      }
    }

    ctx.res.setHeader("Access-Control-Allow-Methods", methods.join(","));
    ctx.res.setHeader("Access-Control-Allow-Headers", headers.join(","));

    if (maxAge > 0) {
      ctx.res.setHeader("Access-Control-Max-Age", maxAge.toString());
    }

    if (exposeHeaders.length) {
      ctx.res.setHeader(
        "Access-Control-Expose-Headers",
        exposeHeaders.join(",")
      );
    }
 
    if (debug) {
      console.log(
        `[CORS] ${ctx.req.method} ${ctx.req.url} → Origin: ${reqOrigin} → Allowed: ${allowedOrigin}`
      );
    }
 
    if (ctx.req.method === "OPTIONS") {
      ctx.res.writeHead(204);
      ctx.res.end();
      return;
    }

    await next();
  };
}
