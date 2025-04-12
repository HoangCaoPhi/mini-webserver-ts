import type { RouteContext } from "./http_context.ts";

export type Middleware = (
  ctx: RouteContext,
  next: () => Promise<void>
) => Promise<void>;

export type TokenVerifier = (
  token: string
) => Promise<{ id: string; name: string } | null>;
