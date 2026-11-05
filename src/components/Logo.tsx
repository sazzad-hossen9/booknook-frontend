import Link from "next/link";
import { BookOpen } from "lucide-react";

interface LogoProps {
  className?: string;
  isFooter?: boolean;
}

/**
 * Official BookNook Logo built with Lucide-react BookOpen icon and Playfair typography.
 */
export function Logo({ className = "", isFooter = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2A44] shadow-sm border border-[#E0A526]/30">
        <BookOpen className="h-5 w-5 text-[#E0A526]" strokeWidth={2.2} />
      </div>
      <div className="flex items-baseline font-serif text-2xl font-bold tracking-tight">
        <span
          className={
            isFooter
              ? "text-white"
              : "text-[#1F2A44] dark:text-[#F3EFE6]"
          }
        >
          Book
        </span>
        <span className="text-[#E0A526]">Nook</span>
      </div>
    </Link>
  );
}

