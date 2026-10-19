import Link from "next/link";
import { primaryNav } from "@/components/site-nav";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <p className="max-w-xl text-xs leading-5 text-muted-foreground">
          給資訊研究所入學考試的演算法複習教材。以 CLRS 與常見考題為綱，強調手算、複雜度對照與易錯點。
        </p>
        <nav aria-label="頁尾" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-foreground/80 hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
