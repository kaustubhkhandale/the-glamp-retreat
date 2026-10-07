import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
const singletons = new Set(["siteSettings", "homePage", "aboutPage"]);
export default defineConfig({
  name: "glamp-retreat",
  title: "The Glamp Retreat",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "j70izg2a",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            ...["siteSettings", "homePage", "aboutPage"].map((type) =>
              S.listItem()
                .id(type)
                .title(
                  {
                    siteSettings: "Site settings",
                    homePage: "Home page",
                    aboutPage: "About page",
                  }[type]!,
                )
                .child(S.document().schemaType(type).documentId(type)),
            ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletons.has(item.getId()!),
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((t) => !singletons.has(t.schemaType)),
  },
  document: {
    newDocumentOptions: (options) =>
      options.filter((o) => !singletons.has(o.templateId)),
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter(
            (a) =>
              !["duplicate", "delete", "unpublish"].includes(a.action || ""),
          )
        : actions,
  },
});
