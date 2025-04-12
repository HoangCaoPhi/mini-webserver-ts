import type { Middleware } from "../abstractions/middleware.ts";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  keyGenerator?: (ctx: any) => string;
  message?: string;
};

type Record = {
  count: number;
  startTime: number;
};

const store = new Map<string, Record>();

export function rateLimiter(options: RateLimitOptions): Middleware {
  const {
    windowMs,
    max,
    keyGenerator = (ctx) => ctx.req.socket.remoteAddress || "unknown",
    message = "Too many requests",
  } = options;

  return async (ctx, next) => {
    const key = keyGenerator(ctx);
    const now = Date.now();
    const entry = store.get(key) || { count: 0, startTime: now };

    // Reset window nếu hết thời gian
    if (now - entry.startTime > windowMs) {
      entry.count = 0;
      entry.startTime = now;
    }

    entry.count++;
    store.set(key, entry);

    if (entry.count > max) {
      ctx.res.writeHead(429, { "Content-Type": "application/json" });
      ctx.res.end(JSON.stringify({ error: message }));
      return;
    }

    await next();
  };
}
