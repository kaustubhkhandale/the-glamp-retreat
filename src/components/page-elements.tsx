import Link from "next/link";
import type { AccessibleImage } from "@/lib/sanity/types";
import { ContentImage } from "./content-image";
import { Icon, type IconName } from "./icon";
export function PageHeader({
  eyebrow,
  title,
  intro,
  crumb,
  image,
  visual = false,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  crumb: string;
  image?: AccessibleImage | null;
  visual?: boolean;
}) {
  return (
    <section
      className={`interior-hero ${visual ? "interior-hero-visual" : ""}`}
    >
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <div className="interior-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="interior-intro">{intro}</p>
          </div>
          {visual && (
            <ContentImage
              image={image}
              label={crumb}
              className="interior-hero-image"
              priority
            />
          )}
        </div>
      </div>
    </section>
  );
}
export function EmptyPanel({
  title,
  children,
  icon = "leaf",
}: {
  title: string;
  children: React.ReactNode;
  icon?: IconName;
}) {
  return (
    <div className="empty-panel">
      <span className="icon-circle">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function ExploreBand({
  title = "Continue Exploring",
  href = "/packages",
  label = "Explore Packages",
}: {
  title?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="explore-band section-dark">
      <div className="container explore-inner">
        <div>
          <p className="eyebrow">The Glamp Retreat</p>
          <h2>{title}</h2>
        </div>
        <div className="explore-actions">
          <Link className="button button-light" href={href}>
            {label}
            <Icon name="arrow" />
          </Link>
          <Link className="button button-glass" href="/contact">
            Contact Us
            <Icon name="phone" />
          </Link>
        </div>
      </div>
    </section>
  );
}
export function ContentList({ items }: { items?: string[] | null }) {
  return items?.length ? (
    <ul className="detail-list">
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>
          <span aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  ) : null;
}
