"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/Spinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard component for protecting private pages.
 * Waits until session check finishes before deciding whether to redirect.
 * If user is not logged in, redirects to /login?redirect=<currentPath>.
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [isPending, session, pathname, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Checking your reading pass...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return <>{children}</>;
}

