"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

/**
 * The mark: three wind currents converging into a single vertical axis.
 *
 * Literally the brand thesis — pawan (wind) resolving into shakti (a single
 * concentrated force). Drawn on a 32-unit grid so it stays crisp at favicon
 * size, and stroke-only so it inverts cleanly on any background.
 */
export function Wordmark({ className, animated = false }: { className?: string; animated?: boolean }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: 1.3, ease: EASE.out, delay: i * 0.14 }, opacity: { duration: 0.2 } },
    }),
  };

  const Path = animated ? motion.path : "path";
  const props = animated
    ? { variants: draw, initial: "hidden" as const, animate: "show" as const }
    : {};

  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id="psm-a" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#56e8cf" />
          <stop offset="1" stopColor="#7a5cff" />
        </linearGradient>
      </defs>

      {/* Three currents, each entering at a different height and bending into
          the same convergence point. */}
      <Path
        {...props}
        custom={0}
        d="M3 9c5.5 0 8.2 2.4 10.4 5.2C15.2 16.5 16 18 16 20"
        stroke="url(#psm-a)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <Path
        {...props}
        custom={1}
        d="M29 9c-5.5 0-8.2 2.4-10.4 5.2C16.8 16.5 16 18 16 20"
        stroke="url(#psm-a)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <Path
        {...props}
        custom={2}
        d="M16 3v17"
        stroke="#e9dcc3"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* The synthesised point. */}
      <circle cx="16" cy="24.5" r="3.4" stroke="url(#psm-a)" strokeWidth="1.6" />
      <circle cx="16" cy="24.5" r="1.1" fill="#56e8cf" />
    </svg>
  );
}
