"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Book, API_URL } from "@/types";
import { BookCard } from "@/components/BookCard";
import { BookFilter } from "./BookFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { BookX } from "lucide-react";

/**
 * Interactive client component for the All Books page.
 * Manages search, category selection, query sync, and responsive book grid.
 */
export function BooksClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const query = new URLSearchParams({ sort: "newest" });
        if (category !== "All") query.set("category", category);
        if (search.trim()) query.set("search", search.trim());

        const res = await fetch(`${API_URL}/books?${query.toString()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        const list: Book[] = Array.isArray(data) ? data : [];
        list.sort(
          (a, b) =>
            new Date(b.addedDate || 0).getTime() -
            new Date(a.addedDate || 0).getTime()
        );
        setBooks(list);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadBooks, 250);
    return () => clearTimeout(timer);
  }, [category, search]);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      if (newCat && newCat !== "All") {
        params.set("category", newCat);
      } else {
        params.delete("category");
      }
      router.replace(`/books?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }
      router.replace(`/books?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="inline-block rounded-full bg-[#2F7D6D]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#2F7D6D] uppercase">
          THE COMMUNITY SHELVES
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1F2A44] dark:text-[#F3EFE6]">
          Find your next read
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          Explore our collection of amazing books across all genres.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <BookFilter
        search={search}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="text-sm font-medium text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {loading ? "..." : books.length}
          </span>{" "}
          books
        </p>
        {(category !== "All" || search) && (
          <button
            onClick={() => {
              setCategory("All");
              setSearch("");
              router.replace("/books", { scroll: false });
            }}
            className="text-xs font-semibold text-[#E0A526] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex h-[380px] flex-col rounded-[16px] border border-border bg-card p-5"
            >
              <Skeleton className="h-[220px] w-full rounded-xl" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-5 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <Skeleton className="h-6 w-20 mx-auto rounded-full" />
              </div>
              <Skeleton className="mt-auto h-11 w-full rounded-[12px]" />
            </div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card p-8">
          <BookX className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No books found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            We couldn&apos;t find any books matching your criteria. Try adjusting your
            search terms or selecting a different category.
          </p>
        </div>
      )}
    </div>
  );
}

