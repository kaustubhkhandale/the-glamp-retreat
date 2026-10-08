import { propertyLocation } from "@/lib/location";
import { Icon } from "./icon";

export function LocationMap({ address, directionsUrl }: { address?: string | null; directionsUrl?: string | null }) {
  const location = propertyLocation(address, directionsUrl);
  return (
    <div className="location-map">
      <iframe
        src={location.mapUrl}
        title="Google Map showing The Glamp Retreat location"
        width="600"
        height="350"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <a className="button" href={location.directionsUrl} target="_blank" rel="noopener noreferrer">
        Get Directions <Icon name="arrow" />
      </a>
    </div>
  );
}
