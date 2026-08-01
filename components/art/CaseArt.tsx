import type { CaseStudy } from "@/lib/data";

/**
 * Case-study artwork.
 *
 * These are generated compositions rather than stock photography or mockup
 * templates: each is drawn from the same grid, stroke weight, and palette as
 * the rest of the site, so the work section looks like it belongs to the brand
 * instead of like a gallery of borrowed screenshots. They are also vector, so
 * they stay sharp on an ultrawide display and cost a few kB instead of 400.
 *
 * All randomness is seeded, so the server and client render identical markup.
 */

/** Deterministic PRNG — mulberry32. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ACCENTS = {
  prana: { a: "#56e8cf", b: "#7a5cff" },
  shakti: { a: "#7a5cff", b: "#56e8cf" },
  ember: { a: "#f2a65a", b: "#7a5cff" },
} as const;

type ArtProps = { accent: CaseStudy["accent"]; id: string };

const W = 800;
const H = 500;

/* -------------------------------------------------------------------------- */

function Terrain({ accent, id }: ArtProps) {
  const c = ACCENTS[accent];
  const r = rng(9137);
  const rows = 18;
  const cols = 26;

  /* An isometric height field — reads as routing topology. */
  const lines: string[] = [];
  for (let j = 0; j < rows; j++) {
    let d = "";
    for (let i = 0; i <= cols; i++) {
      const x = 60 + (i / cols) * 680;
      const wave =
        Math.sin(i * 0.42 + j * 0.3) * 22 +
        Math.sin(i * 0.17 - j * 0.5) * 14 +
        (r() - 0.5) * 5;
      const y = 130 + j * 17 - wave * (1 - j / rows) * 1.2;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    lines.push(d);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.a} />
          <stop offset="1" stopColor={c.b} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.42" r="0.6">
          <stop offset="0" stopColor={c.a} stopOpacity="0.28" />
          <stop offset="1" stopColor={c.a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#080a12" />
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      {lines.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={`url(#${id}-g)`}
          strokeWidth={i % 4 === 0 ? 1.1 : 0.6}
          opacity={0.16 + (1 - i / rows) * 0.5}
        />
      ))}
      {/* Route markers riding the field. */}
      {[0.22, 0.46, 0.71].map((t, i) => (
        <g key={i}>
          <circle cx={60 + t * 680} cy={175 + i * 42} r="4.5" fill={c.a} opacity="0.9" />
          <circle cx={60 + t * 680} cy={175 + i * 42} r="11" fill="none" stroke={c.a} strokeWidth="0.8" opacity="0.35" />
        </g>
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

function Network({ accent, id }: ArtProps) {
  const c = ACCENTS[accent];
  const r = rng(4471);
  const nodes = Array.from({ length: 46 }, () => ({
    x: 70 + r() * 660,
    y: 60 + r() * 380,
    s: 1.4 + r() * 3.6,
  }));

  const edges: [number, number][] = [];
  nodes.forEach((n, i) => {
    const near = nodes
      .map((m, j) => ({ j, d: Math.hypot(m.x - n.x, m.y - n.y) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach(({ j }) => edges.push([i, j]));
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.a} />
          <stop offset="1" stopColor={c.b} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.42" cy="0.5" r="0.62">
          <stop offset="0" stopColor={c.b} stopOpacity="0.3" />
          <stop offset="1" stopColor={c.b} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#080a12" />
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      {edges.map(([i, j], k) => (
        <line
          key={k}
          x1={nodes[i].x}
          y1={nodes[i].y}
          x2={nodes[j].x}
          y2={nodes[j].y}
          stroke={`url(#${id}-g)`}
          strokeWidth="0.6"
          opacity="0.32"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.s} fill={i % 7 === 0 ? c.a : "#e9dcc3"} opacity={i % 7 === 0 ? 0.95 : 0.42} />
      ))}
      {/* A cited document surfacing out of the graph. */}
      <g transform="translate(520 250)">
        <rect width="200" height="128" rx="8" fill="#0d1020" stroke={c.a} strokeOpacity="0.4" />
        <rect x="16" y="20" width="120" height="5" rx="2.5" fill="#e9dcc3" opacity="0.55" />
        <rect x="16" y="36" width="168" height="4" rx="2" fill="#e9dcc3" opacity="0.2" />
        <rect x="16" y="48" width="150" height="4" rx="2" fill="#e9dcc3" opacity="0.2" />
        <rect x="16" y="60" width="164" height="4" rx="2" fill="#e9dcc3" opacity="0.2" />
        <rect x="16" y="80" width="88" height="18" rx="9" fill={c.a} opacity="0.18" />
        <circle cx="27" cy="89" r="3.5" fill={c.a} />
        <rect x="38" y="86" width="54" height="5" rx="2.5" fill={c.a} opacity="0.7" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

function Dashboard({ accent, id }: ArtProps) {
  const c = ACCENTS[accent];
  const r = rng(2213);
  const bars = Array.from({ length: 34 }, () => 0.15 + r() * 0.85);
  const series = Array.from({ length: 44 }, (_, i) => {
    const base = Math.sin(i * 0.28) * 22 + Math.sin(i * 0.11) * 14;
    return 132 - base - r() * 12;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c.a} />
          <stop offset="1" stopColor={c.b} />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.a} stopOpacity="0.34" />
          <stop offset="1" stopColor={c.a} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#080a12" />

      {/* Chart panel */}
      <g transform="translate(44 44)">
        <rect width="470" height="240" rx="12" fill="#0c0f1c" stroke="#e9dcc3" strokeOpacity="0.07" />
        <rect x="22" y="22" width="96" height="6" rx="3" fill="#e9dcc3" opacity="0.4" />
        <rect x="22" y="38" width="52" height="12" rx="4" fill={c.a} opacity="0.2" />
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="22" y1={80 + i * 40} x2="448" y2={80 + i * 40} stroke="#e9dcc3" strokeOpacity="0.05" />
        ))}
        <path
          d={`M22 ${series[0] + 68} ${series.map((v, i) => `L${22 + (i / (series.length - 1)) * 426} ${v + 68}`).join(" ")} L448 220 L22 220 Z`}
          fill={`url(#${id}-fill)`}
        />
        <path
          d={`M22 ${series[0] + 68} ${series.map((v, i) => `L${22 + (i / (series.length - 1)) * 426} ${v + 68}`).join(" ")}`}
          fill="none"
          stroke={`url(#${id}-g)`}
          strokeWidth="1.8"
        />
      </g>

      {/* Order book */}
      <g transform="translate(534 44)">
        <rect width="222" height="240" rx="12" fill="#0c0f1c" stroke="#e9dcc3" strokeOpacity="0.07" />
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i} transform={`translate(18 ${26 + i * 19})`}>
            <rect width={40 + r() * 90} height="10" rx="3" fill={i < 5 ? c.a : "#f2a65a"} opacity={0.13 + (1 - i / 11) * 0.2} />
            <rect x="150" width="34" height="4" rx="2" y="3" fill="#e9dcc3" opacity="0.28" />
          </g>
        ))}
      </g>

      {/* Volume */}
      <g transform="translate(44 306)">
        <rect width="712" height="150" rx="12" fill="#0c0f1c" stroke="#e9dcc3" strokeOpacity="0.07" />
        {bars.map((v, i) => (
          <rect
            key={i}
            x={22 + i * 19.6}
            y={124 - v * 92}
            width="11"
            height={v * 92}
            rx="3"
            fill={`url(#${id}-g)`}
            opacity={0.3 + v * 0.55}
          />
        ))}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

function Mobile({ accent, id }: ArtProps) {
  const c = ACCENTS[accent];

  const Phone = ({ x, y, scale, dim }: { x: number; y: number; scale: number; dim: number }) => (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={dim}>
      <rect width="176" height="340" rx="26" fill="#0c0f1c" stroke="#e9dcc3" strokeOpacity="0.12" strokeWidth="1.4" />
      <rect x="66" y="12" width="44" height="6" rx="3" fill="#e9dcc3" opacity="0.18" />
      <rect x="16" y="34" width="144" height="86" rx="12" fill={c.a} opacity="0.14" />
      <circle cx="52" cy="70" r="17" fill={c.a} opacity="0.4" />
      <rect x="80" y="60" width="62" height="6" rx="3" fill="#e9dcc3" opacity="0.5" />
      <rect x="80" y="74" width="42" height="5" rx="2.5" fill="#e9dcc3" opacity="0.22" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(16 ${134 + i * 52})`}>
          <rect width="144" height="42" rx="10" fill="#11141f" />
          <circle cx="24" cy="21" r="10" fill={c.b} opacity="0.35" />
          <rect x="44" y="13" width="70" height="5" rx="2.5" fill="#e9dcc3" opacity="0.4" />
          <rect x="44" y="25" width="46" height="4" rx="2" fill="#e9dcc3" opacity="0.16" />
        </g>
      ))}
      <rect x="16" y="296" width="144" height="30" rx="15" fill={c.a} opacity="0.85" />
    </g>
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden focusable="false">
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor={c.a} stopOpacity="0.24" />
          <stop offset="1" stopColor={c.a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#080a12" />
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      <Phone x={150} y={112} scale={0.78} dim={0.32} />
      <Phone x={492} y={112} scale={0.78} dim={0.32} />
      <Phone x={312} y={72} scale={1} dim={1} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

function Flow({ accent, id }: ArtProps) {
  const c = ACCENTS[accent];
  const r = rng(7781);
  /* Telemetry streams converging from many sources into one operations view. */
  const streams = Array.from({ length: 30 }, (_, i) => {
    const y0 = 40 + i * 14 + r() * 6;
    return `M40 ${y0.toFixed(1)} C240 ${y0.toFixed(1)}, 380 ${(250 + (y0 - 250) * 0.25).toFixed(1)}, 620 250`;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c.a} stopOpacity="0.06" />
          <stop offset="0.55" stopColor={c.a} stopOpacity="0.5" />
          <stop offset="1" stopColor={c.b} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#080a12" />
      {streams.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={`url(#${id}-g)`} strokeWidth={i % 5 === 0 ? 1.3 : 0.7} opacity="0.6" />
      ))}
      {/* Source sensors */}
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx="40" cy={40 + i * 14 + rng(7781 + i)() * 6} r="2" fill={c.a} opacity="0.5" />
      ))}
      {/* The single operations view */}
      <circle cx="620" cy="250" r="46" fill="#0c0f1c" stroke={c.b} strokeOpacity="0.5" />
      <circle cx="620" cy="250" r="66" fill="none" stroke={c.b} strokeOpacity="0.18" />
      <circle cx="620" cy="250" r="88" fill="none" stroke={c.b} strokeOpacity="0.08" />
      <path d="M598 250h12l6-14 8 28 6-14h12" fill="none" stroke={c.a} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

