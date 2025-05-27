import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import {
  connectDB,
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  Book,
} from "./assignment-3";

const app = new Koa();
const router = new Router();

const initialBooks: Book[] = [
  { title: "1984", author: "George Orwell", genre: "Dystopian" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic" },
  { title: "Dune", author: "Frank Herbert", genre: "Sci-Fi" },
  { title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian" },
];

async function seedBooks(): Promise<void> {
  const existingBooks = await getBooks();
  if (existingBooks.length === 0) {
    for (const book of initialBooks) {
      await addBook(book);
    }
    console.log("Database seeded with initial books.");
  }
}

// GET with filters
router.get("/books", async (ctx) => {
  const { genre, author, title } = ctx.query;

  const filter = {
    ...(genre ? { genre: genre.toString() } : {}),
    ...(author ? { author: author.toString() } : {}),
    ...(title ? { title: title.toString() } : {}),
  };

  const books = await getBooks(filter);
  ctx.body = books;
});

// POST
router.post("/books", async (ctx) => {
  const { title, author, genre } = ctx.request.body as Partial<Book>;

  if (!title || !author || !genre) {
    ctx.status = 400;
    ctx.body = { error: "Missing title, author, or genre" };
    return;
  }

  const book = await addBook({ title, author, genre });
  ctx.status = 201;
  ctx.body = book;
});

// PUT
router.put("/books/:id", async (ctx) => {
  const { id } = ctx.params;
  const { title, author, genre } = ctx.request.body as Partial<Book>;

  if (!title && !author && !genre) {
    ctx.status = 400;
    ctx.body = { error: "No valid fields to update" };
    return;
  }

  try {
    const success = await updateBook(id, { title, author, genre });
    if (!success) {
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

// DELETE
router.delete("/books/:id", async (ctx) => {
  const { id } = ctx.params;
  try {
    const success = await deleteBook(id);
    if (!success) {
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

/* Start the server */
connectDB()
  .then(async () => {
    await seedBooks();
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`McMasterful Books API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
