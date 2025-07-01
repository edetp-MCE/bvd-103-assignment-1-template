import swaggerUi from "swagger-ui-koa";
import { koaSwagger } from "swagger-ui-koa";
import { Context, Middleware } from "koa";
import { readFileSync } from "fs";
import path from "path";

export function swaggerDocsMiddleware(): Middleware {
  const specPath = path.resolve(__dirname, "../../dist/openapi.json");
  const spec = JSON.parse(readFileSync(specPath, "utf8"));

  return koaSwagger({
    routePrefix: "/docs",
    swaggerOptions: {
      spec,
    },
  });
}
