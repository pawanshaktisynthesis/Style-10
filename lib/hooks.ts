"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/* -------------------------------------------------------------------------- */
/* Media queries                                                               */
/* -------------------------------------------------------------------------- */

function subscribeToQuery(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

/**
 * SSR-safe media query. Returns `serverValue` during render on the server and
 * on the first client render, so hydration never mismatches.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    subscribeToQuery(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Honours the OS setting and reacts if the user changes it mid-session. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/** Coarse pointers get no custom cursor, no magnetic pull, no hover states. */
export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

/* -------------------------------------------------------------------------- */
/* Environment                                                                 */
/* -------------------------------------------------------------------------- */

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export type Tier = "high" | "low";

/**
 * Decides how much 3D this device should be asked to render.
 *
 * Deliberately conservative: hardware concurrency and memory are crude signals,
 * but they reliably separate a laptop from a budget phone, which is the only
 * distinction the scene actually needs.
 */
export function useDeviceTier(): Tier {
  const [tier, setTier] = useState<Tier>("high");

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (cores <= 4 || memory <= 4 || (coarse && window.innerWidth < 900)) {
      setTier("low");
    }
  }, []);

  return tier;
}

/** True while the document is visible — used to park the render loop. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return visible;
}
