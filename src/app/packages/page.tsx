import { PackagesView } from "@/components/pages/packages-view";
import { sanityFetch } from "@/lib/sanity/client";
import { PACKAGES_QUERY } from "@/lib/sanity/queries";
import type { PACKAGES_QUERY_RESULT } from "@/lib/sanity/types";
import { routeMetadata } from "@/lib/metadata";
export const metadata = routeMetadata("Packages", "/packages");
export default async function Packages() {
  const data = await sanityFetch<PACKAGES_QUERY_RESULT>(
    PACKAGES_QUERY,
    "package",
  );
  return <PackagesView packages={data || []} />;
}
