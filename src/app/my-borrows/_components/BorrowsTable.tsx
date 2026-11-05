"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Borrow, API_URL } from "@/types";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/get-token-from-client";
import { ReturnBookButton } from "./ReturnBookButton";
import { Spinner } from "@/components/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  CalendarCheck,
  Clock,
  Sparkles,
  Info,
  ArrowRight,
} from "lucide-react";

/**
 * Borrows Table component matching My-Borrows-Page.png.
 * Features 3 stat cards, full borrows table, mobile card transformation,
 * and immediate state update upon returning a book.
 */
export function BorrowsTable() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBorrows = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const token = await getTokenFromClient();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${API_URL}/borrows?email=${encodeURIComponent(user.email)}`,
        {
          headers,
          cache: "no-store",
        }
      );
      const data = await res.json();
      setBorrows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load borrows:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    loadBorrows();
  }, [loadBorrows]);

  const handleReturned = (borrowId: string) => {
    setBorrows((prev) => prev.filter((b) => b._id !== borrowId));
  };

  // Stat calculations
  const totalBorrowed = borrows.length;
  const now = new Date();
  const dueSoonCount = borrows.filter((b) => {
    if (!b.returnDate) return false;
    const diffDays =
      (new Date(b.returnDate).getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  }).length;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 py-12">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Checking borrowed records...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* 3 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Currently Borrowed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs cursor-default"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2F7D6D]/15 text-[#2F7D6D]">
            <BookOpen className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Currently Borrowed
            </span>
            <p className="font-serif text-3xl font-bold text-foreground">
              {String(totalBorrowed).padStart(2, "0")}
            </p>
          </div>
        </motion.div>

        {/* Returned Books */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs cursor-default"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E0A526]/15 text-[#E0A526]">
            <CalendarCheck className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Lounge Pass
            </span>
            <p className="font-serif text-3xl font-bold text-foreground">
              Active
            </p>
          </div>
        </motion.div>

        {/* Due Soon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs cursor-default"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
            <Clock className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Due Soon
            </span>
            <p className="font-serif text-3xl font-bold text-foreground">
              {String(dueSoonCount).padStart(2, "0")}
            </p>
          </div>
        </motion.div>
      </div>

      {borrows.length === 0 ? (
        <div className="mx-auto max-w-lg rounded-[24px] border border-dashed border-border bg-card p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F7D6D]/15 text-[#2F7D6D]">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-bold text-foreground">
            No active borrowed books
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xs mx-auto">
            You don&apos;t have any books borrowed right now. Browse our library to pick your next story!
          </p>
          <div className="mt-6">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E0A526] px-5 py-2.5 text-sm font-semibold text-[#1F2A44] shadow-sm hover:bg-[#F2C45A] transition-all"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-[20px] border border-border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-[#FAF7F2] dark:bg-[#111624]">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-20 text-xs font-bold text-muted-foreground">
                    Book Image
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">
                    Book Title
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">
                    Borrow Date
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">
                    Return Date
                  </TableHead>
                  <TableHead className="text-xs font-bold text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold text-muted-foreground pr-6">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrows.map((borrow) => {
                  const borrowFormatted = borrow.borrowDate
                    ? new Date(borrow.borrowDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  const returnFormatted = borrow.returnDate
                    ? new Date(borrow.returnDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  const isDueSoon =
                    borrow.returnDate &&
                    (new Date(borrow.returnDate).getTime() - now.getTime()) /
                      (1000 * 60 * 60 * 24) <=
                      3;

                  return (
                    <TableRow
                      key={borrow._id}
                      className="border-border hover:bg-muted/40 transition-colors"
                    >
                      <TableCell>
                        <div className="relative aspect-[3/4] w-14 overflow-hidden rounded-lg shadow-sm border border-border">
                          <Image
                            src={borrow.bookImage}
                            alt={borrow.bookTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-serif font-bold text-foreground">
                        <Link
                          href={`/books/${borrow.bookId}`}
                          className="hover:text-[#E0A526] transition-colors"
                        >
                          {borrow.bookTitle}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {borrowFormatted}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {returnFormatted}
                      </TableCell>
                      <TableCell>
                        {isDueSoon ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                            <Clock className="h-3 w-3" />
                            Due Soon
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Borrowed
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <ReturnBookButton
                          borrowId={borrow._id}
                          bookTitle={borrow.bookTitle}
                          onReturned={handleReturned}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {borrows.map((borrow) => {
              const borrowFormatted = borrow.borrowDate
                ? new Date(borrow.borrowDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—";

              const returnFormatted = borrow.returnDate
                ? new Date(borrow.returnDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—";

              return (
                <div
                  key={borrow._id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-lg shadow-sm border border-border">
                      <Image
                        src={borrow.bookImage}
                        alt={borrow.bookTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/books/${borrow.bookId}`}
                        className="font-serif text-base font-bold text-foreground line-clamp-1 hover:text-[#E0A526]"
                      >
                        {borrow.bookTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Borrowed: {borrowFormatted}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        Due: {returnFormatted}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <ReturnBookButton
                      borrowId={borrow._id}
                      bookTitle={borrow.bookTitle}
                      onReturned={handleReturned}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Friendly Reminder Banner */}
          <div className="flex items-center gap-3 rounded-2xl border border-[#2F7D6D]/20 bg-[#2F7D6D]/10 px-5 py-4 text-xs sm:text-sm text-[#2F7D6D]">
            <Info className="h-5 w-5 shrink-0" />
            <p>
              Enjoying your book? Remember to return it on time so another reader can discover its magic.
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}

