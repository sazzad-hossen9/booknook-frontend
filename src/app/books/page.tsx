import { Suspense } from "react";
import { BooksClient } from "./_components/BooksClient";
import { Spinner } from "@/components/Spinner";

export const metadata = {
  title: "All Books",
  description:
    "Explore our complete collection of books across fiction, science, history, kids and more.",
};

export default function BooksPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12">
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <BooksClient />
      </Suspense>
    </div>
  );
}

