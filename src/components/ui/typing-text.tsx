"use client";

// From 21st.dev: "Typing Text" by hyperiux (built with Hyperiux Vault: https://vault.hyperiux.com).
// Changes for this site: it renders as a plain block (no full-screen section), font size is
// in px, colours come from the site's tokens, and only the sequential variant is kept.
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type TypingTextProps = {
  lines: string[];
  cursorColor?: string;
  fontSize?: number;
  lineHeight?: number;
  charactersPerSecond?: number;
  lineDelay?: number;
  startDelay?: number;
  className?: string;
};

type LineStyle = CSSProperties & Record<`--${string}`, string | number>;

export default function TypingText({
  lines,
  cursorColor = "var(--accent)",
  fontSize = 14,
  lineHeight = 1.7,
  charactersPerSecond = 60,
  lineDelay = 0.12,
  startDelay = 0.2,
  className = "",
}: TypingTextProps) {
  const [reduced, setReduced] = useState(false);
  // Each line starts when the previous one finishes, plus a short pause.
  const prepared = useMemo(() => {
    const out: { text: string; chars: number; duration: number; delay: number }[] = [];
    let at = startDelay;
    for (const text of lines) {
      const chars = Math.max(Array.from(text).length, 1);
      const duration = Math.max(0.35, chars / Math.max(charactersPerSecond, 1));
      out.push({ text, chars, duration, delay: at });
      at += duration + lineDelay;
    }
    return out;
  }, [lines, startDelay, charactersPerSecond, lineDelay]);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    const frame = requestAnimationFrame(() => setReduced(mq.matches));
    mq.addEventListener?.("change", onChange);
    return () => {
      cancelAnimationFrame(frame);
      mq.removeEventListener?.("change", onChange);
    };
  }, []);

  return (
    <div className={`typing-text-root relative flex w-full flex-col items-start ${className}`} aria-label={lines.join(". ")}>
      {prepared.map((line, index) => {
        const style: LineStyle = {
          "--typing-target-width": `${line.chars}ch`,
          "--typing-steps": line.chars,
          "--typing-duration": `${line.duration}s`,
          "--typing-delay": `${line.delay}s`,
          "--typing-cursor-color": cursorColor,
          fontSize,
          lineHeight,
          animation: reduced
            ? "none"
            : "typing-text-write var(--typing-duration) steps(var(--typing-steps), end) var(--typing-delay) both",
          width: reduced ? "auto" : undefined,
          opacity: reduced ? 1 : undefined,
        };
        return (
          <span
            key={`${line.text}-${index}`}
            aria-hidden="true"
            data-cursor={reduced ? undefined : ""}
            className="typing-text-line block max-w-full font-mono whitespace-nowrap"
            style={style}
          >
            <span className="block max-w-full overflow-hidden whitespace-pre-wrap">{line.text}</span>
          </span>
        );
      })}

      <style>{`
        .typing-text-line { position: relative; width: 0; opacity: 0; }
        .typing-text-line[data-cursor]::after {
          content: "";
          position: absolute;
          inset-block-start: 50%;
          inset-inline-start: calc(100% + 0.16em);
          width: 0.55em;
          height: 1.05em;
          background: var(--typing-cursor-color);
          translate: 0 -50%;
          opacity: 0;
          animation: typing-text-cursor-finish var(--typing-duration) linear var(--typing-delay) both;
        }
        @keyframes typing-text-write {
          0% { width: 0; opacity: 0; }
          1% { opacity: 1; }
          100% { width: min(var(--typing-target-width), 100%); opacity: 1; }
        }
        @keyframes typing-text-cursor-finish {
          0%, 99.8% { opacity: 1; }
          99.9%, 100% { opacity: 0; }
        }
        @media (max-width: 640px) {
          .typing-text-line { white-space: normal !important; width: auto !important; }
        }
      `}</style>
    </div>
  );
}
