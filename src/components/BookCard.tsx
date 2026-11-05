import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types";
import { BookOpen, Atom, Landmark, Sparkles, Smile } from "lucide-react";

interface BookCardProps {
  book: Book;
  variant?: "vertical" | "horizontal";
}

const CATEGORY_MAP: Record<string, { icon: typeof BookOpen; bg: string }> = {
  Fiction: {
    icon: BookOpen,
    bg: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/50",
  },
  Science: {
    icon: Atom,
    bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/50",
  },
  History: {
    icon: Landmark,
    bg: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/50",
  },
  Kids: {
    icon: Smile,
    bg: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/50",
  },
  Others: {
    icon: Sparkles,
    bg: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200/50",
  },
};

/**
 * Shared BookCard component for displaying book covers, metadata, and view link.
 */
export function BookCard({ book, variant = "vertical" }: BookCardProps) {
  const categoryMeta = CATEGORY_MAP[book.category] || CATEGORY_MAP.Others;
  const CategoryIcon = categoryMeta.icon;

  if (variant === "horizontal") {
    return (
      <Link
        href={`/books/${book._id}`}
        className="group flex items-center gap-4 rounded-[20px] border border-border bg-card p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#E0A526]/60 hover:shadow-md"
      >
        <div className="relative aspect-[3/4] w-[95px] sm:w-[105px] shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm">
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="120px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center min-w-0 pr-1 text-left">
          <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-foreground line-clamp-2 leading-snug group-hover:text-[#E0A526] transition-colors">
            {book.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1">
            {book.author}
          </p>
          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${categoryMeta.bg}`}
            >
              <CategoryIcon className="h-3 w-3 stroke-[2.2]" />
              <span>{book.category}</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group flex h-full flex-col justify-between rounded-[16px] border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col items-center">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-xl bg-muted shadow-md transition-shadow group-hover:shadow-xl">
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Book Info */}
        <div className="mt-4 w-full space-y-1.5 text-center">
          <h3 className="font-serif text-[18px] font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {book.author}
          </p>
          <div className="pt-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${categoryMeta.bg}`}
            >
              <CategoryIcon className="h-3.5 w-3.5" />
              {book.category}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 pt-2">
        <Link
          href={`/books/${book._id}`}
          className="flex h-[42px] w-full items-center justify-center rounded-[12px] bg-[#1F2A44] dark:bg-[#E0A526] text-sm font-semibold text-white dark:text-[#0F1420] shadow-sm transition-all duration-200 hover:bg-[#293757] dark:hover:bg-[#F2C45A] active:scale-[0.99]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
