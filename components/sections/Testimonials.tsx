"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Eyebrow, SplitLines } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { SECTIONS, TESTIMONIALS } from "@/lib/data";
import { EASE, inView } from "@/lib/motion";

const META = SECTIONS.find((s) => s.id === "voices")!;

/**
 * A horizontal track rather than a rotating carousel.
 *
 * Auto-advancing quotes are hostile — they move while you are reading them.
 * This scrolls on your input only: drag, wheel, arrow keys, or the buttons.
 * Native scroll-snap does the physics, so it feels right on a trackpad and on
 * a phone without any custom gesture handling.
 */
export function Testimonials() {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 12);
    setAtEnd(el.scrollLeft > el.scrollWidth - el.clientWidth - 12);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const nudge = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.clientWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <section id="voices" aria-labelledby="voices-title" className="section-y relative">
      <div className="shell">
        <Eyebrow stage={META.stage} phase={META.phase} />

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <SplitLines
            as="h2"
            id="voices-title"
            className="t-h2 max-w-[14ch]"
            lines={[
              <>What clients</>,
              <>
                actually <span className="t-em text-synth">said</span>.
              </>,
            ]}
          />

          <div className="flex gap-2">
            {(
              [
                ["Previous testimonials", -1, atStart],
                ["Next testimonials", 1, atEnd],
              ] as const
            ).map(([label, direction, disabled]) => (
              <button
                key={label}
                type="button"
                onClick={() => nudge(direction)}
                disabled={disabled}
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-champagne/14 text-champagne transition-all duration-300 hover:border-prana/50 hover:bg-elevated disabled:pointer-events-none disabled:opacity-30"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                  <path
                    d={direction === 1 ? "M3 8h10M9 4l4 4-4 4" : "M13 8H3M7 4L3 8l4 4"}
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full-bleed track so cards run off the edge — the page should feel
          wider than the viewport here. */}
      <ul
        ref={track}
        tabIndex={0}
        aria-label="Client testimonials"
        /* scroll-padding must match the inline padding: without it, snap-start
           aligns the first card to the scrollport edge and the leading padding
           is silently scrolled away. */
        style={{
          paddingInline: "clamp(1.25rem, 5vw, 5.5rem)",
          scrollPaddingInline: "clamp(1.25rem, 5vw, 5.5rem)",
        }}
        className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TESTIMONIALS.map((item, i) => (
          <motion.li
            key={item.name}
            data-reveal
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.75, ease: EASE.out, delay: Math.min(i, 3) * 0.07 }}
            className="w-[min(85vw,26rem)] shrink-0 snap-start"
          >
            <Tilt max={5} className="h-full">
              <figure className="glass edge-light flex h-full flex-col rounded-[20px] p-7 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.9)] md:p-8">
                <span
                  aria-hidden
                  className="t-em text-[3.5rem] leading-[0.6] text-ember/45"
                >
                  &ldquo;
                </span>

                <blockquote className="mt-5 flex-1">
                  <p className="text-[1.0625rem] font-light leading-[1.65] text-bone">{item.quote}</p>
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-3.5 border-t border-champagne/8 pt-6">
                  {/* Monogram rather than a stock headshot — an invented face
                      would be a fabrication, and a stock one is worse. */}
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-champagne/12 font-display text-[0.8125rem] font-light text-champagne"
                    style={{
                      background:
                        "linear-gradient(140deg, rgba(86,232,207,0.16), rgba(122,92,255,0.16))",
                    }}
                  >
                    {item.name
                      .replace(/^Dr\.\s*/, "")
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.9375rem] font-medium text-champagne">
                      {item.name}
                    </span>
                    <span className="block truncate text-[0.8125rem] text-faint">
                      {item.role}, {item.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Tilt>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
