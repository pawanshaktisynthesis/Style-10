"use client";

import { motion } from "motion/react";
import { CTA } from "@/components/ui/Magnetic";
import { EASE } from "@/lib/motion";
import { BRAND } from "@/lib/data";

/**
 * The hero states the thesis in three words.
 *
 * "Force, given form" is the brand's own etymology rendered in English —
 * shakti (force) resolved through synthesis (form) — and it sits directly on
 * top of the 3D core doing exactly that. The subhead does the concrete work of
 * saying what the firm actually sells.
 */

const LINES = [
  <>Force,</>,
  <>
    given <span className="t-em text-synth">form</span>.
  </>,
];

/**
 * The hero animates *behind* the preloader rather than after it.
 *
 * Waiting for the hand-off meant the panels slid away to reveal an empty stage
 * that then began animating — and it pushed the largest text paint a full
 * second later than it needed to be. Composing underneath means the reveal
 * shows a page that has already settled.
 */
const BASE = 0.2;

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-between pb-8 pt-28 md:pb-12"
    >
      <div className="shell-wide flex flex-1 flex-col justify-center">
        {/* Eyebrow — the etymology that drives the whole visual system. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE.out, delay: BASE }}
          className="flex flex-wrap items-center gap-x-3 gap-y-1"
        >
          <span className="t-mono text-prana">{BRAND.etymology}</span>
          <span aria-hidden className="h-px w-12 bg-gradient-to-r from-prana/50 to-transparent" />
        </motion.div>

        <h1 id="hero-title" className="t-display mt-6 max-w-[16ch] text-champagne">
          <span className="sr-only">Force, given form.</span>
          {LINES.map((line, i) => (
            <span key={i} aria-hidden className="line-mask">
              <motion.span
                className="block"
                initial={{ y: "112%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.25, ease: EASE.out, delay: BASE + 0.08 + i * 0.11 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE.out, delay: BASE + 0.42 }}
          className="t-lead mt-8 max-w-[54ch] text-bone/85"
        >
          PawanShakti Synthesis builds AI systems, enterprise software, and digital products for
          companies that treat engineering and design as the same discipline.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE.out, delay: BASE + 0.54 }}
          className="mt-11 flex flex-wrap items-center gap-4"
        >
          <CTA href="#contact">Start a project</CTA>
          <CTA href="#work" variant="ghost">
            See selected work
          </CTA>
        </motion.div>
      </div>

      {/* Baseline strip: status, capability summary, scroll cue. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE.out, delay: BASE + 0.8 }}
        className="shell-wide"
      >
        <div className="rule mb-5" />
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="flex items-center gap-2.5 text-[0.8125rem] text-muted">
            <span aria-hidden className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-prana opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-prana" />
            </span>
            Taking two engagements for Q4 2026
          </p>

          <p className="hidden text-[0.8125rem] text-faint md:block">{BRAND.location}</p>

          <a
            href="#about"
            className="group flex items-center gap-2.5 text-[0.8125rem] text-muted transition-colors hover:text-champagne"
          >
            <span className="t-mono">Scroll</span>
            <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full border border-champagne/15">
              <motion.svg
                viewBox="0 0 12 12"
                className="h-3 w-3"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: EASE.inOut }}
              >
                <path d="M6 1v9M2.5 6.5 6 10l3.5-3.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
