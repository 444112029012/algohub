"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  edgeKey,
  getArrayTrace,
  getGraphTrace,
  getIntervalTrace,
  getSetCoverTrace,
  getTableTrace,
  graphLayout,
  bellmanFordTrace,
  spfaTrace,
  type ArrayKind,
  type CoverElemState,
  type CoverSetState,
  type GraphEdgeState,
  type GraphNodeState,
  type IntervalState,
} from "@/lib/traces";
import { cn } from "@/lib/utils";

const KIND_CLASS: Record<ArrayKind, string> = {
  compare: "bg-gold/80 text-foreground ring-2 ring-gold",
  pivot: "bg-vermillion text-white ring-2 ring-vermillion",
  sorted: "bg-teal text-white",
  left: "bg-sky-300/90 text-sky-950",
  right: "bg-amber-300/90 text-amber-950",
  write: "bg-violet-500 text-white ring-2 ring-violet-700",
  mid: "bg-vermillion text-white ring-2 ring-foreground/30",
  range: "bg-primary/10 ring-2 ring-primary/30",
  swap: "bg-vermillion/90 text-white",
};

const KIND_LABEL: Record<ArrayKind, string> = {
  compare: "比較",
  pivot: "Pivot / 根",
  sorted: "已定位",
  left: "左",
  right: "右",
  write: "寫入",
  mid: "中點",
  range: "區間",
  swap: "交換",
};

function StepBar({
  i,
  n,
  playing,
  onPrev,
  onNext,
  onToggle,
  onReset,
}: {
  i: number;
  n: number;
  playing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={onReset}>
        重來
      </Button>
      <Button size="sm" variant="outline" onClick={onPrev} disabled={i <= 0}>
        上一步
      </Button>
      <Button size="sm" onClick={onToggle}>
        {playing ? "暫停" : "播放"}
      </Button>
      <Button size="sm" variant="outline" onClick={onNext} disabled={i >= n - 1}>
        下一步
      </Button>
      <span className="text-xs text-muted-foreground">
        第 {i + 1} / {n} 步
      </span>
    </div>
  );
}

function usePlayer(n: number, ms = 900) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (i >= n - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setI((x) => Math.min(n - 1, x + 1)), ms);
    return () => window.clearTimeout(t);
  }, [playing, i, n, ms]);
  return {
    i,
    playing,
    setPlaying,
    prev: () => {
      setPlaying(false);
      setI((x) => Math.max(0, x - 1));
    },
    next: () => {
      setPlaying(false);
      setI((x) => Math.min(n - 1, x + 1));
    },
    reset: () => {
      setPlaying(false);
      setI(0);
    },
  };
}

