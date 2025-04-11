import type { Middleware, RouteContext } from "../router/abstraction.ts";

 
export const logger: Middleware = async (ctx: RouteContext, next: () => Promise<void>) => {
  const start = Date.now();

  console.log(`📥 [${ctx.req.method}] ${ctx.req.url}`);
  await next();

  const duration = Date.now() - start;
  console.log(`📤 Response sent in ${duration}ms`);
};
