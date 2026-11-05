"use client";

import { useState } from "react";
import { API_URL } from "@/types";
import { getTokenFromClient } from "@/lib/get-token-from-client";
import { RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ReturnBookButtonProps {
  borrowId: string;
  bookTitle: string;
  onReturned: (borrowId: string) => void;
}

/**
 * Return Book Action Button.
 * Calls DELETE /borrows/:id to return the book and increments available copies.
 */
export function ReturnBookButton({
  borrowId,
  bookTitle,
  onReturned,
}: ReturnBookButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    setLoading(true);
    try {
      const token = await getTokenFromClient();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/borrows/${borrowId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to return book");
      toast.success(`"${bookTitle}" was returned successfully! Thank you.`);
      onReturned(borrowId);
    } catch (err: any) {
      toast.error(err?.message || "Failed to return book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleReturn}
      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#1F2A44] dark:bg-[#28324D] px-3.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#2e3e63] active:scale-95 disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <RotateCcw className="h-3.5 w-3.5 text-[#E0A526]" />
      )}
      <span>Return Book</span>
    </button>
  );
}

