
import amqplib from 'amqplib';

let connection: amqplib.Connection;
let channel: amqplib.Channel;

export async function connectRabbitMQ() {
  connection = await amqplib.connect('amqp://rabbitmq');
  channel = await connection.createChannel();
}

export async function sendToQueue(queue: string, msg: any) {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
}

export async function consumeQueue(queue: string, callback: (msg: any) => void) {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  await channel.assertQueue(queue, { durable: false });
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel.ack(msg);
    }
  });
}
