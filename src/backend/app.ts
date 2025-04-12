import type { RouteContext } from "../mini-server/abstractions/http_context.ts";
import { HttpServer } from "../mini-server/http-server.ts";
import { bodyParser } from "../mini-server/middlewares/bodyParser.ts";
import { errorHandler } from "../mini-server/middlewares/errorHandler.ts";
import { notFound } from "../mini-server/middlewares/notFound.ts";
import { serveStatic } from "../mini-server/middlewares/static.ts";
import { logger } from "./middleware/logger.ts";

const app = new HttpServer(3000);
 
app.use(errorHandler);
app.use(logger);
app.use(bodyParser);
app.use(serveStatic("public")); 
app.use(notFound); 

app.get("/test", async (ctx: RouteContext) => {
  ctx.res.writeHead(200, { "Content-Type": "text/plain" });
  ctx.res.end("Hello from /test");
});

app.listen();