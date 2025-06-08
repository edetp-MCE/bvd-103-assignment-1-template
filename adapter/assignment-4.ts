import { MongoClient, ObjectId, Db, Collection } from "mongodb";

const uri = "mongodb://localhost:27017";
const dbName = "booksdb";
let client: MongoClient;

export interface Book {
  title: string;
  author: string;
  genre: string;
}

export async function connectDB(): Promise<void> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
  }
}

function getDb(): Db {
  if (!client) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return client.db(dbName);
}

function getCollection(): Collection<Book> {
  return getDb().collection<Book>("books");
}

export async function getBooks(filter: Partial<Book> = {}): Promise<Book[]> {
  const mongoFilter: any = {};

  if (filter.genre) {
    mongoFilter.genre = { $regex: new RegExp(filter.genre, "i") };
  }
  if (filter.author) {
    mongoFilter.author = { $regex: new RegExp(filter.author, "i") };
  }
  if (filter.title) {
    mongoFilter.title = { $regex: new RegExp(filter.title, "i") };
  }

  return await getCollection().find(mongoFilter).toArray();
}

export async function addBook(book: Book): Promise<Book & { _id: ObjectId }> {
  const result = await getCollection().insertOne(book);
  return { _id: result.insertedId, ...book };
}

export async function updateBook(
  id: string,
  updates: Partial<Book>
): Promise<boolean> {
  if (!ObjectId.isValid(id)) throw new Error("Invalid ID");
  const result = await getCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.matchedCount > 0;
}

export async function deleteBook(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) throw new Error("Invalid ID");
  const result = await getCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
