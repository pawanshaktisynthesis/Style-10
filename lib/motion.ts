import type { Transition, Variants } from "motion/react";

/**
 * Motion tokens.
 *
 * Every curve here is either an expo/quint ease (things that arrive) or a
 * spring tuned to feel weighted (things you push). Nothing linear, nothing
 * with visible overshoot bounce.
 */

export const EASE = {
  /** Arrivals: fast start, long settle. The house curve. */
  out: [0.16, 1, 0.3, 1] as const,
  /** Slightly softer arrival for large surfaces. */
  outSoft: [0.22, 1, 0.36, 1] as const,
  /** Symmetric — for things that leave and come back. */
  inOut: [0.76, 0, 0.24, 1] as const,
  /** Short UI state changes. */
  swift: [0.4, 0, 0.2, 1] as const,
};

export const SPRING = {
  /** Cursor and magnetic pulls — heavy, no wobble. */
  heavy: { type: "spring", stiffness: 150, damping: 20, mass: 0.6 } as Transition,
  /** Card lifts and hover states. */
  soft: { type: "spring", stiffness: 260, damping: 30, mass: 0.8 } as Transition,
  /** Snappy toggles. */
  quick: { type: "spring", stiffness: 420, damping: 34, mass: 0.5 } as Transition,
};

export const DUR = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  cinematic: 1.6,
};

/** Container that staggers its children on enter. */
export const stagger = (delay = 0, each = 0.07): Variants => ({
  hidden: {},
  show: { transition: { delayChildren: delay, staggerChildren: each } },
});

/** The standard rise-and-fade. Travel is small; the ease does the work. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE.out } },
};

export const riseLarge: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE.out } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.slow, ease: EASE.out } },
};

/** A masked line lifting into view — used for display headlines. */
export const lineLift: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 1.05, ease: EASE.out } },
};

/** Viewport defaults: fire once, a little before the element is centred. */
export const inView = { once: true, margin: "-12% 0px -12% 0px" } as const;
