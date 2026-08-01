"use client";

import { motion } from "motion/react";
import { Eyebrow, Reveal, SplitLines } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { Glyph } from "@/components/art/Glyph";
import { SECTIONS, SERVICES } from "@/lib/data";
import { EASE, inView } from "@/lib/motion";

const META = SECTIONS.find((s) => s.id === "services")!;

/**
 * Capabilities are laid out on a single hairline grid rather than as twelve
 * floating cards. The shared rules do the organising, so the hover state — a
 * lift, a lit edge, and the glyph animating — is the only decoration on top.
 */
export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y relative">
      <div className="shell">
        <Eyebrow stage={META.stage} phase={META.phase} />

        <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <SplitLines
            as="h2"
            id="services-title"
            className="t-h2 lg:col-span-6"
            lines={[
              <>What we</>,
              <>
                actually <span className="t-em text-synth">do</span>.
              </>,
            ]}
          />
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
            <Reveal>
              <p className="t-lead">
                Twelve capabilities, one team. Most engagements draw on three or four of these at
                once, which is the point — the parts are built by people who talk to each other.
              </p>
            </Reveal>
          </div>
        </div>

        {/* The card surfaces never animate — only their contents do. Fading an
            article itself would leave it transparent mid-reveal and expose the
            grid's hairline background as a pale panel. */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-[20px] border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <article key={service.id} className="group relative isolate bg-abyss">
              <Tilt max={4} className="h-full">
                <motion.div
                  data-reveal
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ duration: 0.7, ease: EASE.out, delay: (i % 3) * 0.06 }}
                  className="relative flex h-full flex-col p-7 transition-colors duration-500 group-hover:bg-elevated md:p-8"
                >
                  {/* Lit top edge on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-prana via-shakti to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />

                  <div className="flex items-start justify-between gap-4">
                    <Glyph
                      name={service.glyph}
                      className="h-11 w-11 text-prana/70 transition-colors duration-500 group-hover:text-prana"
                    />
                    <span className="t-mono text-[0.625rem] text-faint transition-colors duration-500 group-hover:text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-8 text-[1.1875rem] font-medium tracking-tight text-champagne">
                    {service.title}
                  </h3>
                  <p className="t-body mt-2.5 text-[0.9375rem]">{service.summary}</p>

                  {/* Detail is revealed on hover and focus, and stays reachable
                      for keyboard users because the group is focus-within. */}
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="t-body mt-4 text-[0.875rem] text-muted/80">{service.detail}</p>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {service.points.map((point) => (
                          <li
                            key={point}
                            className="rounded-full border border-champagne/10 px-2.5 py-1 text-[0.6875rem] text-muted"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-auto pt-7">
                    <span
                      aria-hidden
                      className="block h-px w-full origin-left scale-x-0 bg-champagne/12 transition-transform duration-500 group-hover:scale-x-100"
                    />
                  </div>
                </motion.div>
              </Tilt>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
