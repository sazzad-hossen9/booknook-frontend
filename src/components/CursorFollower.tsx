"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";

/**
 * Reusable full-page custom cursor follower built with Motion springs.
 * Follows mouse pointer smoothly with 50px round circle and difference blend mode.
 * Automatically hidden on touch devices ((pointer: fine) check).
 */
export function CursorFollower() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Exact spring configuration required
  const x = useSpring(0, { stiffness: 200, damping: 18, mass: 1 });
  const y = useSpring(0, { stiffness: 200, damping: 33, mass: 1 });

  useEffect(() => {
    // Hide on touch devices (only show when (pointer: fine) matches)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    setMounted(true);

    const handlePointerMove = (e: PointerEvent) => {
      setVisible(true);
      // Center the 50px circle on the cursor
      x.set(e.clientX - 25);
      y.set(e.clientY - 25);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [x, y]);

  if (!mounted || !visible) return null;

  return (
    <motion.div
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
        backgroundColor: "rgba(224, 165, 38, 0.15)",
        mixBlendMode: "difference",
      }}
      aria-hidden="true"
    />
  );
}
