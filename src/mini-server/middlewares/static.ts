import path from "path"; 
import type { Middleware } from "../abstractions/middleware.ts";
import type { RouteContext } from "../abstractions/http_context.ts";
export function serveStatic(dir: string): Middleware {
    const basePath = path.resolve(dir);
  
    return async (ctx: RouteContext, next: () => Promise<void>) => {
      const urlPath = decodeURIComponent(new URL(ctx.req.url!, 'http://localhost').pathname);
      const filePath = path.join(basePath, urlPath);
  
      try {
        const stat = await import('node:fs/promises').then(fs => fs.stat(filePath));
        if (stat.isFile()) {
          const ext = path.extname(filePath).slice(1);
          const mimeType = mimeTypes[ext] || 'application/octet-stream';
          ctx.res.writeHead(200, { 'Content-Type': mimeType });
          const file = await import('node:fs/promises').then(fs => fs.readFile(filePath));
          ctx.res.end(file);
          return;
        }
      } catch (err) { 
      }
  
      await next();
    };
  }
  
  // Simple MIME map
  const mimeTypes: Record<string, string> = {
    html: 'text/html',
    css:  'text/css',
    js:   'application/javascript',
    png:  'image/png',
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    gif:  'image/gif',
    svg:  'image/svg+xml',
    json: 'application/json',
    txt:  'text/plain',
  };
