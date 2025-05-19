
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "booksdb";

let isConnected = false;

export async function connectDB() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
    }
    return client.db(dbName).collection("books");
}

export async function getBooks(genre?: string) {
    const collection = await connectDB();
    return genre
        ? collection.find({ genre: { $regex: new RegExp(genre, "i") } }).toArray()
        : collection.find().toArray();
}

export async function addBook(book: { title: string, author: string, genre: string }) {
    const collection = await connectDB();
    return collection.insertOne(book);
}

export async function updateBook(id: string, data: Partial<{ title: string, author: string, genre: string }>) {
    const collection = await connectDB();
    return collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteBook(id: string) {
    const collection = await connectDB();
    return collection.deleteOne({ _id: new ObjectId(id) });
}
