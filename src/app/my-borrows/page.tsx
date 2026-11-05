import { PrivateRoute } from "@/components/PrivateRoute";
import { BorrowsTable } from "./_components/BorrowsTable";

export const metadata = {
  title: "My Borrows",
  description: "Keep track of the books and stories you have currently borrowed.",
};

export default function MyBorrowsPage() {
  return (
    <PrivateRoute>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2 mb-8">
          <span className="inline-block rounded-full bg-[#2F7D6D]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#2F7D6D] uppercase">
            YOUR READING JOURNEY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            My Borrows
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Keep track of the stories you&apos;re currently enjoying.
          </p>
        </div>

        {/* Table & Stats */}
        <BorrowsTable />
      </div>
    </PrivateRoute>
  );
}

