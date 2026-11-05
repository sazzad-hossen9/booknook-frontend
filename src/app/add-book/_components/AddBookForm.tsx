"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/types";
import { uploadImageToImgbb } from "@/lib/upload-image";
import { getTokenFromClient } from "@/lib/get-token-from-client";
import {
  BookOpen,
  User,
  LayoutGrid,
  Layers,
  FileText,
  UploadCloud,
  Mail,
  Plus,
  Loader2,
  Info,
  X,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Add Book Form component matching Add-Book-Page.png.
 * Uses clean native FormData, file picker with 2MB validation and preview,
 * automated imgbb upload, and clean two-column desktop layout.
 */
export function AddBookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size must be less than 2MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("You must be logged in to add a book.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload a book cover image.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    const title = String(formValues.title || "").trim();
    const author = String(formValues.author || "").trim();
    const category = String(formValues.category || "Fiction").trim();
    const copies = Number(formValues.copies) || 1;
    const description = String(formValues.description || "").trim();

    if (!title || !author || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Upload image file to imgbb
      toast.loading("Uploading book cover to ImgBB...", { id: "add-book-progress" });
      const uploadedImageUrl = await uploadImageToImgbb(selectedFile);

      // Step 2: Post to backend with the hosted image URL and JWT
      toast.loading("Adding book to library...", { id: "add-book-progress" });
      const token = await getTokenFromClient();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          author,
          category,
          copies,
          description,
          image: uploadedImageUrl,
          userName: user.name || "Community Member",
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData?.message || "Failed to add book");

      toast.success("Book added to the library successfully!", {
        id: "add-book-progress",
      });
      router.push("/my-books");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add book. Please try again.", {
        id: "add-book-progress",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[24px] border border-border bg-card p-6 sm:p-10 shadow-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Form Inputs */}
        <div className="space-y-5">
          {/* Book Title */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <BookOpen className="h-4 w-4 text-[#E0A526]" />
              <span>Book Title</span>
            </label>
            <input
              name="title"
              type="text"
              required
              minLength={2}
              placeholder="Enter book title..."
              className="h-[46px] w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground"
            />
          </div>

          {/* Author Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <User className="h-4 w-4 text-[#E0A526]" />
              <span>Author Name</span>
            </label>
            <input
              name="author"
              type="text"
              required
              minLength={2}
              placeholder="Enter author name..."
              className="h-[46px] w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <LayoutGrid className="h-4 w-4 text-[#E0A526]" />
              <span>Category</span>
            </label>
            <select
              name="category"
              defaultValue="Fiction"
              className="h-[46px] w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 cursor-pointer"
            >
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Kids">Kids</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Total Copies */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Layers className="h-4 w-4 text-[#E0A526]" />
              <span>Total Copies</span>
            </label>
            <input
              name="copies"
              type="number"
              min={1}
              max={100}
              defaultValue={1}
              required
              className="h-[46px] w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20"
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <FileText className="h-4 w-4 text-[#E0A526]" />
              <span>Short Description</span>
            </label>
            <textarea
              name="description"
              rows={4}
              required
              minLength={10}
              placeholder="Write a short description about this book..."
              className="w-full rounded-xl border border-border bg-card p-3.5 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground resize-none"
            />
          </div>
        </div>

        {/* Right Column: Image Uploader & Read-Only User Info */}
        <div className="space-y-5">
          {/* Book Image Upload Area */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <UploadCloud className="h-4 w-4 text-[#E0A526]" />
              <span>Book Image</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-[#FAF7F2] dark:bg-[#111624] p-5 text-center">
              {/* Preview or Drop Area */}
              {previewUrl ? (
                <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-xl border border-border shadow-md">
                  <Image
                    src={previewUrl}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-border text-[#1F2A44] dark:text-[#E0A526] shadow-xs">
                    <UploadCloud className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <h4 className="mt-3 font-serif text-base font-bold text-foreground">
                    Drop your book cover here
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG or WEBP (recommended 3:4 ratio, max 2MB)
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex h-9 items-center justify-center rounded-xl bg-[#E0A526] px-4 text-xs font-bold text-[#1F2A44] shadow-xs hover:bg-[#F2C45A] transition-all cursor-pointer"
                    >
                      Browse Image
                    </button>
                  </div>
                </div>
              )}

              {/* Decorative mini books stacked */}
              <div className="hidden sm:flex flex-col items-center justify-center pl-4 border-l border-border/60">
                <div className="h-16 w-16 relative flex flex-col items-center justify-end gap-1 opacity-80">
                  <div className="h-2 w-12 rounded-xs bg-[#E0A526]" />
                  <div className="h-2 w-14 rounded-xs bg-[#1F2A44] dark:bg-[#28324D]" />
                  <div className="h-2 w-16 rounded-xs bg-[#2F7D6D]" />
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Added By (Read Only) */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <User className="h-4 w-4 text-[#E0A526]" />
              <span>Added By</span>
            </label>
            <input
              type="text"
              readOnly
              value={user?.name || "Member"}
              className="h-[46px] w-full rounded-xl border border-border bg-muted/60 px-4 text-sm text-foreground outline-none cursor-not-allowed"
            />
          </div>

          {/* User Email (Read Only) */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Mail className="h-4 w-4 text-[#E0A526]" />
              <span>User Email</span>
            </label>
            <input
              type="email"
              readOnly
              value={user?.email || ""}
              className="h-[46px] w-full rounded-xl border border-border bg-muted/60 px-4 text-sm text-foreground outline-none cursor-not-allowed"
            />
          </div>

          {/* Community Info Banner */}
          <div className="flex items-center gap-2.5 rounded-xl bg-[#2F7D6D]/10 px-4 py-3 text-xs text-[#2F7D6D] border border-[#2F7D6D]/20">
            <Info className="h-4 w-4 shrink-0" />
            <span>This book will be added to the community library collection.</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={submitting}
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#1F2A44] dark:bg-[#E0A526] text-sm font-semibold text-white dark:text-[#0F1420] shadow-sm transition-all duration-200 hover:bg-[#293757] dark:hover:bg-[#F2C45A] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Book to Shelves...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Book</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
