import type { RouteContext } from "../abstractions/http_context.ts";
import type { Middleware } from "../abstractions/middleware.ts";

export const bodyParser: Middleware = async (
  ctx: RouteContext,
  next: () => Promise<void>
): Promise<void> => {
  const method = ctx.req.method || "";
  const contentType = ctx.req.headers["content-type"] || "";

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    if (contentType.includes("application/json")) {
      const chunks: Buffer[] = [];

      for await (const chunk of ctx.req) {
        chunks.push(chunk);
      }

      const raw = Buffer.concat(chunks).toString();
      try {
        ctx.body = JSON.parse(raw);
      } catch (err) {
        ctx.res.writeHead(400, { "Content-Type": "text/plain" });
        ctx.res.end("Invalid JSON");
      }
    }
  }

  await next();
};
