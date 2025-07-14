import Koa from "koa";
import { connectRabbitMQ } from "./messaging";

const app = new Koa();

connectRabbitMQ().then(async (channel) => {
  await channel.assertExchange("orders_exchange", "topic", { durable: false });

  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, "orders_exchange", "order.created");

  channel.consume(q.queue, (msg) => {
    if (msg) {
      const order = JSON.parse(msg.content.toString());
      console.log("Warehouse received order:", order);
      channel.ack(msg);
    }
  });

  app.listen(3000, () => {
    console.log("Warehouse service running on port 3000");
  });
});
