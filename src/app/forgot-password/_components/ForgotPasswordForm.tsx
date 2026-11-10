"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Mail, KeyRound, Loader2, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

/**
 * Step 1: Forgot Password Form.
 * Collects the user's registered email address and triggers Better Auth's official
 * requestPasswordReset method, which dispatches a branded reset link email via Resend.
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      toast.error("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: trimmedEmail,
        redirectTo: "/reset-password",
      });

      if (error) {
        throw new Error(error.message || "Failed to send reset email");
      }

      setEmailSent(true);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || resending) return;

    setResending(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: "/reset-password",
      });

      if (error) {
        throw new Error(error.message || "Failed to resend reset email");
      }

      toast.success("A fresh reset link was sent to your email!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to resend email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // State 2: Confirmation screen after email has been dispatched via Resend
  if (emailSent) {
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
            Check your inbox
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We have sent a secure password reset link to:
          </p>
          <p className="font-semibold text-foreground text-sm bg-muted/60 py-1.5 px-3 rounded-lg inline-block break-all border border-border">
            {email}
          </p>
          <p className="text-xs text-muted-foreground pt-2">
            Click the link in the email to set a new password. The link is secure and time-limited.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-xs hover:bg-muted transition-colors disabled:opacity-60"
          >
            {resending ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#E0A526]" />
            ) : (
              <RotateCcw className="h-4 w-4 text-[#E0A526]" />
            )}
            <span>Resend reset email</span>
          </button>

          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F2A44] dark:bg-[#28324D] px-4 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#2a395d] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-[#E0A526]" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  // State 1: Email input form
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto space-y-6"
    >
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E0A526]/15 text-[#E0A526]">
          <KeyRound className="h-5 w-5" />
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Forgot Password?
        </h2>
        <p className="text-sm text-muted-foreground">
          No worries! Enter your registered email address and we will send you a secure link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Registered Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reader@booknook.com"
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] font-semibold text-[#1F2A44] shadow-sm hover:bg-[#F2C45A] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#1F2A44]" />
              <span>Sending Reset Link...</span>
            </>
          ) : (
            <span>Send Password Reset Link</span>
          )}
        </button>

        {/* Back to Login Link */}
        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
