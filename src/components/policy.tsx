import { PolicyView } from "./pages/policy-view";
import { sanityFetch } from "@/lib/sanity/client";
import { POLICY_QUERY } from "@/lib/sanity/queries";
import type { POLICY_QUERY_RESULT } from "@/lib/sanity/types";
export async function Policy({ slug, title }: { slug: string; title: string }) {
  const data = await sanityFetch<POLICY_QUERY_RESULT>(
    POLICY_QUERY,
    "policyPage",
    { slug },
  );
  return <PolicyView data={data} title={title} slug={slug} />;
}
