import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.SITE_URL?.replace(/\/$/, "");
  return origin
    ? [
        "",
        "about",
        "packages",
        "amenities",
        "gallery",
        "contact",
        "privacy",
        "booking-terms",
      ].map((path) => ({ url: origin + "/" + path }))
    : [];
}
