"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { SECTIONS } from "@/lib/data";
import { getActiveSection, scrollState, subscribeActiveSection } from "@/lib/scroll-store";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";

/* -------------------------------------------------------------------------- */
/* Progress                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A hairline progress bar plus a side rail of section markers.
 *
 * The rail is a genuine navigation aid — it says where you are and lets you
 * jump — so it is a real `nav` with links, not a decorative indicator.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const active = useSyncExternalStore(subscribeActiveSection, getActiveSection, () => "hero");
  const mobile = useIsMobile();

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${scrollState.progress})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[70] h-px bg-transparent">
        <div
          ref={bar}
          className="h-full w-full origin-left"
          style={{ background: "linear-gradient(90deg, #56e8cf, #7a5cff, #f2a65a)", transform: "scaleX(0)" }}
        />
      </div>

      {!mobile && (
        <nav
          aria-label="Section progress"
          className="fixed right-[max(1rem,2vw)] top-1/2 z-40 hidden -translate-y-1/2 xl:block"
        >
          <ul className="flex flex-col items-end gap-3.5">
            {SECTIONS.map((section) => {
              const on = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={on ? "true" : undefined}
                    className="group flex items-center justify-end gap-2.5"
                  >
                    <span
                      className={`text-[0.6875rem] font-medium tracking-wide transition-all duration-500 ${
                        on
                          ? "translate-x-0 text-champagne opacity-100"
                          : "translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      }`}
                    >
                      {section.label}
                    </span>
                    <motion.span
                      aria-hidden
                      className="block h-px rounded-full"
                      animate={{
                        width: on ? 26 : 12,
                        backgroundColor: on ? "#56e8cf" : "rgba(233,220,195,0.28)",
                      }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Scrim                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A contrast floor between the scene and the content.
 *
 * The 3D layer is deliberately luminous, and on a narrow viewport the core's
 * rim lands right where the copy does. Rather than dim the art everywhere, this
 * sits between the canvas and the document and leans much harder on small
 * screens, where the collision actually happens.
 */
export function Scrim() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] bg-void/50 sm:bg-void/35 lg:bg-void/[0.28]"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Grain                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Film grain, generated once as an inline SVG turbulence filter.
 *
 * A texture rather than a tiled PNG: no network request, no repeat seams, and
 * it can be regenerated at any density. It is what stops the large dark
 * gradients from banding on cheap panels.
 */
export function Grain() {
  const reduced = useReducedMotion();
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="220" height="220" filter="url(#n)" opacity="0.55"/></svg>`;
    setSrc(`url("data:image/svg+xml;base64,${btoa(svg)}")`);
  }, []);

  if (!src) return null;

  return (
    <div
      aria-hidden
      className={`grain-overlay ${reduced ? "" : "noise-anim"}`}
      style={{ ["--grain-src" as string]: src }}
    />
  );
}
