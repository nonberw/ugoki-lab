"use client";

/*
 * From 21st.dev: "Segmented Control" by halaska-studio (Halaska UI, MIT).
 * Changes for this site: typed, styled with the site's CSS variables instead of the kit's
 * inline palette (so it follows the light/dark toggle), and the thumb respects reduced motion.
 * Behaviour is the original: a sliding thumb, radio semantics, arrow-key navigation.
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

export function SegmentedControl<T extends string>({ options, value, onChange, label, className }: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Partial<Record<T, HTMLButtonElement | null>>>({});
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  const update = useCallback(() => {
    const btn = btnRefs.current[value];
    const container = containerRef.current;
    if (!btn || !container) return;
    const c = container.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    setThumb({ left: b.left - c.left, width: b.width });
  }, [value]);

  useEffect(() => {
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = options.indexOf(value);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % options.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + options.length) % options.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = options.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const opt = options[next]!;
    onChange(opt);
    btnRefs.current[opt]?.focus();
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("relative flex items-center rounded-[10px] bg-foreground/[0.06] p-[3px]", className)}
    >
      {thumb && (
        <div
          aria-hidden="true"
          className="absolute top-[3px] h-[calc(100%-6px)] rounded-[8px] bg-surface shadow-[0_1px_3px_rgb(0_0_0/0.08)] transition-[left,width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none"
          style={{ left: thumb.left, width: thumb.width }}
        />
      )}
      {options.map((opt) => (
        <button
          key={opt}
          ref={(el) => {
            btnRefs.current[opt] = el;
          }}
          type="button"
          role="radio"
          aria-checked={value === opt}
          tabIndex={value === opt ? 0 : -1}
          onClick={() => onChange(opt)}
          className={cn(
            "relative z-[1] flex-1 rounded-[8px] px-3.5 py-1.5 text-[13px] whitespace-nowrap transition-colors",
            value === opt ? "font-medium text-foreground" : "text-muted hover:text-foreground",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;
