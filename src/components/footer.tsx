import Link from "next/link";
import type { SETTINGS_QUERY_RESULT } from "@/lib/sanity/types";
import { telephone, whatsappUrl } from "@/lib/sanity/content";
import { Icon } from "./icon";
export function Footer({ settings }: { settings: SETTINGS_QUERY_RESULT }) {
  const whatsapp = whatsappUrl(settings?.whatsapp);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" href="/">
              {settings?.siteName || "The Glamp Retreat"}
            </Link>
            {settings?.shortDescription && <p>{settings.shortDescription}</p>}
            {settings?.address && (
              <p className="footer-address">
                <Icon name="pin" />
                {settings.address}
              </p>
            )}
          </div>
          <nav aria-label="Footer navigation">
            <h2 className="footer-heading">Navigation</h2>
            <ul>
              {[
                ["/", "Home"],
                ["/about", "About Us"],
                ["/gallery", "Gallery"],
                ["/amenities", "Amenities"],
                ["/packages", "Packages"],
                ["/contact", "Contact Us"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="footer-heading">Telephone Booking</h2>
            {[
              { label: "Office Contacts", contacts: settings?.officeContacts },
              {
                label: "Corporate & Groups",
                contacts: settings?.corporateContacts,
              },
            ].map((desk) => (
              <div className="footer-contact" key={desk.label}>
                <p className="eyebrow">{desk.label}</p>
                {desk.contacts?.some((contact) => contact.phone) ? (
                  desk.contacts.map(
                    (contact) =>
                      contact.phone && (
                        <a key={contact.phone} href={telephone(contact.phone)}>
                          <Icon name="phone" />
                          <span>
                            {contact.name && <small>{contact.name}</small>}
                            {contact.phone}
                          </span>
                        </a>
                      ),
                  )
                ) : (
                  <p>Contact details coming soon.</p>
                )}
              </div>
            ))}
          </div>
          <div>
            <h2 className="footer-heading">Connect</h2>
            <ul className="social-links">
              {settings?.socialLinks?.map(
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
              {whatsapp && (
                <li>
                  <a href={whatsapp}>
                    WhatsApp
                    <Icon name="arrow" />
                  </a>
                </li>
              )}
            </ul>
            <Link className="text-link" href="/contact">
              Contact the Retreat
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings?.siteName || "The Glamp Retreat"}. All rights reserved.
          </p>
          <nav className="footer-links" aria-label="Legal navigation">
            <Link href="/privacy">Privacy</Link>
            <Link href="/booking-terms">Booking Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
