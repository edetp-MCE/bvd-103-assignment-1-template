import { Db } from "mongodb";

export type Warehouse = {
  bookId: string;
  stock: number;
};

let db: Db;

export function setWarehouseDB(database: Db) {
  db = database;
}

export async function updateStock(bookId: string, stock: number) {
  await db.collection("warehouse").updateOne(
    { bookId },
    { $set: { stock } },
    { upsert: true }
  );
  return { bookId, stock };
}

export async function getStock(bookId: string) {
  const result = await db.collection("warehouse").findOne({ bookId });
  return result || { bookId, stock: 0 };
}
