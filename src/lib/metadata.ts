import type { Metadata } from "next";
export function routeMetadata(title: string, path: string): Metadata {
  return {
    title,
    ...(process.env.SITE_URL
      ? {
          alternates: {
            canonical: new URL(path, process.env.SITE_URL).toString(),
          },
        }
      : {}),
  };
}
