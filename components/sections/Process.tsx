"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Eyebrow, Reveal, SplitLines } from "@/components/ui/Reveal";
import { PROCESS, SECTIONS } from "@/lib/data";
import { EASE, inView } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

const META = SECTIONS.find((s) => s.id === "process")!;

/**
 * The method is a genuine ordered sequence — you cannot harden before you
 * build — so the numbering is load-bearing rather than decorative, and the
 * connecting rail fills in order as you scroll it.
 */
export function Process() {
  const rail = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: rail, offset: ["start 78%", "end 65%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" aria-labelledby="process-title" className="section-y relative">
      <div className="shell">
        <Eyebrow stage={META.stage} phase={META.phase} />

        <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <SplitLines
            as="h2"
            id="process-title"
            className="t-h2 lg:col-span-6"
            lines={[
              <>Five stages.</>,
              <>
                No <span className="t-em text-synth">surprises</span>.
              </>,
            ]}
          />
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
            <Reveal>
              <p className="t-lead">
                Every stage ends with something you can read, run, or ship — not a status update.
                If a stage does not produce its output, we do not start the next one.
              </p>
            </Reveal>
          </div>
        </div>

        <ol ref={rail} className="relative mt-20">
          {/* Rail: vertical on mobile, aligned to the number column on desktop. */}
          <span aria-hidden className="absolute left-[15px] top-3 h-full w-px bg-rule lg:left-[calc(8.5rem+15px)]" />
          <motion.span
            aria-hidden
            className="absolute left-[15px] top-3 h-full w-px origin-top bg-gradient-to-b from-prana via-shakti to-ember lg:left-[calc(8.5rem+15px)]"
            style={{ scaleY: reduced ? 1 : fill }}
          />

          {PROCESS.map((step, i) => (
            <motion.li
              key={step.n}
              data-reveal
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.8, ease: EASE.out, delay: i * 0.05 }}
              className="group relative grid gap-y-4 pb-16 pl-14 last:pb-0 lg:grid-cols-[8.5rem_1fr] lg:gap-x-14 lg:pl-0"
            >
              {/* Duration sits in the left column on desktop, above on mobile. */}
              <div className="lg:pt-1 lg:text-right">
                <span className="t-mono text-faint">{step.duration}</span>
              </div>

              {/* Node marker */}
              <span
                aria-hidden
                className="absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full border border-rule bg-void transition-colors duration-500 group-hover:border-prana/60 lg:left-[8.5rem]"
              >
                <span className="h-2 w-2 rounded-full bg-faint transition-all duration-500 group-hover:scale-125 group-hover:bg-prana" />
              </span>

              <div className="lg:pl-14">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[0.8125rem] font-medium text-prana">{step.n}</span>
                  <h3 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-light leading-none tracking-tight text-champagne">
                    {step.title}
                  </h3>
                </div>

                <p className="t-body mt-4 max-w-[62ch]">{step.body}</p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {step.outputs.map((output) => (
                    <li
                      key={output}
                      className="rounded-full border border-champagne/10 bg-abyss/60 px-3 py-1.5 text-[0.75rem] text-muted transition-colors duration-500 group-hover:border-champagne/20 group-hover:text-bone"
                    >
                      {output}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
