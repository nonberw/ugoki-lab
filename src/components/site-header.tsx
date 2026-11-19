import { NAV, SITE } from "@/lib/content";
import { ThemeToggle } from "./theme-toggle";
import { Seal } from "./seal";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label={`${SITE.name}, back to top`}>
          <Seal className="size-8 rounded-[6px] text-[17px]" />
          <span className="flex flex-col leading-none">
            <span className="font-mono text-[12px] font-medium tracking-[0.16em] uppercase">{SITE.short}</span>
            <span className="mt-1 hidden font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase sm:block">
              open physical AI
            </span>
          </span>
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 md:gap-2">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden px-3 py-2 text-[14px] text-muted transition-colors hover:text-foreground lg:block"
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href="#join"
            className="ml-1 inline-flex h-9 items-center rounded-[10px] bg-foreground px-4 text-[13px] font-medium text-background transition-transform active:translate-y-px"
          >
            Join the lab
          </a>
        </nav>
      </div>
    </header>
  );
}
