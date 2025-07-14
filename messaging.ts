import amqp from "amqplib";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect("amqp://rabbitmq:5672");
  channel = await connection.createChannel();
  return channel;
}

export function getChannel(): amqp.Channel {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized!");
  }
  return channel;
}
