// Render isolated test fixtures in memory. Never writes or publishes CMS content.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const require = createRequire(import.meta.url);
const Module = require("node:module");
const root = fileURLToPath(new URL("../", import.meta.url));
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return originalResolve.call(
    this,
    request.startsWith("@/")
      ? path.join(root, "src", request.slice(2))
      : request,
    ...args,
  );
};
for (const extension of [".ts", ".tsx"]) {
  Module._extensions[extension] = (module, filename) => {
    const source = readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    });
    module._compile(outputText, filename);
  };
}
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "j70izg2a";
process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
const { Homepage } = require(path.join(root, "src/components/homepage.tsx"));
const empty = {
  home: null,
  settings: null,
  packages: [],
  amenities: [],
  about: null,
  reviews: [],
};
const render = (props) =>
  renderToStaticMarkup(React.createElement(Homepage, props));
const emptyHtml = render(empty);
for (const heading of [
  "Choose Your Visit",
  "Glamp, Hut, or Tent",
  "Experience The Retreat",
  "Celebrate Memorable Occasions",
  "Sanctuary Moments",
  "Essential Retreat Information",
  "Words From Our Guests",
  "Location &amp; Telephone Booking",
]) {
  assert.ok(emptyHtml.includes(heading), heading);
}
assert.ok(
  !emptyHtml.includes("tel:"),
  "Missing approved phones must not render telephone links",
);
assert.ok(
  !emptyHtml.includes("wa.me"),
  "WhatsApp must remain absent when unconfigured",
);
for (const fake of [
  "9876543210",
  "Highland Valley",
  "Vikram",
  "up to 60",
  "up to 30",
  "lh3.googleusercontent.com",
]) {
  assert.ok(
    !emptyHtml.includes(fake),
    "Stitch sample claims must be absent: " + fake,
  );
}
const fixture = {
  ...empty,
  home: {
    heading: "TEST FIXTURE HEADING",
    supportingLine: "Test supporting line",
    introduction: "Test introduction",
    highlights: ["Test highlight"],
    occasions: ["Test occasion"],
    dayCapacity: 24,
    overnightCapacity: 8,
    featuredPackages: [],
    featuredGallery: [
      {
        _id: "test-video",
        kind: "video",
        caption: "Test film",
        videoUrl: "https://example.com/test-film",
        poster: null,
        videoFileUrl: null,
      },
    ],
  },
  settings: {
    siteName: "Test name",
    address: "TEST ADDRESS",
    directionsUrl: "https://example.com/directions",
    officeContacts: [{ name: "Test office", phone: "+12025550100" }],
    corporateContacts: [],
    whatsapp: null,
  },
  packages: [
    {
      _id: "test-package",
      name: "TEST PACKAGE",
      category: "Overnight",
      accommodation: "Glamp",
      summary: "TEST SUMMARY",
    },
  ],
  amenities: [
    {
      _id: "test-amenity",
      name: "TEST AMENITY",
      category: "Test category",
      description: "Test description",
      icon: "leaf",
    },
  ],
  about: {
    petInformation: "TEST PET POLICY",
    petRules: ["Test rule"],
    images: [],
  },
  reviews: [
    {
      _id: "test-review",
      guestName: "TEST REVIEWER",
      review: "TEST REVIEW TEXT",
      rating: 5,
      sourceUrl: "https://example.com/review",
    },
  ],
};
const populatedHtml = render(fixture);
const unresolvedReferencesHtml = render({
  ...fixture,
  home: {
    ...fixture.home,
    featuredPackages: [null, { _id: "test-package" }, null],
    featuredGallery: [null, ...fixture.home.featuredGallery, null],
  },
});
assert.ok(unresolvedReferencesHtml.includes("TEST PACKAGE"), "Unresolved package references must not prevent rendering published packages");
assert.ok(unresolvedReferencesHtml.includes("Test film"), "Unresolved gallery references must not prevent rendering published media");
for (const value of [
  "TEST FIXTURE HEADING",
  "TEST PACKAGE",
  "TEST AMENITY",
  "TEST PET POLICY",
  "TEST REVIEW TEXT",
  "TEST ADDRESS",
  "Confirmed capacity: 24 guests.",
  "Confirmed capacity: 8 guests.",
  "tel:+12025550100",
  "https://example.com/test-film",
]) {
  assert.ok(
    populatedHtml.includes(value),
    "Published-field rendering: " + value,
  );
}
assert.ok(!populatedHtml.includes("autoplay"), "Videos must not autoplay");
// Observe the homepage's media selection independently of client playback.
// Real HeroVideo initially renders nothing until motion preferences are known.
const heroModule = require(path.join(root, "src/components/hero-video.tsx"));
const originalHeroVideo = heroModule.HeroVideo;
assert.equal(renderToStaticMarkup(React.createElement(originalHeroVideo, { src: "https://example.com/hero.mp4" })), "");
try {
  heroModule.HeroVideo = function TestHeroVideo({ src }) { return React.createElement("span", { "data-test-hero-video": src }); };
  const heroHome = { ...fixture.home, heroVideoUrl: "https://example.com/hero.mp4" };
  assert.ok(render({ ...fixture, home: { ...heroHome, heroMediaType: "video" } }).includes("data-test-hero-video"), "Video mode selects the background player");
  for (const home of [heroHome, { ...heroHome, heroMediaType: "image" }, { ...heroHome, heroMediaType: "video", heroVideoUrl: null }]) {
    assert.ok(!render({ ...fixture, home }).includes("data-test-hero-video"), "Image, legacy and missing-video content retain image mode");
  }
} finally {
  heroModule.HeroVideo = originalHeroVideo;
}
console.log(
  "Homepage empty and populated rendering passed; sample facts absent; configured content and contacts render.",
);
