// From 21st.dev: "Footer with Big Wordmark" by vilqor (MIT, Midnight Lite template).
// Changes for this site: Phosphor icon instead of Lucide, sharp corners, a kanji line
// beside the wordmark, credits instead of a status dot, and the site's sans display face.
import * as React from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const tap =
  "max-md:inline-flex max-md:min-h-11 max-md:items-center pointer-coarse:inline-flex pointer-coarse:min-h-11 pointer-coarse:items-center";

export type FooterColumn = { title: string; links: { label: string; href: string }[] };

export interface WordmarkFooterProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  kanji?: string;
  year: number;
  description?: string;
  navLabel?: string;
  columns: FooterColumn[];
  credits?: string[];
  credit?: { label: string; href: string };
}

export function WordmarkFooter({
  name,
  kanji,
  year,
  description,
  navLabel = "Footer",
  columns,
  credits,
  credit,
  className,
  ...props
}: WordmarkFooterProps) {
  return (
    <footer className={cn("relative overflow-hidden bg-background text-foreground", className)} {...props}>
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-6 pt-16 pb-10 max-md:gap-6 max-md:pt-12 max-md:pb-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <span className="flex items-baseline gap-3 text-[25px] leading-none font-medium tracking-[-0.02em]">
            {name}
            {kanji && <span className="font-jp text-[18px] text-accent">{kanji}</span>}
          </span>
          {description && <p className="mt-4 max-w-[320px] text-[14px] leading-[22px] text-muted">{description}</p>}
        </div>
        <nav aria-label={navLabel} className="grid grid-cols-2 gap-8 max-md:hidden md:col-span-6 md:col-start-7 lg:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{col.title}</p>
              <ul className="mt-4 grid gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className={cn("text-[14px] text-muted transition-colors hover:text-foreground", tap)}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {/* phones: each column folds away; tap a heading to open it */}
        <nav aria-label={navLabel} className="-mx-4 grid gap-1 md:hidden">
          {columns.map((col) => (
            <details key={col.title} className="group open:bg-foreground/[0.03]">
              <summary className="flex h-14 cursor-pointer list-none items-center justify-between px-4 [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-[12px] tracking-[0.14em] text-muted uppercase">{col.title}</span>
                <Plus
                  className="size-4 text-muted transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <ul className="px-4 pb-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="block py-3 text-[15px] text-muted">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-6 pb-6 text-[13px] text-muted sm:flex-row sm:items-center sm:gap-6 md:px-10">
        <p className="font-mono tabular-nums">
          © {year} {name}
        </p>
        {credits?.map((c) => (
          <p key={c}>{c}</p>
        ))}
        {credit && (
          <a href={credit.href} className={cn("hover:text-foreground sm:ml-auto", tap)}>
            {credit.label}
          </a>
        )}
      </div>
      {/* the name, set large and fading into the background */}
      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.2em] text-center text-[clamp(96px,24vw,360px)] leading-[0.9] font-medium tracking-[-0.05em] text-transparent select-none [background-clip:text] [-webkit-background-clip:text] [background-image:linear-gradient(to_bottom,color-mix(in_oklab,var(--color-primary)_28%,transparent),transparent_85%)] max-md:text-[30vw]"
      >
        {name.split(" ")[0]}
      </p>
    </footer>
  );
}

export default WordmarkFooter;
