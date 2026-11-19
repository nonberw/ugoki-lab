"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** path without extension: `${src}.mp4` and `${src}.jpg` must both exist */
  src: string;
  alt: string;
  className?: string;
};

/**
 * A short looping robot clip. Plays only while on screen; with reduced motion
 * it stays on its poster frame.
 */
export function Clip({ src, alt, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      poster={`${src}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
    >
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  );
}
