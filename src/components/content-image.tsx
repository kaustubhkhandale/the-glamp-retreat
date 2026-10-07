import Image from "next/image";
import type { AccessibleImage } from "@/lib/sanity/types";
import { imageUrl } from "@/lib/sanity/image";
import { Icon } from "./icon";

export function ContentImage({
  image,
  label,
  className = "",
  sizes = "(max-width: 767px) 100vw, 50vw",
  priority = false,
}: {
  image?: AccessibleImage | null;
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = image?.asset && image.alt ? imageUrl(image, 1800) : null;
  return (
    <div className={`content-image ${className}`}>
      {src && image?.alt ? (
        <Image
          src={src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{
            objectPosition: `${(image.hotspot?.x ?? 0.5) * 100}% ${(image.hotspot?.y ?? 0.5) * 100}%`,
          }}
        />
      ) : (
        <div className="image-empty">
          <Icon name="image" />
          <span>{label}</span>
          <small>Photography coming soon</small>
        </div>
      )}
    </div>
  );
}
