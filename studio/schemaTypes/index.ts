import { defineType, defineField, type FieldDefinition } from "sanity";
const string = (name: string, required = false): FieldDefinition =>
  defineField({
    name,
    type: "string",
    validation: (r) => (required ? r.required() : r),
  });
const text = (name: string): FieldDefinition =>
  defineField({ name, type: "text", rows: 3 });
const list = (name: string, values: string[]): FieldDefinition =>
  defineField({
    name,
    type: "string",
    options: { list: values },
    validation: (r) => r.required(),
  });
const strings = (name: string): FieldDefinition =>
  defineField({ name, type: "array", of: [{ type: "string" }] });
const number = (name: string, required = false): FieldDefinition =>
  defineField({
    name,
    type: "number",
    validation: (r) => (required ? r.required().min(0) : r.min(0)),
  });
const image = (name: string): FieldDefinition =>
  defineField({ name, type: "accessibleImage" });
const images = (name: string): FieldDefinition =>
  defineField({ name, type: "array", of: [{ type: "accessibleImage" }] });
const url = (name: string): FieldDefinition =>
  defineField({
    name,
    type: "url",
    validation: (r) => r.uri({ scheme: ["https", "http"] }),
  });
const phone = (name: string, required = false): FieldDefinition =>
  defineField({
    name,
    type: "string",
    description:
      "International format, e.g. + followed by country code and number.",
    validation: (r) =>
      required
        ? r
            .required()
            .regex(/^\+[1-9]\d{7,14}$/, { name: "international phone" })
        : r.regex(/^\+[1-9]\d{7,14}$/, { name: "international phone" }),
  });
const slug: FieldDefinition = defineField({
  name: "slug",
  type: "slug",
  options: { source: (doc) => String(doc.name || doc.title || "") },
  validation: (r) => r.required(),
});
const order = number("displayOrder");
const active: FieldDefinition = defineField({
  name: "active",
  type: "boolean",
  initialValue: false,
});
const seo: FieldDefinition = defineField({ name: "seo", type: "seo" });
const refs = (name: string, type: string): FieldDefinition =>
  defineField({
    name,
    type: "array",
    of: [{ type: "reference", to: [{ type }] }],
  });
const contacts = (name: string): FieldDefinition =>
  defineField({
    name,
    type: "array",
    description:
      "Approved public booking contacts only. Never add private customer information.",
    of: [
      {
        type: "object",
        name: "contact",
        fields: [string("name", true), phone("phone", true)],
      },
    ],
  });
const doc = (name: string, title: string, fields: FieldDefinition[]) =>
  defineType({
    name,
    title,
    type: "document",
    fields,
    preview: {
      select: {
        title:
          name === "siteSettings"
            ? "siteName"
            : name === "homePage"
              ? "heading"
              : name === "testimonial"
                ? "guestName"
                : name === "galleryItem"
                  ? "caption"
                  : name === "aboutPage"
                    ? "story"
                    : name === "policyPage"
                      ? "title"
                      : "name",
        media:
          name === "package"
            ? "cover"
            : name === "galleryItem"
              ? "photo"
              : "image",
      },
      prepare: ({ title: label, media }) => ({ title: label || title, media }),
    },
  });
