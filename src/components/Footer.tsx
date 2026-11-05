import { Logo } from "@/components/Logo";
import { Mail, Phone } from "lucide-react";

/**
 * Global Footer component with rich navy theme, contact details, inline SVG social icons,
 * and current year copyright.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[#28324D] bg-[#1F2A44] text-[#F3EFE6] dark:bg-[#0B0F19]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/10">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo isFooter />
            <p className="text-xs text-[#9AA3B5] tracking-wide">
              Read more. Grow more.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#9AA3B5]">
            <a
              href="mailto:hello@booknook.com"
              className="inline-flex items-center gap-2 hover:text-[#E0A526] transition-colors"
            >
              <Mail className="h-4 w-4 text-[#E0A526]" />
              <span>hello@booknook.com</span>
            </a>
            <div className="hidden sm:block h-3.5 w-px bg-white/20" />
            <a
              href="tel:+8801234567890"
              className="inline-flex items-center gap-2 hover:text-[#E0A526] transition-colors"
            >
              <Phone className="h-4 w-4 text-[#E0A526]" />
              <span>+880 1234 567890</span>
            </a>
          </div>

          {/* Social Icons (NEW X Logo, Facebook, YouTube as inline SVGs) */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-[#9AA3B5]">Follow Us:</span>
            <div className="flex items-center gap-3">
              {/* NEW X (formerly Twitter) Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#F3EFE6] hover:bg-[#E0A526] hover:text-[#1F2A44] transition-all duration-200"
              >
                <svg
                  width="16"
                  height="16"
                  className="h-4 w-4 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#F3EFE6] hover:bg-[#E0A526] hover:text-[#1F2A44] transition-all duration-200"
              >
                <svg
                  width="16"
                  height="16"
                  className="h-4 w-4 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.604.2-1.921.439-.462.35-.615.936-.615 2.19v1.351h4.63l-.707 3.667h-3.923v7.98H9.101z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-[#F3EFE6] hover:bg-[#E0A526] hover:text-[#1F2A44] transition-all duration-200"
              >
                <svg
                  width="16"
                  height="16"
                  className="h-4 w-4 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 text-center text-xs text-[#9AA3B5]/80">
          <p>© {currentYear} BookNook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

