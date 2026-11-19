"use client";

// From 21st.dev: "Background ASCII Dither" by nikolas-sapa.
// Changes for this site: the pointer is tracked on the parent element (content sits above the
// canvas), the glyph font follows Geist Mono, and the loop pauses while off screen.
import { useEffect, useRef } from "react";

const ASCII_RAMP = " .:-=+*#%@";
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

type Mode = "ascii" | "dither" | "dot";

function noise(x: number, y: number, t: number): number {
  const v =
    Math.sin(x * 1.7 + t * 0.6) +
    Math.sin(y * 2.3 - t * 0.4) +
    Math.sin((x + y) * 1.1 + t * 0.25) +
    Math.sin(Math.hypot(x - 6, y - 4) * 1.9 - t * 0.7);
  return v / 8 + 0.5;
}

export function AsciiDitherMedia({
  mode = "ascii",
  cellSize = 14,
  cursorRadius = 140,
  speed = 1,
  className = "",
}: {
  mode?: Mode;
  cellSize?: number;
  cursorRadius?: number;
  /** multiplier on how fast the field flows */
  speed?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const host: HTMLElement = canvas.parentElement ?? canvas;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fg = getComputedStyle(canvas).color;
    const monoFont =
      getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() ||
      "ui-monospace, monospace";

    let cols = 0;
    let rows = 0;
    const cursor = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };
    let raf = 0;
    let t = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      cols = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${cellSize * 0.85}px ${monoFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = null;
        resize();
        if (reduced) draw();
      }, 150);
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = fg;
      cursor.x += (cursor.tx - cursor.x) * 0.12;
      cursor.y += (cursor.ty - cursor.y) * 0.12;
      const r2 = cursorRadius * cursorRadius;

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let lum = Math.pow(noise(gx * 0.35 + t * 0.22, gy * 0.35, t), 1.7);
          const px = gx * cellSize + cellSize / 2;
          const py = gy * cellSize + cellSize / 2;
          const dx = px - cursor.x;
          const dy = py - cursor.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 * 4) lum = Math.min(1, lum + Math.exp(-d2 / r2) * 0.7);

          if (mode === "ascii") {
            const ch = ASCII_RAMP[Math.floor(lum * (ASCII_RAMP.length - 1))]!;
            if (ch !== " ") {
              ctx.globalAlpha = 0.25 + lum * 0.75;
              ctx.fillText(ch, px, py);
            }
          } else if (mode === "dither") {
            if (lum > BAYER[(gy % 4) * 4 + (gx % 4)]!) {
              ctx.globalAlpha = 0.9;
              ctx.fillRect(px - 1, py - 1, 2, 2);
            }
          } else {
            const rad = (lum * cellSize) / 2.4;
            if (rad > 0.4) {
              ctx.globalAlpha = 0.3 + lum * 0.7;
              ctx.beginPath();
              ctx.arc(px, py, rad, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      t += 0.028 * speed;
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.tx = e.clientX - rect.left;
      cursor.ty = e.clientY - rect.top;
    };
    const onLeave = () => {
      cursor.tx = -1e4;
      cursor.ty = -1e4;
    };

    const mo = new MutationObserver(() => {
      fg = getComputedStyle(canvas).color;
      if (reduced) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    resize();
    window.addEventListener("resize", onResize);
    let io: IntersectionObserver | null = null;
    if (reduced) {
      draw();
    } else {
      host.addEventListener("pointermove", onPointer);
      host.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
      io = new IntersectionObserver(([entry]) => {
        const next = !!entry?.isIntersecting;
        if (next && !visible) raf = requestAnimationFrame(loop);
        visible = next;
      });
      io.observe(canvas);
    }
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      io?.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [mode, cellSize, cursorRadius, speed]);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />;
}

export default AsciiDitherMedia;
