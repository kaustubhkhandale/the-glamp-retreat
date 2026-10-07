import Link from "next/link";
import type { PACKAGES_QUERY_RESULT } from "@/lib/sanity/types";
import {
  PageHeader,
  EmptyPanel,
  ExploreBand,
  ContentList,
} from "../page-elements";
import { ContentImage } from "../content-image";
import { Icon } from "../icon";
const categories = [
  { name: "Day Picnic", id: "day-visits", label: "Day Visits" },
  { name: "Evening Leisure", id: "evening-leisure", label: "Evening Leisure" },
  { name: "Overnight", id: "overnight-stays", label: "Overnight Stays" },
];
function price(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
}
export function PackagesView({
  packages,
}: {
  packages: PACKAGES_QUERY_RESULT;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Choose Your Visit"
        title="Packages & Stays"
        crumb="Packages"
        intro="Explore day visits, evening leisure, and overnight options. Package details, inclusions, and visiting rules are listed below."
      />
      <nav className="section-jump" aria-label="Package categories">
        <div className="container">
          {categories.map((category) => (
            <a key={category.id} href={`#${category.id}`}>
              {category.label}
              <Icon name={category.name === "Overnight" ? "bed" : "leaf"} />
            </a>
          ))}
        </div>
      </nav>
      {categories.map((category, index) => {
        const items = packages.filter(
          (item) => item.category === category.name,
        );
        return (
          <section
            className={`home-section package-section ${index % 2 ? "section-soft" : ""}`}
            id={category.id}
            key={category.id}
          >
            <div className="container">
              <div className="numbered-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="eyebrow">{category.name}</p>
                  <h2>{category.label}</h2>
                </div>
              </div>
              {items.length ? (
                <div className="package-directory">
                  {items.map((item) => (
                    <article
                      className="package-detail-card"
                      key={item._id}
                      id={
                        item.slug?.current
                          ? `package-${item.slug.current}`
                          : undefined
                      }
                    >
                      <ContentImage
                        image={item.cover}
                        label={item.name || category.label}
                        sizes="(max-width: 1023px) 100vw, 42vw"
                      />
                      <div className="package-detail-body">
                        <div className="package-title-row">
                          <div>
                            <p className="eyebrow">
                              {item.accommodation || item.category}
                            </p>
                            <h3>{item.name}</h3>
                          </div>
                          {item.price != null && item.currency && (
                            <div className="package-price">
                              <strong>
                                {price(item.price, item.currency)}
                              </strong>
                              {item.pricingUnit && (
                                <span>{item.pricingUnit}</span>
                              )}
                            </div>
                          )}
                        </div>
                        {item.summary && (
                          <p className="muted">{item.summary}</p>
                        )}
                        {(item.vegetarianPrice != null && item.currency) ||
                        (item.nonVegetarianPrice != null && item.currency) ? (
                          <dl className="price-variants">
                            {item.vegetarianPrice != null && item.currency && (
                              <div>
                                <dt>Vegetarian</dt>
                                <dd>
                                  {price(item.vegetarianPrice, item.currency)}
                                </dd>
                              </div>
                            )}
                            {item.nonVegetarianPrice != null &&
                              item.currency && (
                                <div>
                                  <dt>Non-vegetarian</dt>
                                  <dd>
                                    {price(
                                      item.nonVegetarianPrice,
                                      item.currency,
                                    )}
                                  </dd>
                                </div>
                              )}
                          </dl>
                        ) : null}
                        {(item.arrival || item.departure) && (
                          <dl className="visit-times">
                            {item.arrival && (
                              <div>
                                <dt>Arrival</dt>
                                <dd>{item.arrival}</dd>
                              </div>
                            )}
                            {item.departure && (
                              <div>
                                <dt>Departure</dt>
                                <dd>
                                  {item.departure}
                                  {item.departureDayOffset != null &&
                                  item.departureDayOffset > 0 ? (
                                    <span>Day +{item.departureDayOffset}</span>
                                  ) : null}
                                </dd>
                              </div>
                            )}
                          </dl>
                        )}
                        {[
                          item.inclusions,
                          item.exclusions,
                          item.rules,
                          item.gallery,
                        ].some((list) => list?.length) ? (
                          <details className="package-disclosure">
                            <summary>
                              Inclusions & Visit Details
                              <Icon name="arrow" />
                            </summary>
                            <div className="package-extra">
                              {[
                                { title: "Included", items: item.inclusions },
                                {
                                  title: "Not Included",
                                  items: item.exclusions,
                                },
                                { title: "Visiting Rules", items: item.rules },
                              ].map((list) =>
                                list.items?.length ? (
                                  <section key={list.title}>
                                    <h4>{list.title}</h4>
                                    <ContentList items={list.items} />
                                  </section>
                                ) : null,
                              )}
                              {item.gallery?.length ? (
                                <div className="package-photo-strip">
                                  {item.gallery.map((image, index) => (
                                    <ContentImage
                                      key={image._key || index}
                                      image={image}
                                      label={item.name || "Package photo"}
                                      sizes="(max-width: 767px) 45vw, 20vw"
                                    />
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </details>
                        ) : null}
                        <Link className="text-link" href="/contact">
                          Contact for Package Details
                          <Icon name="phone" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyPanel
                  icon={category.name === "Overnight" ? "bed" : "leaf"}
                  title="Package details coming soon"
                >
                  Available {category.name.toLowerCase()} packages will be
                  listed here.
                </EmptyPanel>
              )}
            </div>
          </section>
        );
      })}
      <section className="home-section section-soft">
        <div className="container package-note">
          <Icon name="phone" />
          <div>
            <p className="eyebrow">Telephone Enquiries</p>
            <h2>Have a Question About Your Visit?</h2>
            <p>
              Contact the retreat for package details and booking enquiries.
            </p>
          </div>
          <Link className="button" href="/contact">
            Contact Us
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
      <ExploreBand
        title="Picture Your Visit"
        href="/gallery"
        label="View Gallery"
      />
    </>
  );
}
