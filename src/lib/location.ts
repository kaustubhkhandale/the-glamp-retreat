// Property location supplied and approved by the owner in this session.
// Published Site settings can override it later; no CMS content is seeded.
export const PROPERTY_ADDRESS =
  "The Glamp Retreat, 4MQM+GW2, Kondhali, Hardoli, Maharashtra 441103";

export function propertyLocation(address?: string | null, directionsUrl?: string | null) {
  const location = address?.trim() || PROPERTY_ADDRESS;
  return {
    address: location,
    mapUrl: `https://www.google.com/maps?${new URLSearchParams({ q: location, output: "embed" })}`,
    directionsUrl: directionsUrl || `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", destination: location })}`,
  };
}
