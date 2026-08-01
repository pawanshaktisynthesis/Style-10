/**
 * A mutable scroll store shared between Lenis, the WebGL scene, and the cursor.
 *
 * This is deliberately *not* React state. Scroll updates at 120Hz; routing that
 * through re-renders would make the whole page janky. Lenis writes here, the
 * render loop reads here, and only genuinely discrete changes (which section is
 * active) are published to React via a subscription.
 */

export type ScrollState = {
  /** Absolute scroll offset in pixels. */
  y: number;
  /** 0..1 across the whole document. */
  progress: number;
  /** Signed pixels-per-frame, smoothed. Drives motion blur and particle drag. */
  velocity: number;
  /** Normalised pointer, -1..1 on both axes, origin at viewport centre. */
  pointerX: number;
  pointerY: number;
  /** 0..1 how far the preloader has handed off to the page. */
  intro: number;
};

export const scrollState: ScrollState = {
  y: 0,
  progress: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
  intro: 0,
};

/* -------------------------------------------------------------------------- */
/* Active-section channel — the only thing scroll publishes to React.          */
/* -------------------------------------------------------------------------- */

type Listener = (id: string) => void;

const listeners = new Set<Listener>();
let activeSection = "hero";

export function setActiveSection(id: string) {
  if (id === activeSection) return;
  activeSection = id;
  listeners.forEach((fn) => fn(id));
}

export function getActiveSection() {
  return activeSection;
}

export function subscribeActiveSection(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/* -------------------------------------------------------------------------- */
/* Math                                                                        */
/* -------------------------------------------------------------------------- */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Frame-rate independent damping. Standard `lerp(a, b, 0.1)` moves twice as far
 * per second at 120Hz as it does at 60Hz; this does not.
 */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/** Remap `v` from [inMin, inMax] to [outMin, outMax], clamped at both ends. */
export function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((v - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
}

export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
