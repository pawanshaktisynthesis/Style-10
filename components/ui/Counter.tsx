"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/hooks";

/**
 * A count-up that eases out rather than ticking linearly, so the number
 * decelerates into its final value the way a physical dial would.
 *
 * The full value is always present in the DOM for assistive technology — the
 * animated digits are `aria-hidden`, so a screen reader never hears counting.
 */
export function Counter({
  value,
  decimals = 0,
  suffix = "",
  duration = 1900,
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!visible || reduced) return;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      /* Quint-out: most of the travel happens early, then a long settle. */
      setDisplay(value * (1 - Math.pow(1 - t, 5)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, value, duration, reduced]);

  const formatted = display.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {value.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        {suffix}
      </span>
      <span aria-hidden className="tabular-nums">
        {formatted}
        {suffix}
      </span>
    </span>
  );
}
