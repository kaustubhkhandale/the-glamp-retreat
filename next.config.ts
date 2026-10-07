import type { NextConfig } from "next";
const project = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const nextConfig: NextConfig = {
  turbopack: {
    // Only the Tailwind entry needs compilation; ordinary CSS stays native.
    rules: { "globals.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
  images: {
    remotePatterns:
      project && dataset
        ? [
            {
              protocol: "https",
              hostname: "cdn.sanity.io",
              pathname: `/images/${project}/${dataset}/**`,
            },
          ]
        : [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
