import type { Middleware } from "../abstractions/middleware.ts";

export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    console.error("[ERROR]", err.message);
    ctx.res.writeHead(500, { "Content-Type": "application/json" });
    ctx.res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};
