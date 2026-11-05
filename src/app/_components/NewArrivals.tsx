"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Book, API_URL } from "@/types";
import { BookCard } from "@/components/BookCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BookOpen } from "lucide-react";

/**
 * New Arrivals section displaying the 6 most recently added books.
 */
export function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNewBooks() {
      try {
        const res = await fetch(`${API_URL}/books?sort=newest&limit=6`, { cache: "no-store" });
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load new arrivals:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNewBooks();
  }, []);

  return (
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
      <SectionHeading
        title="New Arrivals"
        subtitle="Explore our latest collection of amazing books."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-[20px] border border-border bg-card p-4 sm:p-5"
            >
              <Skeleton className="h-[135px] w-[100px] shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-20 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {books.map((book) => (
            <BookCard key={book._id} book={book} variant="horizontal" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card p-8">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-base font-semibold">No books available yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first reader to add a book to our community shelves!
          </p>
          <div className="mt-6">
            <Link
              href="/add-book"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E0A526] px-5 py-2.5 text-sm font-semibold text-[#1F2A44]"
            >
              Add a Book
            </Link>
          </div>
        </div>
      )}

      {/* Button to see all books */}
      <div className="mt-12 text-center">
        <Link
          href="/books"
          className="inline-flex items-center gap-2.5 rounded-full bg-[#1F2A44] dark:bg-[#E0A526] px-7 py-3 text-sm font-semibold text-white dark:text-[#0F1420] shadow-sm transition-all duration-300 hover:bg-[#28385C] dark:hover:bg-[#F2C45A] hover:shadow-md active:scale-95"
        >
          <BookOpen className="h-4 w-4" />
          <span>See All Books</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

