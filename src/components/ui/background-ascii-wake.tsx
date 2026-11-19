"use client";

// From 21st.dev: "Background ASCII Wake" by nikolas-sapa.
// Changes for this site: the pointer is tracked on the parent element (so content
// layered above the canvas still drives the wake), the glyph font follows Geist Mono,
// and the loop pauses while the hero is off screen.
import { useEffect, useRef } from "react";

const RAMP = " .:-=+*#%@";

export interface WakeGlyphProps {
  /** grid cell size in px */
  cellSize?: number;
  className?: string;
}

// deterministic PRNG so the ambient scatter is stable within a session
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function WakeGlyph({ cellSize = 12, className = "" }: WakeGlyphProps) {
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
    let heat = new Float32Array(0);
    let rate = new Float32Array(0);
    let ambient = new Float32Array(0);
    let raf = 0;
    let last = 0;
    let visible = true;
    const pointer = { x: -1, y: -1, t: 0, has: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${cellSize * 0.85}px ${monoFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      cols = Math.max(1, Math.ceil(width / cellSize));
      rows = Math.max(1, Math.ceil(height / cellSize));
      const n = cols * rows;
      heat = new Float32Array(n);
      rate = new Float32Array(n).fill(1.4);
      ambient = new Float32Array(n);
      const rand = mulberry32(0xa53f9c1 ^ (cols * 71 + rows));
      for (let i = 0; i < n; i++) {
        if (rand() < 0.035) ambient[i] = 0.08 + rand() * 0.14;
      }
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = fg;
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const idx = gy * cols + gx;
          const lum = Math.max(ambient[idx]!, heat[idx]!);
          if (lum <= 0.03) continue;
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(lum * (RAMP.length - 1)))];
          if (ch === " ") continue;
          ctx.globalAlpha = Math.min(1, 0.15 + lum * 0.85);
          ctx.fillText(ch!, gx * cellSize + cellSize / 2, gy * cellSize + cellSize / 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    const stamp = (px: number, py: number, radiusCells: number, decayRate: number) => {
      const cx = px / cellSize;
      const cy = py / cellSize;
      const r = Math.max(0.6, radiusCells);
      const minGx = Math.max(0, Math.floor(cx - r));
      const maxGx = Math.min(cols - 1, Math.ceil(cx + r));
      const minGy = Math.max(0, Math.floor(cy - r));
      const maxGy = Math.min(rows - 1, Math.ceil(cy + r));
      for (let gy = minGy; gy <= maxGy; gy++) {
        for (let gx = minGx; gx <= maxGx; gx++) {
          const d = Math.hypot(gx + 0.5 - cx, gy + 0.5 - cy);
          if (d > r) continue;
          const falloff = 1 - d / r;
          const idx = gy * cols + gx;
          if (falloff > heat[idx]!) {
            heat[idx] = falloff;
            rate[idx] = decayRate;
          }
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      if (pointer.has) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const dist = Math.hypot(dx, dy);
        const speed = dist / Math.max(1, now - pointer.t);
        const radiusCells = Math.max(0.6, Math.min(2.6, 2.4 / (1 + speed * 1.6)));
        const decayRate = Math.max(0.8, Math.min(4.5, 1.0 + speed * 3.2));
        const steps = Math.max(1, Math.ceil(dist / (cellSize * 0.5)));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          stamp(pointer.x + dx * t, pointer.y + dy * t, radiusCells, decayRate);
        }
      } else {
        stamp(x, y, 1.4, 1.4);
      }
      pointer.x = x;
      pointer.y = y;
      pointer.t = now;
      pointer.has = true;
    };

    const onPointerLeave = () => {
      pointer.has = false;
    };

    const loop = (now: number) => {
      const dt = last ? Math.min(64, now - last) / 1000 : 1 / 60;
      last = now;
      for (let i = 0; i < heat.length; i++) {
        if (heat[i]! > 0) {
          heat[i]! -= rate[i]! * dt;
          if (heat[i]! < 0) heat[i] = 0;
        }
      }
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    resize();
    let io: IntersectionObserver | null = null;
    if (reduced) {
      draw();
    } else {
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
      raf = requestAnimationFrame(loop);
      io = new IntersectionObserver(([entry]) => {
        const next = !!entry?.isIntersecting;
        if (next && !visible) {
          last = 0;
          raf = requestAnimationFrame(loop);
        }
        visible = next;
      });
      io.observe(canvas);
    }

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeTimer = null;
        resize();
        if (reduced) draw();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    // the theme toggle flips a `.dark` class on <html>; follow it without a remount
    const themeObserver = new MutationObserver(() => {
      fg = getComputedStyle(canvas).color;
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      io?.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [cellSize]);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full text-foreground ${className}`} />;
}

export default WakeGlyph;
