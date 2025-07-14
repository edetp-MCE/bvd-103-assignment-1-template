import Koa from "koa";
import Router from "@koa/router";
import { connectRabbitMQ, getChannel } from "./messaging";

const app = new Koa();
const router = new Router();

router.post("/api/orders", async (ctx) => {
  const order = ctx.request.body;

  const channel = getChannel();
  channel.publish(
    "orders_exchange",  // exchange
    "order.created",     // routing key
    Buffer.from(JSON.stringify(order))
  );

  ctx.status = 201;
  ctx.body = { message: "Order placed" };
});

app.use(require("koa-bodyparser")());
app.use(router.routes());

connectRabbitMQ().then((channel) => {
  channel.assertExchange("orders_exchange", "topic", { durable: false });

  app.listen(3000, () => {
    console.log("Orders service running on port 3000");
  });
});
