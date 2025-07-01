import { Collection, Db, ObjectId } from "mongodb";

export interface Book {
  _id?: string;
  title: string;
  author: string;
  genre: string;
}

let db: Db;

export function setBooksDB(database: Db) {
  db = database;
}

function getBooksCollection(): Collection<Book> {
  if (!db) throw new Error("Database not initialized");
  return db.collection<Book>("books");
}

export async function getBooks(filters: Partial<Book> = {}): Promise<Book[]> {
  const collection = getBooksCollection();
  const query: any = {};

  if (filters.genre) query.genre = filters.genre;
  if (filters.author) query.author = filters.author;
  if (filters.title) query.title = filters.title;

  const books = await collection.find(query).toArray();
  return books.map((b) => ({
    ...b,
    _id: b._id?.toString(),
  }));
}

export async function addBook(book: Book): Promise<Book> {
  const collection = getBooksCollection();
  const result = await collection.insertOne(book);
  return {
    ...book,
    _id: result.insertedId.toString(),
  };
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<boolean> {
  const collection = getBooksCollection();
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  return result.matchedCount > 0;
}

export async function deleteBook(id: string): Promise<boolean> {
  const collection = getBooksCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
