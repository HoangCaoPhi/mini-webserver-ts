import type { Middleware } from "../abstractions/middleware.ts";

export const notFound: Middleware = async (ctx, next) => {
  await next();
  if (!ctx.res.headersSent) {
    ctx.res.writeHead(404, { "Content-Type": "application/json" });
    ctx.res.end(JSON.stringify({ error: "Not Found" }));
  }
};
