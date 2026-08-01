import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/data";

/* -------------------------------------------------------------------------- */
/* Type                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Four faces, each with a job:
 *   Sora            — display, run at extreme weight contrast within a line
 *   Inter           — body, invisible by design
 *   Instrument Serif — one italic word colliding into the grotesk headlines
 *   JetBrains Mono  — eyebrows, indices, metrics; technical precision as texture
 *
 * All self-hosted through next/font, so there is no render-blocking request to
 * a third-party font host and no layout shift when they land.
 */

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  /* Only the weights the type scale actually sets. Shipping 500 and 600 as
     well cost real bytes for glyphs nothing on the page ever renders. */
  weight: ["200", "300", "400"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: "italic",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

/* -------------------------------------------------------------------------- */
/* Metadata                                                                    */
/* -------------------------------------------------------------------------- */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pawanshakti-synthesis.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — Premium technology, design, and business systems`,
    template: `%s — ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name, url: SITE_URL }],
  creator: BRAND.name,
  publisher: BRAND.name,
  keywords: [
    "AI solutions",
    "software development",
    "web development",
    "mobile apps",
    "cloud platform engineering",
    "UI UX design",
    "digital transformation",
    "data analytics",
    "machine learning",
    "enterprise systems",
    "technology consultancy",
    "PawanShakti Synthesis",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND.name,
    title: `${BRAND.name} — Force, given form`,
    description: BRAND.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Force, given form`,
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "technology",
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#05060b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  /* Never block zoom — pinch-zoom is an accessibility control, not a bug. */
  maximumScale: 5,
};

/* -------------------------------------------------------------------------- */
/* Structured data                                                             */
/* -------------------------------------------------------------------------- */

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND.name,
      url: SITE_URL,
      email: BRAND.email,
      telephone: BRAND.phone,
      description: BRAND.description,
      foundingDate: String(BRAND.founded),
      slogan: BRAND.tagline,
      areaServed: "Worldwide",
      address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "Software Engineering",
        "Cloud Infrastructure",
        "User Experience Design",
        "Digital Transformation",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Capabilities",
        itemListElement: [
          "AI Solutions",
          "Machine Learning",
          "Software Development",
          "Web Development",
          "Mobile Apps",
          "Cloud & Platform",
          "Automation",
          "UI/UX Design",
          "Brand Design",
          "Digital Transformation",
          "Data Analytics",
          "Custom Enterprise Systems",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND.name,
      description: BRAND.description,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
};

/* -------------------------------------------------------------------------- */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${instrument.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          // Static, authored object — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </body>
    </html>
  );
}
