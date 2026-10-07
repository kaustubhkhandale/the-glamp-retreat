import type { SETTINGS_QUERY_RESULT } from "@/lib/sanity/types";
import { telephone, whatsappUrl } from "@/lib/sanity/content";
import { Icon } from "./icon";
export function BookingContacts({
  settings,
}: {
  settings: SETTINGS_QUERY_RESULT;
}) {
  const desks = [
    {
      title: "Office & General Booking Desk",
      label: "Telephone enquiries",
      contacts: settings?.officeContacts,
    },
    {
      title: "Corporate & Group Events Desk",
      label: "Group enquiries",
      contacts: settings?.corporateContacts,
    },
  ];
  const whatsapp = whatsappUrl(settings?.whatsapp);
  return (
    <div className="booking-desks">
      {desks.map((desk) => (
        <section className="booking-card" key={desk.title}>
          <div className="booking-heading">
            <div>
              <p className="eyebrow">{desk.label}</p>
              <h3>{desk.title}</h3>
            </div>
            <Icon name="phone" />
          </div>
          {desk.contacts?.some((contact) => contact.phone) ? (
            desk.contacts.map(
              (contact) =>
                contact.phone && (
                  <a
                    className="button"
                    href={telephone(contact.phone)}
                    key={contact.phone}
                  >
                    <Icon name="phone" />
                    <span>
                      {contact.name && <small>{contact.name}</small>}
                      {contact.phone}
                    </span>
                  </a>
                ),
            )
          ) : (
            <p className="muted">Contact details will be available soon.</p>
          )}
        </section>
      ))}
      {whatsapp && (
        <a href={whatsapp} className="text-link">
          Contact us on WhatsApp
          <Icon name="arrow" />
        </a>
      )}
    </div>
  );
}
