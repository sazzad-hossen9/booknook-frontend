"use client";

import { useState } from "react";
import { API_URL } from "@/types";
import { getTokenFromClient } from "@/lib/get-token-from-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteBookButtonProps {
  bookId: string;
  bookTitle: string;
  onDeleted: (bookId: string) => void;
}

/**
 * Delete Book Button with shadcn AlertDialog confirmation modal.
 * Prevents accidental deletions with a clear, accessible confirmation dialog.
 */
export function DeleteBookButton({
  bookId,
  bookTitle,
  onDeleted,
}: DeleteBookButtonProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = await getTokenFromClient();
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete book");
      toast.success(`"${bookTitle}" was removed from the library.`);
      onDeleted(bookId);
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete book");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-destructive px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-destructive/90 transition-all active:scale-95"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Delete</span>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-[24px] border-border bg-card p-6 shadow-2xl max-w-sm text-center sm:text-left">
        <AlertDialogHeader className="flex flex-col items-center sm:items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive border border-destructive/20">
            <Trash2 className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <AlertDialogTitle className="font-serif text-xl font-bold text-foreground">
              Delete This Book?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure you want to delete &quot;{bookTitle}&quot;? This action
              cannot be undone and will also clear its borrow history.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-row items-center justify-end gap-2 border-t-0 p-0 bg-transparent">
          <AlertDialogCancel
            className="rounded-xl border-border text-xs font-medium"
            disabled={deleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={deleting}
            className="rounded-xl bg-destructive text-white hover:bg-destructive/90 text-xs font-semibold"
          >
            {deleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete Book"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

