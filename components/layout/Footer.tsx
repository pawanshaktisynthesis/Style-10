"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Reveal } from "@/components/ui/Reveal";
import { BRAND, SECTIONS, SERVICES } from "@/lib/data";
import { EASE } from "@/lib/motion";

/** A live clock in the studio's timezone — small, but it says someone is there. */
function StudioClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const render = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
          hour12: false,
        }).format(new Date()),
      );
    render();
    const id = setInterval(render, 30_000);
    return () => clearInterval(id);
  }, []);

  /* Rendered only after mount — a server-rendered clock is always wrong. */
  if (!time) return <span className="t-mono text-faint">Bengaluru</span>;
  return (
    <span className="t-mono text-faint">
      Bengaluru <span className="text-muted tabular-nums">{time}</span> IST
    </span>
  );
}

export function Footer() {
  const year = 2026;

  return (
    <footer className="relative border-t border-rule">
      {/* The closing statement — the last large type on the page. */}
      <div className="shell section-y">
        <Reveal>
          <p className="max-w-[18ch] font-display text-[clamp(2.25rem,7vw,6rem)] font-extralight leading-[0.92] tracking-[-0.045em] text-champagne">
            Let&apos;s build something that <span className="t-em text-synth">lasts</span>.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href="#contact"
            className="group mt-12 inline-flex items-center gap-4 text-[1.0625rem] font-medium text-champagne"
          >
            <span className="relative">
              {BRAND.email}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gradient-to-r from-prana to-shakti transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100"
              />
            </span>
            <motion.span
              aria-hidden
              className="grid h-11 w-11 place-items-center rounded-full border border-champagne/15"
              whileHover={{ scale: 1.08, borderColor: "rgba(86,232,207,0.5)" }}
              transition={{ duration: 0.35, ease: EASE.out }}
            >
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
                →
              </span>
            </motion.span>
          </a>
        </Reveal>
      </div>

      {/* Directory */}
      <div className="shell grid gap-10 border-t border-rule py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Wordmark className="h-8 w-8" />
            <span className="text-[0.9375rem] font-medium tracking-tight text-champagne">
              PawanShakti
            </span>
          </div>
          <p className="mt-5 max-w-[30ch] text-[0.8125rem] leading-relaxed text-muted">
            {BRAND.tagline}
          </p>
          <p className="t-mono mt-6 text-faint">{BRAND.etymology}</p>
        </div>

        <nav aria-label="Sections">
          <h2 className="t-mono text-faint">Sections</h2>
          <ul className="mt-5 space-y-2.5">
            {SECTIONS.filter((s) => s.id !== "hero").map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="group inline-flex items-center gap-2 text-[0.875rem] text-muted transition-colors hover:text-champagne"
                >
                  <span
                    aria-hidden
                    className="h-px w-0 bg-prana transition-all duration-400 group-hover:w-3"
                  />
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Capabilities">
          <h2 className="t-mono text-faint">Capabilities</h2>
          <ul className="mt-5 space-y-2.5">
            {SERVICES.slice(0, 6).map((service) => (
              <li key={service.id}>
                <a
                  href="#services"
                  className="group inline-flex items-center gap-2 text-[0.875rem] text-muted transition-colors hover:text-champagne"
                >
                  <span
                    aria-hidden
                    className="h-px w-0 bg-prana transition-all duration-400 group-hover:w-3"
                  />
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="t-mono text-faint">Studio</h2>
          <ul className="mt-5 space-y-2.5 text-[0.875rem] text-muted">
            <li>
              <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-champagne">
                {BRAND.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-champagne"
              >
                {BRAND.phone}
              </a>
            </li>
            <li className="pt-2">
              <StudioClock />
            </li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-4 border-t border-rule py-7">
        <p className="text-[0.75rem] text-faint">
          © {year} {BRAND.name}. Founded {BRAND.founded}.
        </p>
        <p className="text-[0.75rem] text-faint">
          Built in-house — Next.js, WebGL, and an unreasonable amount of attention to easing.
        </p>
      </div>
    </footer>
  );
}
