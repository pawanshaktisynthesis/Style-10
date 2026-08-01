"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AtmosphereFallback } from "./AtmosphereFallback";
import { useReducedMotion } from "@/lib/hooks";

/**
 * Client boundary for the WebGL scene.
 *
 * three.js is by far the largest dependency on the page and nothing in the
 * document depends on it, so it is both code-split *and* deferred until the
 * main thread goes idle. Downloading and compiling it while the browser is
 * still laying out the hero is what turns a fast first paint into a slow one;
 * waiting for idle keeps LCP and interactivity to pure HTML and CSS.
 *
 * The CSS atmosphere renders in the meantime, so the background is never empty
 * — the scene simply takes over a beat later.
 *
 * Reduced motion is checked *before* the import is triggered, not inside the
 * scene: a visitor who has asked for less motion should never pay to download
 * a 226 kB renderer that will immediately decline to run.
 */
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export function SceneMount() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) return;

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const w = window as IdleWindow;

    /* The timeout is the guarantee: on a busy page idle may never arrive, and
       the scene must not be held back indefinitely. */
    if (w.requestIdleCallback) {
      const handle = w.requestIdleCallback(() => setReady(true), { timeout: 1800 });
      return () => w.cancelIdleCallback?.(handle);
    }

    const timer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timer);
  }, [reduced]);

  if (reduced || !ready) return <AtmosphereFallback />;
  return <SceneCanvas />;
}
