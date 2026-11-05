import Link from "next/link";
import Image from "next/image";
import { Home, Compass } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for wandered off our library shelves.",
};

/**
 * Custom 404 Not Found page matching Custom-404-Page.png.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-10 rounded-[28px] border border-border bg-card p-8 sm:p-14 shadow-sm">
        {/* Left Column: Visual Illustration */}
        <div className="md:col-span-6 flex justify-center">
          <div className="relative aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-2xl shadow-md border border-border">
            <Image
              src="/images/not-found.jpg"
              alt="404 Page Wandered Off"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Column: Friendly 404 Message */}
        <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <span className="font-serif text-7xl sm:text-8xl font-black tracking-tight text-[#1F2A44] dark:text-[#E0A526]">
            404
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Oops! This page wandered off.
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
            The page you&apos;re looking for may have moved, or it might be hiding
            peacefully between the library shelves.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/"
              className="inline-flex h-[46px] w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#1F2A44] dark:bg-[#E0A526] px-6 text-sm font-semibold text-white dark:text-[#0F1420] shadow-sm hover:bg-[#28385C] dark:hover:bg-[#F2C45A] transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/books"
              className="inline-flex h-[46px] w-full sm:w-auto items-center justify-center gap-2 text-sm font-semibold text-[#E0A526] hover:underline"
            >
              <Compass className="h-4 w-4" />
              <span>Explore All Books</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

