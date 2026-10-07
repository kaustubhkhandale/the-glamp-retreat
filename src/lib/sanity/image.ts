import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
export function imageUrl(source: SanityImageSource, width = 1200) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;
  return createImageUrlBuilder({ projectId, dataset })
    .image(source)
    .width(width)
    .auto("format")
    .fit("max")
    .url();
}
