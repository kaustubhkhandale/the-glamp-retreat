import { AboutView } from "@/components/pages/about-view";
import { sanityFetch } from "@/lib/sanity/client";
import { ABOUT_QUERY } from "@/lib/sanity/queries";
import type { ABOUT_QUERY_RESULT } from "@/lib/sanity/types";
import { routeMetadata } from "@/lib/metadata";
export const metadata = routeMetadata("About", "/about");
export default async function About() {
  const data = await sanityFetch<ABOUT_QUERY_RESULT>(ABOUT_QUERY, "aboutPage");
  return <AboutView data={data} />;
}