export const schemaTypes = [
  defineType({
    name: "accessibleImage",
    title: "Image",
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alternative text",
        validation: (r) => r.required().min(3),
      }),
      string("caption"),
    ],
  }),
  defineType({
    name: "seo",
    title: "SEO",
    type: "object",
    fields: [
      string("title"),
      defineField({
        name: "description",
        type: "text",
        validation: (r) => r.max(160),
      }),
      image("image"),
    ],
  }),
  doc("siteSettings", "Site settings", [
    string("siteName", true),
    image("logo"),
    text("shortDescription"),
    defineField({
      name: "address",
      type: "text",
      description: "Publish only the verified property address.",
    }),
    url("directionsUrl"),
    contacts("officeContacts"),
    contacts("corporateContacts"),
    phone("whatsapp"),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [string("label", true), url("url")],
        },
      ],
    }),
    seo,
  ]),
  doc("homePage", "Home page", [
    defineField({
      name: "heroMediaType",
      title: "Hero background",
      type: "string",
      initialValue: "image",
      options: { layout: "radio", list: [{ title: "Image", value: "image" }, { title: "Video", value: "video" }] },
    }),
    defineField({
      name: "hero",
      title: "Hero image / video fallback",
      type: "accessibleImage",
      description: "Displayed in image mode, while video loads, and when motion is reduced or playback fails.",
      validation: (rule) => rule.custom((value, context) =>
        context.document?.heroMediaType === "video" && !(value && typeof value === "object" && "asset" in value && value.asset)
          ? "Add a fallback image for the video background."
          : true),
    }),
    defineField({
      name: "heroVideo",
      title: "Hero background video",
      type: "file",
      options: { accept: "video/mp4" },
      description: "Upload a short, compressed MP4 of the property. It loops silently; audio is never played. Keep the fallback image when switching modes.",
      hidden: ({ document }) => document?.heroMediaType !== "video",
      validation: (rule) => rule.custom((value, context) =>
        context.document?.heroMediaType === "video" && !value?.asset
          ? "Upload an MP4 before publishing video mode."
          : true),
    }),
    string("heading", true),
    string("supportingLine"),
    refs("featuredPackages", "package"),
    refs("featuredGallery", "galleryItem"),
    text("introduction"),
    strings("highlights"),
    strings("occasions"),
    number("dayCapacity"),
    number("overnightCapacity"),
  ]),
  doc("package", "Packages", [
    string("name", true),
    slug,
    list("category", ["Day Picnic", "Evening Leisure", "Overnight"]),
    defineField({
      name: "accommodation",
      type: "string",
      options: { list: ["Glamp", "Hut", "Tent"] },
      hidden: ({ document }) => document?.category !== "Overnight",
    }),
    text("summary"),
    image("cover"),
    images("gallery"),
    number("price", true),
    defineField({
      name: "currency",
      type: "string",
      validation: (r) =>
        r.required().regex(/^[A-Z]{3}$/, { name: "ISO currency code" }),
    }),
    list("pricingUnit", ["per person", "per group", "per stay"]),
    number("vegetarianPrice"),
    number("nonVegetarianPrice"),
    ...["arrival", "departure"].map((name) =>
      defineField({
        name,
        type: "string",
        description: "24-hour HH:mm",
        validation: (r) =>
          r.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "HH:mm" }),
      }),
    ),
    defineField({
      name: "departureDayOffset",
      type: "number",
      hidden: ({ document }) => document?.category !== "Overnight",
      validation: (r) => r.integer().min(0),
    }),
    strings("inclusions"),
    strings("exclusions"),
    strings("rules"),
    order,
    active,
    seo,
  ]),
  doc("amenity", "Amenities", [
    string("name", true),
    string("category", true),
    text("description"),
    image("image"),
    defineField({
      name: "icon",
      type: "string",
      options: {
        list: [
          "leaf",
          "water",
          "bed",
          "dining",
          "music",
          "parking",
          "accessibility",
          "pet",
        ],
      },
    }),
    order,
    active,
  ]),
  doc("galleryItem", "Gallery", [
    list("kind", ["photo", "video"]),
    defineField({
      name: "photo",
      type: "accessibleImage",
      hidden: ({ document }) => document?.kind !== "photo",
      validation: (r) =>
        r.custom((value, context) =>
          context.document?.kind === "photo" && !value
            ? "Photo is required"
            : true,
        ),
    }),
    defineField({
      name: "videoUrl",
      type: "url",
      hidden: ({ document }) => document?.kind !== "video",
      validation: (r) => r.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "videoFile",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ document }) => document?.kind !== "video",
      validation: (r) =>
        r.custom((value, context) =>
          context.document?.kind === "video" &&
          !value &&
          !context.document.videoUrl
            ? "Add a video URL or file"
            : true,
        ),
    }),
    defineField({
      name: "poster",
      type: "accessibleImage",
      hidden: ({ document }) => document?.kind !== "video",
    }),
    string("caption"),
    list("category", [
      "Entrance",
      "Lawns",
      "Swimming Pool",
      "Glamps",
      "Huts",
      "Tents",
      "Dining",
      "Music and Karaoke",
      "Restrooms",
      "Other",
    ]),
    order,
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ]),
  doc("testimonial", "Approved guest reviews", [
    string("guestName", true),
    defineField({
      name: "review",
      type: "text",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rating",
      type: "number",
      validation: (r) => r.integer().min(1).max(5),
    }),
    url("sourceUrl"),
    defineField({
      name: "approved",
      type: "boolean",
      initialValue: false,
      description: "Approve only genuine reviews with permission to publish.",
    }),
  ]),
  doc("aboutPage", "About page", [
    text("story"),
    images("images"),
    text("petInformation"),
    strings("petRules"),
    strings("occasions"),
  ]),
  doc("policyPage", "Policies", [
    string("title", true),
    slug,
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "lastUpdated",
      type: "date",
      validation: (r) => r.required(),
    }),
  ]),
];
