import Link from "next/link";
import type { SETTINGS_QUERY_RESULT } from "@/lib/sanity/types";
import { PageHeader } from "../page-elements";
import { BookingContacts } from "../booking-contacts";
import { Icon } from "../icon";
import { LocationMap } from "../location-map";
import { propertyLocation } from "@/lib/location";
import { ContactForm } from "../contact-form";
export function ContactView({ settings }: { settings: SETTINGS_QUERY_RESULT }) {
  return (
    <>
      <PageHeader
        eyebrow="Let's Plan Your Visit"
        title="Contact the Retreat"
        crumb="Contact Us"
        intro="For package information, visiting details, or group enquiries, call our team or send an enquiry using the form below."
      />
      <section className="home-section">
        <div className="container contact-layout">
          <div className="contact-location">
            <p className="eyebrow">Find Us</p>
            <h2>{settings?.siteName || "The Glamp Retreat"}</h2>
            <address>{propertyLocation(settings?.address).address}</address>
            <LocationMap address={settings?.address} directionsUrl={settings?.directionsUrl} />
          </div>
          <div>
            <p className="eyebrow">Get in Touch</p>
            <h2 className="contact-desk-title">Telephone Enquiries</h2>
            <BookingContacts settings={settings} />
          </div>
        </div>
      </section>
      <section className="home-section section-soft">
        <div className="container">
          <ContactForm phone={settings?.whatsapp} />
        </div>
      </section>
      <section className="home-section">
        <div className="container contact-bottom-grid">
          <div>
            <p className="eyebrow">Stay Connected</p>
            <h2>More From the Retreat</h2>
            {settings?.socialLinks?.some((link) => link.url) ? (
              <ul className="contact-socials">
                {settings.socialLinks.map(
                  (link) =>
                    link.url && (
                      <li key={link.url}>
                        <a href={link.url}>
                          {link.label || "Social profile"}
                          <Icon name="arrow" />
                        </a>
                      </li>
                    ),
                )}
              </ul>
            ) : (
              <p className="muted">Social links will be available soon.</p>
            )}
          </div>
          <div className="contact-help-card">
            <p className="eyebrow">Useful Information</p>
            <h3>Before Your Visit</h3>
            <Link className="resource-link" href="/packages">
              Explore Packages
              <Icon name="arrow" />
            </Link>
            <Link className="resource-link" href="/booking-terms">
              Read Booking Terms
              <Icon name="arrow" />
            </Link>
            <Link className="resource-link" href="/privacy">
              Privacy Policy
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
