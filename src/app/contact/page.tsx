import { ContactView } from "@/components/pages/contact-view";
import { sanityFetch } from "@/lib/sanity/client";
import { SETTINGS_QUERY } from "@/lib/sanity/queries";
import type { SETTINGS_QUERY_RESULT } from "@/lib/sanity/types";
import { routeMetadata } from "@/lib/metadata";
export const metadata = routeMetadata("Contact", "/contact");
export default async function Contact() {
  const settings = await sanityFetch<SETTINGS_QUERY_RESULT>(
    SETTINGS_QUERY,
    "siteSettings",
  );
  return <ContactView settings={settings} />;
}
