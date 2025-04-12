import type { ServerResponse } from "http";

export function send(res: ServerResponse, body: string, status: number, contentType: string) {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

export function json(res: ServerResponse, data: unknown, status = 200) {
  send(res, JSON.stringify(data), status, "application/json");
}

export function text(res: ServerResponse, body: string, status = 200) {
  send(res, body, status, "text/plain");
}

export function html(res: ServerResponse, body: string, status = 200) {
  send(res, body, status, "text/html");
}

export function redirect(res: ServerResponse, url: string, status = 302) {
  res.writeHead(status, { Location: url });
  res.end();
}
