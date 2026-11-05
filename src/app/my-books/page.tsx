import { PrivateRoute } from "@/components/PrivateRoute";
import { MyBooksTable } from "./_components/MyBooksTable";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "My Books",
  description: "Manage and edit the books you have contributed to the library.",
};

export default function MyBooksPage() {
  return (
    <PrivateRoute>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E0A526]/15 text-[#E0A526] border border-[#E0A526]/30">
            <BookOpen className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              My Books
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage the books you&apos;ve added to the library collection.
            </p>
          </div>
        </div>

        {/* Table / Cards */}
        <MyBooksTable />
      </div>
    </PrivateRoute>
  );
}

