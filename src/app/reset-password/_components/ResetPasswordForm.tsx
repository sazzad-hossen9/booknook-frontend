"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

/**
 * Step 3: Reset Password Form.
 * Reads the secure Better Auth token from the URL search params,
 * validates new password rules on the client, and invokes authClient.resetPassword.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const errorParam = searchParams.get("error");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Live validation rules
  const hasMinLen = newPassword.length >= 6;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const passwordsMatch = newPassword !== "" && newPassword === confirmPassword;
  const isFormValid = hasMinLen && hasUpper && hasLower && passwordsMatch;

  // Invalid or expired token view
  if (!token || errorParam) {
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
            This password reset link is invalid or has expired. For your security, password reset links can only be used once and expire shortly after being issued.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/forgot-password"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] px-4 py-3 text-sm font-semibold text-[#1F2A44] shadow-sm hover:bg-[#F2C45A] transition-colors"
          >
            <span>Request a New Reset Link</span>
          </Link>

          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-xs hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  // Success view
  if (resetSuccess) {
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
            Password Reset Complete
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your BookNook account password has been updated successfully. You can now log in using your new password.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] px-4 py-3 text-sm font-semibold text-[#1F2A44] shadow-sm hover:bg-[#F2C45A] transition-colors"
          >
            <span>Sign In Now</span>
          </Link>
        </div>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      if (!hasMinLen || !hasUpper || !hasLower) {
        toast.error("Password must be at least 6 characters with uppercase and lowercase letters.");
      } else if (!passwordsMatch) {
        toast.error("Passwords do not match. Please verify.");
      }
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (error) {
        throw new Error(error.message || "Failed to reset password. The link may have expired.");
      }

      setResetSuccess(true);
      toast.success("Password reset successfully! You can now sign in.");

      // Delay redirect to allow user to see success state
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

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
          Set New Password
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose a strong, unique password to secure your BookNook lounge account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-11 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-11 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Live Validation Requirements Checklist */}
        <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1.5 text-xs">
          <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Password Requirements:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            <div className={`flex items-center gap-1.5 ${hasMinLen ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
              <Check className={`h-3.5 w-3.5 ${hasMinLen ? "opacity-100 text-emerald-500" : "opacity-30"}`} />
              <span>At least 6 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasUpper ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
              <Check className={`h-3.5 w-3.5 ${hasUpper ? "opacity-100 text-emerald-500" : "opacity-30"}`} />
              <span>One uppercase letter</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasLower ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
              <Check className={`h-3.5 w-3.5 ${hasLower ? "opacity-100 text-emerald-500" : "opacity-30"}`} />
              <span>One lowercase letter</span>
            </div>
            <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>
              <Check className={`h-3.5 w-3.5 ${passwordsMatch ? "opacity-100 text-emerald-500" : "opacity-30"}`} />
              <span>Passwords match</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] font-semibold text-[#1F2A44] shadow-sm hover:bg-[#F2C45A] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#1F2A44]" />
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Cancel and return to Sign In</span>
          </Link>
        </div>
      </form>
    </motion.div>
  );
}

