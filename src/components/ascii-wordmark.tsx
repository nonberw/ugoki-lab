"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Glyph ramp shared with the background, so the wordmark looks cut from the same field.
const NOISE = ".:-=+*#%@ugoki";

type Props = {
  lines: string[];
  label: string;
  className?: string;
};

/**
 * Figlet wordmark that decodes itself from noise, column by column, on load,
 * and briefly re-scrambles when hovered. Writes straight to the DOM in a rAF loop
 * (no React state per frame). Reduced motion shows the final art at once.
 */
export function AsciiWordmark({ lines, label, className }: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const width = Math.max(...lines.map((l) => l.length));
  const final = lines.map((l) => l.padEnd(width, " "));

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const target = final.join("\n");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pre.textContent = target;
      return;
    }

    let raf = 0;
    const rand = () => NOISE[Math.floor(Math.random() * NOISE.length)]!;

    const run = (duration: number) => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        // a soft front: columns left of `edge` are settled, a band after it shimmers
        const edge = p * (width + 14) - 14;
        const out = final
          .map((row) =>
            Array.from(row, (ch, x) => {
              if (x < edge) return ch;
              if (ch === " ") return Math.random() < 0.035 * (1 - p) ? rand() : " ";
              return x < edge + 14 ? rand() : Math.random() < 0.5 ? rand() : " ";
            }).join(""),
          )
          .join("\n");
        pre.textContent = out;
        if (p < 1) raf = requestAnimationFrame(tick);
        else pre.textContent = target;
      };
      raf = requestAnimationFrame(tick);
    };

    run(1600);
    let busy = false;
    const onEnter = () => {
      if (busy) return;
      busy = true;
      run(700);
      window.setTimeout(() => (busy = false), 900);
    };
    pre.addEventListener("pointerenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      pre.removeEventListener("pointerenter", onEnter);
    };
    // `final` is derived from `lines`; re-run only when the art changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  return (
    <div role="img" aria-label={label} className={cn("select-none", className)}>
      <pre
        ref={preRef}
        aria-hidden="true"
        className="m-0 font-mono leading-[1.05] whitespace-pre text-foreground"
        suppressHydrationWarning
      >
        {final.join("\n")}
      </pre>
    </div>
  );
}
