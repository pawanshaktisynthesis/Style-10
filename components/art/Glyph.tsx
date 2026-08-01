import type { Service } from "@/lib/data";

/**
 * Capability glyphs.
 *
 * Line-art built on a single 48-unit grid with one shared stroke weight, so
 * twelve different marks still read as one family. Each glyph animates on card
 * hover via `group-hover` — the motion is specific to what the capability does,
 * not a generic spin.
 */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Shared transition class for every animated part. */
const T = "transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]";

function Orbit() {
  return (
    <>
      <circle cx="24" cy="24" r="5" {...S} />
      <ellipse cx="24" cy="24" rx="18" ry="7.5" {...S} opacity="0.55" className={`${T} origin-center group-hover:rotate-[26deg]`} />
      <ellipse cx="24" cy="24" rx="18" ry="7.5" {...S} opacity="0.4" transform="rotate(60 24 24)" className={`${T} origin-center group-hover:rotate-[86deg]`} />
      <ellipse cx="24" cy="24" rx="18" ry="7.5" {...S} opacity="0.4" transform="rotate(120 24 24)" className={`${T} origin-center group-hover:rotate-[146deg]`} />
      <circle cx="42" cy="24" r="1.9" fill="currentColor" className={`${T} group-hover:translate-x-[-36px]`} />
    </>
  );
}

function Grid() {
  return (
    <>
      <rect x="6" y="6" width="15" height="15" rx="2.5" {...S} className={`${T} group-hover:translate-x-[1.5px] group-hover:translate-y-[1.5px]`} />
      <rect x="27" y="6" width="15" height="15" rx="2.5" {...S} opacity="0.5" className={`${T} group-hover:translate-x-[-1.5px] group-hover:translate-y-[1.5px]`} />
      <rect x="6" y="27" width="15" height="15" rx="2.5" {...S} opacity="0.5" className={`${T} group-hover:translate-x-[1.5px] group-hover:translate-y-[-1.5px]`} />
      <rect x="27" y="27" width="15" height="15" rx="2.5" {...S} className={`${T} group-hover:translate-x-[-1.5px] group-hover:translate-y-[-1.5px]`} />
    </>
  );
}

function Wave() {
  return (
    <>
      <path d="M4 30c5-9 10-9 15 0s10 9 15 0 10-9 10 0" {...S} className={`${T} group-hover:translate-y-[-5px]`} />
      <path d="M4 22c5-9 10-9 15 0s10 9 15 0 10-9 10 0" {...S} opacity="0.45" className={`${T} group-hover:translate-y-[5px]`} />
    </>
  );
}

function Stack() {
  return (
    <>
      <path d="M24 6 41 15 24 24 7 15z" {...S} className={`${T} group-hover:translate-y-[-3.5px]`} />
      <path d="M7 24l17 9 17-9" {...S} opacity="0.6" />
      <path d="M7 32l17 9 17-9" {...S} opacity="0.35" className={`${T} group-hover:translate-y-[3.5px]`} />
    </>
  );
}

function Cloud() {
  return (
    <>
      <path d="M14 32a7.5 7.5 0 0 1 .8-15A11 11 0 0 1 36 19.5a6.5 6.5 0 0 1-1.5 12.8z" {...S} />
      <path d="M18 38v4M24 38v6M30 38v4" {...S} opacity="0.5" className={`${T} group-hover:translate-y-[3px]`} />
    </>
  );
}

function Flow() {
  return (
    <>
      <circle cx="9" cy="12" r="4" {...S} />
      <circle cx="39" cy="24" r="4" {...S} />
      <circle cx="9" cy="36" r="4" {...S} />
      <path d="M13 13.5c14 1 12 9 22 10M13 34.5c14-1 12-9 22-10" {...S} opacity="0.5" strokeDasharray="42" className={`${T} group-hover:[stroke-dashoffset:-42]`} />
    </>
  );
}

