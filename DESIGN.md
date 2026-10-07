# Stitch implementation

Source: the user-supplied homepage HTML from [Stitch project 4438677703743419022](https://stitch.withgoogle.com/projects/4438677703743419022). No account access or changes to Stitch are required to use the supplied export.

The public homepage follows the export's nine-section sequence: immersive hero, visit selection, accommodation cards, experience grid, occasions, gallery preview, key details, guest reviews, and location/telephone contacts. The fixed translucent header and four-column footer share the same system across all routes. All seven interior pages now extend this system through editorial page headers, ivory/forest surfaces and reusable content cards.

## Design system

Tokens live in `src/app/globals.css` using Tailwind v4 theme variables and shared CSS classes.

| Token                  | Value / purpose                                   |
| ---------------------- | ------------------------------------------------- |
| Primary                | `#051912`, hero and dark overlays                 |
| Primary container      | `#1a2e26`, headings, buttons and occasion section |
| Secondary              | `#7d5629`, labels and warm accents                |
| Secondary fixed        | `#ffdcbb`, accents on dark surfaces               |
| Surface                | `#fcf9f4`, ivory page background                  |
| Surface container low  | `#f6f3ee`, alternating sections                   |
| Surface container high | `#ebe8e3`, contact section                        |
| On surface             | `#1c1c19`, primary body text                      |
| On surface variant     | `#424845`, secondary body text                    |
| Display / headings     | Playfair Display, variable 400–700                |
| Body / labels          | Plus Jakarta Sans, variable 400–700               |
| Desktop display        | 56px, tight leading                               |
| Mobile display         | 38px                                              |
| Section heading        | 40px desktop / 30px mobile                        |
| Body                   | 15px, 24px leading                                |
| Label                  | 11–12px, uppercase, tracked                       |
| Layout                 | 1440px maximum width; gutters 64px / 40px / 20px  |
| Spacing                | 6px, 12px, 20px, 36px, 64px                       |
| Cards                  | 8px corners; buttons 2px corners                  |

Fonts are local WOFF2 assets under `src/app/fonts/`, loaded by `next/font/local`; their SIL Open Font License files are included. Google Fonts CDN URLs are not used at runtime or build time. The initial downloads came from the official Google Fonts service. SVG icons are local React components, with no external icon font or UI library.

## CMS mapping

| Module                       | Published content source                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| Brand, booking links, footer | Site settings; office/corporate contacts; social links; optional WhatsApp                      |
| Hero and introduction        | Home page heading, supporting line, hero and introduction                                      |
| Visit / accommodation cards  | Active packages; featured references preferred for accommodation cards                         |
| Experiences                  | Active amenities, first five in display order                                                  |
| Occasions                    | Home page occasions; About page image or a featured photo; approved corporate telephone        |
| Gallery                      | Home page featured gallery references; photos, video links or video files with native controls |
| Key details                  | About page pet information/rules; explicitly configured capacities and Home page highlights    |
| Guest stories                | Approved testimonials only, first three                                                        |
| Location                     | Verified address and directions URL from Site settings                                         |

No production content was seeded. Generated sample imagery and the export's unverified property claims, capacities, location names, telephone numbers and reviews are excluded. Missing content uses brief empty states and neutral image panels; these are replaced automatically by published CMS content. The hero's fallback heading is supplied design copy. The public login avatar and strict advance-booking claim from the export were omitted under the original content rules. All navigation links resolve to real application routes. Occasion pills describe approved occasions and are not nonfunctional fake controls.

## Verification

Run `npm run test:homepage` for isolated empty/populated rendering checks; fixtures stay in memory and never touch Sanity. Run `npm run typegen` after query/schema edits; the extraction step now overwrites generated schema files safely. Existing `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:foundation` continue to apply.

Responsive rules cover desktop, tablet and narrow mobile layouts; disclosure navigation has active-route states, focus on opening, Escape to close, and focus return. Videos use `preload="none"`, controls, and no autoplay. Sanity image hotspot coordinates inform CSS focal positions, and responsive sizes are declared.

An isolated headless Chrome verified all eight pages at 1440px, 1024px, 768px, 390px and 320px. Desktop/mobile screenshots were reviewed; design-token declarations, fonts, shared layout, overflow and mobile-menu keyboard/navigation checks passed. Real approved imagery and longer CMS content still need a populated visual review. No pixel comparison against Stitch is claimed.

## Interior pages

Interior layouts are defined in src/app/interior.css and reuse the homepage tokens and shared components. Header and Footer remain in the root layout, so pages never instantiate duplicate navigation or footers.

| Route          | Layout and behaviour                                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /about         | Split editorial hero, story, published photographs, pet policies/rules and occasion directory                                                                           |
| /packages      | Sticky category navigation, package photographs/prices, arrival/departure and day offsets, vegetarian/non-vegetarian variants, native expandable inclusion/rule details |
| /amenities     | Category navigation and reusable photo/icon cards; only active amenities are queried                                                                                    |
| /gallery       | Category filters, responsive photo/video grid and native dialog with Escape, previous/next and arrow-key navigation                                                     |
| /contact       | Verified address/directions panel, shared office/corporate contact cards, conditional WhatsApp/social links and useful policy links                                     |
| /privacy       | Readable policy article, last-updated date and heading-derived contents sidebar                                                                                         |
| /booking-terms | The same policy layout with independently published booking terms                                                                                                       |

No policy language, prices, facilities, phone numbers or photos are fabricated. Content comes from the existing published queries. Photo grids and contact links populate once actual content is available. Gallery videos remain click-to-play with preload=none; external video URLs open as links.

Run npm run test:pages for in-memory empty/populated rendering checks. The live route and browser tests additionally check that each route has exactly one shared header, footer and page title. The browser audit caught a CSS loader collision that replaced shared styles with interior styles; Tailwind compilation is now restricted to globals.css, and static theme declarations export every token used by interior.css. Gallery filtering clicks and native-dialog focus/keyboard behaviour still need a browser review once gallery content exists; fixture rendering has passed without publishing anything to Sanity.
