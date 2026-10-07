import Link from "next/link";
import type {
  HOME_QUERY_RESULT,
  SETTINGS_QUERY_RESULT,
  PACKAGES_QUERY_RESULT,
  AMENITIES_QUERY_RESULT,
  ABOUT_QUERY_RESULT,
  TESTIMONIALS_QUERY_RESULT,
} from "@/lib/sanity/types";
import { telephone } from "@/lib/sanity/content";
import { imageUrl } from "@/lib/sanity/image";
import { ContentImage } from "./content-image";
import { HeroVideo } from "./hero-video";
import { SectionHeading } from "./section-heading";
import { BookingContacts } from "./booking-contacts";
import { Icon, type IconName } from "./icon";

type Props = {
  home: HOME_QUERY_RESULT;
  settings: SETTINGS_QUERY_RESULT;
  packages: PACKAGES_QUERY_RESULT;
  amenities: AMENITIES_QUERY_RESULT;
  about: ABOUT_QUERY_RESULT;
  reviews: TESTIMONIALS_QUERY_RESULT;
};
const amenityIcons = new Set<IconName>([
  "leaf",
  "water",
  "bed",
  "dining",
  "music",
  "parking",
  "accessibility",
  "pet",
]);
export function Homepage({
  home,
  settings,
  packages,
  amenities,
  about,
  reviews,
}: Props) {
  const dayPackage = packages.find(
    (item) =>
      item.category === "Day Picnic" || item.category === "Evening Leisure",
  );
  const nightPackage = packages.find((item) => item.category === "Overnight");
  const featuredIds = home?.featuredPackages?.map((item) => item._id) || [];
  const preferredPackages = [
    ...packages.filter((item) => featuredIds.includes(item._id)),
    ...packages.filter((item) => !featuredIds.includes(item._id)),
  ];
  const gallery =
    home?.featuredGallery?.filter((item) => item != null).slice(0, 3) || [];
  const occasionImage =
    about?.images?.[0] || gallery.find((item) => item.kind === "photo")?.photo;
  const corporatePhone = settings?.corporateContacts?.find(
    (item) => item.phone,
  )?.phone;
  const visitCards = [
    {
      label: "Day visits",
      title: "Day Picnic & Evening Leisure",
      item: dayPackage,
      link: "Explore Day Packages",
      href: "/packages",
    },
    {
      label: "Overnight",
      title: "Overnight Stays",
      item: nightPackage,
      link: "Explore Overnight Stays",
      href: "/packages",
    },
  ];
  return (
    <div className="homepage">
      <section className="hero" aria-labelledby="hero-heading">
        <ContentImage
          image={home?.hero}
          label="The Glamp Retreat"
          className="hero-image"
          priority
          sizes="100vw"
        />
        {home?.heroMediaType === "video" && home.heroVideoUrl && (
          <HeroVideo key={home.heroVideoUrl} src={home.heroVideoUrl} />
        )}
        <div className="hero-scrim" />
        <div className="container hero-content">
          <div className="hero-copy">
            <p className="hero-badge">
              <span />
              The Glamp Retreat
            </p>
            <h1 id="hero-heading">
              {home?.heading ||
                "Illuminated Wilderness, Crafted for Quiet Escapes"}
            </h1>
            <p className="hero-description">
              {home?.supportingLine ||
                "Explore our packages, browse the gallery, and plan your visit."}
            </p>
            <div className="hero-actions">
              <Link className="button button-light" href="/packages">
                Explore Packages
              </Link>
              <Link className="button button-glass" href="/gallery">
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Choose Your Visit">
        <div className="container">
          <SectionHeading
            eyebrow="Curation"
            title="Choose Your Visit"
            description={home?.introduction}
          />
          <div className="visit-grid">
            {visitCards.map((card) => (
              <article className="visit-card" key={card.label}>
                <div className="visit-media">
                  <ContentImage image={card.item?.cover} label={card.title} />
                  <span className="media-badge">{card.label}</span>
                </div>
                <div className="card-body">
                  <h3>{card.title}</h3>
                  <p>
                    {card.item?.summary ||
                      "Package details will be available soon."}
                  </p>
                  <Link className="text-link" href={card.href}>
                    {card.link}
                    <Icon name="arrow" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="Accommodations"
            title="Glamp, Hut, or Tent"
          />
          <div className="stay-grid">
            {(["Glamp", "Hut", "Tent"] as const).map((type) => {
              const item = preferredPackages.find(
                (item) =>
                  item.category === "Overnight" && item.accommodation === type,
              );
              return (
                <article className="stay-card" key={type}>
                  <ContentImage
                    image={item?.cover}
                    label={type}
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                  <div className="card-body">
                    <h3>{item?.name || type}</h3>
                    <p>
                      {item?.summary ||
                        "Accommodation details will be available soon."}
                    </p>
                    <Link className="button" href="/packages">
                      View Packages
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <SectionHeading
            eyebrow="Lifestyle"
            title="Experience The Retreat"
            href="/amenities"
            linkLabel="View Amenities"
          />
          <div className="experience-grid">
            {amenities.length > 0 ? (
              amenities.slice(0, 5).map((item, index) => (
                <article
                  className={`experience-card experience-${index}`}
                  key={item._id}
                >
                  <ContentImage
                    image={item.image}
                    label={item.name || "The retreat"}
                    sizes="(max-width: 767px) 100vw, 60vw"
                  />
                  <div className="experience-scrim" />
                  <div className="experience-copy">
                    {item.icon && amenityIcons.has(item.icon) && (
                      <Icon name={item.icon} />
                    )}
                    <span className="eyebrow">{item.category}</span>
                    <h3>{item.name}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </article>
              ))
            ) : (
              <>
                <Link
                  href="/amenities"
                  className="experience-card experience-0"
                >
                  <ContentImage label="Activities & Amenities" />
                  <div className="experience-copy">
                    <span className="eyebrow">Explore</span>
                    <h3>Activities & Amenities</h3>
                    <p>Property details will be available soon.</p>
                    <Icon name="arrow" />
                  </div>
                </Link>
                <Link href="/gallery" className="experience-card experience-1">
                  <ContentImage label="Around the Retreat" />
                  <div className="experience-copy">
                    <span className="eyebrow">Discover</span>
                    <h3>Around the Retreat</h3>
                    <Icon name="arrow" />
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="home-section section-dark">
        <div className="container occasion-grid">
          <div className="occasion-copy">
            <p className="eyebrow">Gatherings</p>
            <h2>Celebrate Memorable Occasions</h2>
            {home?.occasions?.length ? (
              <>
                <p className="occasion-label">Occasions at the retreat</p>
                <ul className="occasion-pills">
                  {home.occasions.map((occasion) => (
                    <li key={occasion}>{occasion}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="dark-muted">
                Occasion details will be available soon.
              </p>
            )}
            {corporatePhone ? (
              <a
                className="button button-secondary"
                href={telephone(corporatePhone)}
              >
                <Icon name="phone" />
                Call for Group Enquiries
              </a>
            ) : (
              <Link className="button button-light" href="/contact">
                Contact Us
                <Icon name="arrow" />
              </Link>
            )}
          </div>
          <ContentImage
            image={occasionImage}
            label="Gatherings at the Retreat"
            className="occasion-image"
          />
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <SectionHeading
            eyebrow="Visual Chronicle"
            title="Sanctuary Moments"
            href="/gallery"
            linkLabel="View Gallery"
          />
          <div className="gallery-preview">
            {gallery.length
              ? gallery.map((item, index) => (
                  <figure
                    className={`gallery-tile gallery-tile-${index}`}
                    key={item._id}
                  >
                    {item.kind === "video" ? (
                      item.videoFileUrl ? (
                        <video
                          className="gallery-video"
                          controls
                          preload="none"
                          aria-label={item.caption || "Property video"}
                          poster={
                            item.poster
                              ? imageUrl(item.poster) || undefined
                              : undefined
                          }
                        >
                          <source src={item.videoFileUrl} />

                          <a href={item.videoFileUrl}>Watch property video</a>
                        </video>
                      ) : item.videoUrl ? (
                        <a className="video-link" href={item.videoUrl}>
                          <ContentImage
                            image={item.poster}
                            label="Property video"
                          />
                          <span className="video-link-content">
                            <span className="play-button">
                              <Icon name="play" />
                            </span>
                            <span>Watch Property Preview</span>
                          </span>
                        </a>
                      ) : (
                        <ContentImage
                          image={item.poster}
                          label="Property video"
                        />
                      )
                    ) : (
                      <ContentImage
                        image={item.photo}
                        label={item.caption || "Property photography"}
                        sizes="(max-width: 767px) 100vw, 50vw"
                      />
                    )}
                    {item.caption && <figcaption>{item.caption}</figcaption>}
                  </figure>
                ))
              : [
                  "Property Preview",
                  "Retreat Details",
                  "Around the Retreat",
                ].map((label, index) => (
                  <div
                    className={`gallery-tile gallery-tile-${index}`}
                    key={label}
                  >
                    <ContentImage label={label} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="home-section section-soft">
        <div className="container">
          <div className="section-heading centered">
            <div>
              <p className="eyebrow">Key Details</p>
              <h2>Essential Retreat Information</h2>
            </div>
          </div>
          <div className="information-grid">
            <article className="information-card">
              <span className="icon-circle">
                <Icon name="pet" />
              </span>
              <h3>Pet Information</h3>
              <p>
                {about?.petInformation ||
                  "Pet policies will be available soon."}
              </p>
              {about?.petRules?.length ? (
                <Link className="text-link" href="/about">
                  Read Pet Rules
                  <Icon name="arrow" />
                </Link>
              ) : null}
            </article>
            <article className="information-card">
              <span className="icon-circle">
                <Icon name="groups" />
              </span>
              <h3>Day & Evening Visits</h3>
              <p>
                {home?.dayCapacity != null
                  ? `Confirmed capacity: ${home.dayCapacity} guests.`
                  : "Capacity details will be available soon."}
              </p>
            </article>
            <article className="information-card">
              <span className="icon-circle">
                <Icon name="bed" />
              </span>
              <h3>Overnight Stays</h3>
              <p>
                {home?.overnightCapacity != null
                  ? `Confirmed capacity: ${home.overnightCapacity} guests.`
                  : "Capacity details will be available soon."}
              </p>
            </article>
          </div>
          {home?.highlights?.length ? (
            <ul className="highlight-list">
              {home.highlights.map((highlight) => (
                <li key={highlight}>
                  <Icon name="leaf" />
                  {highlight}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <SectionHeading
            eyebrow="Guest Stories"
            title="Words From Our Guests"
          />
          {reviews.length > 0 ? (
            <div className="review-grid">
              {reviews.slice(0, 3).map((review) => (
                <figure className="review-card" key={review._id}>
                  <Icon name="quote" className="quote-icon" />
                  {review.rating != null && (
                    <div
                      className="review-stars"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: review.rating }, (_, i) => (
                        <Icon key={i} name="star" />
                      ))}
                    </div>
                  )}
                  <blockquote>{review.review}</blockquote>
                  <figcaption>
                    <span className="guest-initial" aria-hidden="true">
                      {review.guestName?.charAt(0)}
                    </span>
                    <span>
                      {review.guestName}
                      {review.sourceUrl && (
                        <a href={review.sourceUrl}>
                          Read original review
                          <Icon name="arrow" />
                        </a>
                      )}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="review-empty">
              <Icon name="quote" />
              <p>Guest reviews will appear here once approved.</p>
            </div>
          )}
        </div>
      </section>

      <section className="home-section section-location">
        <div className="container">
          <SectionHeading
            eyebrow="Access & Enquiries"
            title="Location & Telephone Booking"
          />
          <div className="location-grid">
            <div className="location-card">
              <div>
                <p className="eyebrow">
                  <Icon name="pin" />
                  Find the Retreat
                </p>
                <h3>{settings?.siteName || "The Glamp Retreat"}</h3>
                {settings?.address ? (
                  <address>{settings.address}</address>
                ) : (
                  <p className="muted">
                    Property address will be available soon.
                  </p>
                )}
              </div>
              <div className="directions-panel">
                <Icon name="pin" />
                {settings?.directionsUrl ? (
                  <a
                    className="button button-light"
                    href={settings.directionsUrl}
                  >
                    Get Directions
                    <Icon name="arrow" />
                  </a>
                ) : (
                  <span>Directions coming soon</span>
                )}
              </div>
            </div>
            <BookingContacts settings={settings} />
          </div>
        </div>
      </section>
      {process.env.NODE_ENV === "development" && !home && (
        <aside className="development-note container">
          Development preview: publish verified Home page content and imagery in
          Sanity to populate this design.
        </aside>
      )}
    </div>
  );
}
