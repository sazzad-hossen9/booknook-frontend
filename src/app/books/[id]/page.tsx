import { PrivateRoute } from "@/components/PrivateRoute";
import { BookDetailsClient } from "./_components/BookDetailsClient";

export const metadata = {
  title: "Book Details",
  description: "View detailed book information and borrow copies online.",
};

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <PrivateRoute>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10">
        <BookDetailsClient id={resolvedParams.id} />
      </div>
    </PrivateRoute>
  );
}

