import Image from "next/image";
import { Suspense } from "react";
import { Logo } from "@/components/Logo";
import { RegisterForm } from "./_components/RegisterForm";
import { BookOpen, Star, Heart } from "lucide-react";
import { Spinner } from "@/components/Spinner";

export const metadata = {
  title: "Register",
  description: "Join the BookNook reading lounge and explore our library collection.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-[24px] border border-border bg-card shadow-lg">
        {/* Left Column: Visual Illustration (Hidden on mobile) */}
        <div className="relative hidden lg:block lg:col-span-6 bg-slate-900 min-h-[600px]">
          <Image
            src="/images/register-illustration.jpg"
            alt="Join BookNook"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
          <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white space-y-4">
            <span className="font-serif italic text-base text-[#E0A526]">
              Join BookNook
            </span>
            <h2 className="font-serif text-4xl font-bold tracking-tight">
              Create Your Account
            </h2>
            <p className="text-sm text-slate-200/90 max-w-sm leading-relaxed">
              Be a part of our reading community and start your journey today.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-white/90">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0A526] text-[#1F2A44]">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>
                <span>Borrow books easily</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/90">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0A526] text-[#1F2A44]">
                  <Star className="h-3.5 w-3.5" />
                </div>
                <span>Manage your reading collection</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/90">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0A526] text-[#1F2A44]">
                  <Heart className="h-3.5 w-3.5" />
                </div>
                <span>Never miss a good read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Register Form */}
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
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

