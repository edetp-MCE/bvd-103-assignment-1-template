import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import {
  setDB,
  addBook,
  getBooks,
  deleteBook,
  Book,
} from "../assignment-4";

let mongod: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
  setDB(client.db("test"));
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

describe("Book operations", () => {
  it("adds and retrieves a book", async () => {
    const book: Book = { title: "Test", author: "Author", genre: "Genre" };
    const inserted = await addBook(book);

    const allBooks = await getBooks();
    expect(allBooks.some((b: { _id: { toString: () => any; }; }) => b._id.toString() === inserted._id.toString())).toBe(true);
  });
});
