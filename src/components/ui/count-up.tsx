"use client";

// From 21st.dev: "Count Up Animation" by wensity. Changes for this site: imports from
// `motion/react` (the current name of framer-motion) and the shared `cn` helper.
import * as React from "react";
import {
  animate,
  cancelFrame,
  frame,
  motionValue,
  useInView,
  useReducedMotion,
  type AnimationPlaybackControlsWithThen,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export type NumberTickerVariant = "count" | "roll";

export interface NumberTickerProps extends Omit<React.ComponentPropsWithoutRef<"span">, "children" | "prefix"> {
  value: number;
  from?: number;
  variant?: NumberTickerVariant;
  duration?: number;
  delay?: number;
  trigger?: "view" | "mount";
  locales?: string | string[];
  format?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  onComplete?: () => void;
}

interface Layout {
  lead: string;
  trail: string;
  fd: number;
  decimal: string;
  group: string;
  scale: number;
  digits: string[];
  separators: (length: number) => ReadonlySet<number>;
  text: string;
}

const MAX_PLACES = 21;
const STRIP = 11;
const MAX_TURNS = 1;
const ROLL_EASE = [0.3, 0.5, 0.2, 1] as const;
const COUNT_EASE = [0.33, 0.2, 0.3, 1] as const;
const PRESENCE = { type: "spring", bounce: 0, visualDuration: 0.42 } as const;

const LINE = 1.5;
const LINE_TRIM = `${-(LINE - 1.15) / 2}em`;
const PAD_X = "0.3em";
const FALLBACK_MASK =
  "linear-gradient(to bottom, transparent 0, #000 0.38em, #000 calc(100% - 0.3em), transparent 100%)";

let measureContext: CanvasRenderingContext2D | null | undefined;

function inkMask(row: HTMLElement): string | null {
  if (measureContext === undefined) measureContext = document.createElement("canvas").getContext("2d");
  const ctx = measureContext;
  if (!ctx) return null;
  const cs = getComputedStyle(row);
  const size = parseFloat(cs.fontSize);
  const line = parseFloat(cs.lineHeight);
  if (!size || !Number.isFinite(line)) return null;
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = ctx.measureText("0123456789");
  if (!m.fontBoundingBoxAscent) return null;
  const baseline = (line - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
  const margin = size * 0.025;
  const top = Math.max(1, baseline - m.actualBoundingBoxAscent - margin);
  const bottom = Math.min(line - 1, baseline + m.actualBoundingBoxDescent + margin);
  if (bottom <= top) return null;
  const steps = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const ease = (f: number) => f * f * (3 - 2 * f);
  const stops = [
    ...steps.map((f) => `rgba(0,0,0,${ease(f).toFixed(3)}) ${(top * f).toFixed(2)}px`),
    ...steps.map((f) => `rgba(0,0,0,${ease(1 - f).toFixed(3)}) ${(bottom + (line - bottom) * f).toFixed(2)}px`),
  ];
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

function makeFormatter(locales: string | string[] | undefined, options: Intl.NumberFormatOptions) {
  try {
    return new Intl.NumberFormat(locales, options);
  } catch {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
  }
}

function readParts(formatter: Intl.NumberFormat, n: number) {
  let int = "";
  let frac = "";
  let lead = "";
  let trail = "";
  let decimal = ".";
  let seenNumber = false;
  for (const part of formatter.formatToParts(n)) {
    switch (part.type) {
      case "integer":
        int += part.value;
        seenNumber = true;
        break;
      case "fraction":
        frac += part.value;
        break;
      case "decimal":
        decimal = part.value;
        break;
      case "group":
      case "minusSign":
      case "plusSign":
        break;
      default:
        if (seenNumber) trail += part.value;
        else lead += part.value;
    }
  }
  return { int, frac, lead, trail, decimal };
}

function buildLayout(
  value: number,
  locales: string | string[] | undefined,
  format: Intl.NumberFormatOptions | undefined,
  prefix: string,
  suffix: string,
): Layout {
  const options = format ?? {};
  const full = makeFormatter(locales, options);
  const latn = makeFormatter(locales, { ...options, numberingSystem: "latn" });
  const abs = Number.isFinite(value) ? Math.abs(value) : 0;

  const target = readParts(latn, abs);
  const shown = Number(`${target.int || "0"}.${target.frac || "0"}`);
  let scale = 1;
  if (abs > 0 && shown > 0) {
    scale = shown / abs;
  } else {
    const one = readParts(latn, 1);
    scale = Number(`${one.int || "1"}.${one.frac || "0"}`) || 1;
  }

  const resolved = full.resolvedOptions() as Intl.ResolvedNumberFormatOptions & { useGrouping?: unknown };
  const plain = makeFormatter(locales, {
    numberingSystem: "latn",
    maximumFractionDigits: 0,
    useGrouping: resolved.useGrouping as Intl.NumberFormatOptions["useGrouping"],
  });
  const groupPart = makeFormatter(locales, { numberingSystem: "latn" })
    .formatToParts(1234567)
    .find((part) => part.type === "group");

  const digitFormatter = makeFormatter(locales, {
    numberingSystem: resolved.numberingSystem,
    useGrouping: false,
    maximumFractionDigits: 0,
  });
  const digits = Array.from({ length: 10 }, (_, d) => digitFormatter.format(d));

  const cache = new Map<number, ReadonlySet<number>>();
  const separators = (length: number) => {
    const n = Math.min(Math.max(1, length), MAX_PLACES);
    const hit = cache.get(n);
    if (hit) return hit;
    const chunks = plain
      .formatToParts(10 ** (n - 1))
      .filter((part) => part.type === "integer")
      .map((part) => part.value.length);
    const set = new Set<number>();
    let acc = 0;
    for (let i = chunks.length - 1; i > 0; i -= 1) {
      acc += chunks[i] ?? 0;
      set.add(acc);
    }
    cache.set(n, set);
    return set;
  };

  return {
    lead: prefix + target.lead,
    trail: target.trail + suffix,
    fd: target.frac.length,
    decimal: target.decimal,
    group: groupPart?.value ?? ",",
    scale,
    digits,
    separators,
    text: `${prefix}${full.format(Number.isFinite(value) ? value : 0)}${suffix}`,
  };
}

function scaledInt(raw: number, layout: Layout) {
  return Math.round(Math.abs(raw) * layout.scale * 10 ** layout.fd);
}

function lengthOf(n: number, fd: number) {
  return Math.min(MAX_PLACES, String(Math.floor(n / 10 ** fd)).length);
}

function digitAt(n: number, idx: number) {
  return Math.floor(n / 10 ** idx) % 10;
}

function glyphWidth(metrics: Metrics, turns: number) {
  const pos = wrap(turns);
  const low = Math.floor(pos);
  const w0 = metrics.digits[low % 10] ?? 0;
  const w1 = metrics.digits[(low + 1) % 10] ?? 0;
  return w0 + (w1 - w0) * (pos - low);
}

function smooth(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

function wrap(turns: number) {
  return ((turns % 10) + 10) % 10;
}

function placeShows(n: number, idx: number, fd: number) {
  return idx <= fd || n >= 10 ** idx;
}

interface Slot {
  presence: MotionValue<number>;
  on: boolean;
}

interface Column {
  turns: MotionValue<number>;
  start: number;
  target: number;
  startShown: number;
  targetOn: boolean;
  shown: number;
}

interface Metrics {
  digits: number[];
  group: number;
  minus: number;
  font: number;
}

export function NumberTicker({ variant = "roll", ...props }: NumberTickerProps) {
  return <NumberTickerEngine key={variant} variant={variant} {...props} />;
}

function NumberTickerEngine({
  value,
  from = 0,
  variant = "roll",
  duration,
  delay = 0,
  trigger = "view",
  locales,
  format,
  prefix = "",
  suffix = "",
  onComplete,
  className,
  style,
  ...rest
}: NumberTickerProps) {
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const rowRef = React.useRef<HTMLSpanElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const started = trigger === "mount" || inView;

  const safeValue = Number.isFinite(value) ? value : 0;
  const safeFrom = Number.isFinite(from) ? from : 0;
  const formatKey = JSON.stringify(format ?? null);
  const localeKey = JSON.stringify(locales ?? null);
  const layout = React.useMemo(
    () => buildLayout(safeValue, locales, format, prefix, suffix),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeValue, localeKey, formatKey, prefix, suffix],
  );
  const [first] = React.useState(() => ({
    n: scaledInt(safeFrom, layout),
    fd: layout.fd,
    negative: safeFrom < 0,
  }));

  const needed = Math.max(
    lengthOf(scaledInt(safeFrom, layout), layout.fd),
    lengthOf(scaledInt(safeValue, layout), layout.fd),
  );
  const [maxPlaces, setMaxPlaces] = React.useState(needed);
  if (needed > maxPlaces) setMaxPlaces(needed);
  const places = Math.max(maxPlaces, needed);
  const columnCount = places + layout.fd;

  const layoutRef = React.useRef(layout);
  const placesRef = React.useRef(places);
  const onCompleteRef = React.useRef(onComplete);
  const instantRef = React.useRef(false);
  React.useLayoutEffect(() => {
    layoutRef.current = layout;
    placesRef.current = places;
    onCompleteRef.current = onComplete;
    instantRef.current = Boolean(reduceMotion);
  });

  const shownRef = React.useRef(first.n);

  const separatorPlaces = React.useMemo(() => {
    const all = new Set<number>();
    for (let n = 1; n <= places; n += 1) {
      for (const k of layout.separators(n)) all.add(k);
    }
    return all;
  }, [layout, places]);

  const metricsRef = React.useRef<Metrics | null>(null);
  const columnsRef = React.useRef(new Map<number, Column>());
  const signRef = React.useRef<Slot | null>(null);
  const paintRef = React.useRef<() => void>(() => {});
  const scheduledRef = React.useRef(false);

  const process = React.useCallback(() => {
    scheduledRef.current = false;
    paintRef.current();
  }, []);
  const schedule = React.useCallback(() => {
    if (scheduledRef.current) return;
    scheduledRef.current = true;
    frame.render(process);
  }, [process]);

  const makeSlot = React.useCallback(
    (on: boolean): Slot => {
      const presence = motionValue(on ? 1 : 0);
      presence.on("change", schedule);
      return { presence, on };
    },
    [schedule],
  );

  const getColumn = React.useCallback(
    (idx: number) => {
      let col = columnsRef.current.get(idx);
      if (!col) {
        const n = shownRef.current ?? 0;
        const digit = digitAt(n, idx);
        const on = placeShows(n, idx, layoutRef.current.fd);
        const turns = motionValue(digit);
        turns.on("change", schedule);
        col = { turns, start: digit, target: digit, startShown: on ? 1 : 0, targetOn: on, shown: on ? 1 : 0 };
        columnsRef.current.set(idx, col);
      }
      return col;
    },
    [schedule],
  );

  const toggle = React.useCallback((slot: Slot, on: boolean) => {
    if (slot.on === on) return;
    slot.on = on;
    if (instantRef.current) {
      slot.presence.stop();
      slot.presence.set(on ? 1 : 0);
    } else {
      animate(slot.presence, on ? 1 : 0, PRESENCE);
    }
  }, []);

  const paint = () => {
    const row = rowRef.current;
    const metrics = metricsRef.current;
    if (!row || !metrics) return;
    const L = layoutRef.current;

    let higher = 0;
    let length = 1;
    for (let idx = placesRef.current + L.fd - 1; idx >= 0; idx -= 1) {
      const col = getColumn(idx);
      const now = col.turns.get();
      const span = col.target - col.start;
      const moved = Math.abs(now - col.start);
      const target = col.targetOn ? 1 : 0;
      let own: number;
      if (idx <= L.fd) own = 1;
      else if (col.startShown === target) own = target;
      else if (Math.abs(span) < 1e-6) own = 0;
      else if (target === 1)
        own = col.startShown + (1 - col.startShown) * smooth(moved / Math.min(0.7, Math.abs(span)));
      else own = col.startShown * (1 - smooth(moved / Math.abs(span)));
      col.shown = Math.max(own, higher);
      higher = col.shown;
      if (col.shown > 0.001) length = Math.max(length, idx - L.fd + 1);
    }
    const groups = L.separators(length);

    for (const el of row.querySelectorAll<HTMLElement>("[data-ticker-col]")) {
      const col = columnsRef.current.get(Number(el.dataset.idx));
      const strip = el.firstElementChild?.nextElementSibling as HTMLElement | null;
      if (!col || !strip) continue;
      const now = col.turns.get();
      const span = col.target - col.start;
      const progress = Math.abs(span) > 1e-6 ? Math.min(1, Math.max(0, (now - col.start) / span)) : 1;
      const fromW = glyphWidth(metrics, col.start);
      const width = fromW + (glyphWidth(metrics, col.target) - fromW) * progress;
      el.style.width = `${width * col.shown}px`;
      el.style.opacity = String(smooth((col.shown - 0.25) / 0.6));
      strip.style.transform = `translate3d(0, ${(-wrap(now) * 100) / STRIP}%, 0)`;
    }

    for (const el of row.querySelectorAll<HTMLElement>("[data-ticker-sep]")) {
      const place = Number(el.dataset.place);
      const shown = groups.has(place) ? (columnsRef.current.get(place + L.fd)?.shown ?? 0) : 0;
      el.style.width = `${metrics.group * shown}px`;
      el.style.opacity = String(smooth((shown - 0.3) / 0.7));
    }
    const signEl = row.querySelector<HTMLElement>("[data-ticker-sign]");
    if (signEl && signRef.current) {
      const p = signRef.current.presence.get();
      signEl.style.width = `${metrics.minus * p}px`;
      signEl.style.opacity = String(p);
    }
  };

  React.useLayoutEffect(() => {
    paintRef.current = paint;
  });

  React.useLayoutEffect(() => {
    const box = measureRef.current;
    if (!box) return;
    const read = () => {
      const widths = Array.from(box.children, (s) => s.getBoundingClientRect().width);
      metricsRef.current = {
        digits: widths.slice(0, 10),
        group: widths[10] ?? 0,
        minus: widths[11] ?? 0,
        font: parseFloat(getComputedStyle(box).fontSize) || 16,
      };
      const row = rowRef.current;
      const mask = row ? inkMask(row) : null;
      if (row && mask) row.style.setProperty("--ticker-mask", mask);
      paintRef.current();
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(box);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) read();
    });
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [layout]);

  React.useLayoutEffect(() => {
    for (let idx = 0; idx < columnCount; idx += 1) getColumn(idx);
    if (!signRef.current) signRef.current = makeSlot(first.negative);
    paintRef.current();
  });

  const firstRunRef = React.useRef(true);
  const runLength = Math.max(0.05, duration ?? (variant === "roll" ? 1 : 2.2));

  React.useEffect(() => {
    if (!started) return;
    const wait = firstRunRef.current ? Math.max(0, delay) : 0;
    firstRunRef.current = false;

    const L = layoutRef.current;
    const n = scaledInt(safeValue, L);
    const previous = shownRef.current ?? 0;
    shownRef.current = n;
    const up = n >= previous;
    const change = Math.abs(n - previous);
    const count = placesRef.current + L.fd;

    if (signRef.current) toggle(signRef.current, safeValue < 0 && n > 0);

    const running: AnimationPlaybackControlsWithThen[] = [];
    const moving: Column[] = [];
    for (let idx = 0; idx < count; idx += 1) {
      const col = getColumn(idx);
      const digit = digitAt(n, idx);
      const base = variant === "count" ? col.turns.get() : col.target;
      const here = wrap(base);
      let step = up ? (digit - here + 10) % 10 : -((here - digit + 10) % 10);
      if (Math.abs(step) < 1e-6 || Math.abs(Math.abs(step) - 10) < 1e-6) step = 0;
      if (variant === "count") {
        const laps = Math.min(MAX_TURNS, Math.floor(change / 10 ** idx / 10));
        step += (up ? 10 : -10) * laps;
      }
      col.start = col.turns.get();
      col.target = base + step;
      col.startShown = col.shown;
      col.targetOn = placeShows(n, idx, L.fd);

      if (reduceMotion) {
        col.turns.stop();
        col.turns.set(col.target);
        col.start = col.target;
        col.startShown = col.targetOn ? 1 : 0;
        continue;
      }
      if (Math.abs(col.turns.get() - col.target) < 1e-6) continue;
      moving.push(col);
    }

    if (variant === "count") {
      const distance = (col: Column) => Math.abs(col.target - col.turns.get());
      const longest = Math.max(1, ...moving.map(distance));
      for (const col of moving) {
        const share = Math.max(0.4, distance(col) / longest);
        running.push(
          animate(col.turns, col.target, {
            duration: runLength * share,
            delay: wait + runLength * (1 - share),
            ease: COUNT_EASE,
          }),
        );
      }
    } else {
      for (const col of moving) {
        running.push(animate(col.turns, col.target, { duration: runLength, delay: wait, ease: ROLL_EASE }));
      }
    }
    schedule();

    let cancelled = false;
    const finish = () => {
      if (!cancelled) onCompleteRef.current?.();
    };
    if (running.length === 0) finish();
    else Promise.all(running.map((c) => new Promise<void>((r) => c.then(r)))).then(finish);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, safeValue, layout, variant, runLength, reduceMotion]);

  React.useEffect(
    () => () => {
      cancelFrame(process);
      for (const col of columnsRef.current.values()) col.turns.stop();
      signRef.current?.presence.stop();
    },
    [process],
  );

  const firstGroups = layout.separators(lengthOf(first.n, first.fd));

  const slots: React.ReactNode[] = [];
  for (let place = places - 1; place >= -layout.fd; place -= 1) {
    const idx = place + layout.fd;
    const on = placeShows(first.n, idx, first.fd);
    const digit = digitAt(first.n, idx);
    slots.push(
      <span
        key={`c${place}`}
        data-ticker-col=""
        data-idx={idx}
        className="relative box-content inline-block text-center"
        style={{
          paddingInline: PAD_X,
          marginInline: `-${PAD_X}`,
          maskImage: `var(--ticker-mask, ${FALLBACK_MASK})`,
          WebkitMaskImage: `var(--ticker-mask, ${FALLBACK_MASK})`,
          ...(on ? null : { width: 0, opacity: 0 }),
        }}
      >
        <span className="invisible">{layout.digits[digit]}</span>
        <span
          data-ticker-strip=""
          className="absolute flex flex-col items-center will-change-transform"
          style={{ top: 0, left: PAD_X, right: PAD_X, transform: `translate3d(0, ${(-digit * 100) / STRIP}%, 0)` }}
        >
          {Array.from({ length: STRIP }, (_, i) => (
            <span key={i} className="block">
              {layout.digits[i % 10]}
            </span>
          ))}
        </span>
      </span>,
    );
    if (place > 0 && separatorPlaces.has(place)) {
      const sepOn = firstGroups.has(place) && on;
      slots.push(
        <span
          key={`s${place}`}
          data-ticker-sep=""
          data-place={place}
          className="inline-block whitespace-pre"
          style={sepOn ? undefined : { width: 0, opacity: 0 }}
        >
          {layout.group}
        </span>,
      );
    }
    if (place === 0 && layout.fd > 0) {
      slots.push(
        <span key="decimal" className="whitespace-pre">
          {layout.decimal}
        </span>,
      );
    }
  }

  return (
    <span ref={rootRef} className={cn("relative inline-block whitespace-nowrap", className)} style={style} {...rest}>
      <span className="sr-only">{layout.text}</span>
      <span
        ref={rowRef}
        aria-hidden="true"
        className="inline-flex items-baseline"
        style={{ lineHeight: LINE, marginBlock: LINE_TRIM }}
      >
        <span data-ticker-sign="" className="inline-block" style={first.negative ? undefined : { width: 0, opacity: 0 }}>
          −
        </span>
        {layout.lead ? <span className="whitespace-pre">{layout.lead}</span> : null}
        {slots}
        {layout.trail ? <span className="whitespace-pre">{layout.trail}</span> : null}
      </span>
      <span ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre">
        {layout.digits.map((d, i) => (
          <span key={i} className="inline-block">
            {d}
          </span>
        ))}
        <span className="inline-block">{layout.group}</span>
        <span className="inline-block">−</span>
      </span>
    </span>
  );
}
