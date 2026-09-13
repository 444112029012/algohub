import Link from "next/link";
import { Catalog } from "@/components/catalog";
import { algorithms } from "@/data";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="mb-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs tracking-[0.2em] text-vermillion">CS GRAD EXAM</p>
          <h1 className="font-heading mt-2 text-4xl leading-tight sm:text-5xl">
            研究所常考演算法
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-foreground/80">
            依資訊研究所入學考試整理的 {algorithms.length}{" "}
            篇教材。每篇都有直覺介紹、複雜度、手算步驟、虛擬碼，以及 Python / C++ /
            TypeScript。排序、圖遍歷、最短路、背包與 LCS 還能逐步播放。
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <HeroStat n={String(algorithms.length)} label="篇完整教材" />
          <HeroStat n="3" label="種實作語言" />
          <HeroStat n="極高" label="考頻標籤" />
        </div>
      </section>

      <section className="mb-10 rounded-2xl bg-primary px-5 py-5 text-primary-foreground sm:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-lg">先把對照表背熟</p>
            <p className="text-sm text-primary-foreground/75">
              穩定 / 原地 / 最壞 n²，以及 Dijkstra 不能有負權，是選擇題送分題。
            </p>
          </div>
          <Link
            href="/cheatsheet"
            className="inline-flex h-9 items-center rounded-lg bg-paper px-3 text-sm text-ink hover:bg-paper/90"
          >
            打開複雜度速查
          </Link>
        </div>
      </section>

      <Catalog />
    </div>
  );
}

function HeroStat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-xl bg-card/80 px-2 py-3 ring-1 ring-border">
      <p className="font-heading text-xl">{n}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
