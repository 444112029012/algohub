"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { primaryNav } from "@/components/site-nav";
import { cn } from "@/lib/utils";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-paper/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-baseline gap-2">
          <span className="truncate font-heading text-[clamp(1rem,2.4vw,1.125rem)] tracking-tight">
            演算法研究室
          </span>
          <span className="hidden text-xs text-muted-foreground md:inline">研究所備考</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="主要">
          {primaryNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 shrink-0 items-center rounded-md px-3 text-sm text-ink ring-1 ring-border md:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "關閉" : "選單"}
        </button>

        {open && (
          <nav
            id="site-menu"
            aria-label="主要"
            className="absolute inset-x-0 top-full border-b border-border bg-paper px-4 py-3 shadow-[0_16px_32px_-24px_oklch(0.3_0.05_250/0.45)] md:hidden"
          >
            <ul className="grid gap-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} pathname={pathname} block />
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({
  item,
  pathname,
  block,
}: {
  item: { href: string; label: string };
  pathname: string;
  block?: boolean;
}) {
  const current = isCurrent(pathname, item.href);
  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-2 text-sm transition-colors duration-200",
        block && "block",
        current
          ? "bg-primary text-primary-foreground"
          : "text-foreground/80 hover:bg-muted hover:text-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}
