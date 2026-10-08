"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { whatsappUrl } from "@/lib/sanity/content";
import { Icon } from "./icon";

export function ContactForm({ phone }: { phone?: string | null }) {
  const [status, setStatus] = useState("");
  const url = whatsappUrl(phone);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url) return;
    const data = new FormData(event.currentTarget);
    const message = [
      "Hello! I'd like to enquire about The Glamp Retreat.",
      `Name: ${String(data.get("name")).trim()}`,
      `Email: ${String(data.get("email")).trim()}`,
      `Phone: ${String(data.get("phone")).trim()}`,
      `Enquiry: ${String(data.get("message")).trim()}`,
    ].join("\n");
    window.open(`${url}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setStatus("Your enquiry is ready in WhatsApp. Press Send there to share it with our team. If WhatsApp did not open, allow pop-ups and try again.");
  }

  return (
    <div className="contact-form-card">
      <p className="eyebrow">Plan Your Escape</p>
      <h2 id="contact-form-heading">Send an Enquiry</h2>
      <p className="muted">Tell us about your visit. We’ll open WhatsApp with your details ready to send.</p>
      <form className="contact-form" onSubmit={submit} aria-labelledby="contact-form-heading">
        <div className="contact-form-fields">
          <label htmlFor="contact-name">Full name<input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="Your name" pattern=".*\S.*" /></label>
          <label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
          <label htmlFor="contact-phone">Phone number<input id="contact-phone" name="phone" type="tel" autoComplete="tel" required maxLength={30} pattern="[+0-9() .-]{7,30}" title="Enter a phone number with at least 7 characters, using digits, spaces, +, brackets or dashes." placeholder="Your phone number" /></label>
        </div>
        <label htmlFor="contact-message">Your enquiry<textarea id="contact-message" name="message" rows={5} required maxLength={2000} placeholder="Tell us about your preferred dates, group size, or any questions." /></label>
        <p className="contact-form-note">Your details are shared with our team only when you send the message in WhatsApp. Read our <Link href="/privacy">Privacy Policy</Link>.</p>
        <button className="button" type="submit" disabled={!url}>Continue to WhatsApp<Icon name="arrow" /></button>
        {!url && <p className="muted">WhatsApp enquiries are currently unavailable. Please use the telephone contacts above.</p>}
        <p role="status" className="contact-form-status">{status}</p>
      </form>
    </div>
  );
}
