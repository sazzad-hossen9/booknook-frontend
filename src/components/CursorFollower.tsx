"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Premium Custom Cursor Follower for BookNook.
 * Strictly active ONLY on desktop PCs with a physical mouse.
 * Completely hidden on mobile phones, tablets, and touch devices.
 *
 * Features:
 * - Smooth spring physics with zero initial-jump glitch.
 * - Interactive hover expansion over links, buttons, and clickable items.
 * - Gentle gold glow matching BookNook's brand aesthetic (#E0A526).
 * - Click compression feedback.
 * - Center focal dot with smooth transition.
 */
export function CursorFollower() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const hasPositioned = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 280, damping: 24, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Strictly verify desktop PC environment with a physical mouse
    const isDesktopWithMouse = () => {
      if (typeof window === "undefined") return false;
      const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const isDesktopWidth = window.innerWidth >= 1024;
      return hasFinePointer && isDesktopWidth;
    };

    if (!isDesktopWithMouse()) return;
    setMounted(true);

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !isDesktopWithMouse()) {
        setVisible(false);
        return;
      }

      // Smoothly jump to initial position on the first move to eliminate jump glitch
      if (!hasPositioned.current) {
        mouseX.jump(e.clientX - 22);
        mouseY.jump(e.clientY - 22);
        hasPositioned.current = true;
      } else {
        mouseX.set(e.clientX - 22);
        mouseY.set(e.clientY - 22);
      }

      setVisible(true);
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

    const handleMouseLeave = () => {
      setVisible(false);
    };

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
  }, [mouseX, mouseY]);

  if (!mounted || !visible) return null;

  return (
    <motion.div
      className="hidden lg:block pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        x: smoothX,
        y: smoothY,
        width: 44,
        height: 44,
      }}
      animate={{
        scale: isClicking ? 0.82 : isHovering ? 1.35 : 1,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        scale: { type: "spring", stiffness: 400, damping: 25 },
        opacity: { duration: 0.15 },
      }}
      aria-hidden="true"
    >
      {/* Outer ring with smooth gold styling */}
      <motion.div
        className="relative h-full w-full rounded-full border border-[#E0A526]/80"
        animate={{
          backgroundColor: isHovering
            ? "rgba(224, 165, 38, 0.18)"
            : "rgba(224, 165, 38, 0.06)",
          borderColor: isHovering
            ? "rgba(224, 165, 38, 0.95)"
            : "rgba(224, 165, 38, 0.75)",
          boxShadow: isHovering
            ? "0 0 16px rgba(224, 165, 38, 0.5), inset 0 0 8px rgba(224, 165, 38, 0.25)"
            : "0 0 8px rgba(224, 165, 38, 0.25)",
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Subtle center focal dot */}
        <motion.span
          animate={{
            scale: isHovering ? 0 : 1,
            opacity: isHovering ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-[#E0A526] shadow-[0_0_4px_#E0A526]"
        />
      </motion.div>
    </motion.div>
  );
}
