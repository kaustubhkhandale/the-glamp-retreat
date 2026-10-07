import { Policy } from "@/components/policy";
import { routeMetadata } from "@/lib/metadata";
export const metadata = routeMetadata("Booking terms", "/booking-terms");
export default function Terms() {
  return <Policy slug="booking-terms" title="Booking Terms" />;
}
