"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Forgot Password form allowing users to directly reset their password.
 * Matches BookNook design system with live rule validation and Sonner toasts.
 */
export function ForgotPasswordForm() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Live password validation checks
  const hasMinLen = newPassword.length >= 6;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const passwordsMatch = newPassword !== "" && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    const email = String(formValues.email || "").trim();
    const enteredPassword = String(formValues.newPassword || "");
    const enteredConfirm = String(formValues.confirmPassword || "");

    if (!email) {
      toast.error("Please enter your registered email address.");
      return;
    }

    if (!hasMinLen || !hasUpper || !hasLower) {
      toast.error(
        "Password must be at least 6 characters with uppercase and lowercase letters.",
      );
      return;
    }

    if (enteredPassword !== enteredConfirm) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);
    try {
      toast.loading("Resetting your password...", { id: "reset-progress" });

      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: enteredPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to reset password");
      }

      toast.success(
        "Password reset successfully! Please log in with your new password.",
        { id: "reset-progress" },
      );

      // Redirect to login page
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.", {
        id: "reset-progress",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E0A526]/15 text-[#E0A526]">
          <KeyRound className="h-5 w-5" />
        </div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Reset Password
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your registered email and choose a new password for your
          account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Registered Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground transition-all"
            />
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              required
              placeholder="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-11 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              required
              placeholder=" Enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-11 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Live Password Rules validation box */}
        <div className="rounded-xl border border-border bg-[#FAF7F2] dark:bg-[#111624] p-3 text-xs space-y-1.5">
          <div
            className={`flex items-center gap-2 ${
              hasMinLen ? "text-[#2F7D6D] font-medium" : "text-muted-foreground"
            }`}
          >
            <Check
              className={`h-3.5 w-3.5 ${
                hasMinLen ? "text-[#2F7D6D]" : "opacity-40"
              }`}
            />
            <span>At least 6 characters</span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              hasUpper ? "text-[#2F7D6D] font-medium" : "text-muted-foreground"
            }`}
          >
            <Check
              className={`h-3.5 w-3.5 ${
                hasUpper ? "text-[#2F7D6D]" : "opacity-40"
              }`}
            />
            <span>One uppercase letter</span>
          </div>
          <div
            className={`flex items-center gap-2 ${
              hasLower ? "text-[#2F7D6D] font-medium" : "text-muted-foreground"
            }`}
          >
            <Check
              className={`h-3.5 w-3.5 ${
                hasLower ? "text-[#2F7D6D]" : "opacity-40"
              }`}
            />
            <span>One lowercase letter</span>
          </div>
          {confirmPassword && (
            <div
              className={`flex items-center gap-2 ${
                passwordsMatch
                  ? "text-[#2F7D6D] font-medium"
                  : "text-destructive"
              }`}
            >
              <Check
                className={`h-3.5 w-3.5 ${
                  passwordsMatch ? "text-[#2F7D6D]" : "opacity-40"
                }`}
              />
              <span>
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] text-sm font-semibold text-[#1F2A44] shadow-md hover:bg-[#F2C45A] active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <KeyRound className="h-4 w-4" />
              <span>Reset & Update Password</span>
            </>
          )}
        </button>

        {/* Back to Login Link */}
        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-[#E0A526] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
