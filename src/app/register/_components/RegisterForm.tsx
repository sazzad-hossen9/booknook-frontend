"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Link as LinkIcon,
  Check,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    photoUrl: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) =>
          !val ||
          val === "" ||
          val.startsWith("http://") ||
          val.startsWith("https://"),
        { message: "Please enter a valid URL starting with http:// or https://" }
      ),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Register Form component matching Register-page.png.
 * Supports Full Name, Email, Photo URL (text input), Password (with rules),
 * Google OAuth, and automatic redirection to /login.
 */
export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordVal = watch("password") || "";
  const photoUrlVal = watch("photoUrl") || "";
  const hasMinLen = passwordVal.length >= 6;
  const hasUpper = /[A-Z]/.test(passwordVal);
  const hasLower = /[a-z]/.test(passwordVal);

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const finalPhotoUrl = data.photoUrl?.trim() || "";

      toast.loading("Creating your BookNook account...", {
        id: "register-task",
      });

      const res = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: finalPhotoUrl || undefined,
      });

      if (res?.error) {
        toast.error(res.error.message || "Failed to create account", {
          id: "register-task",
        });
        return;
      }

      toast.success("Account created! Please check your email to verify.", {
        id: "register-task",
      });
      setRegisteredEmail(data.email);
    } catch (err: any) {
      toast.error(err?.message || "Failed to register. Please try again.", {
        id: "register-task",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err: any) {
      toast.error(err?.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (registeredEmail) {
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
            We have sent a verification link to:
          </p>
          <p className="font-semibold text-foreground text-sm bg-muted/60 py-1.5 px-3 rounded-lg inline-block break-all border border-border">
            {registeredEmail}
          </p>
          <p className="text-xs text-muted-foreground pt-2">
            Click the link in the email to verify your BookNook account and activate full access.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] px-4 py-3 text-sm font-semibold text-[#1F2A44] shadow-sm hover:bg-[#F2C45A] transition-colors"
          >
            <span>Proceed to Sign In</span>
          </Link>
        </div>
      </motion.div>
    );
  }

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
          Register Your Account
        </h2>
        <p className="text-sm text-muted-foreground">
          Fill in the form below to create your reading account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter your  name "
              {...register("name")}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Photo URL (Optional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Profile Image URL (Optional)
            </label>
            <span className="text-[11px] text-muted-foreground">
              Leave blank to use email initial
            </span>
          </div>
          <div className="relative flex items-center">
            <LinkIcon className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="url"
              placeholder="e.g. https://example.com/photo.jpg"
              {...register("photoUrl")}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-12 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground"
            />
            {photoUrlVal && photoUrlVal.startsWith("http") ? (
              <div className="absolute right-2.5 h-7 w-7 overflow-hidden rounded-full border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrlVal}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            ) : null}
          </div>
          {errors.photoUrl && (
            <p className="text-xs text-destructive">{errors.photoUrl.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your  password"
              {...register("password")}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
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

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="confirmPassword"
              {...register("confirmPassword")}
              className="h-[46px] w-full rounded-xl border border-border bg-card pl-10 pr-10 text-sm text-foreground outline-none focus:border-[#E0A526] focus:ring-2 focus:ring-[#E0A526]/20 placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
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
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || googleLoading}
          className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#E0A526] text-sm font-semibold text-[#1F2A44] shadow-md hover:bg-[#F2C45A] disabled:opacity-60 transition-colors cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 stroke-[2.5]" />
              <span>Register Account</span>
            </>
          )}
        </motion.button>

        {/* Divider */}
        <div className="relative py-2 text-center text-xs text-muted-foreground after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-border">
          <span className="relative z-10 bg-card px-3 font-medium">OR</span>
        </div>

        {/* Google Register Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading || googleLoading}
          className="flex h-[46px] w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
        >
          {googleLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </motion.button>

        {/* Link to Login */}
        <p className="text-center text-xs text-muted-foreground pt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#E0A526] hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
