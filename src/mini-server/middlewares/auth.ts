import type { RouteContext } from "../abstractions/http_context.ts";
import type { Middleware, TokenVerifier } from "../abstractions/middleware.ts";
import { sessions } from "../data/sessions.ts";

export const auth = (verifyToken: TokenVerifier): Middleware => {
  return async (ctx: RouteContext, next: () => Promise<void>) => {
    let user = undefined;

    const sessionId = ctx.cookies.session_id;
    if (sessionId && sessions[sessionId]) {
      user = sessions[sessionId];
    }

    if (!user) {
      const authHeader = ctx.req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7).trim();
        user = await verifyToken(token);
      }
    }

    if (!user) {
      ctx.res.writeHead(401, { "Content-Type": "application/json" });
      ctx.res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    ctx.identity = { user };
    await next();
  };
};
