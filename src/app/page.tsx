import Link from "next/link";
import { Catalog } from "@/components/catalog";
import { algorithms } from "@/data";
import { studyPath, studyPathSlugs } from "@/lib/study-path";

export default function HomePage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-16 grid items-end gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)]">
        <div className="max-w-4xl">
          <p className="text-xs tracking-[0.2em] text-vermillion">CS GRAD EXAM</p>
          <h1 className="font-heading mt-3 max-w-5xl text-[clamp(2.4rem,5vw,3.5rem)] leading-[1.15]">
            研究所常考演算法
          </h1>
          <p className="mt-5 max-w-prose text-[15px] leading-7 text-foreground/80">
            依資訊研究所入學考試整理的 {algorithms.length}{" "}
            篇教材。每篇都有想法、複雜度、手算、虛擬碼，以及 Python / C++ /
            TypeScript。建議依讀序閱讀；未列入而考頻為「極高」者，放在考前清單。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#study-path"
              className="inline-flex h-11 items-center rounded-lg bg-primary px-4 text-sm text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              從讀序開始
            </Link>
            <Link
              href="/cheatsheet"
              className="inline-flex h-11 items-center rounded-lg bg-card px-4 text-sm text-ink ring-1 ring-border transition-colors duration-200 hover:bg-muted"
            >
              複雜度速查
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <HeroStat n={String(algorithms.length)} label="篇教材" />
          <HeroStat n="3" label="種實作語言" />
          <HeroStat n="極高" label="考頻標籤" />
        </div>
      </section>

      <StudyPath />

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

function StudyPath() {
  const highs = algorithms.filter((a) => a.examWeight === "極高" && !studyPathSlugs.has(a.slug));
  return (
    <section id="study-path" className="mb-16 scroll-mt-20 space-y-6">
      <div>
        <h2 className="font-heading text-2xl">建議讀序</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          八個主題涵蓋選擇題與手算的主線。進入各篇後逐步看圖解，再做三題測驗。
        </p>
      </div>
      <ol className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr))]">
        {studyPath.map((step, i) => (
          <li
            key={step.title}
            className="rounded-xl bg-card px-4 py-4 ring-1 ring-border transition-colors hover:bg-muted/40"
          >
            <p className="text-xs text-muted-foreground">第 {i + 1} 節</p>
            <p className="font-medium">{step.title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {step.slugs.map(([slug, label]) => (
                <Link
                  key={slug}
                  href={`/algorithms/${slug}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-muted px-3 text-xs transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
                >
                  {label}
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div>
        <h2 className="font-heading text-xl">考前清單</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          讀序未列入、考頻為極高的篇目，考前由此補齊。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {highs.map((a) => (
            <Link
              key={a.slug}
              href={`/algorithms/${a.slug}`}
              className="inline-flex min-h-11 items-center rounded-full bg-vermillion/10 px-3 text-xs text-vermillion ring-1 ring-vermillion/20 transition-colors duration-200 hover:bg-vermillion/20"
            >
              {a.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
