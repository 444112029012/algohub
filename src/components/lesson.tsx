import Link from "next/link";
import { AlgorithmVisualizer } from "@/components/visualizer";
import { CodeTabs, PseudoBlock } from "@/components/code-block";
import { Quiz } from "@/components/quiz";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RememberVisit } from "@/components/remember-visit";
import { getAlgorithm, type Algorithm } from "@/data";
import { CATEGORIES } from "@/data/types";
import { studyNeighbors } from "@/lib/study-path";

function demoLead(algorithm: Algorithm) {
  if (algorithm.slug === "bellman-ford") {
    return "點下方的數字是目前距離。先看「每一輪掃全部邊」：負邊存在時，挑中一個點也不能定案。再切到「只處理有變短的點」，那是同一張圖的佇列版本。建議按下一步。";
  }
  if (algorithm.slug === "dijkstra") {
    return "點下方的數字是目前距離。紅點是這一步定案的點：因為沒有負邊，它不會再變短。金黃是改過、但還沒被挑中。";
  }
  if (algorithm.slug === "heap" || algorithm.slug === "heap-sort") {
    return "上面是同一份數字畫成的樹，下面是陣列。父節點要大於或等於孩子。先看樹誰和誰交換，再對下面的下標。";
  }
  if (algorithm.slug === "bst") {
    return "比現在這個點小就往左，大就往右。還沒放入的點先不畫。這不是堆積：堆積的左右沒有大小順序。";
  }
  if (algorithm.slug === "vertex-cover") {
    return "實線是這一步抓的邊。還沒被蓋的邊都可以抓；動畫依列出順序抓，不是因為那條比較好。抓完後，碰到這兩個點的邊會變成虛線。";
  }
  if (algorithm.slug === "two-sat") {
    return "每個子句變成兩條箭頭。亮起來的是這一對。最後看 x 和 ¬x 能不能互相走到：能走到就是無解。";
  }
  if (algorithm.slug === "three-sat" || algorithm.slug === "clique-independent-set" || algorithm.slug === "hamilton-tsp") {
    return "箭頭是化約方向：左邊能在多項式時間變成右邊，所以右邊至少和左邊一樣難。點亮的是這一頁在鏈上的位置。";
  }
  if (algorithm.slug === "stack") {
    return "右邊是頂端。最後放進去的，下一次最先被拿走。";
  }
  if (algorithm.slug === "queue") {
    return "左邊是頭。先排進來的先離開，新的人排到右邊。";
  }
  if (algorithm.visualizer === "table") {
    return "金框是正在寫的那一格，淡藍是這一步去看的舊格子。先讀底下的旁白，再對表。建議按「下一步」，不要先按播放。";
  }
  if (algorithm.visualizer === "graph") {
    return "先看圖例，再按「下一步」。底下那句旁白在講這一動為什麼發生。";
  }
  if (algorithm.visualizer === "array") {
    return "色塊是正在比較、當 Pivot、或已經定位的位置。先看底下旁白，再對上面的數字。建議按「下一步」。";
  }
  if (algorithm.visualizer === "sets") {
    return "圓點是元素：金＝這步新蓋到，綠＝已經蓋過。每個集合旁邊的「新蓋」是這步還能多蓋幾個。";
  }
  if (algorithm.visualizer === "intervals") {
    return "紅＝正在考慮這段時間，綠＝已選，灰＝跟已選重疊所以丟掉。";
  }
  return "用同一組小例子把演算法跑一遍。";
}

function PathNav({ slug }: { slug: string }) {
  const hop = studyNeighbors(slug);
  if (!hop) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">
        讀序第 {hop.current.station} 節 · {hop.current.title}
      </span>
      {hop.prev && (
        <Link href={`/algorithms/${hop.prev.slug}`} className="rounded-full bg-card px-3 py-1 ring-1 ring-border hover:bg-muted">
          上一篇 {hop.prev.label}
        </Link>
      )}
      {hop.next && (
        <Link href={`/algorithms/${hop.next.slug}`} className="rounded-full bg-primary px-3 py-1 text-primary-foreground hover:bg-primary/90">
          下一篇 {hop.next.label}
        </Link>
      )}
    </div>
  );
}

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
    <div className="mx-auto grid w-full min-w-0 max-w-[1600px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_200px] lg:px-8">
      <RememberVisit slug={algorithm.slug} />
      <article className="min-w-0 space-y-10">
        <LessonToc items={toc.filter((t) => algorithm.visualizer !== "none" || t.id !== "demo")} mobile />
        <div>
          <p className="text-xs tracking-wide text-muted-foreground">
            <Link href="/" className="hover:underline">
              目錄
            </Link>
            <span className="mx-1.5">/</span>
            {cat?.name}
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <h1 className="font-heading text-[clamp(1.75rem,4vw,2.5rem)]">{algorithm.name}</h1>
            <span className="pb-1 text-sm text-muted-foreground">{algorithm.english}</span>
            <Badge className="bg-vermillion/15 text-vermillion">考頻 {algorithm.examWeight}</Badge>
          </div>
          <p className="mt-4 max-w-3xl text-[15px] leading-7">{algorithm.summary}</p>
          <PathNav slug={algorithm.slug} />
        </div>

        <section id="intro" className="scroll-mt-20 space-y-3">
          <h2 className="font-heading border-b border-border/80 pb-2 text-2xl">想法</h2>
          <p className="max-w-prose text-[15px] leading-7">{algorithm.idea}</p>
          {algorithm.slug === "master-theorem" && (
            <p className="text-sm leading-6 text-muted-foreground">
              這篇是三情況對照，用手算，沒有逐步動畫。
            </p>
          )}
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
          <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-4">
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
            <p className="text-sm leading-6 text-muted-foreground">{demoLead(algorithm)}</p>
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
            <h2 className="font-heading text-xl">相關題目</h2>
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
        <LessonToc items={toc.filter((t) => algorithm.visualizer !== "none" || t.id !== "demo")} />
      </aside>
    </div>
  );
}

function LessonToc({
  items,
  mobile,
}: {
  items: { id: string; label: string }[];
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <nav className="sticky top-14 z-30 -mx-4 flex gap-1 overflow-x-auto bg-paper/95 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
        {items.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="shrink-0 rounded-full bg-card px-3 py-1 text-xs ring-1 ring-border"
          >
            {t.label}
          </a>
        ))}
      </nav>
    );
  }
  return (
    <nav className="sticky top-20 space-y-1 text-sm">
      <p className="mb-2 text-xs tracking-wide text-muted-foreground">本頁</p>
      {items.map((t) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {t.label}
        </a>
      ))}
    </nav>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-card px-3 py-2 ring-1 ring-border">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-mono text-xs leading-snug break-words sm:text-sm">{value}</p>
    </div>
  );
}
