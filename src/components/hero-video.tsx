"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo({ src }: { src: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  if (!enabled || failed) return null;

  return (
    <>
      <video
        ref={video}
        className={`hero-video${hasFrame ? " is-playing" : ""}`}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          setHasFrame(true);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        className="hero-video-toggle"
        onClick={() => {
          if (playing) video.current?.pause();
          else video.current?.play().catch(() => setFailed(true));
        }}
      >
        {playing ? "Pause background video" : "Play background video"}
      </button>
    </>
  );
}
