"use client";

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
  pivot: "樞紐 / 根",
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

function usePlayer(n: number) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (i >= n - 1) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setI((x) => Math.min(n - 1, x + 1)), 900);
    return () => window.clearTimeout(t);
  }, [playing, i, n]);
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

export function AlgorithmVisualizer({ slug }: { slug: string }) {
  const array = useMemo(() => getArrayTrace(slug), [slug]);
  const graph = useMemo(() => getGraphTrace(slug), [slug]);
  const table = useMemo(() => getTableTrace(slug), [slug]);
  const sets = useMemo(() => getSetCoverTrace(slug), [slug]);
  const intervals = useMemo(() => getIntervalTrace(slug), [slug]);
  if (array.length) return <ArrayVis frames={array} />;
  if (graph.length) return <GraphVis slug={slug} frames={graph} />;
  if (table.length) return <TableVis frames={table} />;
  if (sets.length) return <SetCoverVis frames={sets} />;
  if (intervals.length) return <IntervalVis frames={intervals} />;
  return null;
}

function ArrayVis({ frames }: { frames: ReturnType<typeof getArrayTrace> }) {
  const p = usePlayer(frames.length);
  const f = frames[p.i]!;
  const kinds = new Set(f.highlights.map((h) => h.kind));
  const max = Math.max(...frames[0]!.array);
  return (
    <div className="space-y-4">
      <div className="flex h-44 items-end justify-center gap-1.5 sm:gap-2">
        {f.array.map((v, idx) => {
          const hi = f.highlights.find((h) => h.index === idx);
          return (
            <div key={idx} className="flex w-10 flex-col items-center gap-1 sm:w-12">
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
      <p className="min-h-12 rounded-lg bg-muted/70 px-3 py-2 text-sm">{f.message}</p>
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

function GraphVis({
  slug,
  frames,
}: {
  slug: string;
  frames: ReturnType<typeof getGraphTrace>;
}) {
  const p = usePlayer(frames.length);
  const f = frames[p.i]!;
  const layout = graphLayout(slug);

  return (
    <div className="space-y-4">
      <svg viewBox="0 0 430 240" className="h-auto w-full overflow-visible">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="18"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b6256" />
          </marker>
        </defs>
        {layout.edges.map((e) => {
          const a = layout.nodes.find((n) => n.id === e.u)!;
          const b = layout.nodes.find((n) => n.id === e.v)!;
          const key = e.directed ? `${e.u}>${e.v}` : edgeKey(e.u, e.v);
          const st = f.edgeStates[key] ?? "idle";
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const label = f.edgeLabels?.[key] ?? (e.w !== undefined ? String(e.w) : "");
          return (
            <g key={key}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={EDGE_STROKE[st]}
                strokeWidth={st === "tree" || st === "relaxed" ? 3.5 : st === "idle" ? 1.6 : 3}
                strokeDasharray={st === "rejected" ? "4 4" : undefined}
                markerEnd={e.directed ? "url(#arrow)" : undefined}
              />
              {label && (
                <text x={mx + 6} y={my - 6} className="fill-foreground text-[11px]">
                  {label}
                </text>
              )}
            </g>
          );
        })}
        {layout.nodes.map((n) => {
          const st = f.nodeStates[n.id] ?? "idle";
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
            </g>
          );
        })}
      </svg>
      <p className="min-h-12 rounded-lg bg-muted/70 px-3 py-2 text-sm">{f.message}</p>
      <div className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
        <span className="rounded bg-card px-2 py-1 ring-1 ring-border">
          {f.structureLabel}：{f.structure.join(" · ") || "∅"}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <Legend color={NODE_FILL.queued} label="佇列 / 候選" />
        <Legend color={NODE_FILL.current} label="當前" />
        <Legend color={NODE_FILL.visited} label="已處理" />
        <Legend color={EDGE_STROKE.tree} label="樹邊 / 匹配 / 增廣" />
        <Legend color={EDGE_STROKE.rejected} label="捨棄" dashed />
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
  const p = usePlayer(frames.length);
  const f = frames[p.i]!;
  const hi = new Set(f.highlight.map((h) => `${h.r},${h.c}`));
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-center text-sm">
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
                <th className="border border-border bg-muted/40 px-2 py-1.5 font-medium">
                  {f.rowLabels[ri]}
                </th>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "border border-border px-2 py-1.5 font-mono transition-colors",
                      hi.has(`${ri},${ci}`) && "bg-gold/50 ring-2 ring-vermillion/60"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="min-h-12 rounded-lg bg-muted/70 px-3 py-2 text-sm">{f.message}</p>
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
      <p className="min-h-12 rounded-lg bg-muted/70 px-3 py-2 text-sm">{f.message}</p>
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
      <p className="min-h-12 rounded-lg bg-muted/70 px-3 py-2 text-sm">{f.message}</p>
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