function GridArt({ accent, id }: ArtProps) {
  const c = ACCENTS[accent];
  const r = rng(3319);
  /* Nine systems collapsing into one — the consolidation story, drawn. */
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.a} />
          <stop offset="1" stopColor={c.b} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#080a12" />
      {Array.from({ length: 9 }, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 52 + col * 96;
        const y = 96 + row * 104;
        return (
          <g key={i} opacity={0.34 + r() * 0.2}>
            <rect x={x} y={y} width="76" height="80" rx="9" fill="#0c0f1c" stroke="#e9dcc3" strokeOpacity="0.1" />
            <rect x={x + 14} y={y + 16} width="34" height="5" rx="2.5" fill="#e9dcc3" opacity="0.35" />
            <rect x={x + 14} y={y + 30} width="48" height="4" rx="2" fill="#e9dcc3" opacity="0.15" />
            <rect x={x + 14} y={y + 42} width="40" height="4" rx="2" fill="#e9dcc3" opacity="0.15" />
            <path d={`M${x + 80} ${y + 40}C${x + 150} ${y + 40}, 400 250, 470 250`} stroke={`url(#${id}-g)`} strokeWidth="0.7" fill="none" opacity="0.45" />
          </g>
        );
      })}
      {/* The one platform */}
      <g transform="translate(478 132)">
        <rect width="270" height="236" rx="14" fill="#0d1020" stroke={c.a} strokeOpacity="0.34" />
        <rect x="22" y="26" width="110" height="7" rx="3.5" fill="#e9dcc3" opacity="0.55" />
        <rect x="22" y="46" width="66" height="16" rx="8" fill={c.a} opacity="0.2" />
        <rect x="96" y="46" width="52" height="16" rx="8" fill="#e9dcc3" opacity="0.07" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(22 ${84 + i * 36})`}>
            <rect width="226" height="27" rx="7" fill="#11141f" />
            <circle cx="18" cy="13.5" r="6" fill={i === 0 ? c.a : "#e9dcc3"} opacity={i === 0 ? 0.8 : 0.2} />
            <rect x="34" y="10" width={110 - i * 14} height="5" rx="2.5" fill="#e9dcc3" opacity="0.3" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

const ART: Record<CaseStudy["art"], (p: ArtProps) => React.ReactElement> = {
  terrain: Terrain,
  network: Network,
  dashboard: Dashboard,
  mobile: Mobile,
  flow: Flow,
  grid: GridArt,
};

export function CaseArt({ study }: { study: CaseStudy }) {
  const Art = ART[study.art];
  return <Art accent={study.accent} id={`art-${study.id}`} />;
}
