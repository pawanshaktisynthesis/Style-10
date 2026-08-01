"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks";

const STATEMENT =
  "Most technology work is delivered as two separate crafts. Engineers ship a system, designers dress it, and the seam between them is where quality quietly disappears. We removed the seam.";

/**
 * The manifesto illuminates word by word as it is scrolled through, so reading
 * pace and scroll pace are the same thing. The full sentence is present as a
 * single accessible node — the animated words are decoration on top of it.
 */
export function Manifesto() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const words = root.current.querySelectorAll<HTMLElement>("[data-word]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        /* 0.45 is the floor that still clears 3:1 against the void at this
           size — the unlit words have to be readable, not merely present. */
        { opacity: 0.45, filter: "blur(1.4px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            end: "bottom 62%",
            scrub: 0.6,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section aria-label="Our position" className="section-y relative">
      <div ref={root} className="shell">
        <p className="sr-only">{STATEMENT}</p>
        <p
          aria-hidden
          className="max-w-[22ch] font-display text-[clamp(1.75rem,5vw,4.25rem)] font-extralight leading-[1.08] tracking-[-0.035em] text-champagne md:max-w-[20ch]"
        >
          {STATEMENT.split(" ").map((word, i) => (
            <span key={i} data-word className="inline-block">
              {word}
              {" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
