"use client";

import { useEffect, useState, useMemo, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Book, API_URL } from "@/types";
import { BookCard } from "@/components/BookCard";
import { BookFilter } from "./BookFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { BookX } from "lucide-react";

/**
 * Interactive client component for the All Books page.
 * Fetches all books from the backend once. All Search, Category Filtering,
 * and Sorting are performed purely on the client side using JavaScript array methods.
 */
export function BooksClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "newest";

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Fetch all books from the backend once on mount (no search/filter query params sent to backend)
  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/books`, {
          cache: "no-store",
        });
        const data = await res.json();
        setAllBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch books from backend:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  // Sync state if URL query params change externally
  useEffect(() => {
    const urlCat = searchParams.get("category") || "All";
    const urlSearch = searchParams.get("search") || "";
    const urlSort = searchParams.get("sort") || "newest";
    setCategory(urlCat);
    setSearch(urlSearch);
    setSort(urlSort);
  }, [searchParams]);

  // Frontend Search, Category Filter, and Sorting using JS array methods
  const filteredBooks = useMemo(() => {
    let result = [...allBooks];

    // 1. Search by book title on frontend
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((book) =>
        book.title?.toLowerCase().includes(q)
      );
    }

    // 2. Category filtering on frontend
    if (category && category !== "All") {
      result = result.filter(
        (book) => book.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // 3. Sorting on frontend (Newest / Oldest)
    result.sort((a, b) => {
      const dateA = new Date(a.addedDate || 0).getTime();
      const dateB = new Date(b.addedDate || 0).getTime();

      if (sort === "oldest") {
        return dateA - dateB;
      }
      // default: newest
      return dateB - dateA;
    });

    return result;
  }, [allBooks, search, category, sort]);

  const updateUrlParams = (newCat: string, newSearch: string, newSort: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (newCat && newCat !== "All") params.set("category", newCat);
      if (newSearch) params.set("search", newSearch);
      if (newSort && newSort !== "newest") params.set("sort", newSort);

      const qs = params.toString();
      router.replace(qs ? `/books?${qs}` : "/books", { scroll: false });
    });
  };

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    updateUrlParams(newCat, search, sort);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    updateUrlParams(category, newSearch, sort);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    updateUrlParams(category, search, newSort);
  };

  const handleResetFilters = () => {
    setCategory("All");
    setSearch("");
    setSort("newest");
    router.replace("/books", { scroll: false });
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <span className="inline-block rounded-full bg-[#2F7D6D]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#2F7D6D] uppercase">
          THE COMMUNITY SHELVES
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1F2A44] dark:text-[#F3EFE6]">
          Find your next read
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          Explore our collection of amazing books across all genres.
        </p>
      </motion.div>

      {/* Search, Filter & Sort Bar */}
      <BookFilter
        search={search}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <p className="text-sm font-medium text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {loading ? "..." : filteredBooks.length}
          </span>{" "}
          books
        </p>
        {(category !== "All" || search || sort !== "newest") && (
          <button
            onClick={handleResetFilters}
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
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="mt-4 flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card p-8">
          <BookX className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-base font-semibold">No books match your filters</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search title, picking a different category, or resetting all filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-6 rounded-xl bg-[#E0A526] px-5 py-2.5 text-sm font-semibold text-[#1F2A44] hover:bg-[#F2C45A] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
