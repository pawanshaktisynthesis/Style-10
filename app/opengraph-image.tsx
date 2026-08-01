import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${BRAND.name} — Force, given form`;

/**
 * The social card, composed from the same elements as the hero: the mark, the
 * headline, and a suggestion of the wind field. Generated at build/request time
 * so it never drifts out of sync with the brand.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#05060b",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Aurora wash */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -160,
            width: 900,
            height: 900,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(86,232,207,0.20), rgba(122,92,255,0.12) 45%, transparent 68%)",
            display: "flex",
          }}
        />

        {/* Concentric field rings */}
        {[300, 420, 540].map((r) => (
          <div
            key={r}
            style={{
              position: "absolute",
              top: 315 - r / 2,
              right: 120 - r / 2,
              width: r,
              height: r,
              borderRadius: 9999,
              border: "1px solid rgba(86,232,207,0.18)",
              display: "flex",
            }}
          />
        ))}

        {/* Mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="46" height="46" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="og" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#56e8cf" />
                <stop offset="1" stopColor="#7a5cff" />
              </linearGradient>
            </defs>
            <path d="M3 9c5.5 0 8.2 2.4 10.4 5.2C15.2 16.5 16 18 16 20" stroke="url(#og)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M29 9c-5.5 0-8.2 2.4-10.4 5.2C16.8 16.5 16 18 16 20" stroke="url(#og)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M16 3v17" stroke="#e9dcc3" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="16" cy="24.5" r="3.4" stroke="url(#og)" strokeWidth="1.8" />
          </svg>
          <span style={{ color: "#e9dcc3", fontSize: 25, letterSpacing: -0.4 }}>PawanShakti Synthesis</span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#56e8cf",
              fontSize: 15,
              letterSpacing: 5.5,
              textTransform: "uppercase",
              marginBottom: 26,
            }}
          >
            pawan · wind — shakti · power
          </span>
          <span style={{ color: "#e9dcc3", fontSize: 116, lineHeight: 1, letterSpacing: -4.5 }}>
            Force, given form.
          </span>
          <span style={{ color: "#8a8798", fontSize: 25, marginTop: 30, maxWidth: 900, lineHeight: 1.45 }}>
            AI systems, enterprise software, and digital products for companies that treat
            engineering and design as the same discipline.
          </span>
        </div>

        {/* Baseline */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 210, height: 2, background: "linear-gradient(90deg,#56e8cf,#7a5cff,#f2a65a)", display: "flex" }} />
          <span style={{ color: "#565468", fontSize: 17, letterSpacing: 1 }}>
            Bengaluru · Singapore · since 2017
          </span>
        </div>
      </div>
    ),
    size,
  );
}
