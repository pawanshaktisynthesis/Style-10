"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Eyebrow, Reveal, SplitLines } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { METRICS, PRINCIPLES, SECTIONS, TIMELINE } from "@/lib/data";
import { EASE, inView } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

const META = SECTIONS.find((s) => s.id === "about")!;

export function About() {
  const timeline = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  /* The spine fills as the timeline is scrolled — progress you can see. */
  const { scrollYProgress } = useScroll({
    target: timeline,
    offset: ["start 72%", "end 58%"],
  });
  const spine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="shell">
        <Eyebrow stage={META.stage} phase={META.phase} />

        {/* Deliberately asymmetric: heading left, standfirst offset right. */}
        <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <SplitLines
            as="h2"
            id="about-title"
            className="t-h2 lg:col-span-7"
            lines={[
              <>One team,</>,
              <>
                no <span className="t-em text-synth">handoffs</span>.
              </>,
            ]}
          />

          <div className="lg:col-span-5 lg:pt-3">
            <Reveal>
              <p className="t-lead">
                Forty-one engineers and designers who share one repository and one definition of
                done. We cap the number of engagements we take each quarter so that the people who
                pitch the work are the people who write it.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-rule bg-rule lg:grid-cols-4">
          {METRICS.map((metric, i) => (
            <div
              key={metric.label}
              className="group relative bg-abyss transition-colors duration-500 hover:bg-elevated"
            >
              <motion.div
                data-reveal
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.7, ease: EASE.out, delay: i * 0.07 }}
                className="p-6 md:p-8"
              >
                <p className="font-display text-[clamp(2rem,4vw,3.25rem)] font-extralight leading-none tracking-tight text-champagne">
                  <Counter
                    value={metric.value}
                    suffix={metric.suffix}
                    decimals={"decimals" in metric ? metric.decimals : 0}
                  />
                </p>
                <p className="mt-3 text-[0.9375rem] text-bone">{metric.label}</p>
                <p className="t-mono mt-1.5 text-[0.625rem] text-faint">{metric.detail}</p>
              </motion.div>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-prana to-shakti transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </div>
          ))}
        </div>

        {/* Timeline — a genuine chronology, so the years carry the structure. */}
        <div className="mt-28 grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h3 className="t-h3 text-champagne">How we got here</h3>
              <p className="t-body mt-4 max-w-[36ch]">
                Nine years, one practice. The through line is that we never split design away from
                engineering, even when it would have been easier to.
              </p>
            </Reveal>
          </div>

          <ol ref={timeline} className="relative lg:col-span-8">
            {/* The unfilled spine */}
            <span aria-hidden className="absolute left-0 top-2 h-full w-px bg-rule md:left-[6.5rem]" />
            {/* The filled spine, driven by scroll */}
            <motion.span
              aria-hidden
              className="absolute left-0 top-2 w-px origin-top bg-gradient-to-b from-prana via-shakti to-transparent md:left-[6.5rem]"
              style={{ height: "100%", scaleY: reduced ? 1 : spine }}
            />

            {TIMELINE.map((entry, i) => (
              <motion.li
                key={entry.year}
                data-reveal
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.75, ease: EASE.out, delay: i * 0.06 }}
                className="group relative flex flex-col gap-2 pb-12 pl-8 last:pb-0 md:flex-row md:gap-10 md:pl-0"
              >
                <span className="t-mono w-24 shrink-0 pt-1.5 text-prana md:text-right">
                  {entry.year}
                </span>

                <span
                  aria-hidden
                  className="absolute left-0 top-2 h-2.5 w-2.5 -translate-x-[4.5px] rounded-full border border-prana/50 bg-void transition-all duration-500 group-hover:scale-125 group-hover:bg-prana md:left-[6.5rem]"
                />

                <div className="md:pl-10">
                  <h4 className="text-[1.0625rem] font-medium tracking-tight text-champagne">
                    {entry.title}
                  </h4>
                  <p className="t-body mt-2 max-w-[58ch]">{entry.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Principles */}
        <div className="mt-28 grid gap-8 md:grid-cols-3">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.title} delay={i * 0.08} className="group">
              <div className="rule mb-6 transition-opacity duration-500 group-hover:opacity-100" />
              <h3 className="max-w-[20ch] font-display text-[1.375rem] font-light leading-tight tracking-tight text-champagne">
                {principle.title}
              </h3>
              <p className="t-body mt-4">{principle.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
