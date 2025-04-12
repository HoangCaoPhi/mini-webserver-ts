import { IncomingMessage, ServerResponse } from "http";
import type { Container } from "./container.ts";

export interface BaseContext {
  req: IncomingMessage;
  res: ServerResponse;
  params: Record<string, string>;
  query: Record<string, string>;
  cookies: Record<string, string>;
  body?: any;
  container: Container;

  json: (data: unknown, status?: number) => void;
  text: (body: string, status?: number) => void;
  html: (body: string, status?: number) => void;

  redirect: (url: string, status?: number) => void;
  getHeader(key: string): string | undefined;
  getHeaders(): Record<string, string>;
  parseHeader(key: string):
    | {
        value: string;
        params: Record<string, string>;
      }
    | undefined;
}

export type RouteContext = BaseContext & { identity: Identity };

export interface Identity {
  user?: User;
}
export interface User {
  id: string;
  name: string;
}
