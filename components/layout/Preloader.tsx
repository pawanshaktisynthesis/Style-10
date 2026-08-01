"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { EASE } from "@/lib/motion";
import { scrollState } from "@/lib/scroll-store";
import { useReducedMotion } from "@/lib/hooks";
import { BRAND } from "@/lib/data";

/**
 * The entrance.
 *
 * A counter tied to a spring rather than a timer, so the number decelerates
 * into 100 instead of ticking mechanically. On exit the panel splits and the
 * two halves clear the viewport vertically, handing the page off to the scene.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { stiffness: 42, damping: 20, mass: 0.9 });
  const readout = useTransform(smooth, (v) => Math.round(v).toString().padStart(3, "0"));
  const scaleX = useTransform(smooth, [0, 100], [0, 1]);
  const startedAt = useRef(0);

  useEffect(() => {
    /* Lock scrolling while the panel is up. */
    document.documentElement.classList.add("lenis-stopped");

    if (reduced) {
      document.documentElement.classList.remove("lenis-stopped");
      scrollState.intro = 1;
      setDone(true);
      return;
    }

    startedAt.current = performance.now();

    /* Advance against real readiness — fonts and first paint — rather than a
       fixed delay, but never hold the page longer than 2.2s. */
    let frame = 0;
    const ready = Promise.race([
      Promise.all([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => requestAnimationFrame(r))]),
      new Promise((r) => setTimeout(r, 1600)),
    ]);

    const tick = () => {
      const elapsed = performance.now() - startedAt.current;
      /* Asymptotic climb to 92 while waiting, so it never stalls at a number. */
      raw.set(Math.min(92, (1 - Math.exp(-elapsed / 620)) * 100));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    ready.then(() => {
      const elapsed = performance.now() - startedAt.current;
      /* A floor of 620ms — a preloader that flashes is worse than none, but
         every millisecond past that is a millisecond the hero is not painted. */
      setTimeout(() => {
        cancelAnimationFrame(frame);
        raw.set(100);
        setTimeout(() => {
          setDone(true);
          document.documentElement.classList.remove("lenis-stopped");
        }, 420);
      }, Math.max(0, 620 - elapsed));
    });

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [raw, reduced]);

  /* Hand the intro value to the shaders so the field arrives with the panel. */
  useEffect(() => {
    if (!done) return;
    let frame = 0;
    const start = performance.now();
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / 1400);
      scrollState.intro = 1 - Math.pow(1 - t, 3);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex items-end"
          exit={{ transition: { duration: 0 } }}
          aria-hidden
        >
          {/* Two panels that clear in opposite directions. */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-void"
            exit={{ y: "-101%", transition: { duration: 0.85, ease: EASE.inOut } }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-void"
            exit={{ y: "101%", transition: { duration: 0.85, ease: EASE.inOut, delay: 0.04 } }}
          />

          <motion.div
            className="relative z-10 w-full px-[clamp(1.25rem,5vw,5.5rem)] pb-[clamp(2rem,6vh,4rem)]"
            exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE.swift } }}
          >
            <div className="flex items-end justify-between gap-6">
              <div>
                <motion.p
                  className="t-mono text-faint"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE.out, delay: 0.15 }}
                >
                  {BRAND.etymology}
                </motion.p>
                <motion.p
                  className="mt-3 font-display text-[clamp(1.5rem,4vw,2.75rem)] font-extralight leading-none tracking-tight text-champagne"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE.out, delay: 0.25 }}
                >
                  PawanShakti <span className="t-em text-synth">Synthesis</span>
                </motion.p>
              </div>

              <motion.span
                className="font-mono text-[clamp(2.5rem,9vw,7rem)] font-light leading-none tracking-tighter text-champagne tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {readout}
              </motion.span>
            </div>

            <div className="mt-6 h-px w-full overflow-hidden bg-rule">
              <motion.div
                className="h-full w-full origin-left"
                style={{
                  scaleX,
                  background: "linear-gradient(90deg, #56e8cf, #7a5cff)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
