import Image from "next/image";
import { Suspense } from "react";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./_components/LoginForm";
import { Spinner } from "@/components/Spinner";

export const metadata = {
  title: "Login",
  description: "Sign in to your BookNook account and continue your reading journey.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[24px] border border-border bg-card shadow-lg">
        {/* Left Column: Visual Illustration (Hidden on mobile) */}
        <div className="relative hidden lg:block lg:col-span-6 bg-slate-900 min-h-[560px]">
          <Image
            src="/images/login-illustration.jpg"
            alt="Welcome to BookNook"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white space-y-3">
            <div className="h-1 w-12 rounded-full bg-[#E0A526]" />
            <h2 className="font-serif text-4xl font-bold tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-sm text-slate-200/90 max-w-sm leading-relaxed">
              Sign in to your BookNook account and continue your reading journey
              among thousands of shared stories.
            </p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-6 flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-6 flex justify-center sm:justify-start">
            <Logo />
          </div>
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <Spinner size="md" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

