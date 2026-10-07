"use client";
import { useEffect, useRef, useState } from "react";
import type { GALLERY_QUERY_RESULT } from "@/lib/sanity/types";
import { imageUrl } from "@/lib/sanity/image";
import { ContentImage } from "./content-image";
import { EmptyPanel } from "./page-elements";
import { Icon } from "./icon";
export function GalleryBrowser({ items }: { items: GALLERY_QUERY_RESULT }) {
  const [category, setCategory] = useState("All"),
    [selected, setSelected] = useState<GALLERY_QUERY_RESULT[number] | null>(
      null,
    );
  const dialog = useRef<HTMLDialogElement>(null);
  const categories = [
    "All",
    ...new Set(items.map((item) => item.category || "Other")),
  ];
  const filtered =
    category === "All"
      ? items
      : items.filter((item) => (item.category || "Other") === category);
  const photos = filtered.filter(
    (item) => item.kind === "photo" && item.photo?.asset && item.photo.alt,
  );
  const selectedIndex = photos.findIndex((item) => item._id === selected?._id);
  useEffect(() => {
    const element = dialog.current;
    if (selected && element && !element.open) element.showModal();
    else if (!selected && element?.open) element.close();
  }, [selected]);
  function move(direction: number) {
    if (photos.length > 1 && selectedIndex >= 0)
      setSelected(
        photos[(selectedIndex + direction + photos.length) % photos.length],
      );
  }
  return (
    <>
      {items.length > 0 ? (
        <>
          <div className="gallery-toolbar">
            <div
              className="gallery-filters"
              role="group"
              aria-label="Filter gallery by category"
            >
              {categories.map((value) => (
                <button
                  key={value}
                  className="filter-button"
                  aria-pressed={value === category}
                  onClick={() => setCategory(value)}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="gallery-count" role="status" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "moment" : "moments"}
            </p>
          </div>
          <div className="gallery-directory">
            {filtered.map((item, index) => (
              <figure
                className={`gallery-entry ${index % 5 === 0 ? "gallery-entry-wide" : ""}`}
                key={item._id}
              >
                {item.kind === "photo" ? (
                  item.photo?.asset && item.photo.alt ? (
                    <button
                      className="gallery-photo-button"
                      onClick={() => setSelected(item)}
                      aria-label={`View photo: ${item.caption || item.photo.alt}`}
                    >
                      <ContentImage
                        image={item.photo}
                        label={item.caption || "Retreat photo"}
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 66vw"
                      />
                      <span className="photo-open">
                        <Icon name="image" />
                        View Photo
                      </span>
                    </button>
                  ) : (
                    <ContentImage image={item.photo} label="Retreat photo" />
                  )
                ) : item.videoFileUrl ? (
                  <video
                    className="gallery-file"
                    controls
                    preload="none"
                    aria-label={item.caption || "Property video"}
                    poster={
                      item.poster
                        ? imageUrl(item.poster) || undefined
                        : undefined
                    }
                  >
                    <source src={item.videoFileUrl} />
                    <a href={item.videoFileUrl}>Watch video</a>
                  </video>
                ) : item.videoUrl ? (
                  <a className="gallery-video-link" href={item.videoUrl}>
                    <ContentImage
                      image={item.poster}
                      label={item.caption || "Property video"}
                    />
                    <span>
                      <span className="play-button">
                        <Icon name="play" />
                      </span>
                      Watch Video
                    </span>
                  </a>
                ) : (
                  <ContentImage image={item.poster} label="Property video" />
                )}
                <figcaption>
                  <span className="eyebrow">
                    {item.category || "The Retreat"}
                  </span>
                  {item.caption && <p>{item.caption}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      ) : (
        <div className="gallery-empty-layout">
          <ContentImage label="The Property Gallery" />
          <EmptyPanel title="More moments coming soon" icon="image">
            Photos and videos of the retreat will be shared here.
          </EmptyPanel>
        </div>
      )}
      <dialog
        ref={dialog}
        className="gallery-lightbox"
        aria-labelledby="gallery-lightbox-title"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") move(1);
          if (event.key === "ArrowLeft") move(-1);
        }}
      >
        {selected && (
          <div className="lightbox-inner">
            <div className="lightbox-heading">
              <h2 id="gallery-lightbox-title">
                {selected.caption ||
                  selected.photo?.alt ||
                  "Retreat photograph"}
              </h2>
              <button
                className="lightbox-close"
                autoFocus
                onClick={() => setSelected(null)}
                aria-label="Close photo"
              >
                <Icon name="close" />
              </button>
            </div>
            <ContentImage
              image={selected.photo}
              label="Retreat photograph"
              className="lightbox-image"
              sizes="90vw"
            />
            {photos.length > 1 && (
              <div className="lightbox-controls">
                <button onClick={() => move(-1)} aria-label="Previous photo">
                  <Icon name="arrow" className="arrow-back" />
                  Previous
                </button>
                <p aria-live="polite">
                  {selectedIndex + 1} / {photos.length}
                </p>
                <button onClick={() => move(1)} aria-label="Next photo">
                  Next
                  <Icon name="arrow" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
