"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import type { AccessibleImage } from "@/lib/sanity/types";
import { imageUrl } from "@/lib/sanity/image";
import { telephone } from "@/lib/sanity/content";
import { Icon } from "./icon";
const links = [
  ["/", "Home"],
  ["/about", "About Us"],
  ["/gallery", "Gallery"],
  ["/amenities", "Amenities"],
  ["/packages", "Packages"],
  ["/contact", "Contact Us"],
];
export function Header({
  siteName,
  logo,
  phone,
}: {
  siteName: string;
  logo: AccessibleImage | null;
  phone: string | null;
}) {
  const pathname = usePathname(),
    [menuPath, setMenuPath] = useState<string | null>(null),
    toggle = useRef<HTMLButtonElement>(null),
    navigation = useRef<HTMLElement>(null);
  const open = menuPath === pathname,
    logoSrc = logo?.asset && logo.alt ? imageUrl(logo, 160) : null;
  return (
    <header className="header">
      <div
        className="container header-inner"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setMenuPath(null);
            toggle.current?.focus();
          }
        }}
      >
        <Link href="/" className="brand" onClick={() => setMenuPath(null)}>
          {logoSrc && logo?.alt && (
            <Image
              src={logoSrc}
              alt={logo.alt}
              width={40}
              height={40}
              className="brand-logo"
            />
          )}
          <span>{siteName}</span>
        </Link>
        <nav
          ref={navigation}
          id="main-navigation"
          aria-label="Main navigation"
          className="nav"
          data-open={open}
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setMenuPath(null)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {phone && (
            <a className="button header-call" href={telephone(phone)}>
              <Icon name="phone" />
              <span>Call Us</span>
            </a>
          )}
          <button
            ref={toggle}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => {
              setMenuPath(open ? null : pathname);
              if (!open)
                requestAnimationFrame(() =>
                  navigation.current
                    ?.querySelector<HTMLAnchorElement>("a")
                    ?.focus(),
                );
            }}
          >
            <Icon name={open ? "close" : "menu"} />
            <span>{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
