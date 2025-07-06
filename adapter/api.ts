import axios from "axios";

const api = axios.create({
  baseURL: "/api", 
});

export interface Book {
  _id?: string;
  title: string;
  author: string;
  genre: string;
}

export async function getBooks(filters?: Partial<Book>): Promise<Book[]> {
  const response = await api.get<Book[]>("/books", { params: filters });
  return response.data;
}

export async function addBook(book: Book): Promise<Book> {
  const response = await api.post<Book>("/books", book);
  return response.data;
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<{ message: string }> {
  const response = await api.put(`/books/${id}`, updates);
  return response.data;
}

export async function deleteBook(id: string): Promise<{ message: string }> {
  const response = await api.delete(`/books/${id}`);
  return response.data;
}
