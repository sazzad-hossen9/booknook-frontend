"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

/**
 * Navbar theme toggle switch with Sun and Moon icons.
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5 opacity-60">
        <Sun className="h-4 w-4 text-[#E0A526]" />
        <div className="h-5 w-8 rounded-full bg-muted" />
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-1.5">
      <Sun
        className={`h-4 w-4 transition-colors ${
          !isDark ? "text-[#E0A526]" : "text-muted-foreground/60"
        }`}
      />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
      <Moon
        className={`h-4 w-4 transition-colors ${
          isDark ? "text-[#F2C45A]" : "text-muted-foreground/60"
        }`}
      />
    </div>
  );
}
