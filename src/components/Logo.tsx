import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  isFooter?: boolean;
}

/**
 * Official BookNook Logo component rendered from the custom brand graphic.
 * Adapts between light and dark modes with transparent background.
 */
export function Logo({ className = "", isFooter = false }: LogoProps) {
  if (isFooter) {
    return (
      <Link
        href="/"
        className={`inline-flex items-center transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
      >
        <Image
          src="/images/logo-dark.png"
          alt="BookNook"
          width={170}
          height={36}
          priority
          className="h-9 w-auto object-contain"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center transition-transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      {/* Light mode brand logo */}
      <Image
        src="/images/logo.png"
        alt="BookNook"
        width={170}
        height={36}
        priority
        className="h-9 sm:h-10 w-auto object-contain dark:hidden"
      />
      {/* Dark mode brand logo */}
      <Image
        src="/images/logo-dark.png"
        alt="BookNook"
        width={170}
        height={36}
        priority
        className="h-9 sm:h-10 w-auto object-contain hidden dark:block"
      />
    </Link>
  );
}
