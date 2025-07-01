import { getBooks, addBook, Book } from "../db/booksRepository";

const initialBooks: Book[] = [
  { title: "1984", author: "George Orwell", genre: "Dystopian" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic" },
  { title: "Dune", author: "Frank Herbert", genre: "Sci-Fi" },
  { title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian" },
];

export async function seedBooks() {
  const books = await getBooks();
  if (books.length === 0) {
    for (const book of initialBooks) {
      await addBook(book);
    }
    console.log("Database seeded with initial books.");
  }
}
