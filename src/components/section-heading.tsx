import Link from "next/link";
import { Icon } from "./icon";
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  description?: string | null;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
      {href && linkLabel && (
        <Link className="text-link" href={href}>
          {linkLabel}
          <Icon name="arrow" />
        </Link>
      )}
    </div>
  );
}
