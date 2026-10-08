# The Glamp Retreat

Next.js App Router, TypeScript, Tailwind CSS and a separately deployable Sanity Studio. The supplied Stitch homepage and all seven interior pages use a shared design system, header and footer with published CMS content and no invented property details. See [DESIGN.md](DESIGN.md) for the layout, tokens and content mapping.

## Local development

Use Node.js 22.18+ and npm. Run `npm ci` at the root, then `npm ci` from `studio/`. Copy `.env.example` to `.env.local`; copy `studio/.env.example` to `studio/.env`. The confirmed project is `j70izg2a` and dataset is `production`. Both are public identifiers, not credentials. Set `SITE_URL` only to the actual approved production origin.
Run `npm run dev` for the website (localhost:3000) and, in another terminal in `studio/`, `npm run dev` for Studio (localhost:3333). The Studio is not embedded in the website.
Root commands: `npm run build`, `npm start`, `npm run typecheck`, `npm run lint`, `npm run typegen`. Studio commands: `npm run build`, `npm run typecheck`, `npm run typegen`.
After schema or GROQ changes, regenerate and commit `studio/schema.json` and `src/lib/sanity/types.ts`. Generated types must not be edited by hand.

## Repository

- `src/app/`: eight public routes, metadata endpoints, signed revalidation endpoint.
- `src/components/`: shared header/footer, page headers, content panels, contact cards, photo viewer and page-specific content views under `pages/`.
- `src/lib/sanity/`: server-only published client, explicit query projections, generated types, image/contact helpers.
- `studio/schemaTypes/`: eight document types, image and SEO objects.
  Design tokens live in `src/app/globals.css` and follow the supplied Stitch palette and spacing. Playfair Display and Plus Jakarta Sans are self-hosted WOFF2 files with included licenses under `src/app/fonts/`; no font CDN connection is needed at runtime or build time.

## Sanity account and publishing

Open https://www.sanity.io/organizations/o17z23bp6/project/j70izg2a/getting-started and sign in through the browser. No passwords or tokens should be pasted into chat.
Confirm the production dataset and review its visibility. Public reads have been verified without a token. Store only approved public website content in this dataset; never customer data or private contact lists. A private dataset would require a separate server-only least-privilege read token and another connection test.
In project API settings, add the exact Studio origins needed for local and hosted Studio. Enable credentialed CORS only for those trusted Studio origins; never use wildcard credentialed CORS. Server-side website reads do not need credentialed browser CORS.
Invite the client through project Members using a content editor role, not administrator unless required. Restrict management access to maintainers.
Use Site settings, Home page and About page singleton entries; no duplicate singleton creation is offered. Create policies with slugs `privacy` and `booking-terms`. Add packages, amenities, gallery items and genuine approved reviews. Save drafts, then publish deliberately. Packages and amenities require active=true to be queried; reviews require approved=true.
Publish only confirmed photos, addresses, contacts, prices, amenities and capacities. Guest Kitchen remains unconfirmed. Do not import historical spreadsheet values without confirmation. Production content is never automatically seeded.
Telephone links use approved public contacts. A floating WhatsApp chat button appears on every page when the Site settings WhatsApp number is configured. The Contact page enquiry form validates name, email, phone and message, then opens WhatsApp with the details ready to send; the visitor must press Send in WhatsApp. The form does not store enquiries or email them. There are no reservation buttons, payment, login or public uploads. Homepage modules render approved CMS content; testimonials must be approved to appear. Select Home page featured gallery references to populate the photo/video preview, and activate packages and amenities deliberately. Until verified content is published, neutral empty states replace the export's sample photos, location, numbers and reviews.

## Cache and publish webhook

The owner supplied the public property address: The Glamp Retreat, 4MQM+GW2, Kondhali, Hardoli, Maharashtra 441103. It is the website fallback in `src/lib/location.ts`, shown with a lazy Google Maps embed and directions link on Home and Contact. Published Site settings address/directions override the fallback; no production CMS document was created. Review the map pin against the actual entrance before launch.

