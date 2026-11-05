"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  ShieldCheck,
  BookMarked,
  ArrowLeftRight,
  Plus,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Interactive Profile component showing user details, avatar, and quick links.
 */
export function ProfileClient() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
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

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Profile Card */}
      <div className="rounded-[24px] border border-border bg-card p-8 sm:p-10 shadow-sm text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar with gold ring */}
          <Avatar className="h-24 w-24 border-2 border-[#E0A526] shadow-md">
            <AvatarImage
              src={user?.image || undefined}
              alt={user?.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-[#1F2A44] font-serif text-3xl font-bold text-[#E0A526]">
              {(user?.email || user?.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {user?.name || "BookNook Reader"}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2F7D6D]/15 px-3 py-1 text-xs font-semibold text-[#2F7D6D] mx-auto sm:mx-0">
                <ShieldCheck className="h-3.5 w-3.5" />
                Community Member
              </span>
            </div>

            <p className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-[#E0A526]" />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/my-books"
            className="flex items-center gap-3 rounded-xl border border-border bg-[#FAF7F2] dark:bg-[#111624] p-3.5 text-xs font-semibold text-foreground hover:border-[#E0A526]/50 transition-colors"
          >
            <BookMarked className="h-4 w-4 text-[#E0A526]" />
            <span>My Books</span>
          </Link>
          <Link
            href="/my-borrows"
            className="flex items-center gap-3 rounded-xl border border-border bg-[#FAF7F2] dark:bg-[#111624] p-3.5 text-xs font-semibold text-foreground hover:border-[#E0A526]/50 transition-colors"
          >
            <ArrowLeftRight className="h-4 w-4 text-[#2F7D6D]" />
            <span>My Borrows</span>
          </Link>
          <Link
            href="/add-book"
            className="flex items-center gap-3 rounded-xl border border-border bg-[#FAF7F2] dark:bg-[#111624] p-3.5 text-xs font-semibold text-foreground hover:border-[#E0A526]/50 transition-colors"
          >
            <Plus className="h-4 w-4 text-amber-500" />
            <span>Add a Book</span>
          </Link>
        </div>

        {/* Logout */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive hover:text-white transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
