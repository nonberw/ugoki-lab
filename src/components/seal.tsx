import { cn } from "@/lib/utils";
import { SITE } from "@/lib/content";

/** The lab's mark: 動 cut into a vermilion hanko square. */
export function Seal({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-accent font-jp leading-none font-bold text-accent-ink",
        className,
      )}
    >
      {SITE.seal}
    </span>
  );
}
