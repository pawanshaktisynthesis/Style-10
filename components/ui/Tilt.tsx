"use client";

import { type ReactNode, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { SPRING } from "@/lib/motion";
import { useIsTouch, useReducedMotion } from "@/lib/hooks";

/**
 * A card that tilts toward the pointer and carries a specular highlight that
 * tracks it — the highlight is what makes the surface read as glass rather
 * than as a rotating rectangle.
 */
export function Tilt({
  children,
  className,
  max = 7,
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const rx = useSpring(useMotionValue(0), SPRING.soft);
  const ry = useSpring(useMotionValue(0), SPRING.soft);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);

  const highlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(86,232,207,0.13), rgba(122,92,255,0.07) 38%, transparent 68%)`;

  const still = touch || reduced;

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || still) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className ?? ""}`}
      onPointerMove={onMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={reset}
      style={
        still
          ? undefined
          : { rotateX: rx, rotateY: ry, transformPerspective: 1100, transformStyle: "preserve-3d" }
      }
    >
      {children}
      {glow && !still && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
          style={{ background: highlight, opacity: hovered ? 1 : 0 }}
        />
      )}
    </motion.div>
  );
}
