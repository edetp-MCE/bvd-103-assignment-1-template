import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { connectRabbitMQ, sendToQueue } from "./utils/rabbitmq";

const app = new Koa();
app.use(bodyParser());

app.use(async (ctx) => {
  if (ctx.path === "/new-listing" && ctx.method === "POST") {
    const data = ctx.request.body;
    await sendToQueue("new_listings", data);
    ctx.body = { status: "Listing sent to queue" };
  }
});

(async () => {
  await connectRabbitMQ();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Listings service running on ${PORT}`));
})();
