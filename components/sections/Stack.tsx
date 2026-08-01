"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Eyebrow, Reveal, SplitLines } from "@/components/ui/Reveal";
import { SECTIONS, STACK_GROUPS } from "@/lib/data";
import { EASE, inView, SPRING } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

const META = SECTIONS.find((s) => s.id === "stack")!;

/* Percent of the orbit box. Capped so that a label centred on the outer
   ring still lands inside the container instead of colliding with the
   heading or the column beside it. */
const RING_RADII = [21, 30, 39, 48];
const RING_SPEEDS = [88, 116, 150, 190]; // seconds per revolution
const RING_COLORS = ["#56e8cf", "#7fd8ff", "#7a5cff", "#f2a65a"];

/**
 * The stack as an orbit: four rings, one per layer of the system, turning at
 * different rates so the composition never repeats. Selecting a ring brings it
 * forward and dims the others.
 *
 * The orbit is decorative — `aria-hidden` — and the same information is
 * published beside it as a plain, fully navigable definition list. Nobody needs
 * to parse a rotating diagram to read a technology list, which is also why the
 * orbit is dropped entirely below `lg`: at phone width it is unreadable, and
 * its rotating labels would push the document wider than the viewport.
 */
export function Stack() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-y relative">
      <div className="shell">
        <Eyebrow stage={META.stage} phase={META.phase} />

        <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <SplitLines
            as="h2"
            id="stack-title"
            className="t-h2 lg:col-span-6"
            lines={[
              <>Tools we</>,
              <>
                actually <span className="t-em text-synth">run</span>.
              </>,
            ]}
          />
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
            <Reveal>
              <p className="t-lead">
                We are not religious about any of it. This is what has survived contact with
                production across nine years, and what we will argue for unless you have a reason
                to go another way.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* The orbit */}
          <Reveal className="hidden lg:col-span-7 lg:block" delay={0.1}>
            <div
              aria-hidden
              className="relative mx-auto aspect-square w-full max-w-[520px]"
              onMouseLeave={() => setActive(null)}
            >
              {/* Ring guides */}
              {RING_RADII.map((r, i) => (
                <span
                  key={`guide-${i}`}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-700"
                  style={{
                    width: `${r * 2}%`,
                    height: `${r * 2}%`,
                    borderColor: RING_COLORS[i],
                    opacity: active === null ? 0.12 : active === i ? 0.4 : 0.05,
                  }}
                />
              ))}

              {/* Orbiting items */}
              {STACK_GROUPS.map((group, ringIndex) => {
                const radius = RING_RADII[ringIndex];
                const dimmed = active !== null && active !== ringIndex;

                return (
                  <div
                    key={group.group}
                    className="absolute inset-0"
                    style={
                      reduced
                        ? undefined
                        : {
                            animation: `orbit-spin ${RING_SPEEDS[ringIndex]}s linear infinite`,
                            animationDirection: ringIndex % 2 === 0 ? "normal" : "reverse",
                          }
                    }
                  >
                    {group.items.map((item, i) => {
                      const angle = (i / group.items.length) * Math.PI * 2 + ringIndex * 0.4;
                      const x = 50 + Math.cos(angle) * radius;
                      const y = 50 + Math.sin(angle) * radius;

                      return (
                        <span
                          key={item}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${x}%`, top: `${y}%` }}
                        >
                          {/* Counter-rotation keeps every label upright. */}
                          <span
                            className="block whitespace-nowrap rounded-full border px-2 py-[3px] text-[0.625rem] font-medium backdrop-blur-sm transition-all duration-500"
                            style={{
                              animation: reduced
                                ? undefined
                                : `orbit-spin ${RING_SPEEDS[ringIndex]}s linear infinite ${
                                    ringIndex % 2 === 0 ? "reverse" : "normal"
                                  }`,
                              borderColor: dimmed ? "rgba(233,220,195,0.06)" : `${RING_COLORS[ringIndex]}38`,
                              backgroundColor: dimmed ? "rgba(8,9,15,0.5)" : "rgba(11,13,24,0.72)",
                              color: dimmed ? "#3f3d4e" : "#c8c6d0",
                              opacity: dimmed ? 0.35 : 1,
                            }}
                          >
                            {item}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                );
              })}

              {/* The core */}
              <div className="absolute left-1/2 top-1/2 grid h-[19%] w-[19%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-champagne/12 bg-void/85 backdrop-blur-md">
                <div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(86,232,207,0.35), transparent 68%)" }}
                />
                <span className="relative t-mono text-center text-[0.5625rem] leading-tight text-champagne">
                  PS
                  <br />
                  Synthesis
                </span>
              </div>
            </div>
          </Reveal>

          {/* The list — the accessible source of truth. */}
          <div className="lg:col-span-5">
            <dl className="space-y-px overflow-hidden rounded-[20px] border border-rule bg-rule">
              {STACK_GROUPS.map((group, i) => (
                /* A `dl` may contain one level of `div` wrapping each
                   term/description pair — no more — so the reveal animates the
                   `dt` and `dd` themselves rather than adding a wrapper. The
                   surface stays opaque throughout, which is what keeps the
                   grid's hairline background from showing through mid-reveal. */
                <div
                  key={group.group}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onBlur={() => setActive(null)}
                  tabIndex={0}
                  className="bg-abyss p-6 outline-offset-[-2px] transition-colors duration-400 hover:bg-elevated focus-visible:bg-elevated"
                >
                  <motion.dt
                    data-reveal
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={inView}
                    transition={{ duration: 0.65, ease: EASE.out, delay: i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <motion.span
                      aria-hidden
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: RING_COLORS[i] }}
                      animate={{ scale: active === i ? 1.6 : 1 }}
                      transition={SPRING.quick}
                    />
                    <span className="text-[0.9375rem] font-medium text-champagne">{group.group}</span>
                  </motion.dt>
                  <motion.dd
                    data-reveal
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={inView}
                    transition={{ duration: 0.65, ease: EASE.out, delay: i * 0.07 + 0.05 }}
                    className="mt-3 pl-5 text-[0.8125rem] leading-relaxed text-muted"
                  >
                    {group.items.join(" · ")}
                  </motion.dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
