import "server-only";
import { createClient } from "next-sanity";
export const configured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);
export const client = configured
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: "2026-10-01",
      perspective: "published",
      useCdn: false,
    })
  : null;
export async function sanityFetch<T>(
  query: string,
  tag: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  if (!client) return null;
  return client.fetch<T>(query, params, {
    next: { revalidate: 3600, tags: [`sanity:${tag}`] },
  });
}
