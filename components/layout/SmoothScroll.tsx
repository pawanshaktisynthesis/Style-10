"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks";
import { scrollState, setActiveSection } from "@/lib/scroll-store";
import { SECTIONS } from "@/lib/data";

/**
 * Owns the scroll pipeline.
 *
 * Lenis drives it, GSAP's ScrollTrigger is slaved to Lenis (so the two never
 * disagree about the scroll position), and both write into the mutable
 * `scrollState` that the WebGL loop reads. Nothing here causes a React render
 * except the active-section change, which is published through a subscription.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* Reduced motion gets native scrolling — smoothed scrolling is itself
       vestibular motion, so honouring the setting means switching it off. */
    if (reduced) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollState.y = window.scrollY;
        scrollState.progress = max > 0 ? window.scrollY / max : 0;
        scrollState.velocity = 0;
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      ScrollTrigger.refresh();
      return () => {
        window.removeEventListener("scroll", onScroll);
        ScrollTrigger.killAll();
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      /* An expo-out curve: the page keeps gliding after the wheel stops, which
         is what makes it feel weighted rather than sticky. */
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      /* Touch devices keep native scrolling — smoothing a touch drag fights
         the user's finger and always feels wrong. */
      syncTouch: false,
    });

    lenis.on("scroll", ({ scroll, limit, velocity }: { scroll: number; limit: number; velocity: number }) => {
      scrollState.y = scroll;
      scrollState.progress = limit > 0 ? scroll / limit : 0;
      /* Clamped: a trackpad fling can spike velocity high enough to tear the
         particle field apart. */
      scrollState.velocity = Math.max(-3, Math.min(3, velocity * 0.06));
      ScrollTrigger.update();
    });

    /* Drive Lenis from GSAP's ticker rather than its own rAF, so there is
       exactly one animation frame loop on the page. */
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /* Anchor links route through Lenis so in-page navigation is smooth too. */
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -8, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.killAll();
    };
  }, [reduced]);

  /* Active-section tracking, using IntersectionObserver rather than scroll
     math so it stays correct when sections change height. */
  useEffect(() => {
    const observed = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!observed.length) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio);
        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best && bestRatio > 0.08) setActiveSection(best);
      },
      { threshold: [0, 0.08, 0.25, 0.5, 0.75, 1], rootMargin: "-12% 0px -40% 0px" },
    );

    observed.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Pointer feeds the scene's parallax and the shader's push field. */
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (event: PointerEvent) => {
      scrollState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <>{children}</>;
}
