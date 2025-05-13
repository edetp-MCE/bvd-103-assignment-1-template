"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var koa_1 = require("koa");
var router_1 = require("@koa/router");
var koa_bodyparser_1 = require("koa-bodyparser");
var app = new koa_1.default();
var router = new router_1.default();
var books = [
    { id: 1, title: "1984", author: "George Orwell", genre: "Dystopian" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic" },
    { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi" },
    { id: 4, title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian" }
];
router.get("/books", function (ctx) {
    var _a;
    var genre = (_a = ctx.query.genre) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
    var filtered = genre
        ? books.filter(function (book) { return book.genre.toLowerCase() === genre; })
        : books;
    ctx.body = filtered;
});
app.use((0, koa_bodyparser_1.default)());
app.use(router.routes()).use(router.allowedMethods());
var PORT = 3000;
app.listen(PORT, function () {
    console.log("McMasterful Books API running at http://localhost:${PORT}");
});
