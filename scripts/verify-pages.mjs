// Reuse the in-memory TSX renderer; no fixture data is written to Sanity.
import "./verify-homepage.mjs";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const require = createRequire(import.meta.url);
const render = (component, props) =>
  renderToStaticMarkup(React.createElement(component, props));
const { AboutView } = require("../src/components/pages/about-view.tsx");
const { PackagesView } = require("../src/components/pages/packages-view.tsx");
const { AmenitiesView } = require("../src/components/pages/amenities-view.tsx");
const { ContactView } = require("../src/components/pages/contact-view.tsx");
const { PolicyView } = require("../src/components/pages/policy-view.tsx");
const { GalleryBrowser } = require("../src/components/gallery-browser.tsx");
const { propertyLocation, PROPERTY_ADDRESS } = require("../src/lib/location.ts");
const ownerLocation = propertyLocation();
assert.equal(new URL(ownerLocation.mapUrl).searchParams.get("q"), PROPERTY_ADDRESS);
assert.equal(new URL(ownerLocation.directionsUrl).searchParams.get("destination"), PROPERTY_ADDRESS);
assert.ok(ownerLocation.mapUrl.includes("%2B"), "Plus Code must retain its plus sign in the URL");
assert.equal(propertyLocation("UPDATED ADDRESS", "https://example.com/directions").directionsUrl, "https://example.com/directions");
assert.equal(new URL(propertyLocation("UPDATED ADDRESS").mapUrl).searchParams.get("q"), "UPDATED ADDRESS");
const locationHtml = render(ContactView, { settings: null });
assert.ok(locationHtml.includes(PROPERTY_ADDRESS));
assert.ok(locationHtml.includes('<iframe'));
assert.ok(locationHtml.includes('loading="lazy"'));
assert.ok(locationHtml.includes('title="Google Map showing The Glamp Retreat location"'));
for (const [component, props] of [
  [AboutView, { data: null }],
  [PackagesView, { packages: [] }],
  [AmenitiesView, { amenities: [] }],
  [ContactView, { settings: null }],
  [PolicyView, { data: null, title: "Privacy Policy", slug: "privacy" }],
  [PolicyView, { data: null, title: "Booking Terms", slug: "booking-terms" }],
]) {
  const html = render(component, props);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.ok(!html.includes("tel:"));
  assert.ok(!html.includes("wa.me"));
}
const packageHtml = render(PackagesView, {
  packages: [
    {
      _id: "test-package",
      name: "TEST STAY",
      category: "Overnight",
      accommodation: "Glamp",
      slug: { current: "test-stay" },
      summary: "TEST SUMMARY",
      price: 0,
      currency: "INR",
      pricingUnit: "per stay",
      arrival: "16:00",
      departure: "10:00",
      departureDayOffset: 1,
      vegetarianPrice: 100,
      nonVegetarianPrice: 150,
      inclusions: ["TEST INCLUSION"],
      exclusions: ["TEST EXCLUSION"],
      rules: ["TEST RULE"],
      gallery: [],
    },
  ],
});
for (const text of [
  "TEST STAY",
  "TEST INCLUSION",
  "TEST EXCLUSION",
  "TEST RULE",
  "16:00",
  "10:00",
  "Day +",
  "Vegetarian",
  "Non-vegetarian",
  "per stay",
  "<details",
]) {
  assert.ok(packageHtml.includes(text), text);
}
assert.ok(!packageHtml.includes("Reservation"));
const aboutHtml = render(AboutView, {
  data: {
    story: "TEST STORY",
    petInformation: "TEST PET POLICY",
    petRules: ["TEST PET RULE"],
    occasions: ["TEST OCCASION"],
    images: [],
  },
});
for (const text of [
  "TEST STORY",
  "TEST PET POLICY",
  "TEST PET RULE",
  "TEST OCCASION",
])
  assert.ok(aboutHtml.includes(text));
const amenityHtml = render(AmenitiesView, {
  amenities: [
    {
      _id: "test-amenity",
      name: "TEST AMENITY",
      category: "TEST CATEGORY",
      description: "TEST DESCRIPTION",
      icon: "water",
    },
  ],
});
assert.ok(amenityHtml.includes("TEST AMENITY"));
assert.ok(amenityHtml.includes('href="#amenity-category-0"'));
const contactHtml = render(ContactView, {
  settings: {
    siteName: "TEST SITE",
    address: "TEST ADDRESS",
    directionsUrl: "https://example.com/directions",
    officeContacts: [{ name: "Test office", phone: "+12025550100" }],
    corporateContacts: [],
    whatsapp: "+12025550101",
    socialLinks: [{ label: "TEST SOCIAL", url: "https://example.com/social" }],
  },
});
for (const text of [
  "TEST ADDRESS",
  "tel:+12025550100",
  "https://wa.me/12025550101",
  "TEST SOCIAL",
  "https://example.com/directions",
])
  assert.ok(contactHtml.includes(text));
assert.ok(!contactHtml.includes("<form"));
const policyHtml = render(PolicyView, {
  title: "Privacy Policy",
  slug: "privacy",
  data: {
    title: "TEST POLICY",
    lastUpdated: "2026-10-07",
    body: [
      {
        _type: "block",
        _key: "test-heading",
        style: "h1",
        children: [
          {
            _type: "span",
            _key: "test-title",
            text: "TEST SECTION",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "test-paragraph",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "test-text",
            text: "TEST POLICY TEXT",
            marks: ["test-link"],
          },
        ],
        markDefs: [
          { _type: "link", _key: "test-link", href: "javascript:alert(1)" },
        ],
      },
    ],
  },
});
assert.equal((policyHtml.match(/<h1(?:\s|>)/g) || []).length, 1);
assert.ok(policyHtml.includes('href="#policy-test-heading"'));
assert.ok(policyHtml.includes('id="policy-test-heading"'));
assert.ok(policyHtml.includes("TEST POLICY TEXT"));
assert.ok(!policyHtml.includes("javascript:"));
const galleryHtml = render(GalleryBrowser, {
  items: [
    {
      _id: "test-video",
      kind: "video",
      category: "Other",
      caption: "TEST FILM",
      videoFileUrl: "https://example.com/test.mp4",
      videoUrl: null,
      poster: null,
    },
  ],
});
assert.ok(galleryHtml.includes("Filter gallery by category"));
assert.ok(galleryHtml.includes('aria-pressed="true"'));
assert.ok(galleryHtml.includes('preload="none"'));
assert.ok(
  !galleryHtml.includes("autoPlay") && !galleryHtml.includes("autoplay"),
);
assert.ok(galleryHtml.includes("TEST FILM"));
console.log(
  "All interior page empty/populated content checks passed, including policies, package timing/pricing, contacts and gallery media.",
);
