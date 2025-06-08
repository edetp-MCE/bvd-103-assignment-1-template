import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import {
  setWarehouseDB,
  updateStock,
  getStock,
} from "../warehouse";

let mongod: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  setWarehouseDB(client.db("test"));
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

beforeEach(async () => {
  const db = client.db("test");
  await db.collection("warehouse").deleteMany({});
});

describe("Warehouse Collection", () => {
  it("updates and retrieves stock for a book", async () => {
    const bookId = "book123";

    await updateStock(bookId, 10);
    const result = await getStock(bookId);

    expect(result).toBeDefined();
    expect(result.bookId).toBe(bookId);
    expect(result.stock).toBe(10);
  });

});
