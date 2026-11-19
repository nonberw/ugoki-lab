"use client";

import { Moon, Sun } from "@phosphor-icons/react";

/** Flips the `.dark` class on <html> and remembers the choice. */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch light or dark theme"
      className="inline-flex h-9 items-center gap-2 px-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase transition-colors hover:text-foreground active:translate-y-px"
    >
      <Sun size={15} weight="regular" className="hidden dark:block" aria-hidden />
      <Moon size={15} weight="regular" className="block dark:hidden" aria-hidden />
      <span className="hidden dark:inline">Light</span>
      <span className="inline dark:hidden">Dark</span>
    </button>
  );
}
