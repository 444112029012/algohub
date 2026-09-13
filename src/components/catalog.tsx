"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { algorithms, CATEGORIES, type CategoryId } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const weightClass: Record<string, string> = {
  極高: "bg-vermillion/15 text-vermillion ring-vermillion/20",
  高: "bg-gold/25 text-foreground ring-gold/40",
  中: "bg-muted text-muted-foreground ring-border",
};

export function Catalog() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryId | "all">("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return algorithms.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (!query) return true;
      const hay = `${a.name} ${a.english} ${a.tags.join(" ")} ${a.summary}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q, cat]);

  const grouped = CATEGORIES.map((c) => ({
    ...c,
    items: filtered.filter((a) => a.category === c.id),
  })).filter((c) => c.items.length > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋：Dijkstra、穩定排序、主定理…"
          className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none ring-ring/30 placeholder:text-muted-foreground focus:ring-3 sm:max-w-md"
        />
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
            全部
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={cat === c.id}
              onClick={() => setCat(c.id)}
            >
              {c.name}
            </FilterChip>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card/50 px-4 py-12 text-center text-sm text-muted-foreground">
          沒有符合「{q}」的演算法。試試「背包」「最短路」或清空搜尋。
        </p>
      ) : (
        grouped.map((g) => (
          <section key={g.id} className="space-y-3">
            <div>
              <h2 className="font-heading text-xl">{g.name}</h2>
              <p className="text-sm text-muted-foreground">
                {g.english} · {g.blurb}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {g.items.map((a) => (
                <Link key={a.slug} href={`/algorithms/${a.slug}`} className="group">
                  <Card className="paper-card h-full transition-transform group-hover:-translate-y-0.5">
                    <CardHeader className="border-b">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg">
                          {a.name}
                          <span className="mt-0.5 block font-sans text-xs font-normal tracking-wide text-muted-foreground">
                            {a.english}
                          </span>
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={cn("ring-1", weightClass[a.examWeight])}
                        >
                          考頻 {a.examWeight}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {a.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-1.5 pt-3">
                      {a.tags.map((t) => (
                        <Badge key={t} variant="outline" className="font-normal">
                          {t}
                        </Badge>
                      ))}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {a.complexity.timeWorst}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-card text-muted-foreground ring-1 ring-border hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
