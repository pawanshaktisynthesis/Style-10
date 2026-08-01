import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/**
 * The favicon, generated from the same three-currents mark as the site.
 * Drawn at 512 and scaled down by the browser, so it stays legible at 16px.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05060b",
        }}
      >
        <svg width="512" height="512" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="g" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#56e8cf" />
              <stop offset="1" stopColor="#7a5cff" />
            </linearGradient>
          </defs>
          <path d="M3 9c5.5 0 8.2 2.4 10.4 5.2C15.2 16.5 16 18 16 20" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" />
          <path d="M29 9c-5.5 0-8.2 2.4-10.4 5.2C16.8 16.5 16 18 16 20" stroke="url(#g)" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 3v17" stroke="#e9dcc3" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="24.5" r="3.4" stroke="url(#g)" strokeWidth="2" />
          <circle cx="16" cy="24.5" r="1.2" fill="#56e8cf" />
        </svg>
      </div>
    ),
    size,
  );
}
