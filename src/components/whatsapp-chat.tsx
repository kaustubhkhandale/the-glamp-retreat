import { whatsappUrl } from "@/lib/sanity/content";
import { Icon } from "./icon";

export function WhatsAppChat({ phone }: { phone?: string | null }) {
  const url = whatsappUrl(phone);
  if (!url) return null;
  return (
    <a className="whatsapp-chat" href={`${url}?text=${encodeURIComponent("Hello! I'd like to enquire about The Glamp Retreat.")}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with The Glamp Retreat on WhatsApp (opens in a new tab)">
      <Icon name="chat" />
      <span>Chat on WhatsApp</span>
    </a>
  );
}
