import Link from "next/link";
import { Home } from "lucide-react";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AddBookForm } from "./_components/AddBookForm";

export const metadata = {
  title: "Add Book",
  description: "Share your favourite books with the BookNook reading community.",
};

export default function AddBookPage() {
  return (
    <PrivateRoute>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 space-y-6">
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
          <span className="font-medium text-foreground">Add Book</span>
        </nav>

        {/* Page Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="inline-block rounded-full bg-[#2F7D6D]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#2F7D6D] uppercase">
            SHARE A STORY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1F2A44] dark:text-[#F3EFE6]">
            Add a New Book
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Give your favourite book a place on our community shelves.
          </p>
        </div>

        {/* Form */}
        <AddBookForm />
      </div>
    </PrivateRoute>
  );
}

