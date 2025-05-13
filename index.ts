
import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";

const app = new Koa();
const router = new Router();

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
}

const books: Book[] = [
  { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic" },
  { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi" },
  { id: 4, title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian" }
];

router.get("/books", (ctx) => {
  const genre = ctx.query.genre?.toString().toLowerCase();
  const filtered = genre
    ? books.filter(book => book.genre.toLowerCase() === genre)
    : books;
  ctx.body = filtered;
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

const PORT = 3000;
app.listen(PORT, () => {
  console.log("McMasterful Books API running at http://localhost:${PORT}");
});