function Frame() {
  return (
    <>
      <rect x="5" y="9" width="38" height="28" rx="3.5" {...S} />
      <path d="M5 17h38" {...S} opacity="0.6" />
      <circle cx="10.5" cy="13" r="1.1" fill="currentColor" />
      <path d="M12 24h13M12 30h20" {...S} opacity="0.45" strokeDasharray="24" className={`${T} group-hover:[stroke-dashoffset:24]`} />
    </>
  );
}

function Prism() {
  return (
    <>
      <path d="M24 7 41 38H7z" {...S} />
      <path d="M16 38 24 7l8 31" {...S} opacity="0.35" />
      <path d="M41 20h5M41 25h7M41 30h4" {...S} opacity="0.7" className={`${T} group-hover:translate-x-[3.5px]`} />
    </>
  );
}

function Shift() {
  return (
    <>
      <rect x="13" y="5" width="22" height="38" rx="4.5" {...S} />
      <path d="M20 10h8" {...S} opacity="0.6" />
      <rect x="18" y="17" width="12" height="9" rx="1.8" {...S} opacity="0.45" className={`${T} group-hover:translate-y-[9px]`} />
      <rect x="18" y="30" width="12" height="6" rx="1.8" {...S} opacity="0.45" className={`${T} group-hover:translate-y-[-13px]`} />
    </>
  );
}

function Chart() {
  return (
    <>
      <path d="M6 42V6M6 42h36" {...S} opacity="0.6" />
      <path d="M12 34v6M20 26v14M28 30v10M36 16v24" {...S} strokeWidth="2.5" className={`${T} origin-bottom group-hover:scale-y-125`} />
      <path d="M12 30l8-8 8 5 8-13" {...S} opacity="0.5" strokeDasharray="40" className={`${T} group-hover:[stroke-dashoffset:40]`} />
    </>
  );
}

function Node() {
  return (
    <>
      <circle cx="24" cy="24" r="4.5" {...S} />
      <circle cx="9" cy="10" r="3" {...S} opacity="0.7" className={`${T} group-hover:translate-x-[2.5px] group-hover:translate-y-[2.5px]`} />
      <circle cx="39" cy="10" r="3" {...S} opacity="0.7" className={`${T} group-hover:translate-x-[-2.5px] group-hover:translate-y-[2.5px]`} />
      <circle cx="9" cy="38" r="3" {...S} opacity="0.7" className={`${T} group-hover:translate-x-[2.5px] group-hover:translate-y-[-2.5px]`} />
      <circle cx="39" cy="38" r="3" {...S} opacity="0.7" className={`${T} group-hover:translate-x-[-2.5px] group-hover:translate-y-[-2.5px]`} />
      <path d="M11.5 12.5 21 21M36.5 12.5 27 21M11.5 35.5 21 27M36.5 35.5 27 27" {...S} opacity="0.4" />
    </>
  );
}

function Vault() {
  return (
    <>
      <rect x="6" y="8" width="36" height="32" rx="4" {...S} />
      <circle cx="24" cy="24" r="9" {...S} opacity="0.65" className={`${T} origin-center group-hover:rotate-[110deg]`} />
      <path d="M24 15v5M24 28v5M15 24h5M28 24h5" {...S} opacity="0.65" className={`${T} origin-center group-hover:rotate-[110deg]`} />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </>
  );
}

const GLYPHS: Record<Service["glyph"], () => React.ReactElement> = {
  orbit: Orbit,
  grid: Grid,
  wave: Wave,
  stack: Stack,
  cloud: Cloud,
  flow: Flow,
  frame: Frame,
  prism: Prism,
  shift: Shift,
  chart: Chart,
  node: Node,
  vault: Vault,
};

export function Glyph({ name, className }: { name: Service["glyph"]; className?: string }) {
  const Shape = GLYPHS[name];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <Shape />
    </svg>
  );
}
