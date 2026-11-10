"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  CalendarCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  ArrowUpDown,
} from "lucide-react";

/**
 * My Borrows Page Table & Cards component.
 * Features frontend Return Date filtering and sorting using JavaScript array methods (.filter and .sort).
 * All data is fetched from the backend and managed locally in the client.
 */
export function BorrowsTable() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  // Frontend Return Date filter and sort states
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [dateSort, setDateSort] = useState<string>("soonest");

  const loadBorrows = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const token = await getTokenFromClient();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Fetch user's borrows from protected endpoint
      const res = await fetch(
        `${API_URL}/my-borrows/${encodeURIComponent(user.email)}`,
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
  const currentTime = Date.now();
  const dueSoonCount = borrows.filter((b) => {
    if (!b.returnDate) return false;
    const diffDays =
      (new Date(b.returnDate).getTime() - currentTime) /
      (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 3;
  }).length;

  // Frontend Return Date filtering and sorting using JS array methods
  const filteredBorrows = useMemo(() => {
    let list = [...borrows];
    const nowMs = Date.now();

    // Filter by Return Date on frontend
    if (dateFilter === "due-soon") {
      list = list.filter((b) => {
        if (!b.returnDate) return false;
        const diffDays =
          (new Date(b.returnDate).getTime() - nowMs) /
          (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 3;
      });
    } else if (dateFilter === "overdue") {
      list = list.filter((b) => {
        if (!b.returnDate) return false;
        return new Date(b.returnDate).getTime() < nowMs;
      });
    }

    // Sort by Return Date on frontend
    list.sort((a, b) => {
      const dateA = new Date(a.returnDate || 0).getTime();
      const dateB = new Date(b.returnDate || 0).getTime();
      return dateSort === "latest" ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [borrows, dateFilter, dateSort]);

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
          onClick={() => setDateFilter((prev) => (prev === "due-soon" ? "all" : "due-soon"))}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs cursor-pointer hover:border-amber-500/40 transition-colors"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
            <Clock className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Due Soon (≤ 3 Days)
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
          {/* Frontend Return Date Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Filter by Return Date:
              </span>
              <div className="w-44">
                <Select
                  value={dateFilter}
                  onValueChange={(val) => setDateFilter(val || "all")}
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border-border text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#2F7D6D]" />
                      <SelectValue placeholder="All Dates" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-card shadow-lg">
                    <SelectItem value="all" className="cursor-pointer text-xs">
                      All Return Dates
                    </SelectItem>
                    <SelectItem value="due-soon" className="cursor-pointer text-xs">
                      Due Soon (≤ 3 Days)
                    </SelectItem>
                    <SelectItem value="overdue" className="cursor-pointer text-xs">
                      Overdue
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-48">
                <Select
                  value={dateSort}
                  onValueChange={(val) => setDateSort(val || "soonest")}
                >
                  <SelectTrigger className="h-9 w-full rounded-xl border-border text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-3.5 w-3.5 text-[#E0A526]" />
                      <SelectValue placeholder="Sort Return Date" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-card shadow-lg">
                    <SelectItem value="soonest" className="cursor-pointer text-xs">
                      Return Date: Soonest First
                    </SelectItem>
                    <SelectItem value="latest" className="cursor-pointer text-xs">
                      Return Date: Latest First
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-xs font-medium text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredBorrows.length}</span> of {borrows.length} records
            </p>
          </div>

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
                {filteredBorrows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                      No records match the selected return date filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBorrows.map((borrow) => {
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

                    const isOverdue =
                      borrow.returnDate &&
                      new Date(borrow.returnDate).getTime() < currentTime;

                    const isDueSoon =
                      borrow.returnDate &&
                      !isOverdue &&
                      (new Date(borrow.returnDate).getTime() - currentTime) /
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
                        <TableCell className="text-xs text-muted-foreground font-medium">
                          {returnFormatted}
                        </TableCell>
                        <TableCell>
                          {isOverdue ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-3 py-1 text-xs font-semibold text-red-700 dark:text-red-300">
                              <Clock className="h-3 w-3" />
                              Overdue
                            </span>
                          ) : isDueSoon ? (
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
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {filteredBorrows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm rounded-2xl border border-dashed border-border p-4">
                No records match the selected return date filter.
              </div>
            ) : (
              filteredBorrows.map((borrow) => {
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
              })
            )}
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
