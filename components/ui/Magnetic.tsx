"use client";

import { type ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { SPRING } from "@/lib/motion";
import { useIsTouch, useReducedMotion } from "@/lib/hooks";

/**
 * Magnetic pull.
 *
 * The element leans toward the pointer while it is inside a padded hit area,
 * on a heavy spring so it feels attracted rather than attached. Inner content
 * moves further than the wrapper, which is what sells the depth.
 *
 * Disabled entirely on touch and under reduced motion — and the pull is purely
 * visual, so keyboard activation is completely unaffected.
 */
export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING.heavy);
  const sy = useSpring(y, SPRING.heavy);

  /* The inner layer travels 1.8× the wrapper — parallax within the button. */
  const ix = useTransform(sx, (v) => v * 0.8);
  const iy = useTransform(sy, (v) => v * 0.8);

  if (touch || reduced) return <div className={className}>{children}</div>;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      <motion.div style={{ x: ix, y: iy }}>{children}</motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* The primary call to action                                                  */
/* -------------------------------------------------------------------------- */

export function CTA({
  href,
  children,
  variant = "solid",
  className,
  type,
  disabled,
}: {
  href?: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const solid = variant === "solid";

  const inner = (
    <>
      {/* The warm note: amber only appears on deliberate human contact. */}
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
        style={{
          background: solid
            ? "linear-gradient(120deg, #f2a65a, #f5c98a)"
            : "linear-gradient(120deg, rgba(86,232,207,0.16), rgba(122,92,255,0.16))",
        }}
      />
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        >
          <path
            d="M2 8h11M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    </>
  );

  const classes = [
    "group relative inline-flex items-center overflow-hidden rounded-full px-7 py-3.5 text-[0.9375rem] font-medium",
    "transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-55",
    solid
      ? "bg-champagne text-void hover:text-void"
      : "border border-champagne/18 text-champagne hover:border-prana/45",
    className ?? "",
  ].join(" ");

  if (href) {
    return (
      <Magnetic className="inline-block">
        <a href={href} className={classes}>
          {inner}
        </a>
      </Magnetic>
    );
  }

  return (
    <Magnetic className="inline-block">
      <button type={type ?? "button"} disabled={disabled} className={classes}>
        {inner}
      </button>
    </Magnetic>
  );
}
