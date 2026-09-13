import Link from "next/link";
import { AlgorithmVisualizer } from "@/components/visualizer";
import { CodeTabs, PseudoBlock } from "@/components/code-block";
import { Quiz } from "@/components/quiz";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAlgorithm, type Algorithm } from "@/data";
import { CATEGORIES } from "@/data/types";

const toc = [
  { id: "intro", label: "介紹" },
  { id: "complexity", label: "複雜度" },
  { id: "demo", label: "逐步示意" },
  { id: "example", label: "手算實例" },
  { id: "pseudo", label: "虛擬碼" },
  { id: "code", label: "程式碼" },
  { id: "exam", label: "考試要點" },
  { id: "quiz", label: "自我測驗" },
];

export function Lesson({ algorithm }: { algorithm: Algorithm }) {
  const cat = CATEGORIES.find((c) => c.id === algorithm.category);
  const related = algorithm.related
    .map((s) => getAlgorithm(s))
    .filter((x): x is Algorithm => Boolean(x));

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_200px]">
      <article className="min-w-0 space-y-10">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground">
            <Link href="/" className="hover:underline">
              目錄
            </Link>
            <span className="mx-1.5">/</span>
            {cat?.name}
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <h1 className="font-heading text-3xl sm:text-4xl">{algorithm.name}</h1>
            <span className="pb-1 text-sm text-muted-foreground">{algorithm.english}</span>
            <Badge className="bg-vermillion/15 text-vermillion">考頻 {algorithm.examWeight}</Badge>
          </div>
          <p className="mt-4 max-w-3xl text-[15px] leading-7">{algorithm.summary}</p>
        </div>

        <section id="intro" className="scroll-mt-20 space-y-3">
          <h2 className="font-heading text-2xl">想法</h2>
          <p className="leading-7 text-[15px]">{algorithm.idea}</p>
          <div>
            <h3 className="mb-2 text-sm font-medium">什麼時候用</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
              {algorithm.whenToUse.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="complexity" className="scroll-mt-20 space-y-3">
          <h2 className="font-heading text-2xl">複雜度與性質</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="最好" value={algorithm.complexity.timeBest} />
            <Stat label="平均" value={algorithm.complexity.timeAvg} />
            <Stat label="最壞" value={algorithm.complexity.timeWorst} />
            <Stat label="空間" value={algorithm.complexity.space} />
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {algorithm.complexity.stable !== undefined && (
              <Badge variant="outline">
                {algorithm.complexity.stable ? "穩定" : "不穩定"}
              </Badge>
            )}
            {algorithm.complexity.inPlace !== undefined && (
              <Badge variant="outline">
                {algorithm.complexity.inPlace ? "原地" : "非原地"}
              </Badge>
            )}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {algorithm.complexityNote}
          </p>
        </section>

        {algorithm.visualizer !== "none" && (
          <section id="demo" className="scroll-mt-20 space-y-3">
            <h2 className="font-heading text-2xl">逐步示意</h2>
            <p className="text-sm text-muted-foreground">
              用同一組小例子把演算法跑一遍。先按「下一步」跟手算，再按播放看連續過程。
            </p>
            <Card className="paper-card">
              <CardContent className="pt-4">
                <AlgorithmVisualizer slug={algorithm.slug} />
              </CardContent>
            </Card>
          </section>
        )}

        <section id="example" className="scroll-mt-20 space-y-3">
          <h2 className="font-heading text-2xl">手算實例</h2>
          <Card className="paper-card rule-line">
            <CardHeader>
              <CardTitle>{algorithm.workedExample.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                輸入：{algorithm.workedExample.input}
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <ol className="space-y-3">
                {algorithm.workedExample.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Separator />
              <p className="text-sm">
                <span className="font-medium">結果：</span>
                {algorithm.workedExample.result}
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="pseudo" className="scroll-mt-20 space-y-3">
          <h2 className="font-heading text-2xl">虛擬碼</h2>
          <PseudoBlock text={algorithm.pseudocode} />
        </section>

        <section id="code" className="scroll-mt-20 space-y-3">
          <h2 className="font-heading text-2xl">實際程式碼</h2>
          <CodeTabs codes={algorithm.codes} />
        </section>

        <section id="exam" className="scroll-mt-20 space-y-4">
          <h2 className="font-heading text-2xl">考試要點與易錯</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">命題常考</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1.5 pl-4 text-sm leading-6">
                  {algorithm.examTips.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-vermillion">容易寫錯</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1.5 pl-4 text-sm leading-6">
                  {algorithm.pitfalls.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="quiz" className="scroll-mt-20 space-y-3">
          <h2 className="font-heading text-2xl">自我測驗</h2>
          <Card className="paper-card">
            <CardContent className="pt-4">
              <Quiz questions={algorithm.quiz} slug={algorithm.slug} />
            </CardContent>
          </Card>
        </section>

        {related.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-heading text-xl">接著看</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/algorithms/${r.slug}`}
                  className="rounded-full bg-card px-3 py-1 text-sm ring-1 ring-border hover:bg-muted"
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <aside className="hidden lg:block">
        <nav className="sticky top-20 space-y-1 text-sm">
          <p className="mb-2 text-xs tracking-wide text-muted-foreground">本頁</p>
          {toc
            .filter((t) => algorithm.visualizer !== "none" || t.id !== "demo")
            .map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {t.label}
              </a>
            ))}
        </nav>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card px-3 py-2 ring-1 ring-border">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-mono text-sm">{value}</p>
    </div>
  );
}
