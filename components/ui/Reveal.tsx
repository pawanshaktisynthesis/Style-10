"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE, inView } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Motion components are created once at module scope.
 *
 * Calling `motion.create()` inside a render body produces a brand-new
 * component type on every render, which React treats as a different element
 * and remounts — losing DOM state and re-firing every animation. A static map
 * keeps the identity stable and keeps the props properly typed.
 */
const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
} as const;

type Tag = keyof typeof TAGS;

/* -------------------------------------------------------------------------- */
/* Reveal — the standard scroll entrance                                       */
/* -------------------------------------------------------------------------- */

export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = 26,
  blur = false,
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  delay?: number;
  /** Travel distance in px. Small by default; the easing carries the weight. */
  y?: number;
  blur?: boolean;
}) {
  const reduced = useReducedMotion();
  const Motion = TAGS[as];

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <Motion
      data-reveal
      className={className}
      initial={{ opacity: 0, y, ...(blur ? { filter: "blur(8px)" } : null) }}
      whileInView={{ opacity: 1, y: 0, ...(blur ? { filter: "blur(0px)" } : null) }}
      viewport={inView}
      transition={{ duration: 0.85, ease: EASE.out, delay }}
    >
      {children}
    </Motion>
  );
}

/* -------------------------------------------------------------------------- */
/* SplitLines — masked line-by-line lift for display headlines                 */
/* -------------------------------------------------------------------------- */

/**
 * Takes pre-split lines rather than splitting text itself.
 *
 * Automatic word-splitting breaks screen readers and re-flows badly at every
 * breakpoint. Passing the lines in keeps the DOM semantic: the heading is a
 * single element, and each visual line is a masked span inside it.
 */
export function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  as = "h2",
  id,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h2" | "h3" | "p";
  /** Set when the heading is the accessible name for its section. */
  id?: string;
}) {
  const reduced = useReducedMotion();
  const Heading = as;
  const ref = useRef<HTMLHeadingElement>(null);

  /* Observe the heading, never the lines themselves.
   *
   * IntersectionObserver clips a target's intersection rect by every ancestor
   * that clips overflow. A line parked at y:112% sits entirely outside its own
   * `overflow:hidden` mask, so its clipped rect is empty and `whileInView`
   * would never fire. Watching the unclipped heading is the only correct way
   * to drive a masked reveal. */
  const visible = useInView(ref, inView);

  return (
    <Heading className={className} id={id} ref={ref}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          {reduced ? (
            <span className={lineClassName}>{line}</span>
          ) : (
            <motion.span
              data-reveal
              className={`block ${lineClassName ?? ""}`}
              initial={{ y: "112%" }}
              animate={visible ? { y: "0%" } : { y: "112%" }}
              transition={{ duration: 1.05, ease: EASE.out, delay: delay + i * stagger }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </Heading>
  );
}

/* -------------------------------------------------------------------------- */
/* Eyebrow — the structural marker                                             */
/* -------------------------------------------------------------------------- */

/**
 * Section markers carry the brand's own etymology (a Sanskrit stage name) plus
 * the phase index, so the device encodes the narrative rather than decorating.
 */
export function Eyebrow({ stage, phase, className }: { stage: string; phase: string; className?: string }) {
  return (
    <Reveal className={`flex items-center gap-3 ${className ?? ""}`}>
      <span className="t-mono text-prana">{stage}</span>
      <span aria-hidden className="h-px w-10 bg-gradient-to-r from-prana/60 to-transparent" />
      <span className="t-mono text-faint">{phase}</span>
    </Reveal>
  );
}
