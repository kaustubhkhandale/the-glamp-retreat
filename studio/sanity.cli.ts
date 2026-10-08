import { defineCliConfig } from "sanity/cli";
export default defineCliConfig({
  studioHost: "glamp-retreat",
  deployment: {
    appId: "hlbg5an4i6oz5bebqwhlnlub",
  },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j70izg2a",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  typegen: {
    path: "../src/lib/sanity/queries.ts",
    schema: "./schema.json",
    generates: "../src/lib/sanity/types.ts",
  },
});
