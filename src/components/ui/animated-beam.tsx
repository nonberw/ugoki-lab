"use client";

/*
 * From 21st.dev: "Klyv Animated Beam" by klyv-ui (MIT, Copyright (c) 2026 Klyv contributors).
 * Changes for this site: the theme stylesheet import is gone (the `beam-dash` keyframes live
 * in globals.css), colours default to the site's tokens, and `cn` comes from lib/utils.
 */
import { useEffect, useId, useState, type CSSProperties, type RefObject } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  beamColor?: string;
  beamLength?: number;
  paused?: boolean;
  className?: string;
}

interface Geometry {
  width: number;
  height: number;
  d: string;
  length: number;
}

function centreIn(container: DOMRect, node: DOMRect) {
  return { x: node.left - container.left + node.width / 2, y: node.top - container.top + node.height / 2 };
}

/** A curved connector between two real elements, with light pulsing along it. Re-measures on reflow. */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 60,
  reverse = false,
  duration = 3,
  delay = 0,
  pathColor = "var(--line)",
  pathWidth = 1.5,
  pathOpacity = 1,
  beamColor = "var(--accent)",
  beamLength = 46,
  paused = false,
  className,
}: AnimatedBeamProps) {
  const id = useId();
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (!container || !from || !to) return;

    const measure = () => {
      const box = container.getBoundingClientRect();
      const start = centreIn(box, from.getBoundingClientRect());
      const end = centreIn(box, to.getBoundingClientRect());
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const span = Math.hypot(dx, dy) || 1;
      const controlX = midX + (-dy / span) * curvature;
      const controlY = midY + (dx / span) * curvature;
      const d = `M ${start.x},${start.y} Q ${controlX},${controlY} ${end.x},${end.y}`;
      const legs = Math.hypot(controlX - start.x, controlY - start.y) + Math.hypot(end.x - controlX, end.y - controlY);
      setGeometry({ width: box.width, height: box.height, d, length: (span + legs) / 2 });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(from);
    observer.observe(to);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, fromRef, toRef, curvature]);

  if (!geometry) return null;

  const total = Math.round(geometry.length);
  const lap = total + beamLength;
  const travel = reverse ? lap : -lap;

  return (
    <svg
      aria-hidden="true"
      width={geometry.width}
      height={geometry.height}
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      fill="none"
      className={cn("pointer-events-none absolute top-0 left-0", className)}
    >
      <path d={geometry.d} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} strokeLinecap="round" />
      <defs>
        <linearGradient id={`beam-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={beamColor} stopOpacity="0" />
          <stop offset="50%" stopColor={beamColor} stopOpacity="1" />
          <stop offset="100%" stopColor={beamColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        className="motion-safe-only"
        d={geometry.d}
        stroke={`url(#beam-${id})`}
        strokeWidth={pathWidth + 1.25}
        strokeLinecap="round"
        strokeDasharray={`${beamLength} ${total}`}
        strokeDashoffset={0}
        style={
          {
            "--beam-travel": travel,
            animation: `beam-dash ${duration}s linear infinite`,
            animationDelay: `${delay}s`,
            animationPlayState: paused ? "paused" : "running",
          } as CSSProperties
        }
      />
    </svg>
  );
}

export default AnimatedBeam;
