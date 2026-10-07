import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createClient } from "next-sanity";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
for (const path of [
  "/",
  "/about",
  "/packages",
  "/amenities",
  "/gallery",
  "/contact",
  "/privacy",
  "/booking-terms",
]) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, /<h1[ >]/, path);
  assert.match(html, /id="main"/, path);
  assert.equal(
    (html.match(/<header(?:\s|>)/g) || []).length,
    1,
    `${path}: one shared header`,
  );
  assert.equal(
    (html.match(/<footer(?:\s|>)/g) || []).length,
    1,
    `${path}: one shared footer`,
  );
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${path}: one page title`,
  );
  console.log("Route OK:", path);
}
async function webhook(body, signature) {
  return fetch(origin + "/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [SIGNATURE_HEADER_NAME]: signature,
    },
    body,
  });
}
const payload = JSON.stringify({ _type: "package" });
assert.equal(
  (await webhook(payload, "invalid")).status,
  401,
  "Invalid signature must return 401; configure a local test secret",
);
console.log("Invalid webhook signature rejected");
if (process.env.TEST_WEBHOOK_SECRET) {
  for (const type of ["package", "galleryItem"]) {
    const body = JSON.stringify({ _type: type });
    const signature = await encodeSignatureHeader(
      body,
      Date.now(),
      process.env.TEST_WEBHOOK_SECRET,
    );
    assert.equal(
      (await webhook(body, signature)).status,
      200,
      "Valid projected update/delete payload",
    );
    assert.equal(
      (await webhook(JSON.stringify({ _type: "siteSettings" }), signature))
        .status,
      401,
      "Tampered body must be rejected",
    );
  }
  const body = JSON.stringify({ _type: "unrelated" });
  const signature = await encodeSignatureHeader(
    body,
    Date.now(),
    process.env.TEST_WEBHOOK_SECRET,
  );
  assert.equal(
    (await webhook(body, signature)).status,
    400,
    "Unrelated types must be rejected",
  );
  console.log(
    "Signed update/delete-shaped requests accepted; tampered and unrelated payloads rejected",
  );
}
const source = await readFile(
  new URL("../src/lib/sanity/queries.ts", import.meta.url),
  "utf8",
);
const matches = [
  ...source.matchAll(
    /export const (\w+) = defineQuery\(\s*`([\s\S]*?)`\s*,?\s*\);/g,
  ),
];
assert.equal(
  matches.length,
  8,
  "All eight named public queries must be tested",
);
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "j70izg2a",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-10-01",
  perspective: "published",
  useCdn: false,
});
for (const [, name, query] of matches) {
  const result = await client.fetch(query, { slug: "privacy" });
  console.log(
    "Published query OK:",
    name,
    Array.isArray(result)
      ? result.length + " results"
      : result === null
        ? "empty singleton"
        : "document",
  );
}
