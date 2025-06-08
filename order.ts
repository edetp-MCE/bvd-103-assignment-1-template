import { ObjectId, Db } from "mongodb";

export type Order = {
  bookId: string;
  quantity: number;
  status: "pending" | "shipped" | "delivered";
};

let db: Db;

export function setOrdersDB(database: Db) {
  db = database;
}

export async function addOrder(order: Order) {
  const result = await db.collection("orders").insertOne(order);
  return { ...order, _id: result.insertedId };
}

export async function getOrders() {
  return db.collection("orders").find().toArray();
}
