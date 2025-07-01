import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { MongoClient } from "mongodb";
import booksRouter from "./controllers/booksRouter";
import { registry } from "./openapi/builder";
import { generateOpenApiDocument } from "koa-zod-router";
import { setBooksDB } from "./db/booksRepository";
import { seedBooks } from "./utils/seed";

const app = new Koa();

/* Middleware */
app.use(bodyParser());
app.use(booksRouter.routes());
app.use(booksRouter.allowedMethods());

/* OpenAPI JSON generation */
const openApi = generateOpenApiDocument(registry.definitions, {
  openapi: "3.0.0",
  info: {
    title: "McMasterful Books API",
    version: "1.0.0",
    description: "API for McMasterful Partners Program",
  },
});
booksRouter.openapi("/openapi.json", openApi);

async function startServer() {
  try {
    const client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
    setBooksDB(client.db("booksdb"));

    await seedBooks();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();

export default app;