Home page includes a **Hero background** switch: Image or Video. Existing content defaults to Image. For Video, upload a short compressed MP4 and keep a **Hero image / video fallback**; Studio requires both before publishing video mode. The background loops silently with a pause/play button. Reduced-motion visitors see the fallback image without downloading the video; failed playback also retains the image. Switching back to Image keeps the uploaded video for later use. Gallery videos remain manually played.

Next.js 16.4 fetch caching uses one-hour revalidation with a tag per document type, no global cache disabling. Sanity uses published perspective and `useCdn:false`, so invalidation does not refill from Sanity's query CDN. The supported `parseBody` utility from `next-sanity/webhook` verifies signatures and retains its default three-second Content Lake consistency wait. The endpoint uses `revalidateTag(tag, {expire:0})` for immediate expiration. Package/gallery changes also expire the Home page cache because of references.
Set a strong random `SANITY_WEBHOOK_SECRET` only in server environment configuration. In Sanity API > Webhooks create a POST webhook to the deployed website's `/api/revalidate`. Use dataset production, enable Create, Update and Delete, disable drafts and configure the identical signing secret.
Filter:

```groq
coalesce(after()._type, before()._type) in ["siteSettings","homePage","package","amenity","galleryItem","testimonial","aboutPage","policyPage"]
```

Projection (the before fallback is required for deletion):

```groq
{"_type": coalesce(after()._type, before()._type)}
```

