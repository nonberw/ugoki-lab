"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import TypingText from "@/components/ui/typing-text";
import { DEMOS } from "@/lib/content";

type Key = (typeof DEMOS)[number]["key"];
const KEYS = DEMOS.map((d) => d.key) as Key[];

/**
 * Hero card in the spirit of a model playground: pick a prompt, watch the plan type out.
 * Clearly labelled as a concept, because the open model is still in training.
 */
export function ModelPlayground() {
  const [key, setKey] = useState<Key>(KEYS[0]!);
  const demo = DEMOS.find((d) => d.key === key)!;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_20px_60px_-30px_rgb(20_20_20/0.25)]">
      <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <SegmentedControl options={KEYS} value={key} onChange={setKey} label="Example prompt" className="w-full sm:w-auto" />
        <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
          Concept preview <span className="text-accent">·</span> model in training
        </p>
      </div>
      <div className="grid gap-6 px-5 py-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10 md:px-6 md:py-8">
        <div className="min-w-0">
          <p className="text-[12px] text-muted">You describe</p>
          <p className="mt-2 font-display text-2xl leading-snug md:text-[28px]">“{demo.prompt}”</p>
        </div>
        <div className="min-h-[13rem] min-w-0 rounded-[10px] bg-background/70 p-4 md:p-5">
          <p className="mb-2 text-[12px] text-muted">The model plans and checks</p>
          <TypingText key={demo.key} lines={demo.lines} fontSize={13} className="text-foreground" />
        </div>
      </div>
    </div>
  );
}
