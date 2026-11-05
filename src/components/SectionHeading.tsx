"use client";

import { motion } from "motion/react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
}

/**
 * Standardized Section Heading component matching the BookNook design system.
 * Features elegant Playfair serif typography, subtle gold line accents, and optional subtitle.
 * Includes smooth whileInView fade and slide-up animation.
 */
export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  className = "",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`text-center space-y-2 mb-10 ${className}`}
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-[#2F7D6D]/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#2F7D6D] uppercase">
          {eyebrow}
        </span>
      )}
      <div className="flex items-center justify-center gap-4">
        <div className="h-[1.5px] w-12 bg-gradient-to-r from-transparent to-[#E0A526]/60 sm:w-20" />
        <h2 className="font-serif text-3xl sm:text-[32px] font-bold tracking-tight text-[#1F2A44] dark:text-[#F3EFE6]">
          {title}
        </h2>
        <div className="h-[1.5px] w-12 bg-gradient-to-l from-transparent to-[#E0A526]/60 sm:w-20" />
      </div>
      {subtitle && (
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
