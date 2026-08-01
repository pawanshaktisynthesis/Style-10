"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Eyebrow, Reveal, SplitLines } from "@/components/ui/Reveal";
import { CaseArt } from "@/components/art/CaseArt";
import { SECTIONS, WORK, type CaseStudy } from "@/lib/data";
import { EASE, inView, SPRING } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks";

const META = SECTIONS.find((s) => s.id === "work")!;

/* -------------------------------------------------------------------------- */
/* Row                                                                         */
/* -------------------------------------------------------------------------- */

function CaseRow({ study, index, onOpen }: { study: CaseStudy; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const flipped = index % 2 === 1;

  /* Slow counter-parallax on the visual so the row has depth as it passes. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["7%", "-7%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [1.1, 1.02, 1.1]);

  return (
    <motion.article
      ref={ref}
      data-reveal
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.9, ease: EASE.out }}
      className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
    >
      <div className={`lg:col-span-7 ${flipped ? "lg:order-2" : ""}`}>
        <button
          type="button"
          onClick={onOpen}
          data-cursor="view"
          aria-label={`Open case study: ${study.client} — ${study.title}`}
          className="relative block w-full overflow-hidden rounded-[20px] border border-rule bg-abyss text-left"
        >
          <motion.div layoutId={`case-art-${study.id}`} className="aspect-[16/10] overflow-hidden">
            <motion.div style={{ y, scale }} className="h-full w-full">
              <CaseArt study={study} />
            </motion.div>
          </motion.div>

          {/* Scrim + affordance, revealed on hover and keyboard focus. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/85 via-void/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-5 left-5 translate-y-3 text-[0.8125rem] font-medium text-champagne opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
          >
            Read the case study →
          </span>
        </button>
      </div>

      <div className={`lg:col-span-5 ${flipped ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-3">
          <span className="t-mono text-prana">{study.client}</span>
          <span aria-hidden className="h-px w-6 bg-rule" />
          <span className="t-mono text-faint">
            {study.sector} · {study.year}
          </span>
        </div>

        <h3 className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-light leading-[1.08] tracking-tight text-champagne">
          {study.title}
        </h3>

        <p className="t-body mt-4 max-w-[52ch]">{study.summary}</p>

        <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-rule pt-6">
          {study.results.map((result) => (
            <div key={result.label}>
              <dt className="sr-only">{result.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(1.125rem,1.8vw,1.5rem)] font-light leading-none tracking-tight text-champagne">
                  {result.value}
                </span>
                <span className="mt-2 block text-[0.75rem] leading-snug text-faint">{result.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail overlay                                                              */
/* -------------------------------------------------------------------------- */

function CaseDetail({ study, onClose }: { study: CaseStudy; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  /* Dialog hygiene: lock the page, restore focus, trap Tab, close on Escape. */
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("lenis-stopped");
    panel.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab" || !panel.current) return;

      const focusables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
      previous?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE.swift }}
    >
      <button
        type="button"
        aria-label="Close case study"
        onClick={onClose}
        className="absolute inset-0 bg-void/88 backdrop-blur-2xl"
      />

      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`case-title-${study.id}`}
        tabIndex={-1}
        layout
        className="glass relative max-h-[90svh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-[24px] outline-none"
        initial={{ y: 28, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.98, opacity: 0 }}
        transition={SPRING.soft}
      >
        <motion.div layoutId={`case-art-${study.id}`} className="aspect-[16/10] overflow-hidden rounded-t-[24px]">
          <CaseArt study={study} />
        </motion.div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-champagne/15 bg-void/70 text-champagne backdrop-blur-md transition-colors hover:border-prana/50"
        >
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden>
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>

        <div className="p-7 md:p-11">
          <div className="flex flex-wrap items-center gap-3">
            <span className="t-mono text-prana">{study.client}</span>
            <span aria-hidden className="h-px w-6 bg-rule" />
            <span className="t-mono text-faint">
              {study.sector} · {study.year}
            </span>
          </div>

          <h3
            id={`case-title-${study.id}`}
            className="mt-5 font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-light leading-[1.06] tracking-tight text-champagne"
          >
            {study.title}
          </h3>

          <p className="t-lead mt-5 max-w-[64ch]">{study.summary}</p>

          <div className="mt-9 grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="t-mono text-faint">Scope</h4>
              <ul className="mt-4 flex flex-wrap gap-2">
                {study.scope.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-champagne/12 px-3 py-1.5 text-[0.75rem] text-bone"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="t-mono text-faint">Outcome</h4>
              <dl className="mt-4 space-y-3">
                {study.results.map((result) => (
                  <div key={result.label} className="flex items-baseline gap-4">
                    <dt className="sr-only">{result.label}</dt>
                    <dd className="font-display text-xl font-light tracking-tight text-champagne">
                      {result.value}
                    </dd>
                    <dd className="text-[0.8125rem] text-muted">{result.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-10 border-t border-rule pt-7">
            <a
              href="#contact"
              onClick={onClose}
              className="group inline-flex items-center gap-2.5 text-[0.9375rem] font-medium text-champagne"
            >
              Talk to us about work like this
              <span
                aria-hidden
                className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */

export function Work() {
  const [open, setOpen] = useState<CaseStudy | null>(null);

  return (
    <section id="work" aria-labelledby="work-title" className="section-y relative">
      <div className="shell">
        <Eyebrow stage={META.stage} phase={META.phase} />

        <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <SplitLines
            as="h2"
            id="work-title"
            className="t-h2 lg:col-span-6"
            lines={[
              <>Six systems,</>,
              <>
                still <span className="t-em text-synth">running</span>.
              </>,
            ]}
          />
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
            <Reveal>
              <p className="t-lead">
                Every project below is in production and maintained by the client&apos;s own team.
                Numbers are measured after handover, not at launch.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 space-y-24 md:space-y-32">
          {WORK.map((study, i) => (
            <CaseRow key={study.id} study={study} index={i} onOpen={() => setOpen(study)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && <CaseDetail key={open.id} study={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}
