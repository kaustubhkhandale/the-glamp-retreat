import { Policy } from "@/components/policy";
import { routeMetadata } from "@/lib/metadata";
export const metadata = routeMetadata("Privacy", "/privacy");
export default function Privacy() {
  return <Policy slug="privacy" title="Privacy Policy" />;
}
