"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token.");
      return;
    }

    let isMounted = true;

    async function verify() {
      try {
        const { error } = await authClient.verifyEmail({
          query: { token },
        });

        if (!isMounted) return;

        if (error) {
          setStatus("error");
          setErrorMessage(error.message || "Invalid or expired verification token.");
        } else {
          setStatus("success");
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(err?.message || "Failed to verify email.");
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (status === "loading") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center py-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Verifying Your Email
          </h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we confirm your BookNook account...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto space-y-6 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
          <CheckCircle2 className="h-8 w-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Email Verified!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your email address has been successfully verified. Welcome to the BookNook community!
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link
            href="/books"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] px-4 py-3 text-sm font-semibold text-[#1F2A44] shadow-sm hover:bg-[#F2C45A] transition-colors"
          >
            <span>Explore Books</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Sign In to Your Account
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto space-y-6 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
        <AlertTriangle className="h-8 w-8 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Invalid or Expired Link
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {errorMessage ||
            "This email verification link is invalid or has expired. Please sign in or request a new verification email."}
        </p>
      </div>

      <div className="pt-4 space-y-3">
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] px-4 py-3 text-sm font-semibold text-[#1F2A44] shadow-sm hover:bg-[#F2C45A] transition-colors"
        >
          <span>Go to Sign In</span>
        </Link>
      </div>
    </motion.div>
  );
}

