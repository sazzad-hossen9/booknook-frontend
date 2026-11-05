"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Live password validations
  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const email = String(data.email || "").trim();
    const enteredPassword = String(data.password || "");

    if (!email || !enteredPassword) {
      toast.error("Please fill in both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password: enteredPassword,
      });

      if (res?.error) {
        toast.error(
          res.error.message ||
            "Invalid credentials. Please verify your email and password.",
        );
        return;
      }

      toast.success("Welcome back to BookNook!");
      router.push(redirectTarget || "/");
      router.refresh();
    } catch (err: any) {
      toast.error(
        err?.message || "Invalid credentials. Please verify your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + redirectTarget,
      });
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
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
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          Login to Your Account
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to sign in.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#E0A526] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-11 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground"
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

        {/* Live Password Hints matching Login-Page.png */}
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
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] text-sm font-semibold text-[#1F2A44] shadow-md transition-colors duration-200 hover:bg-[#F2C45A] hover:shadow-lg disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 stroke-[2.5]" />
              <span>Login</span>
            </>
          )}
        </motion.button>
      </form>

      {/* OR Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-border" />
        <span className="absolute bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
          OR
        </span>
      </div>

      {/* Continue with Google */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        disabled={googleLoading}
        onClick={handleGoogleLogin}
        className="flex h-[46px] w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted cursor-pointer"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </motion.button>

      {/* Switch to Register */}
      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register${
            redirectTarget !== "/"
              ? `?redirect=${encodeURIComponent(redirectTarget)}`
              : ""
          }`}
          className="font-semibold text-[#E0A526] hover:underline"
        >
          Register here
        </Link>
      </p>
    </motion.div>
  );
}
