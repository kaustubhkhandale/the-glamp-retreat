import { AmenitiesView } from "@/components/pages/amenities-view";
import { sanityFetch } from "@/lib/sanity/client";
import { AMENITIES_QUERY } from "@/lib/sanity/queries";
import type { AMENITIES_QUERY_RESULT } from "@/lib/sanity/types";
import { routeMetadata } from "@/lib/metadata";
export const metadata = routeMetadata("Amenities", "/amenities");
export default async function Amenities() {
  const data = await sanityFetch<AMENITIES_QUERY_RESULT>(
    AMENITIES_QUERY,
    "amenity",
  );
  return <AmenitiesView amenities={data || []} />;
}
