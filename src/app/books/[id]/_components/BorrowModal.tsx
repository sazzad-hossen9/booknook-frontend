"use client";

import { useState } from "react";
import Image from "next/image";
import { Book, API_URL } from "@/types";
import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/get-token-from-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, User, Mail, Calendar, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BorrowModalProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

/**
 * Borrow Confirmation Modal matching Borrow-Confirmation-Modal.png.
 * Shows book preview, user details (read-only), return date selection,
 * and handles borrowing via POST /borrows.
 */
export function BorrowModal({
  book,
  open,
  onOpenChange,
  onSuccess,
}: BorrowModalProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [submitting, setSubmitting] = useState(false);

  const defaultReturnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const handleConfirmBorrow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error("Please log in to borrow books");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const returnDate = String(formData.get("returnDate") || defaultReturnDate);

    setSubmitting(true);
    try {
      const token = await getTokenFromClient();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          bookId: book._id,
          bookTitle: book.title,
          bookImage: book.image,
          returnDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to borrow book");

      toast.success(`You have successfully borrowed "${book.title}"!`);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to borrow book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] w-full rounded-[24px] border-border bg-card p-6 sm:p-7 shadow-2xl">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center gap-3.5 pb-2 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E0A526]/15 text-[#E0A526] border border-[#E0A526]/30">
            <BookOpen className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <DialogTitle className="font-serif text-2xl font-bold text-foreground">
              Borrow This Book
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill in the details to borrow this book.
            </p>
          </div>
        </DialogHeader>

        {/* Mini Book Summary Card */}
        <div className="mt-2 flex items-center gap-4 rounded-2xl border border-border bg-[#FAF7F2] dark:bg-[#111624] p-3.5">
          <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-lg shadow-sm">
            <Image
              src={book.image}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-base font-bold text-foreground line-clamp-1">
              {book.title}
            </h4>
            <p className="text-xs text-[#E0A526] font-medium">
              by {book.author}
            </p>
            <span className="inline-block rounded-full bg-card px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border">
              {book.category}
            </span>
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleConfirmBorrow} className="mt-4 space-y-4">
          {/* User Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              User Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                readOnly
                value={user?.name || "Guest Reader"}
                className="h-[46px] w-full rounded-xl border border-border bg-muted/60 pl-10 pr-4 text-sm text-foreground outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                className="h-[46px] w-full rounded-xl border border-border bg-muted/60 pl-10 pr-4 text-sm text-foreground outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Return Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                name="returnDate"
                required
                min={new Date().toISOString().split("T")[0]}
                defaultValue={defaultReturnDate}
                className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/30"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Standard borrowing period is 14 days. You can adjust your expected return date.
            </p>
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] text-sm font-semibold text-[#1F2A44] shadow-md transition-all duration-200 hover:bg-[#F2C45A] hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Confirming Borrow...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Confirm Borrow</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
