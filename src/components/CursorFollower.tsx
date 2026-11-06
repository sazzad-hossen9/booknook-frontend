"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";

/**
 * Custom cursor follower built with Motion springs.
 * Strictly active ONLY on desktop PCs where a physical mouse pointer is used.
 * Completely hidden on mobile phones, tablets, and touch devices.
 *
 * Features:
 * - 50px round circle with smooth trailing springs.
 * - Interactive hover expansion over clickable elements (links, buttons).
 * - Click/tap compression feedback.
 * - Ambient gold glow with difference blend mode for high contrast on all themes.
 * - Center focal dot that transforms smoothly on hover.
 */
export function CursorFollower() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Exact spring configuration required
  const x = useSpring(0, { stiffness: 200, damping: 18, mass: 1 });
  const y = useSpring(0, { stiffness: 200, damping: 33, mass: 1 });

  useEffect(() => {
    // Strictly verify desktop PC environment with mouse hover support (not mobile or tablet)
    const isDesktopWithMouse = () => {
      if (typeof window === "undefined") return false;
      const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const isDesktopWidth = window.innerWidth >= 1024;
      return hasHover && isDesktopWidth;
    };

    if (!isDesktopWithMouse()) return;
    setMounted(true);

    const handlePointerMove = (e: PointerEvent) => {
      // Only respond to physical mouse events, never touch or stylus
      if (e.pointerType !== "mouse") {
        setVisible(false);
        return;
      }

      if (!isDesktopWithMouse()) {
        setVisible(false);
        return;
      }

      setVisible(true);
      // Center the 50px circle on the cursor
      x.set(e.clientX - 25);
      y.set(e.clientY - 25);
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest(
          "a, button, input, textarea, select, [role='button'], .cursor-pointer"
        )
      );
      setIsHovering(isInteractive);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => setVisible(false);

    const handleResize = () => {
      if (!isDesktopWithMouse()) {
        setVisible(false);
        setMounted(false);
      } else {
        setMounted(true);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [x, y]);

  // Completely unmounted on mobile/tablet or before real mouse movement
  if (!mounted || !visible) return null;

  return (
    <motion.div
      className="hidden lg:block"
      style={{
        x,
        y,
        position: "fixed",
        top: 0,
        left: 0,
        width: 50,
        height: 50,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        border: "1.5px solid rgba(224, 165, 38, 0.85)",
        mixBlendMode: "difference",
      }}
      animate={{
        scale: isClicking ? 0.82 : isHovering ? 1.35 : 1,
        backgroundColor: isHovering
          ? "rgba(224, 165, 38, 0.25)"
          : "rgba(224, 165, 38, 0.12)",
        boxShadow: isHovering
          ? "0 0 20px rgba(224, 165, 38, 0.65), inset 0 0 10px rgba(224, 165, 38, 0.3)"
          : "0 0 10px rgba(224, 165, 38, 0.35), inset 0 0 5px rgba(224, 165, 38, 0.12)",
      }}
      transition={{
        scale: { type: "spring", stiffness: 350, damping: 22 },
        backgroundColor: { duration: 0.2 },
        boxShadow: { duration: 0.25 },
      }}
      aria-hidden="true"
    >
      {/* Subtle center focal dot that fades smoothly when hovering over buttons */}
      <motion.span
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.18 }}
        className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-[#E0A526] shadow-[0_0_6px_#E0A526]"
      />
    </motion.div>
  );
}
