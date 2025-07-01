import { createRouter } from "koa-zod-router";
import { z } from "zod";
import { Context } from "koa";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  Book,
} from "../db/booksRepository";
import { registry } from "../openapi/builder";

const booksRouter = createRouter({ registry });

const BookSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
});

const BookPartialSchema = BookSchema.partial();
const BookFilterSchema = z.object({
  genre: z.string().optional(),
  author: z.string().optional(),
  title: z.string().optional(),
});

booksRouter.get(
  "/books",
  {
    query: BookFilterSchema,
    responses: {
      200: z.array(BookSchema),
    },
  },
  async (ctx: Context) => {
    const books = await getBooks(ctx.query);
    ctx.body = books;
  }
);

booksRouter.post(
  "/books",
  {
    body: BookSchema,
    responses: {
      201: BookSchema.extend({ _id: z.string() }),
      400: z.object({ error: z.string() }),
    },
  },
  async (ctx: Context) => {
    const book = ctx.request.body as Book;
    const newBook = await addBook(book);
    ctx.status = 201;
    ctx.body = newBook;
  }
);

booksRouter.put(
  "/books/:id",
  {
    params: z.object({ id: z.string() }),
    body: BookPartialSchema,
    responses: {
      200: z.object({ message: z.string() }),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
    },
  },
  async (ctx: Context) => {
    const { id } = ctx.params as { id: string };
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
    } catch {
      ctx.status = 400;
      ctx.body = { error: "Invalid ID format" };
    }
  }
);

booksRouter.delete(
  "/books/:id",
  {
    params: z.object({ id: z.string() }),
    responses: {
      200: z.object({ message: z.string() }),
      400: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
    },
  },
  async (ctx: Context) => {
    const { id } = ctx.params as { id: string };
    try {
      const deleted = await deleteBook(id);
      if (!deleted) {
        ctx.status = 404;
        ctx.body = { error: "Book not found" };
      } else {
        ctx.body = { message: "Book deleted successfully" };
      }
    } catch {
      ctx.status = 400;
      ctx.body = { error: "Invalid ID format" };
    }
  }
);

export default booksRouter;
