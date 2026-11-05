/**
 * Central types and interfaces for the BookNook application.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others" | string;
  image: string;
  description: string;
  copies: number;
  userName: string;
  userEmail: string;
  addedDate?: string | Date;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string | Date;
  returnDate: string;
}

export interface GetBooksParams {
  email?: string;
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  copies: number;
  userName: string;
  userEmail: string;
}

export interface UpdateBookPayload {
  title?: string;
  author?: string;
  category?: string;
  image?: string;
  description?: string;
}

export interface BorrowBookPayload {
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  returnDate: string;
}

