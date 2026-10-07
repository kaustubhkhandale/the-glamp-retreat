import type { Metadata } from "next";
import "./globals.css";
import "./interior.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { sanityFetch } from "@/lib/sanity/client";
import { SETTINGS_QUERY } from "@/lib/sanity/queries";
import type { SETTINGS_QUERY_RESULT } from "@/lib/sanity/types";
import { imageUrl } from "@/lib/sanity/image";
import localFont from "next/font/local";
const headingFont = localFont({
  src: "./fonts/playfair-display-latin.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-playfair",
});
const bodyFont = localFont({
  src: "./fonts/plus-jakarta-sans-latin.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-jakarta",
});
export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SETTINGS_QUERY_RESULT>(
    SETTINGS_QUERY,
    "siteSettings",
  );
  const title =
    settings?.seo?.title || settings?.siteName || "The Glamp Retreat";
  const description =
    settings?.seo?.description || settings?.shortDescription || undefined;
  const social = settings?.seo?.image ? imageUrl(settings.seo.image) : null;
  return {
    metadataBase: process.env.SITE_URL
      ? new URL(process.env.SITE_URL)
      : undefined,
    title: { default: title, template: "%s | The Glamp Retreat" },
    description,
    openGraph: { title, description, ...(social ? { images: [social] } : {}) },
    twitter: {
      card: social ? "summary_large_image" : "summary",
      title,
      description,
      ...(social ? { images: [social] } : {}),
    },
  };
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch<SETTINGS_QUERY_RESULT>(
    SETTINGS_QUERY,
    "siteSettings",
  );
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header
          siteName={settings?.siteName || "The Glamp Retreat"}
          logo={settings?.logo || null}
          phone={
            settings?.officeContacts?.find((contact) => contact.phone)?.phone ||
            null
          }
        />
        <main id="main" className="site-main" tabIndex={-1}>
          {children}
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
