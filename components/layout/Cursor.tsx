"use client";

import { useEffect, useRef, useState } from "react";
import { useIsTouch, useReducedMotion } from "@/lib/hooks";
import { damp } from "@/lib/scroll-store";

type Mode = "default" | "link" | "view" | "drag";

const LABEL: Record<Mode, string> = {
  default: "",
  link: "",
  view: "View",
  drag: "Drag",
};

/**
 * A two-part cursor: a small dot that tracks the pointer exactly, and a ring
 * that lags behind it on a damped follow. The lag is the whole effect — it is
 * what makes the pointer feel like it has mass.
 *
 * Never shown on touch or under reduced motion, and it never replaces the
 * native cursor for keyboard users.
 */
export function Cursor() {
  const touch = useIsTouch();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (touch || reduced) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    let frame = 0;
    let last = performance.now();
    let down = false;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      setVisible(true);

      const el = (event.target as HTMLElement | null)?.closest?.(
        "a, button, [role='button'], input, textarea, select, [data-cursor]",
      ) as HTMLElement | null;

      if (!el) return setMode("default");
      const declared = el.dataset.cursor as Mode | undefined;
      setMode(declared ?? "link");
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      current.x = damp(current.x, target.x, 14, dt);
      current.y = damp(current.y, target.y, 14, dt);

      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${
          down ? 0.82 : 1
        })`;
      }
      frame = requestAnimationFrame(tick);
    };

    const onDown = () => (down = true);
    const onUp = () => (down = false);
    const onLeave = () => setVisible(false);

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [touch, reduced]);

  if (touch || reduced) return null;

  const expanded = mode === "view" || mode === "drag";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={dot}
        className="absolute left-0 top-0 rounded-full bg-prana transition-[width,height,opacity] duration-300"
        style={{
          width: mode === "default" ? 5 : 0,
          height: mode === "default" ? 5 : 0,
          opacity: visible ? 1 : 0,
        }}
      />
      <div
        ref={ring}
        className="absolute left-0 top-0 grid place-items-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: expanded ? 76 : mode === "link" ? 42 : 30,
          height: expanded ? 76 : mode === "link" ? 42 : 30,
          opacity: visible ? (mode === "default" ? 0.45 : 1) : 0,
          borderColor: expanded ? "transparent" : "rgba(233,220,195,0.42)",
          backgroundColor: expanded
            ? "rgba(86,232,207,0.9)"
            : mode === "link"
              ? "rgba(86,232,207,0.1)"
              : "transparent",
          backdropFilter: mode === "link" ? "blur(2px)" : undefined,
        }}
      >
        <span
          className="t-mono text-[9px] tracking-[0.14em] text-void transition-opacity duration-200"
          style={{ opacity: expanded ? 1 : 0 }}
        >
          {LABEL[mode]}
        </span>
      </div>
    </div>
  );
}
