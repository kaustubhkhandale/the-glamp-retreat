import { Homepage } from "@/components/homepage";
import { sanityFetch } from "@/lib/sanity/client";
import {
  HOME_QUERY,
  SETTINGS_QUERY,
  PACKAGES_QUERY,
  AMENITIES_QUERY,
  ABOUT_QUERY,
  TESTIMONIALS_QUERY,
} from "@/lib/sanity/queries";
import type {
  HOME_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
  PACKAGES_QUERY_RESULT,
  AMENITIES_QUERY_RESULT,
  ABOUT_QUERY_RESULT,
  TESTIMONIALS_QUERY_RESULT,
} from "@/lib/sanity/types";
import type { Metadata } from "next";
export const metadata: Metadata = process.env.SITE_URL
  ? { alternates: { canonical: new URL("/", process.env.SITE_URL).toString() } }
  : {};
export default async function Home() {
  const [home, settings, packages, amenities, about, reviews] =
    await Promise.all([
      sanityFetch<HOME_QUERY_RESULT>(HOME_QUERY, "homePage"),
      sanityFetch<SETTINGS_QUERY_RESULT>(SETTINGS_QUERY, "siteSettings"),
      sanityFetch<PACKAGES_QUERY_RESULT>(PACKAGES_QUERY, "package"),
      sanityFetch<AMENITIES_QUERY_RESULT>(AMENITIES_QUERY, "amenity"),
      sanityFetch<ABOUT_QUERY_RESULT>(ABOUT_QUERY, "aboutPage"),
      sanityFetch<TESTIMONIALS_QUERY_RESULT>(TESTIMONIALS_QUERY, "testimonial"),
    ]);
  return (
    <Homepage
      home={home}
      settings={settings}
      packages={packages || []}
      amenities={amenities || []}
      about={about}
      reviews={reviews || []}
    />
  );
}
