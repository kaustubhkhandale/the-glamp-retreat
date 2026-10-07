import { defineCliConfig } from "sanity/cli";
export default defineCliConfig({
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
