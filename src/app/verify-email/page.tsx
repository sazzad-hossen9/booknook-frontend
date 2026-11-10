import Image from "next/image";
import { Suspense } from "react";
import { Logo } from "@/components/Logo";
import { VerifyEmailClient } from "./_components/VerifyEmailClient";
import { Spinner } from "@/components/Spinner";

export const metadata = {
  title: "Verify Email | BookNook",
  description: "Verify your email address for BookNook.",
};

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[24px] border border-border bg-card shadow-lg">
        {/* Left Column: Visual Illustration (Hidden on mobile) */}
        <div className="relative hidden lg:block lg:col-span-6 bg-slate-900 min-h-[560px]">
          <Image
            src="/images/register-illustration.jpg"
            alt="Verify Email BookNook"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
          <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white space-y-3">
            <div className="h-1 w-12 rounded-full bg-[#E0A526]" />
            <h2 className="font-serif text-4xl font-bold tracking-tight">
              Welcome to BookNook
            </h2>
            <p className="text-sm text-slate-200/90 max-w-sm leading-relaxed">
              Verify your account to access our curated community collection, borrow books, and share your reading journey.
            </p>
          </div>
        </div>

        {/* Right Column: Verification State */}
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
            <VerifyEmailClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

