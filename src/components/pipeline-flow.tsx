"use client";

import { useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { PIPELINE } from "@/lib/content";

/**
 * Describe → Plan → Generate → Verify → Build, as five nodes joined by pulsing beams.
 * A row on desktop, a column on phones; the beams re-measure either way.
 */
export function PipelineFlow() {
  const container = useRef<HTMLDivElement>(null);
  const n0 = useRef<HTMLDivElement>(null);
  const n1 = useRef<HTMLDivElement>(null);
  const n2 = useRef<HTMLDivElement>(null);
  const n3 = useRef<HTMLDivElement>(null);
  const n4 = useRef<HTMLDivElement>(null);
  const nodes = [n0, n1, n2, n3, n4];

  return (
    <div
      ref={container}
      className="relative grid gap-10 rounded-2xl border border-line bg-surface p-6 md:grid-cols-5 md:gap-6 md:p-10"
    >
      {PIPELINE.map((step, i) => (
        <div key={step.verb} className="relative z-[1] flex gap-4 md:flex-col md:items-center md:text-center">
          <div
            ref={nodes[i]}
            className={`flex size-14 shrink-0 items-center justify-center rounded-full border font-mono text-[13px] ${
              i === 0 || i === PIPELINE.length - 1
                ? "border-accent bg-accent text-accent-ink"
                : "border-line bg-background text-foreground"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </div>
          <div className="md:mt-4">
            <p className="font-display text-xl">{step.verb}</p>
            <p className="mt-1 max-w-[22ch] text-[14px] leading-relaxed text-muted">{step.body}</p>
          </div>
        </div>
      ))}
      <AnimatedBeam containerRef={container} fromRef={n0} toRef={n1} curvature={-24} duration={2.4} delay={0} />
      <AnimatedBeam containerRef={container} fromRef={n1} toRef={n2} curvature={24} duration={2.4} delay={0.45} />
      <AnimatedBeam containerRef={container} fromRef={n2} toRef={n3} curvature={-24} duration={2.4} delay={0.9} />
      <AnimatedBeam containerRef={container} fromRef={n3} toRef={n4} curvature={24} duration={2.4} delay={1.35} />
    </div>
  );
}
