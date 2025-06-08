import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { MongoClient } from "mongodb";
import {
  setBooksDB,
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  Book,
} from "./assignment-4";

const app = new Koa();
const router = new Router();

const initialBooks: Book[] = [
  { title: "1984", author: "George Orwell", genre: "Dystopian" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic" },
  { title: "Dune", author: "Frank Herbert", genre: "Sci-Fi" },
  { title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian" },
];

async function seedBooks() {
  const existingBooks = await getBooks();
  if (existingBooks.length === 0) {
    for (const book of initialBooks) {
      await addBook(book);
    }
    console.log("Database seeded with initial books.");
  }
}

// GET /books
router.get("/books", async (ctx) => {
  const { genre, author, title } = ctx.query;

  const filters = {
    ...(genre ? { genre: genre.toString() } : {}),
    ...(author ? { author: author.toString() } : {}),
    ...(title ? { title: title.toString() } : {}),
  };

  const books = await getBooks(filters);
  ctx.body = books;
});

// POST /books
router.post("/books", async (ctx) => {
  const { title, author, genre } = ctx.request.body as Partial<Book>;

  if (!title || !author || !genre) {
    ctx.status = 400;
    ctx.body = { error: "Missing title, author, or genre" };
    return;
  }

  const newBook = await addBook({ title, author, genre });
  ctx.status = 201;
  ctx.body = newBook;
});

// PUT /books/:id
router.put("/books/:id", async (ctx) => {
  const { id } = ctx.params;
  const updates = ctx.request.body as Partial<Book>;

  if (!updates.title && !updates.author && !updates.genre) {
    ctx.status = 400;
    ctx.body = { error: "No valid fields to update" };
    return;
  }

  try {
    const updated = await updateBook(id, updates);
    if (!updated) {
      ctx.status = 404;
      ctx.body = { error: "Book not found" };
    } else {
      ctx.body = { message: "Book updated successfully" };
    }
  } catch (err) {
    console.error(err);
    ctx.status = 400;
    ctx.body = { error: "Invalid ID format" };
  }
});

// DELETE /books/:id
router.delete("/books/:id", async (ctx) => {
  const { id } = ctx.params;
  try {
    const deleted = await deleteBook(id);
    if (!deleted) {
      ctx.status = 404;
      ctx.body = { error: "Book not found" };
    } else {
      ctx.body = { message: "Book deleted successfully" };
    }
  } catch (err) {
    console.error(err);
    ctx.status = 400;
    ctx.body = { error: "Invalid ID format" };
  }
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

async function startServer() {
  try {
    const client = new MongoClient("mongodb://localhost:27017");
    await client.connect();
    setBooksDB(client.db("booksdb"));

    await seedBooks();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();

export default app;
