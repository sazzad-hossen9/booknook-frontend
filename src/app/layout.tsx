import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CursorFollower } from "@/components/CursorFollower";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BookNook | Cozy Modern Reading Lounge",
    template: "BookNook | %s",
  },
  description:
    "Discover, borrow and share books in our cozy community reading lounge.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CursorFollower />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
