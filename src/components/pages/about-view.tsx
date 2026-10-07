import Link from "next/link";
import type { ABOUT_QUERY_RESULT } from "@/lib/sanity/types";
import {
  PageHeader,
  EmptyPanel,
  ExploreBand,
  ContentList,
} from "../page-elements";
import { SectionHeading } from "../section-heading";
import { ContentImage } from "../content-image";
import { Icon } from "../icon";
export function AboutView({ data }: { data: ABOUT_QUERY_RESULT }) {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="About The Glamp Retreat"
        crumb="About Us"
        intro="A closer look at the retreat, the occasions we host, and the details that help you plan your visit."
        image={data?.images?.[0]}
        visual
      />
      <section className="home-section">
        <div className="container editorial-grid">
          <div>
            <p className="eyebrow">The Retreat</p>
            <h2>Our Story</h2>
            <Link href="/gallery" className="text-link">
              Explore the Gallery
              <Icon name="arrow" />
            </Link>
          </div>
          <div className="body-copy">
            {data?.story ? (
              <p>{data.story}</p>
            ) : (
              <EmptyPanel title="Our story is coming soon">
                We will share more about The Glamp Retreat here.
              </EmptyPanel>
            )}
          </div>
        </div>
      </section>
      {data?.images && data.images.length > 1 && (
        <section className="home-section section-soft">
          <div className="container">
            <SectionHeading
              eyebrow="A Closer Look"
              title="Around the Retreat"
            />
            <div className="about-photo-grid">
              {data.images.slice(1).map((image, index) => (
                <figure key={image._key || index}>
                  <ContentImage
                    image={image}
                    label="The Glamp Retreat"
                    sizes="(max-width: 767px) 100vw, 50vw"
                  />
                  {image.caption && <figcaption>{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="home-section section-soft">
        <div className="container editorial-grid">
          <div>
            <p className="eyebrow">Visiting Together</p>
            <h2>Pet Information</h2>
            <span className="large-outline-icon">
              <Icon name="pet" />
            </span>
          </div>
          <div className="content-paper">
            {data?.petInformation ? (
              <p className="body-copy">{data.petInformation}</p>
            ) : (
              <p className="muted">
                Pet policies and visiting information will be available soon.
              </p>
            )}
            {data?.petRules?.length ? (
              <>
                <h3>Visiting with Pets</h3>
                <ContentList items={data.petRules} />
              </>
            ) : null}
          </div>
        </div>
      </section>
      <section className="home-section">
        <div className="container">
          <SectionHeading eyebrow="Gatherings" title="Make It an Occasion" />
          {data?.occasions?.length ? (
            <ul className="occasion-directory">
              {data.occasions.map((occasion, index) => (
                <li key={`${index}-${occasion}`}>
                  <span className="occasion-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{occasion}</h3>
                  <Icon name="leaf" />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyPanel icon="groups" title="Occasion details coming soon">
              For group enquiries, visit our contact page.
            </EmptyPanel>
          )}
        </div>
      </section>
      <ExploreBand
        title="Get to Know the Retreat"
        href="/gallery"
        label="View Gallery"
      />
    </>
  );
}
