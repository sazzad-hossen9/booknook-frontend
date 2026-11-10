"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Book, API_URL } from "@/types";
import { uploadImageToImgbb } from "@/lib/upload-image";
import { getTokenFromClient } from "@/lib/get-token-from-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Upload,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface EditBookModalProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (updatedBook: Book) => void;
}

/**
 * Edit Book Dialog matching My-Books-Page.png.
 * Allows updating title, author, category, description and optional cover image.
 */
export function EditBookModal({
  book,
  open,
  onOpenChange,
  onUpdated,
}: EditBookModalProps) {
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file must be under 2MB.");
      return;
    }

    setNewImageFile(file);
    setNewPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    const title = String(formValues.title || "").trim();
    const author = String(formValues.author || "").trim();
    const category = String(formValues.category || "Fiction").trim();
    const description = String(formValues.description || "").trim();
    const manualImageUrl = String(formValues.imageUrl || "").trim();

    if (!title || !author || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = manualImageUrl || book.image;

      if (newImageFile) {
        toast.loading("Uploading new cover image to ImgBB...", { id: "edit-progress" });
        finalImageUrl = await uploadImageToImgbb(newImageFile);
      }

      toast.loading("Updating book details...", { id: "edit-progress" });
      const token = await getTokenFromClient();
      if (!token) {
        toast.error("Your session has expired. Please sign in again.", { id: "edit-progress" });
        setSaving(false);
        return;
      }
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(`${API_URL}/books/${book._id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          title,
          author,
          category,
          description,
          image: finalImageUrl,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData?.message || "Failed to update book");

      const updated: Book = {
        ...book,
        title,
        author,
        category,
        description,
        image: finalImageUrl,
      };

      toast.success("Book updated successfully!", { id: "edit-progress" });
      onUpdated(updated);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update book", {
        id: "edit-progress",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] w-full rounded-[24px] border-border bg-card p-6 sm:p-7 shadow-2xl">
        <DialogHeader className="flex flex-row items-center gap-2.5 pb-2 text-left">
          <BookOpen className="h-6 w-6 text-[#1F2A44] dark:text-[#E0A526] stroke-[2]" />
          <DialogTitle className="font-serif text-2xl font-bold text-[#1F2A44] dark:text-[#F3EFE6]">
            Edit Book
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 items-start">
            {/* Left side: Image preview & Change Image button */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="relative aspect-[3/4] w-[140px] overflow-hidden rounded-xl shadow-md border border-border bg-muted">
                <Image
                  src={newPreviewUrl || book.image}
                  alt={book.title}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-9 w-[140px] items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-[#E0A526]" />
                <span>Change Image</span>
              </button>
              {newImageFile && (
                <p className="text-[11px] text-[#2F7D6D] font-medium text-center w-[140px]">
                  New image selected
                </p>
              )}
            </div>

            {/* Right side: Form Fields */}
            <div className="space-y-3 flex-1 min-w-0">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Book Title
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={book.title}
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[#E0A526] transition-colors"
                />
              </div>

              {/* Author */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Author Name
                </label>
                <input
                  name="author"
                  type="text"
                  required
                  defaultValue={book.author}
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[#E0A526] transition-colors"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={book.category}
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[#E0A526] transition-colors cursor-pointer"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Kids">Kids</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Cover Image URL
                </label>
                <input
                  name="imageUrl"
                  type="url"
                  defaultValue={book.image}
                  className="h-[42px] w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground outline-none focus:border-[#E0A526] transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Short Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  defaultValue={book.description}
                  className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-[#E0A526] resize-none transition-colors"
                />
              </div>

              {/* Read Only Meta */}
              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <div className="space-y-1 min-w-0">
                  <span className="text-xs font-semibold text-muted-foreground block truncate">User Name</span>
                  <input
                    type="text"
                    readOnly
                    value={book.userName}
                    title={book.userName}
                    className="h-9 w-full rounded-lg bg-muted/60 border border-border/50 px-2.5 text-xs text-muted-foreground cursor-not-allowed outline-none truncate"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-xs font-semibold text-muted-foreground block truncate">Email Address</span>
                  <input
                    type="text"
                    readOnly
                    value={book.userEmail}
                    title={book.userEmail}
                    className="h-9 w-full rounded-lg bg-muted/60 border border-border/50 px-2.5 text-xs text-muted-foreground cursor-not-allowed outline-none truncate"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-5 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] text-sm font-semibold text-[#1F2A44] shadow-md hover:bg-[#F2C45A] active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Update Book</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
