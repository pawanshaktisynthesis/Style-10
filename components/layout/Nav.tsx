"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE, SPRING } from "@/lib/motion";
import { BRAND, SECTIONS } from "@/lib/data";
import { getActiveSection, scrollState, subscribeActiveSection } from "@/lib/scroll-store";
import { Wordmark } from "@/components/ui/Wordmark";

function useActiveSection() {
  return useSyncExternalStore(subscribeActiveSection, getActiveSection, () => "hero");
}

export function Nav() {
  const active = useActiveSection();
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);

  /* Polled off the shared store rather than a scroll listener. The previous
     value is held in a ref so React is only touched when the state actually
     flips, rather than once per frame for the life of the page. */
  const wasLifted = useRef(false);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const next = scrollState.y > 40;
      if (next !== wasLifted.current) {
        wasLifted.current = next;
        setLifted(next);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Escape closes the mobile sheet, and the body must not scroll behind it. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-prana focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void"
      >
        Skip to content
      </a>

      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE.out, delay: 1.5 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav
          aria-label="Primary"
          className="shell-wide flex items-center justify-between gap-4 py-4 md:py-5"
        >
          <a
            href="#hero"
            className="group flex items-center gap-3 rounded-full py-1"
            aria-label={`${BRAND.name} — back to top`}
          >
            <Wordmark className="h-8 w-8 shrink-0" />
            <span className="text-[0.8125rem] font-medium tracking-tight text-champagne sm:text-[0.9rem]">
              PawanShakti<span className="text-faint"> Synthesis</span>
            </span>
          </a>

          {/* Desktop pill */}
          <motion.div
            animate={{
              backgroundColor: lifted ? "rgba(11,13,24,0.72)" : "rgba(11,13,24,0)",
              borderColor: lifted ? "rgba(233,220,195,0.09)" : "rgba(233,220,195,0)",
              backdropFilter: lifted ? "blur(20px) saturate(150%)" : "blur(0px)",
            }}
            transition={{ duration: 0.45, ease: EASE.swift }}
            className="hidden items-center gap-0.5 rounded-full border p-1 lg:flex"
          >
            {SECTIONS.filter((s) => s.id !== "hero" && s.id !== "contact").map((section) => {
              const on = active === section.id;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={on ? "true" : undefined}
                  className="relative rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300"
                >
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-elevated"
                      transition={SPRING.soft}
                    />
                  )}
                  <span className={`relative z-10 ${on ? "text-champagne" : "text-muted hover:text-bone"}`}>
                    {section.label}
                  </span>
                </a>
              );
            })}
          </motion.div>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="group relative hidden overflow-hidden rounded-full border border-champagne/15 px-5 py-2.5 text-[0.8125rem] font-medium text-champagne transition-colors duration-300 hover:border-prana/50 sm:block"
            >
              <span className="relative z-10">Start a project</span>
              <span className="absolute inset-0 -z-0 translate-y-full bg-prana/12 transition-transform duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-champagne/12 text-champagne lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <motion.span
                  animate={{ rotate: open ? 45 : 0, y: open ? 5 : 0 }}
                  transition={SPRING.quick}
                  className="absolute left-0 top-0 block h-px w-full bg-current"
                />
                <motion.span
                  animate={{ opacity: open ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-1.5 block h-px w-full bg-current"
                />
                <motion.span
                  animate={{ rotate: open ? -45 : 0, y: open ? -5 : 0 }}
                  transition={SPRING.quick}
                  className="absolute bottom-0 left-0 block h-px w-full bg-current"
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-void/85 backdrop-blur-xl"
            />
            <motion.ul
              className="absolute inset-x-0 top-0 flex flex-col gap-1 px-[clamp(1.25rem,5vw,5.5rem)] pb-10 pt-24"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } } }}
            >
              {SECTIONS.map((section) => (
                <motion.li
                  key={section.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE.out } },
                  }}
                >
                  <a
                    href={`#${section.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-rule/70 py-4"
                  >
                    <span className="t-mono w-8 text-faint">{section.phase}</span>
                    <span className="font-display text-3xl font-extralight tracking-tight text-champagne">
                      {section.title}
                    </span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
