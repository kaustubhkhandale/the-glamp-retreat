import type { AMENITIES_QUERY_RESULT } from "@/lib/sanity/types";
import { PageHeader, EmptyPanel, ExploreBand } from "../page-elements";
import { ContentImage } from "../content-image";
import { Icon } from "../icon";
export function AmenitiesView({
  amenities,
}: {
  amenities: AMENITIES_QUERY_RESULT;
}) {
  const categories = [
    ...new Set(amenities.map((item) => item.category || "At the Retreat")),
  ];
  return (
    <>
      <PageHeader
        eyebrow="Experience the Retreat"
        title="Amenities & Experiences"
        crumb="Amenities"
        intro="Take a closer look at the spaces, activities, and facilities available at The Glamp Retreat."
      />
      {categories.length > 0 && (
        <nav className="section-jump" aria-label="Amenity categories">
          <div className="container">
            {categories.map((category, index) => (
              <a key={category} href={`#amenity-category-${index}`}>
                {category}
              </a>
            ))}
          </div>
        </nav>
      )}
      {categories.length ? (
        categories.map((category, index) => (
          <section
            className={`home-section ${index % 2 ? "section-soft" : ""}`}
            id={`amenity-category-${index}`}
            key={category}
          >
            <div className="container">
              <div className="numbered-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="eyebrow">Discover</p>
                  <h2>{category}</h2>
                </div>
              </div>
              <div className="amenity-directory">
                {amenities
                  .filter(
                    (item) => (item.category || "At the Retreat") === category,
                  )
                  .map((item) => (
                    <article className="amenity-detail-card" key={item._id}>
                      {item.image?.asset && (
                        <ContentImage
                          image={item.image}
                          label={item.name || category}
                          sizes="(max-width: 767px) 100vw, 33vw"
                        />
                      )}
                      <div className="amenity-body">
                        <span className="icon-circle">
                          <Icon name={item.icon || "leaf"} />
                        </span>
                        <h3>{item.name}</h3>
                        {item.description && <p>{item.description}</p>}
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        <section className="home-section">
          <div className="container amenities-empty-layout">
            <ContentImage label="Around the Retreat" />
            <div>
              <p className="eyebrow">A Closer Look</p>
              <h2>Discover the Details</h2>
              <EmptyPanel title="Amenities coming soon">
                Property facilities and activity details will appear here when
                available.
              </EmptyPanel>
            </div>
          </div>
        </section>
      )}
      <ExploreBand title="Explore Your Visit Options" />
    </>
  );
}
