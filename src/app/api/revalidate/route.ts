import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
const types = new Set([
  "siteSettings",
  "homePage",
  "package",
  "amenity",
  "galleryItem",
  "testimonial",
  "aboutPage",
  "policyPage",
]);
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  try {
    const { body, isValidSignature } = await parseBody<{ _type?: string }>(
      request,
      secret,
    );
    if (!isValidSignature)
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    if (!body?._type || !types.has(body._type))
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 },
      );
    revalidateTag(`sanity:${body._type}`, { expire: 0 });
    if (body._type === "package" || body._type === "galleryItem")
      revalidateTag("sanity:homePage", { expire: 0 });
    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
