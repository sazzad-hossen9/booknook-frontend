"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  BookOpen,
  Plus,
  BookMarked,
  ArrowLeftRight,
  Menu,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";


export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "All Books", href: "/books", icon: BookOpen },
    ...(user
      ? [
          {
            label: "Add Book",
            href: "/add-book",
            icon: Plus,
            isPill: true,
          },
          { label: "My Books", href: "/my-books", icon: BookMarked },
          { label: "My Borrows", href: "/my-borrows", icon: ArrowLeftRight },
        ]
      : []),
  ];

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between rounded-full border border-border bg-card/95 px-5 sm:px-8 shadow-sm backdrop-blur-md transition-all">
        {/* Left: Logo */}
        <Logo />

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const Icon = link.icon;

            if (link.isPill) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mx-1 inline-flex items-center gap-1.5 rounded-full bg-[#E0A526] px-4 py-2 text-sm font-semibold text-[#1F2A44] shadow-sm transition-all hover:bg-[#F2C45A] hover:shadow-md active:scale-95"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors hover:text-[#E0A526] ${
                  isActive
                    ? "font-semibold text-[#1F2A44] dark:text-[#E0A526]"
                    : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#E0A526]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Theme switch & User menu / Auth buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          <div className="h-5 w-px bg-border" />

          {user ? (
            <Popover>
              <PopoverTrigger className="group flex items-center gap-2 rounded-full p-0.5 outline-none transition-transform hover:scale-105 cursor-pointer">
                <Avatar className="h-9 w-9 border-2 border-[#E0A526]/60 shadow-xs">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="bg-[#1F2A44] font-bold text-sm text-[#E0A526]">
                    {(user.email || user.name || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={10}
                className="w-72 rounded-[22px] border border-border bg-card p-4 shadow-2xl backdrop-blur-md"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Avatar className="h-11 w-11 border-2 border-[#E0A526]/50 shadow-xs shrink-0">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback className="bg-[#1F2A44] font-bold text-base text-[#E0A526]">
                      {(user.email || user.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif font-bold text-base text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Quick Navigation Links */}
                <div className="py-2.5 space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-[#E0A526] transition-colors"
                  >
                    <User className="h-4 w-4 text-[#E0A526]" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/my-books"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-[#E0A526] transition-colors"
                  >
                    <BookMarked className="h-4 w-4 text-[#E0A526]" />
                    <span>My Books</span>
                  </Link>
                  <Link
                    href="/my-borrows"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-[#E0A526] transition-colors"
                  >
                    <ArrowLeftRight className="h-4 w-4 text-[#E0A526]" />
                    <span>My Borrows</span>
                  </Link>
                </div>

                {/* Sign Out Button */}
                <div className="pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive hover:text-white transition-all cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex h-9 items-center justify-center rounded-[12px] px-3.5 text-sm font-semibold text-foreground transition-colors hover:text-[#E0A526]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-[12px] bg-[#1F2A44] dark:bg-[#E0A526] px-4 text-xs sm:text-sm font-semibold text-white dark:text-[#0F1420] shadow-sm transition-all hover:bg-[#293757] dark:hover:bg-[#F2C45A]"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger menu */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] bg-card p-6 border-l border-border"
              >
                <SheetHeader className="text-left mb-6">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#E0A526]/15 font-semibold text-[#1F2A44] dark:text-[#E0A526]"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 text-[#E0A526]" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}

                  {user ? (
                    <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-border">
                      <div className="flex items-center gap-3 px-1">
                        <Avatar className="h-10 w-10 border border-[#E0A526]/50 shrink-0">
                          <AvatarImage
                            src={user.image || undefined}
                            alt={user.name || "User"}
                          />
                          <AvatarFallback className="bg-[#1F2A44] font-bold text-sm text-[#E0A526]">
                            {(user.email || user.name || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileOpen(false);
                          handleLogout();
                        }}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-destructive/10 text-sm font-semibold text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-border">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-11 items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex h-11 items-center justify-center rounded-xl bg-[#1F2A44] dark:bg-[#E0A526] text-sm font-semibold text-white dark:text-[#0F1420]"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