After setup, publish an approved change and inspect delivery status and website refresh; also verify deletion. Never log secrets or introduce write tokens in the website. Missing secret returns 503; invalid signatures are rejected; unsupported types return 400.
References: [Next.js revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag), [Sanity signed webhooks](https://www.sanity.io/docs/nextjs/validating-sanity-webhooks-nextjs), [TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen).

## SEO, media and security

Metadata comes from Site settings with route titles and configurable canonical URLs. Sitemap is empty until SITE_URL is configured; no domain is invented. Social images are included only when available. Structured property data is deferred until verified details and the actual domain are available.
Sanity images use hotspot-aware URLs, Next Image responsive sizes and project/dataset-scoped remote patterns. Video files load with preload=none and controls, with optional poster; external video URLs use links and do not embed/autoplay.
Skip navigation, semantic landmarks, visible focus, responsive disclosure navigation and reduced-motion support are included. Real environment files, Studio dependencies/builds and credentials are ignored. Environment examples are intentionally tracked. Headers include nosniff, frame denial, referrer and restrictive camera/microphone/geolocation policies. Consider deployment-specific CSP/HSTS once final integrations and HTTPS domain are known.

## Vercel and Sanity deployment

The website is hosted at https://the-glamp-retreat-prod.vercel.app. Vercel hosts the Next.js website; Sanity stores its content and hosts the separately deployed editing dashboard (Studio).

### 1. Configure the Vercel website

In Vercel, open the website project > Settings > Environment Variables and add these public configuration values for Production:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `j70izg2a` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SITE_URL` | `https://the-glamp-retreat-prod.vercel.app` |

For signed publish webhooks, configure `SANITY_WEBHOOK_SECRET` privately in Vercel and use the same value in Sanity's webhook Secret field. No secret values belong in this README or Git. The current public dataset requires no API token for website reads.

Redeploy the website after changing environment variables so the deployment uses the new values.

### 2. Deploy the Sanity Studio

Run these commands in PowerShell:

```powershell
cd D:\Projects\glamp\studio
npm ci
npx sanity login
npm run deploy
```

Sign in with the account that has access to the existing project `j70izg2a`. When prompted for **Studio hostname (value.sanity.studio)**, enter only:

```text
glamp-retreat
```

Press Enter. If the name is available and deployment succeeds, the dashboard URL will be `https://glamp-retreat.sanity.studio`. If the hostname is taken, try `the-glamp-retreat`. Use the actual successful URL printed by the CLI; these suggested hostnames are not confirmed deployments.

### 3. Configure Studio access

Open [Sanity Manage](https://www.sanity.io/manage), select project `j70izg2a`, then API > CORS Origins. Ensure the actual deployed Studio origin is listed with **Allow credentials** enabled. For local Studio development, also add `http://localhost:3333` with credentials enabled. Server-side website reads do not require credentialed CORS for the Vercel website origin.

Invite content editors through the project's Members settings if they need access to the dashboard.

### 4. Connect publishing to the website

In Sanity API > Webhooks, create an enabled webhook with:

- URL: `https://the-glamp-retreat-prod.vercel.app/api/revalidate`
- Method: POST
- Dataset: `production`
- Triggers: Create, Update and Delete
- Drafts: Disabled
- Secret: The same privately configured value as Vercel's `SANITY_WEBHOOK_SECRET`

Copy the filter and projection from [Cache and publish webhook](#cache-and-publish-webhook) above. The website already includes the signed revalidation endpoint. With the webhook connected, published content changes refresh the website cache without a new Vercel deployment. Without it, the website uses its one-hour cache revalidation.

### 5. Publish and verify content

Open the deployed Studio and start with **Site settings**: property name, public telephone contacts, WhatsApp number including country code, and address. Publish homepage imagery, packages, amenities, gallery content and policy pages as needed. Packages and amenities must be active; testimonials must be approved. Saved drafts do not appear on the public website.

Publish one approved change, confirm its webhook delivery succeeds, then refresh the Vercel website to verify it appears. Also check the WhatsApp chat button and Contact form after publishing the WhatsApp number.

References: [Sanity Studio deployment](https://www.sanity.io/docs/studio/deployment), [Sanity CORS configuration](https://www.sanity.io/docs/content-lake/cors), [Signed webhook validation](https://www.sanity.io/docs/nextjs/validating-sanity-webhooks-nextjs).

## Verification and known limits

Next.js and Studio builds and both TypeScript checks passed. All eight routes returned HTTP 200 with headings and the main landmark. Every projected published GROQ query executed successfully against j70izg2a/production; all are currently empty. Invalid webhook signatures returned 401. Signed update/delete-shaped payloads returned 200, tampered payloads returned 401 and unsupported types returned 400.
Repeat checks against a running website with a locally configured signing secret: `npm run test:foundation`. Set TEST_ORIGIN if using another port. Set TEST_WEBHOOK_SECRET to the same local server secret to also test signed and tampered requests. This test reads published content and does not mutate Sanity.
The in-app browser connection failed, so an isolated headless Chrome was used for verification. All eight pages passed at 1440px, 1024px, 768px, 390px and 320px: no horizontal overflow, missing design tokens or uncaught JavaScript exceptions. Mobile menu opening, link focus, Escape/focus return and client-side route navigation passed. Desktop/mobile screenshots are saved in the ignored `.qa/` folder. Repeat with `node scripts/verify-browser.mjs` after starting an isolated Chrome with `--headless=new --remote-debugging-port=9237 --user-data-dir=<temporary-QA-profile> about:blank`; use TEST_ORIGIN/TEST_BROWSER_ENDPOINT for other local endpoints. This test only uses that QA browser, never an existing user profile. Gallery filtering and photo-dialog interactions require published content and have not yet been browser-tested.
Account invitations, production URL, production webhook signing configuration and real publish/delete delivery require account/deployment configuration.
Compatible npm audit fixes were applied. Current stable Sanity tooling still has transitive advisories (including braces, older js-yaml, smol-toml and uuid); npm recommends breaking downgrades and no fixed braces version was offered. Do not use npm audit fix --force blindly. Run npm audit in both projects and resolve upstream advisories before production release. This prevents claiming a fully security-cleared production deployment.

The homepage and all interior pages are designed. Run `npm run test:homepage` and `npm run test:pages` to check empty and populated rendering without publishing any fixtures. Packages are grouped by visit category with expandable inclusions/rules; gallery categories and the native photo dialog are interactive; policies derive their contents sidebar from published headings. Each route inherits exactly one header and footer from the root layout. Next step: publish verified imagery, packages, contacts, amenities and approved policy text, then visually review the populated pages on desktop and mobile.

ESLint remains on 9.39.5 because the installed Next.js React/import/accessibility plugins do not declare ESLint 10 compatibility. Lint passes; migrate when those upstream peer ranges support ESLint 10.