function HeapTree({
  values,
  highlights,
}: {
  values: number[];
  highlights: { index: number; kind: ArrayKind }[];
}) {
  if (!values.length) return null;
  const pos = (i: number) => {
    const level = Math.floor(Math.log2(i + 1));
    const indexInLevel = i - (2 ** level - 1);
    const count = 2 ** level;
    return { x: ((indexInLevel + 0.5) / count) * 400 + 15, y: 22 + level * 52 };
  };
  const fill: Record<ArrayKind, string> = {
    compare: "#e7c46a",
    pivot: "#c23b22",
    sorted: "#2f9e8f",
    left: "#7dd3fc",
    right: "#fcd34d",
    write: "#8b5cf6",
    mid: "#c23b22",
    range: "#2a3d66",
    swap: "#c23b22",
  };
  const levels = Math.floor(Math.log2(Math.max(1, values.length - 1))) + 1;
  const height = 36 + levels * 52;
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">同一份陣列畫成完全二元樹。父節點要 ≥ 兩個孩子。</p>
      <svg viewBox={`0 0 430 ${height}`} className="h-auto w-full overflow-visible">
        {values.map((_, i) => {
          if (i === 0) return null;
          const parent = Math.floor((i - 1) / 2);
          const a = pos(parent);
          const b = pos(i);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const r = 18;
          return (
            <line
              key={`e${i}`}
              x1={a.x + (dx / len) * r}
              y1={a.y + (dy / len) * r}
              x2={b.x - (dx / len) * r}
              y2={b.y - (dy / len) * r}
              stroke="#b7aa94"
              strokeWidth={1.6}
            />
          );
        })}
        {values.map((v, i) => {
          const { x, y } = pos(i);
          const kind = highlights.find((h) => h.index === i)?.kind;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={16} fill={kind ? fill[kind] : "#2a3d66"} stroke="#1a2744" />
              <text x={x} y={y + 4} textAnchor="middle" className="fill-white text-[12px] font-semibold">
                {v}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function BellmanModes() {
  const [mode, setMode] = useState<"scan" | "queue">("scan");
  const frames = useMemo(
    () => (mode === "scan" ? bellmanFordTrace() : spfaTrace()),
    [mode]
  );
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={mode === "scan" ? "default" : "outline"} onClick={() => setMode("scan")}>
          每一輪掃全部邊
        </Button>
        <Button size="sm" variant={mode === "queue" ? "default" : "outline"} onClick={() => setMode("queue")}>
          只處理有變短的點
        </Button>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        {mode === "scan"
          ? "距離寫在點的下方。這一輪改短了也不代表定案，下一輪還可能再變。"
          : "黃點在佇列裡。同一個點若已經在佇列中，不要再排一次，但距離仍可以更新。"}
      </p>
      <GraphVis key={mode} slug="bellman-ford" frames={frames} legend={mode === "scan" ? "bellman-ford" : "spfa"} />
    </div>
  );
}

function ReductionChain({ focus }: { focus: string }) {
  const rows = [
    {
      id: "is",
      steps: [
        { slug: "three-sat", label: "3-SAT" },
        { slug: "clique-independent-set", label: "獨立集" },
        { slug: "vertex-cover", label: "點覆蓋" },
      ],
    },
    {
      id: "tsp",
      steps: [
        { slug: "three-sat", label: "3-SAT" },
        { slug: "hamilton-tsp", label: "哈密頓" },
        { slug: "hamilton-tsp", label: "TSP" },
      ],
    },
    {
      id: "sum",
      steps: [
        { slug: "three-sat", label: "3-SAT" },
        { slug: "subset-sum", label: "子集和" },
      ],
    },
  ];
  const note =
    focus === "clique-independent-set"
      ? "這一頁站在中間：獨立集和團是補圖，獨立集再補集就是點覆蓋。箭頭方向是「左邊能化約到右邊」，所以右邊至少和左邊一樣難。"
      : focus === "hamilton-tsp"
        ? "哈密頓迴路問的是點能不能走完。度量 TSP 先做最小生成樹再加倍、抄捷徑，長度不超過最佳解的兩倍。歐拉迴路問的是邊，那個在 P。"
        : "3-SAT 是這幾條鏈的起點。要證明右邊是 NP-complete，就寫「3-SAT 能在多項式時間化成它」。箭頭不能反過來背。";
  return (
    <div className="space-y-3">
      <p className="text-sm leading-6">{note}</p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex flex-wrap items-center gap-2">
            {row.steps.map((step, i) => (
              <div key={`${row.id}-${step.label}`} className="flex items-center gap-2">
                {i > 0 && <span className="text-xs text-muted-foreground">化約 →</span>}
                <Link
                  href={`/algorithms/${step.slug}`}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm ring-1 ring-border",
                    step.slug === focus ? "bg-vermillion/15 text-vermillion" : "bg-card"
                  )}
                >
                  {step.label}
                </Link>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        子集和有 Θ(nT) 的表，所以是弱 NP-complete。3-SAT、團、哈密頓沒有這種偽多項式表。
      </p>
    </div>
  );
}

export function AlgorithmVisualizer({ slug }: { slug: string }) {
  const array = useMemo(() => getArrayTrace(slug), [slug]);
  const graph = useMemo(() => getGraphTrace(slug), [slug]);
  const table = useMemo(() => getTableTrace(slug), [slug]);
  const sets = useMemo(() => getSetCoverTrace(slug), [slug]);
  const intervals = useMemo(() => getIntervalTrace(slug), [slug]);
  if (slug === "three-sat" || slug === "clique-independent-set" || slug === "hamilton-tsp") {
    return <ReductionChain focus={slug} />;
  }
  if (array.length) return <ArrayVis frames={array} tree={slug === "heap" || slug === "heap-sort"} />;
  if (slug === "bellman-ford") return <BellmanModes />;
  if (graph.length) return <GraphVis slug={slug} frames={graph} />;
  if (table.length) return <TableVis frames={table} />;
  if (sets.length) return <SetCoverVis frames={sets} />;
  if (intervals.length) return <IntervalVis frames={intervals} />;
  return null;
}

function ArrayVis({
  frames,
  tree,
}: {
  frames: ReturnType<typeof getArrayTrace>;
  tree?: boolean;
}) {
  const p = usePlayer(frames.length);
  const f = frames[p.i]!;
  const kinds = new Set(f.highlights.map((h) => h.kind));
  const max = Math.max(1, ...frames.flatMap((fr) => fr.array));
  return (
    <div className="space-y-4">
      {tree ? <HeapTree values={f.array} highlights={f.highlights} /> : null}
      <div className="flex h-44 items-end gap-1 sm:gap-1.5">
        {f.array.map((v, idx) => {
          const hi = f.highlights.find((h) => h.index === idx);
          return (
            <div key={idx} className="flex min-w-0 flex-1 basis-0 flex-col items-center gap-1">
              <div
                className={cn(
                  "flex w-full items-end justify-center rounded-md text-xs font-semibold transition-all duration-300",
                  hi ? KIND_CLASS[hi.kind] : "bg-primary/80 text-primary-foreground"
                )}
                style={{ height: `${Math.max(18, (v / max) * 140)}px` }}
              >
                {v}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{idx}</span>
            </div>
          );
        })}
      </div>
      <p className="min-h-12 whitespace-pre-line rounded-lg bg-muted/70 px-3 py-2 text-sm leading-6">
        {f.message}
      </p>
      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
        {[...kinds].map((k) => (
          <span key={k} className="inline-flex items-center gap-1">
            <span className={cn("inline-block size-2.5 rounded-sm", KIND_CLASS[k])} />
            {KIND_LABEL[k]}
          </span>
        ))}
      </div>
      <StepBar
        i={p.i}
        n={frames.length}
        playing={p.playing}
        onPrev={p.prev}
        onNext={p.next}
        onToggle={() => p.setPlaying(!p.playing)}
        onReset={p.reset}
      />
    </div>
  );
}

const NODE_FILL: Record<GraphNodeState, string> = {
  idle: "#e8e0d0",
  queued: "#e7c46a",
  current: "#c23b22",
  visited: "#2f9e8f",
  done: "#2a3d66",
};

const EDGE_STROKE: Record<GraphEdgeState, string> = {
  idle: "#b7aa94",
  active: "#c23b22",
  tree: "#2f9e8f",
  relaxed: "#3d6ea8",
  rejected: "#c9bfae",
};

function graphLegend(slug: string): { color: string; label: string; dashed?: boolean }[] {
  if (slug === "scc") {
    return [
      { color: NODE_FILL.current, label: "正在走的點" },
      { color: NODE_FILL.visited, label: "第一輪已離開（有完成時間）" },
      { color: NODE_FILL.done, label: "已放進某個分量" },
      { color: EDGE_STROKE.tree, label: "第一輪走的邊" },
      { color: EDGE_STROKE.relaxed, label: "第二輪（反向圖）走的邊" },
    ];
  }
  if (slug === "kruskal" || slug === "prim") {
    return [
      { color: NODE_FILL.current, label: "剛連上的點" },
      { color: NODE_FILL.visited, label: "已在樹上" },
      { color: EDGE_STROKE.tree, label: "加入 MST 的邊" },
      { color: EDGE_STROKE.rejected, label: "會成環，丟掉", dashed: true },
    ];
  }
  if (slug === "bellman-ford") {
    return [
      { color: NODE_FILL.queued, label: "這一輪變短了，還沒定案" },
      { color: EDGE_STROKE.relaxed, label: "這步把距離改短" },
      { color: EDGE_STROKE.rejected, label: "走這條沒有更短", dashed: true },
    ];
  }
  if (slug === "spfa") {
    return [
      { color: NODE_FILL.queued, label: "在佇列裡，等一下要處理" },
      { color: NODE_FILL.current, label: "正在看它走出去的邊" },
      { color: EDGE_STROKE.relaxed, label: "這步把距離改短" },
      { color: EDGE_STROKE.rejected, label: "走這條沒有更短", dashed: true },
    ];
  }
  if (slug === "dijkstra") {
    return [
      { color: NODE_FILL.queued, label: "距離改過，還沒被挑中" },
      { color: NODE_FILL.current, label: "這一步挑中、距離定案" },
      { color: NODE_FILL.visited, label: "已經定案" },
      { color: EDGE_STROKE.relaxed, label: "這步把距離改短" },
      { color: EDGE_STROKE.rejected, label: "沒有更短", dashed: true },
    ];
  }
  if (slug === "two-sat") {
    return [
      { color: EDGE_STROKE.relaxed, label: "這一對剛加上的箭頭" },
      { color: EDGE_STROKE.tree, label: "已經畫上的強制關係" },
      { color: NODE_FILL.visited, label: "這組解裡設成真" },
      { color: NODE_FILL.done, label: "這組解裡設成假的那側" },
    ];
  }
  if (slug === "bst") {
    return [
      { color: NODE_FILL.current, label: "這一步正在比較或剛放上的點" },
      { color: NODE_FILL.visited, label: "已經在樹上" },
      { color: EDGE_STROKE.tree, label: "父節點指向孩子" },
    ];
  }
  if (slug === "max-flow") {
    return [
      { color: NODE_FILL.current, label: "增廣路上的點" },
      { color: EDGE_STROKE.tree, label: "這條增廣路" },
      { color: EDGE_STROKE.rejected, label: "流量已滿", dashed: true },
    ];
  }
  if (slug === "vertex-cover") {
    return [
      { color: NODE_FILL.current, label: "放進覆蓋的點" },
      { color: EDGE_STROKE.tree, label: "這步取的匹配邊" },
      { color: EDGE_STROKE.rejected, label: "已被蓋掉的邊", dashed: true },
    ];
  }
  return [
    { color: NODE_FILL.queued, label: "佇列裡、還沒走" },
    { color: NODE_FILL.current, label: "正在處理" },
    { color: NODE_FILL.visited, label: "已經走過" },
    { color: EDGE_STROKE.tree, label: "這步採用的邊" },
    { color: EDGE_STROKE.rejected, label: "略過", dashed: true },
  ];
}

const NODE_R = 18;

function edgeGeometry(
  a: { x: number; y: number },
  b: { x: number; y: number },
  directed: boolean
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const pad = 5;
  const arrow = directed ? 8 : 0;
  return {
    x1: a.x + ux * (NODE_R + pad),
    y1: a.y + uy * (NODE_R + pad),
    x2: b.x - ux * (NODE_R + pad + arrow),
    y2: b.y - uy * (NODE_R + pad + arrow),
    px: -uy,
    py: ux,
  };
}

function pointSegDistance(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number }
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

function clearanceBend(
  a: { x: number; y: number },
  b: { x: number; y: number },
  px: number,
  py: number,
  nodes: { x: number; y: number }[]
) {
  const blocked = nodes.some(
    (n) => n !== a && n !== b && pointSegDistance(n, a, b) < NODE_R + 8
  );
  if (!blocked) return 0;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const reach = NODE_R + 36;
  const score = (sign: number) => {
    const x = mid.x + px * sign * reach;
    const y = mid.y + py * sign * reach;
    return nodes.reduce((sum, n) => sum + Math.hypot(n.x - x, n.y - y), 0);
  };
  return (score(1) >= score(-1) ? 1 : -1) * reach;
}

function distOffset(
  n: { id: string; x: number; y: number },
  nodes: { id: string; x: number; y: number }[],
  edges: { u: string; v: string }[]
) {
  const dirs: [number, number][] = [
    [0, -1],
    [1, -0.45],
    [1, 0.45],
    [0, 1],
    [-1, 0.45],
    [-1, -0.45],
  ];
  const neighbors = edges
    .filter((e) => e.u === n.id || e.v === n.id)
    .map((e) => nodes.find((x) => x.id === (e.u === n.id ? e.v : e.u)))
    .filter((x): x is { id: string; x: number; y: number } => Boolean(x));
  let best = dirs[0];
  let bestScore = -Infinity;
  for (const [dx, dy] of dirs) {
    const mag = Math.hypot(dx, dy);
    const ux = dx / mag;
    const uy = dy / mag;
    let score = neighbors.length === 0 ? -dy : 0;
    for (const o of neighbors) {
      const vx = o.x - n.x;
      const vy = o.y - n.y;
      const vmag = Math.hypot(vx, vy) || 1;
      score -= (ux * vx + uy * vy) / vmag;
    }
    if (n.x < 96 && dx < 0) score -= 1.4;
    if (n.x > 340 && dx > 0) score -= 1.4;
    if (n.y < 70 && dy < 0) score -= 0.25;
    if (n.y > 170 && dy > 0) score -= 0.25;
    if (score > bestScore) {
      bestScore = score;
      best = [dx, dy];
    }
  }
  const mag = Math.hypot(best[0], best[1]);
  return { x: n.x + (best[0] / mag) * 34, y: n.y + (best[1] / mag) * 32 };
}

function EdgeChip({ x, y, text }: { x: number; y: number; text: string }) {
  const w = Math.max(18, text.length * 7 + 10);
  return (
    <g>
      <rect x={x - w / 2} y={y - 9} width={w} height={16} rx={4} fill="var(--card)" stroke="var(--border)" />
      <text x={x} y={y + 3} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
        {text}
      </text>
    </g>
  );
}

function GraphVis({
  slug,
  frames,
  legend,
}: {
  slug: string;
  frames: ReturnType<typeof getGraphTrace>;
  legend?: string;
}) {
  const p = usePlayer(frames.length, 1400);
  const f = frames[p.i]!;
  const layout = graphLayout(slug);
  const shown = f.shown ? new Set(f.shown) : null;
  const visibleEdges = layout.edges.filter(
    (e) => !shown || (shown.has(e.u) && shown.has(e.v))
  );
  const arrowId = `arrow-${slug}`;

  return (
    <div className="space-y-4">
      <svg viewBox="-16 -36 462 320" className="h-auto w-full overflow-visible">
        <defs>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b6256" />
          </marker>
        </defs>
        {visibleEdges.map((e) => {
          const a = layout.nodes.find((n) => n.id === e.u)!;
          const b = layout.nodes.find((n) => n.id === e.v)!;
          const key = e.directed ? `${e.u}>${e.v}` : edgeKey(e.u, e.v);
          const st = f.edgeStates[key] ?? "idle";
          const geom = edgeGeometry(a, b, e.directed);
          const mutual = e.directed && visibleEdges.some((o) => o.u === e.v && o.v === e.u);
          const side = e.u < e.v ? 1 : -1;
          const avoid = clearanceBend(a, b, geom.px, geom.py, layout.nodes);
          let bend = mutual ? 26 * side : 0;
          if (avoid) bend = Math.sign(avoid) * Math.max(Math.abs(bend), Math.abs(avoid));
          const label = f.edgeLabels?.[key] ?? (e.w !== undefined ? String(e.w) : "");
          const labelW = Math.max(18, label.length * 7 + 10);
          const lift = bend === 0 ? labelW / 2 + 10 : bend + Math.sign(bend) * (labelW / 2 + 6);
          const mx = (geom.x1 + geom.x2) / 2 + geom.px * lift;
          const my = (geom.y1 + geom.y2) / 2 + geom.py * lift;
          const cpx = (geom.x1 + geom.x2) / 2 + geom.px * bend;
          const cpy = (geom.y1 + geom.y2) / 2 + geom.py * bend;
          const d = bend
            ? `M ${geom.x1} ${geom.y1} Q ${cpx} ${cpy} ${geom.x2} ${geom.y2}`
            : `M ${geom.x1} ${geom.y1} L ${geom.x2} ${geom.y2}`;
          return (
            <g key={key}>
              <path
                d={d}
                fill="none"
                stroke={EDGE_STROKE[st]}
                strokeWidth={st === "tree" || st === "relaxed" ? 3.5 : st === "idle" ? 1.6 : 3}
                strokeDasharray={st === "rejected" ? "4 4" : undefined}
                markerEnd={e.directed ? `url(#${arrowId})` : undefined}
              />
              {label && <EdgeChip x={mx} y={my} text={label} />}
            </g>
          );
        })}
        {layout.nodes.map((n) => {
          if (shown && !shown.has(n.id)) return null;
          const st = f.nodeStates[n.id] ?? "idle";
          const dist = f.dist?.[n.id];
          const at = dist === undefined ? null : distOffset(n, layout.nodes, visibleEdges);
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={18}
                fill={NODE_FILL[st]}
                stroke="#1a2744"
                strokeWidth={1.2}
              />
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                className="fill-white text-[13px] font-semibold"
                style={{ fill: st === "idle" || st === "queued" ? "#1a2744" : "#fff" }}
              >
                {n.id}
              </text>
              {at && dist !== undefined && <EdgeChip x={at.x} y={at.y} text={String(dist)} />}
            </g>
          );
        })}
      </svg>
      <p className="min-h-12 whitespace-pre-line rounded-lg bg-muted/70 px-3 py-2 text-sm leading-6">
        {f.message}
      </p>
      <div className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
        <span className="rounded bg-card px-2 py-1 ring-1 ring-border">
          {f.structureLabel}：{f.structure.join(" · ") || "（空）"}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        {graphLegend(legend ?? slug).map((item) => (
          <Legend key={item.label} color={item.color} label={item.label} dashed={item.dashed} />
        ))}
      </div>
      <StepBar
        i={p.i}
        n={frames.length}
        playing={p.playing}
        onPrev={p.prev}
        onNext={p.next}
        onToggle={() => p.setPlaying(!p.playing)}
        onReset={p.reset}
      />
    </div>
  );
}

function Legend({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block size-2.5 rounded-full"
        style={{
          background: dashed ? "transparent" : color,
          border: `2px ${dashed ? "dashed" : "solid"} ${color}`,
        }}
      />
      {label}
    </span>
  );
}

function TableVis({ frames }: { frames: ReturnType<typeof getTableTrace> }) {
  const p = usePlayer(frames.length, 1250);
  const f = frames[p.i]!;
  const roleOf = (ri: number, ci: number): "current" | "read" | null => {
    const hit = f.highlight.find((h) => h.r === ri && h.c === ci);
    if (!hit) return null;
    if (hit.role) return hit.role;
    const first = f.highlight[0];
    return first && first.r === ri && first.c === ci ? "current" : "read";
  };
  return (
    <div className="space-y-4">
      {(f.rowTitle || f.colTitle) && (
        <p className="text-xs leading-5 text-muted-foreground">
          {f.colTitle ? <span>橫軸（欄）：{f.colTitle}</span> : null}
          {f.rowTitle && f.colTitle ? <span className="mx-2">·</span> : null}
          {f.rowTitle ? <span>縱軸（列）：{f.rowTitle}</span> : null}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-0 text-center text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="border border-border bg-muted/60 px-2 py-1.5 font-medium" />
              {f.colLabels.map((c) => (
                <th
                  key={c}
                  className="border border-border bg-muted/60 px-2 py-1.5 font-medium"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {f.cells.map((row, ri) => (
              <tr key={ri}>
                <th className="border border-border bg-muted/40 px-2 py-1.5 text-left text-xs font-medium sm:text-sm">
                  {f.rowLabels[ri]}
                </th>
                {row.map((cell, ci) => {
                  const role = roleOf(ri, ci);
                  return (
                    <td
                      key={ci}
                      className={cn(
                        "border border-border px-2 py-1.5 font-mono transition-colors",
                        role === "current" &&
                          "bg-gold/55 font-semibold ring-2 ring-vermillion/70",
                        role === "read" && "bg-sky-200/80 ring-1 ring-sky-500/50"
                      )}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-gold/80 ring-1 ring-vermillion/70" />
          正在填的格子
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-sky-200 ring-1 ring-sky-500/60" />
          這一步去看的舊格子
        </span>
        {f.legend ? <span>{f.legend}</span> : null}
      </p>
      <p className="min-h-12 whitespace-pre-line rounded-lg bg-muted/70 px-3 py-2 text-sm leading-6">
        {f.message}
      </p>
      <StepBar
        i={p.i}
        n={frames.length}
        playing={p.playing}
        onPrev={p.prev}
        onNext={p.next}
        onToggle={() => p.setPlaying(!p.playing)}
        onReset={p.reset}
      />
    </div>
  );
}

const ELEM_CLASS: Record<CoverElemState, string> = {
  uncovered: "bg-muted text-muted-foreground",
  new: "bg-gold text-foreground ring-2 ring-vermillion/50",
  covered: "bg-teal text-white",
};

const SET_RING: Record<CoverSetState, string> = {
  idle: "ring-border",
  best: "ring-2 ring-vermillion bg-vermillion/5",
  picked: "ring-2 ring-teal bg-teal/10",
  stale: "opacity-45 ring-border",
};

function SetCoverVis({ frames }: { frames: ReturnType<typeof getSetCoverTrace> }) {
  const p = usePlayer(frames.length);
  const f = frames[p.i]!;
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs text-muted-foreground">宇宙 U</p>
        <div className="flex flex-wrap gap-2">
          {f.universe.map((el) => (
            <span
              key={el.id}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                ELEM_CLASS[el.state]
              )}
            >
              {el.id}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {f.sets.map((s) => (
          <div
            key={s.name}
            className={cn("rounded-xl bg-card px-3 py-2.5 ring-1 transition-all", SET_RING[s.state])}
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-medium">{s.name}</p>
              <p className="font-mono text-xs text-muted-foreground">新蓋 {s.remaining}</p>
            </div>
            <p className="mt-1 font-mono text-sm">
              {"{"}
              {s.elements.join(", ")}
              {"}"}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        已選：{f.picked.length ? f.picked.join("、") : "尚無"}
        <span className="mx-2">·</span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-gold" /> 本步新蓋
        </span>
        <span className="ml-2 inline-flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-teal" /> 已覆蓋
        </span>
      </p>
      <p className="min-h-12 whitespace-pre-line rounded-lg bg-muted/70 px-3 py-2 text-sm leading-6">
        {f.message}
      </p>
      <StepBar
        i={p.i}
        n={frames.length}
        playing={p.playing}
        onPrev={p.prev}
        onNext={p.next}
        onToggle={() => p.setPlaying(!p.playing)}
        onReset={p.reset}
      />
    </div>
  );
}

const INT_CLASS: Record<IntervalState, string> = {
  idle: "bg-primary/70",
  cand: "bg-vermillion",
  picked: "bg-teal",
  rejected: "bg-muted-foreground/30",
};

function IntervalVis({ frames }: { frames: ReturnType<typeof getIntervalTrace> }) {
  const p = usePlayer(frames.length);
  const f = frames[p.i]!;
  const maxT = Math.max(...f.intervals.map((x) => x.end), 1);
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        {f.intervals.map((it) => (
          <div key={it.name} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-xs font-medium">{it.name}</span>
            <div className="relative h-6 flex-1 rounded bg-muted/50">
              <div
                className={cn(
                  "absolute top-0.5 h-5 rounded-sm transition-all",
                  INT_CLASS[it.state]
                )}
                style={{
                  left: `${(it.start / maxT) * 100}%`,
                  width: `${((it.end - it.start) / maxT) * 100}%`,
                }}
              />
            </div>
            <span className="w-16 shrink-0 font-mono text-[11px] text-muted-foreground">
              [{it.start},{it.end}]
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        已選：{f.picked.length ? f.picked.join("、") : "尚無"}
      </p>
      <p className="min-h-12 whitespace-pre-line rounded-lg bg-muted/70 px-3 py-2 text-sm leading-6">
        {f.message}
      </p>
      <StepBar
        i={p.i}
        n={frames.length}
        playing={p.playing}
        onPrev={p.prev}
        onNext={p.next}
        onToggle={() => p.setPlaying(!p.playing)}
        onReset={p.reset}
      />
    </div>
  );
}
