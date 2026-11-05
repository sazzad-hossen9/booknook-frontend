"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Book, API_URL } from "@/types";
import { BorrowModal } from "./BorrowModal";
import { Spinner } from "@/components/Spinner";
import {
  Home,
  BookOpen,
  Calendar,
  Layers,
  User,
  Mail,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

interface BookDetailsClientProps {
  id: string;
}

/**
 * Interactive client component for Book Details page.
 * Loads book by ID, renders detailed metadata matching Book-Details-Page.png,
 * and controls the borrow modal state.
 */
export function BookDetailsClient({ id }: BookDetailsClientProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  const loadBook = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/books/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load book details");
      const data = await res.json();
      setBook(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load book details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Opening library records...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-destructive/30 bg-card p-8 text-center">
        <h3 className="font-serif text-2xl font-bold text-destructive">
          Book Not Found
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {error || "The requested book could not be found in our collection."}
        </p>
        <div className="mt-6">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back to All Books
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = book.copies > 0;
  const formattedDate = book.addedDate
    ? new Date(book.addedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        <span>/</span>
        <Link href="/books" className="hover:text-foreground transition-colors">
          Books
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground line-clamp-1">
          {book.title}
        </span>
      </nav>

      {/* Main Book Detail Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-[24px] border border-border bg-card p-6 sm:p-10 shadow-sm"
      >
        {/* Left Column: Book Cover */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
          <div className="relative aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-2xl shadow-xl border border-border/50">
            <Image
              src={book.image}
              alt={book.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Middle Column: Details & Description */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {book.title}
            </h1>
            <p className="text-base font-medium text-[#E0A526]">
              by {book.author}
            </p>

            {/* Category badge */}
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[#FAF7F2] dark:bg-[#111624] px-3.5 py-1 text-xs font-semibold text-foreground">
                <BookOpen className="h-3.5 w-3.5 text-[#E0A526]" />
                {book.category}
              </span>
            </div>

            {/* Added on and Copies pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-[#FAF7F2] dark:bg-[#111624] px-4 py-2 text-xs">
                <Calendar className="h-4 w-4 text-[#E0A526]" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">
                    Added on
                  </span>
                  <span className="font-semibold text-foreground">
                    {formattedDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-[#FAF7F2] dark:bg-[#111624] px-4 py-2 text-xs">
                <Layers className="h-4 w-4 text-[#2F7D6D]" />
                <div>
                  <span className="text-muted-foreground block text-[10px]">
                    Available Copies
                  </span>
                  <span className="font-semibold text-foreground">
                    {book.copies}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <BookOpen className="h-4 w-4 text-[#E0A526]" />
                <h3 className="font-serif text-base">Description</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {/* Borrow This Book button right after Description */}
            <div className="pt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                disabled={!isAvailable}
                onClick={() => setIsBorrowModalOpen(true)}
                className="inline-flex h-[46px] items-center justify-center gap-2.5 rounded-xl bg-[#E0A526] px-6 text-sm font-bold text-[#1F2A44] shadow-md transition-colors hover:bg-[#F2C45A] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <BookOpen className="h-4 w-4 stroke-[2.5]" />
                <span>Borrow This Book</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </motion.button>
            </div>
          </div>

          {/* Added by footer banner */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl bg-[#FAF7F2] dark:bg-[#111624] px-4 py-3 text-xs text-muted-foreground border border-border">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <User className="h-3.5 w-3.5 text-[#E0A526]" />
              <span>Added by: {book.userName}</span>
            </div>
            <div className="h-3 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{book.userEmail}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Action Card & Quick Info */}
        <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl border border-border bg-[#FAF7F2]/60 dark:bg-[#111624]/60 p-6 space-y-6">
          <div className="space-y-5">
            {/* Availability status badge */}
            <div>
              {isAvailable ? (
                <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F7D6D]/15 px-4 py-2.5 text-sm font-semibold text-[#2F7D6D]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Available ({book.copies} left)</span>
                </div>
              ) : (
                <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#D64545]/15 px-4 py-2.5 text-sm font-semibold text-[#D64545]">
                  <XCircle className="h-4 w-4" />
                  <span>Not Available</span>
                </div>
              )}
            </div>

            <div className="h-px w-full bg-border" />

            {/* Quick Info list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quick Info
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold text-foreground">
                    {book.category}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Author</span>
                  <span className="font-semibold text-foreground">
                    {book.author}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-semibold text-foreground">
                    {book.copies} copies
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative book stack motif */}
          <div className="pt-4 flex justify-center opacity-70">
            <div className="h-14 w-20 relative flex flex-col items-center justify-end gap-1">
              <div className="h-2.5 w-16 rounded-xs bg-[#E0A526]" />
              <div className="h-2.5 w-20 rounded-xs bg-[#1F2A44] dark:bg-[#28324D]" />
              <div className="h-2.5 w-24 rounded-xs bg-[#2F7D6D]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Borrow Modal Dialog */}
      <BorrowModal
        book={book}
        open={isBorrowModalOpen}
        onOpenChange={setIsBorrowModalOpen}
        onSuccess={loadBook}
      />
    </div>
  );
}

