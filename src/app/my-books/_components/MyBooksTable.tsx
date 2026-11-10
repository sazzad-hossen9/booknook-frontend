"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Book, API_URL } from "@/types";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/get-token-from-client";
import { EditBookModal } from "./EditBookModal";
import { DeleteBookButton } from "./DeleteBookButton";
import { Spinner } from "@/components/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, BookOpen } from "lucide-react";

/**
 * My Books Table component matching My-Books-Page.png.
 * Displays user's contributed books with Edit and Delete capabilities.
 * Automatically converts to compact cards on mobile screens.
 */
export function MyBooksTable() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const loadUserBooks = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const token = await getTokenFromClient();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${API_URL}/my-books/${encodeURIComponent(user.email)}`,
        {
          headers,
          cache: "no-store",
        }
      );
      const data = await res.json();
      const list: Book[] = Array.isArray(data) ? data : [];
      list.sort(
        (a, b) =>
          new Date(b.addedDate || 0).getTime() -
          new Date(a.addedDate || 0).getTime()
      );
      setBooks(list);
    } catch (err) {
      console.error("Failed to load user books:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadUserBooks();
  }, [loadUserBooks]);

  const handleBookDeleted = (deletedId: string) => {
    setBooks((prev) => prev.filter((b) => b._id !== deletedId));
  };

  const handleBookUpdated = (updated: Book) => {
    setBooks((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-12">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Fetching your bookshelf...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-[24px] border border-dashed border-border bg-card p-12 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0A526]/15 text-[#E0A526]">
          <BookOpen className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-serif text-xl font-bold text-foreground">
          You haven&apos;t added any books yet
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-xs mx-auto">
          Share your favorite titles and stories with the BookNook community shelves.
        </p>
        <div className="mt-6">
          <Link
            href="/add-book"
            className="inline-flex items-center gap-2 rounded-xl bg-[#E0A526] px-5 py-2.5 text-sm font-semibold text-[#1F2A44] shadow-sm hover:bg-[#F2C45A] transition-all"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Your First Book</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Desktop Table */}
      <div className="hidden md:block rounded-[20px] border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAF7F2] dark:bg-[#111624]">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-12 text-center text-xs font-bold text-muted-foreground">
                #
              </TableHead>
              <TableHead className="w-24 text-xs font-bold text-muted-foreground">
                Book Cover
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">
                Title
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">
                Author
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">
                Category
              </TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground">
                Added Date
              </TableHead>
              <TableHead className="text-right text-xs font-bold text-muted-foreground pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book, index) => {
              const formattedDate = book.addedDate
                ? new Date(book.addedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—";

              return (
                <TableRow
                  key={book._id}
                  className="border-border hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="text-center font-medium text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="relative aspect-[3/4] w-14 overflow-hidden rounded-lg shadow-sm border border-border">
                      <Image
                        src={book.image}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-serif font-bold text-foreground">
                    <Link
                      href={`/books/${book._id}`}
                      className="hover:text-[#E0A526] transition-colors"
                    >
                      {book.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {book.author}
                  </TableCell>
                  <TableCell>
                    <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground border border-border">
                      {book.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formattedDate}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingBook(book)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#E0A526] px-3.5 text-xs font-semibold text-[#1F2A44] shadow-xs hover:bg-[#F2C45A] transition-all"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <DeleteBookButton
                        bookId={book._id}
                        bookTitle={book.title}
                        onDeleted={handleBookDeleted}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {books.map((book) => {
          const formattedDate = book.addedDate
            ? new Date(book.addedDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—";

          return (
            <div
              key={book._id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-lg shadow-sm border border-border">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <Link
                    href={`/books/${book._id}`}
                    className="font-serif text-base font-bold text-foreground line-clamp-1 hover:text-[#E0A526]"
                  >
                    {book.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium border border-border">
                      {book.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBook(book)}
                  className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#E0A526] text-xs font-semibold text-[#1F2A44]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                <div className="flex-1">
                  <DeleteBookButton
                    bookId={book._id}
                    bookTitle={book.title}
                    onDeleted={handleBookDeleted}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          open={Boolean(editingBook)}
          onOpenChange={(isOpen) => !isOpen && setEditingBook(null)}
          onUpdated={handleBookUpdated}
        />
      )}
    </motion.div>
  );
}
