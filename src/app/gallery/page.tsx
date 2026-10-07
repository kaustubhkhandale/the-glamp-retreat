import { PageHeader, ExploreBand } from "@/components/page-elements";
import { GalleryBrowser } from "@/components/gallery-browser";
import { sanityFetch } from "@/lib/sanity/client";
import { GALLERY_QUERY } from "@/lib/sanity/queries";
import type { GALLERY_QUERY_RESULT } from "@/lib/sanity/types";
import { routeMetadata } from "@/lib/metadata";
export const metadata = routeMetadata("Gallery", "/gallery");
export default async function Gallery() {
  const items = await sanityFetch<GALLERY_QUERY_RESULT>(
    GALLERY_QUERY,
    "galleryItem",
  );
  return (
    <>
      <PageHeader
        eyebrow="A Visual Chronicle"
        title="The Retreat Gallery"
        crumb="Gallery"
        intro="Explore photographs and videos from around The Glamp Retreat. Select a category or open a photograph for a closer look."
      />
      <section className="home-section">
        <div className="container">
          <GalleryBrowser items={items || []} />
        </div>
      </section>
      <ExploreBand title="Find Your Kind of Visit" />
    </>
  );
}
