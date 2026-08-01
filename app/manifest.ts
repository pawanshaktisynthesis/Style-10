import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.short,
    description: BRAND.description,
    start_url: "/",
    display: "standalone",
    background_color: "#05060b",
    theme_color: "#05060b",
    categories: ["business", "technology", "productivity"],
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
