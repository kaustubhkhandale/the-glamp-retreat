import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { POLICY_QUERY_RESULT } from "@/lib/sanity/types";
import { PageHeader, EmptyPanel } from "../page-elements";
import { Icon } from "../icon";
const components: Partial<PortableTextComponents> = {
  block: {
    h1: ({ value, children }) => (
      <h2 id={`policy-${value._key}`}>{children}</h2>
    ),
    h2: ({ value, children }) => (
      <h2 id={`policy-${value._key}`}>{children}</h2>
    ),
    h3: ({ value, children }) => (
      <h3 id={`policy-${value._key}`}>{children}</h3>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href;
      return typeof href === "string" &&
        /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href) ? (
        <a href={href}>{children}</a>
      ) : (
        <span>{children}</span>
      );
    },
  },
};
export function PolicyView({
  data,
  title,
  slug,
}: {
  data: POLICY_QUERY_RESULT;
  title: string;
  slug: string;
}) {
  const headings =
    data?.body?.filter((block) =>
      ["h1", "h2", "h3"].includes(block.style || ""),
    ) || [];
  return (
    <>
      <PageHeader
        eyebrow="Visitor Information"
        title={data?.title || title}
        crumb={title}
        intro={
          slug === "privacy"
            ? "Information about privacy and the use of this website."
            : "Please review the retreat's booking and visiting terms before planning your visit."
        }
      />
      <section className="home-section">
        <div className="container policy-layout">
          <aside className="policy-sidebar">
            <p className="eyebrow">On This Page</p>
            {headings.length > 0 ? (
              <nav aria-label="Policy contents">
                <ul>
                  {headings.map((block) => (
                    <li key={block._key}>
                      <a href={`#policy-${encodeURIComponent(block._key)}`}>
                        {block.children
                          ?.map((child) => child.text || "")
                          .join("")}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <p className="muted">Policy information</p>
            )}
            <div className="policy-resources">
              <Link href={slug === "privacy" ? "/booking-terms" : "/privacy"}>
                {slug === "privacy" ? "Booking Terms" : "Privacy Policy"}
                <Icon name="arrow" />
              </Link>
              <Link href="/contact">
                Contact Us
                <Icon name="arrow" />
              </Link>
            </div>
          </aside>
          <article className="policy-paper">
            {data?.lastUpdated && (
              <p className="policy-updated">
                Last updated{" "}
                <time dateTime={data.lastUpdated}>{data.lastUpdated}</time>
              </p>
            )}
            {data?.body?.length ? (
              <div className="policy-prose">
                <PortableText value={data.body} components={components} />
              </div>
            ) : (
              <EmptyPanel title="Policy details coming soon">
                The approved{" "}
                {slug === "privacy" ? "privacy policy" : "booking terms"} will
                be available here. Contact the retreat for any questions.
              </EmptyPanel>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
