import {
  SCC_GRAPH,
  binarySearchAnswerTrace,
  bubbleSortTrace,
  countingSortTrace,
  heapDsTrace,
  insertionSortTrace,
  quickselectTrace,
  radixSortTrace,
  sccTrace,
  selectionSortTrace,
} from "./traces-extra";

export type ArrayKind =
  | "compare"
  | "pivot"
  | "sorted"
  | "left"
  | "right"
  | "write"
  | "mid"
  | "range"
  | "swap";

export type ArrayFrame = {
  array: number[];
  highlights: { index: number; kind: ArrayKind }[];
  message: string;
  lo?: number;
  hi?: number;
  mid?: number;
};

export type GraphNodeState = "idle" | "queued" | "current" | "visited" | "done";
export type GraphEdgeState = "idle" | "active" | "tree" | "relaxed" | "rejected";

export type GraphFrame = {
  nodeStates: Record<string, GraphNodeState>;
  edgeStates: Record<string, GraphEdgeState>;
  message: string;
  structureLabel: string;
  structure: string[];
  dist?: Record<string, number | string>;
  edgeLabels?: Record<string, string>;
};

export type TableHighlight = {
  r: number;
  c: number;
  /** 正在寫入的格；其餘預設當「這一步去抄的舊格」。 */
  role?: "current" | "read";
};

export type TableFrame = {
  rowLabels: string[];
  colLabels: string[];
  cells: (number | string)[][];
  highlight: TableHighlight[];
  message: string;
  /** 列／欄在問什麼，給填表動畫當軸說明。 */
  rowTitle?: string;
  colTitle?: string;
  legend?: string;
};

export const DEMO_ARRAY = [38, 27, 43, 3, 9, 82, 10];

function rangeHi(
  lo: number,
  hi: number,
  kind: ArrayKind
): { index: number; kind: ArrayKind }[] {
  const out = [];
  for (let i = lo; i <= hi; i++) out.push({ index: i, kind });
  return out;
}

export function mergeSortTrace(input = DEMO_ARRAY): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a = [...input];
  frames.push({
    array: [...a],
    highlights: [],
    message: `初始陣列：[${a.join(", ")}]。合併排序先一路切半，再兩兩合併。`,
  });

  function merge(lo: number, mid: number, hi: number) {
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    frames.push({
      array: [...a],
      highlights: [
        ...rangeHi(lo, mid, "left"),
        ...rangeHi(mid + 1, hi, "right"),
      ],
      message: `合併左 [${left.join(", ")}] 與右 [${right.join(", ")}]`,
      lo,
      hi,
    });
    let i = 0;
    let j = 0;
    let k = lo;
    while (i < left.length && j < right.length) {
      frames.push({
        array: [...a],
        highlights: [
          ...rangeHi(lo, hi, "range"),
          { index: k, kind: "write" },
        ],
        message: `比較 ${left[i]} 與 ${right[j]} → 寫入較小者 ${
          left[i] <= right[j] ? left[i] : right[j]
        }`,
        lo,
        hi,
      });
      if (left[i] <= right[j]) {
        a[k] = left[i++];
      } else {
        a[k] = right[j++];
      }
      frames.push({
        array: [...a],
        highlights: [{ index: k, kind: "write" }],
        message: `位置 ${k} 寫入 ${a[k]}`,
        lo,
        hi,
      });
      k++;
    }
    while (i < left.length) {
      a[k] = left[i++];
      frames.push({
        array: [...a],
        highlights: [{ index: k, kind: "write" }],
        message: `左半剩餘 ${a[k]} 寫入位置 ${k}`,
        lo,
        hi,
      });
      k++;
    }
    while (j < right.length) {
      a[k] = right[j++];
      frames.push({
        array: [...a],
        highlights: [{ index: k, kind: "write" }],
        message: `右半剩餘 ${a[k]} 寫入位置 ${k}`,
        lo,
        hi,
      });
      k++;
    }
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    frames.push({
      array: [...a],
      highlights: rangeHi(lo, hi, "range"),
      message: `分割 [${lo}..${hi}] → 左 [${lo}..${mid}]、右 [${mid + 1}..${hi}]`,
      lo,
      hi,
      mid,
    });
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  sort(0, a.length - 1);
  frames.push({
    array: [...a],
    highlights: a.map((_, i) => ({ index: i, kind: "sorted" as const })),
    message: `完成：[${a.join(", ")}]。穩定、時間永遠 Θ(n log n)。`,
  });
  return frames;
}

export function quickSortTrace(input = DEMO_ARRAY): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a = [...input];
  frames.push({
    array: [...a],
    highlights: [],
    message: `初始陣列：[${a.join(", ")}]。Lomuto 分割：最右當樞紐。`,
  });
  const settled = new Set<number>();

  function partition(lo: number, hi: number) {
    const pivot = a[hi];
    frames.push({
      array: [...a],
      highlights: [
        ...rangeHi(lo, hi, "range"),
        { index: hi, kind: "pivot" },
      ],
      message: `區間 [${lo}..${hi}]，樞紐 pivot = ${pivot}（最右）`,
      lo,
      hi,
    });
    let i = lo;
    for (let j = lo; j < hi; j++) {
      frames.push({
        array: [...a],
        highlights: [
          { index: hi, kind: "pivot" },
          { index: j, kind: "compare" },
          { index: i, kind: "write" },
        ],
        message: `比較 a[${j}]=${a[j]} 與 pivot ${pivot}`,
        lo,
        hi,
      });
      if (a[j] <= pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        frames.push({
          array: [...a],
          highlights: [
            { index: i, kind: "swap" },
            { index: j, kind: "swap" },
            { index: hi, kind: "pivot" },
          ],
          message: `${a[i]} ≤ ${pivot}，與 i=${i} 交換後 i++`,
          lo,
          hi,
        });
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    frames.push({
      array: [...a],
      highlights: [{ index: i, kind: "pivot" }],
      message: `樞紐就位：${a[i]} 放到最終位置 ${i}`,
      lo,
      hi,
    });
    settled.add(i);
    return i;
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) settled.add(lo);
      return;
    }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }

  sort(0, a.length - 1);
  frames.push({
    array: [...a],
    highlights: a.map((_, i) => ({ index: i, kind: "sorted" as const })),
    message: `完成：[${a.join(", ")}]。平均 Θ(n log n)，最壞 Θ(n²)。`,
  });
  return frames;
}

export function heapSortTrace(input = DEMO_ARRAY): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a = [...input];
  const n = a.length;
  frames.push({
    array: [...a],
    highlights: [],
    message: `初始陣列可視為完全二元樹。先建 Max-Heap，再反覆取出堆頂。`,
  });

  function heapify(size: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    const marks: ArrayFrame["highlights"] = [{ index: i, kind: "pivot" }];
    if (l < size) marks.push({ index: l, kind: "left" });
    if (r < size) marks.push({ index: r, kind: "right" });
    frames.push({
      array: [...a],
      highlights: marks,
      message: `heapify(i=${i}, 值 ${a[i]})：左孩 ${
        l < size ? a[l] : "無"
      }、右孩 ${r < size ? a[r] : "無"}`,
    });
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      frames.push({
        array: [...a],
        highlights: [
          { index: i, kind: "swap" },
          { index: largest, kind: "swap" },
        ],
        message: `子節點較大，交換 ${a[largest]} 與 ${a[i]} 後繼續下沉`,
      });
      heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  frames.push({
    array: [...a],
    highlights: rangeHi(0, n - 1, "range"),
    message: `建堆完成，堆頂 ${a[0]} 為最大值。`,
  });

  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    frames.push({
      array: [...a],
      highlights: [
        { index: 0, kind: "swap" },
        { index: end, kind: "sorted" },
      ],
      message: `取出最大值放到位置 ${end}，縮小堆大小為 ${end}`,
    });
    heapify(end, 0);
  }
  frames.push({
    array: [...a],
    highlights: a.map((_, i) => ({ index: i, kind: "sorted" as const })),
    message: `完成：[${a.join(", ")}]。最壞也是 Θ(n log n)，不穩定。`,
  });
  return frames;
}

export function binarySearchTrace(
  input = [3, 9, 10, 27, 38, 43, 82],
  target = 27
): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a = [...input];
  let lo = 0;
  let hi = a.length - 1;
  frames.push({
    array: [...a],
    highlights: [],
    message: `在已排序陣列中找 ${target}。每次丟掉一半。`,
    lo,
    hi,
  });
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    frames.push({
      array: [...a],
      highlights: [
        ...rangeHi(lo, hi, "range"),
        { index: mid, kind: "mid" },
      ],
      message: `lo=${lo}, hi=${hi}, mid=${mid}，a[mid]=${a[mid]}`,
      lo,
      hi,
      mid,
    });
    if (a[mid] === target) {
      frames.push({
        array: [...a],
        highlights: [{ index: mid, kind: "sorted" }],
        message: `找到 ${target}，索引 ${mid}。比較次數為 O(log n)。`,
        lo,
        hi,
        mid,
      });
      return frames;
    }
    if (a[mid] < target) {
      frames.push({
        array: [...a],
        highlights: rangeHi(lo, mid, "compare"),
        message: `${a[mid]} < ${target}，丟掉左半，lo = mid+1 = ${mid + 1}`,
        lo,
        hi,
        mid,
      });
      lo = mid + 1;
    } else {
      frames.push({
        array: [...a],
        highlights: rangeHi(mid, hi, "compare"),
        message: `${a[mid]} > ${target}，丟掉右半，hi = mid-1 = ${mid - 1}`,
        lo,
        hi,
        mid,
      });
      hi = mid - 1;
    }
  }
  frames.push({
    array: [...a],
    highlights: [],
    message: `找不到 ${target}。`,
  });
  return frames;
}

export const DEMO_GRAPH = {
  nodes: [
    { id: "A", x: 70, y: 48 },
    { id: "B", x: 210, y: 48 },
    { id: "C", x: 350, y: 48 },
    { id: "D", x: 70, y: 188 },
    { id: "E", x: 210, y: 188 },
    { id: "F", x: 350, y: 188 },
  ],
  undirected: [
    ["A", "B", 1],
    ["B", "C", 4],
    ["A", "D", 2],
    ["B", "E", 1],
    ["C", "F", 3],
    ["D", "E", 5],
    ["E", "F", 1],
    ["B", "D", 3],
  ] as [string, string, number][],
};

export function edgeKey(u: string, v: string) {
  return u < v ? `${u}-${v}` : `${v}-${u}`;
}

function idleGraph(): GraphFrame["nodeStates"] {
  return Object.fromEntries(DEMO_GRAPH.nodes.map((n) => [n.id, "idle"]));
}

function adjList() {
  const g: Record<string, { to: string; w: number }[]> = {};
  for (const n of DEMO_GRAPH.nodes) g[n.id] = [];
  for (const [u, v, w] of DEMO_GRAPH.undirected) {
    g[u].push({ to: v, w });
    g[v].push({ to: u, w });
  }
  for (const id of Object.keys(g)) g[id].sort((a, b) => a.to.localeCompare(b.to));
  return g;
}

export function bfsTrace(start = "A"): GraphFrame[] {
  const g = adjList();
  const frames: GraphFrame[] = [];
  const visited = new Set<string>();
  const q: string[] = [start];
  const nodeStates = idleGraph();
  const edgeStates: Record<string, GraphEdgeState> = {};
  nodeStates[start] = "queued";
  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: `BFS 從 ${start} 出發。佇列是 FIFO，同層先走完才進下一層。`,
    structureLabel: "Queue",
    structure: [...q],
  });
  while (q.length) {
    const u = q.shift()!;
    if (visited.has(u)) continue;
    visited.add(u);
    nodeStates[u] = "current";
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `出隊 ${u}，標記已拜訪。依字母序檢查鄰居。`,
      structureLabel: "Queue",
      structure: [...q],
    });
    for (const { to } of g[u]) {
      const k = edgeKey(u, to);
      if (!visited.has(to) && !q.includes(to) && nodeStates[to] !== "queued") {
        edgeStates[k] = "tree";
        nodeStates[to] = "queued";
        q.push(to);
        frames.push({
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          message: `${to} 尚未拜訪 → 入隊。這條邊進入 BFS 樹。`,
          structureLabel: "Queue",
          structure: [...q],
        });
      } else {
        edgeStates[k] = edgeStates[k] === "tree" ? "tree" : "rejected";
        frames.push({
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          message: `鄰居 ${to} 已在佇列或已拜訪，略過。`,
          structureLabel: "Queue",
          structure: [...q],
        });
      }
    }
    nodeStates[u] = "visited";
  }
  frames.push({
    nodeStates: Object.fromEntries(
      DEMO_GRAPH.nodes.map((n) => [n.id, "done" as const])
    ),
    edgeStates: { ...edgeStates },
    message: "BFS 結束。無權圖上，第一次到達即為最短路徑。",
    structureLabel: "Queue",
    structure: [],
  });
  return frames;
}

export function dfsTrace(start = "A"): GraphFrame[] {
  const g = adjList();
  const frames: GraphFrame[] = [];
  const visited = new Set<string>();
  const stack: string[] = [start];
  const nodeStates = idleGraph();
  const edgeStates: Record<string, GraphEdgeState> = {};
  nodeStates[start] = "queued";
  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: `DFS 從 ${start} 出發。堆疊是 LIFO，一路往深處走。`,
    structureLabel: "Stack",
    structure: [...stack],
  });
  while (stack.length) {
    const u = stack.pop()!;
    if (visited.has(u)) continue;
    visited.add(u);
    nodeStates[u] = "current";
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `彈出 ${u}，開始展開鄰居（反向壓入以維持字母序）。`,
      structureLabel: "Stack",
      structure: [...stack],
    });
    const neigh = [...g[u]].reverse();
    for (const { to } of neigh) {
      const k = edgeKey(u, to);
      if (!visited.has(to)) {
        edgeStates[k] = "tree";
        nodeStates[to] = "queued";
        stack.push(to);
        frames.push({
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          message: `將 ${to} 壓入堆疊。`,
          structureLabel: "Stack",
          structure: [...stack],
        });
      }
    }
    nodeStates[u] = "visited";
  }
  frames.push({
    nodeStates: Object.fromEntries(
      DEMO_GRAPH.nodes.map((n) => [n.id, "done" as const])
    ),
    edgeStates: { ...edgeStates },
    message: "DFS 結束。常用於拓樸排序、找環、連通分量。",
    structureLabel: "Stack",
    structure: [],
  });
  return frames;
}

export function dijkstraTrace(start = "A"): GraphFrame[] {
  const g = adjList();
  const frames: GraphFrame[] = [];
  const dist: Record<string, number> = {};
  const done = new Set<string>();
  const nodeStates = idleGraph();
  const edgeStates: Record<string, GraphEdgeState> = {};
  for (const n of DEMO_GRAPH.nodes) dist[n.id] = Infinity;
  dist[start] = 0;
  nodeStates[start] = "queued";
  const fmt = () =>
    Object.fromEntries(
      Object.entries(dist).map(([k, v]) => [k, v === Infinity ? "∞" : v])
    );

  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: `Dijkstra 從 ${start} 出發。邊權必須非負。`,
    structureLabel: "距離",
    structure: Object.entries(fmt()).map(([k, v]) => `${k}:${v}`),
    dist: fmt(),
  });

  while (done.size < DEMO_GRAPH.nodes.length) {
    let u: string | null = null;
    let best = Infinity;
    for (const n of DEMO_GRAPH.nodes) {
      if (!done.has(n.id) && dist[n.id] < best) {
        best = dist[n.id];
        u = n.id;
      }
    }
    if (u === null || best === Infinity) break;
    nodeStates[u] = "current";
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `選尚未確定且距離最小的點 ${u}（d=${dist[u]}），此距離已是最短。`,
      structureLabel: "距離",
      structure: Object.entries(fmt()).map(([k, v]) => `${k}:${v}`),
      dist: fmt(),
    });
    for (const { to, w } of g[u]) {
      if (done.has(to)) continue;
      const k = edgeKey(u, to);
      edgeStates[k] = "active";
      frames.push({
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        message: `鬆弛 ${u}→${to}，權重 ${w}：目前 d[${to}]=${
          dist[to] === Infinity ? "∞" : dist[to]
        }，候選 ${dist[u] + w}`,
        structureLabel: "距離",
        structure: Object.entries(fmt()).map(([k, v]) => `${k}:${v}`),
        dist: fmt(),
      });
      if (dist[u] + w < dist[to]) {
        dist[to] = dist[u] + w;
        edgeStates[k] = "relaxed";
        nodeStates[to] = "queued";
        frames.push({
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          message: `更新 d[${to}] = ${dist[to]}`,
          structureLabel: "距離",
          structure: Object.entries(fmt()).map(([k, v]) => `${k}:${v}`),
          dist: fmt(),
        });
      } else {
        edgeStates[k] = "rejected";
      }
    }
    done.add(u);
    nodeStates[u] = "visited";
  }
  frames.push({
    nodeStates: Object.fromEntries(
      DEMO_GRAPH.nodes.map((n) => [n.id, "done" as const])
    ),
    edgeStates: { ...edgeStates },
    message: "所有點的最短距離確定。有負權應改用 Bellman-Ford。",
    structureLabel: "距離",
    structure: Object.entries(fmt()).map(([k, v]) => `${k}:${v}`),
    dist: fmt(),
  });
  return frames;
}

export function kruskalTrace(): GraphFrame[] {
  const frames: GraphFrame[] = [];
  const parent: Record<string, string> = {};
  for (const n of DEMO_GRAPH.nodes) parent[n.id] = n.id;
  const find = (x: string): string =>
    parent[x] === x ? x : (parent[x] = find(parent[x]));
  const edges = [...DEMO_GRAPH.undirected].sort((a, b) => a[2] - b[2]);
  const nodeStates = idleGraph();
  const edgeStates: Record<string, GraphEdgeState> = {};
  const mst: string[] = [];
  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: "Kruskal：把邊依權重由小到大排序，不形成環就加入 MST。",
    structureLabel: "已排序的邊",
    structure: edges.map(([u, v, w]) => `${u}-${v} (${w})`),
  });
  for (const [u, v, w] of edges) {
    const k = edgeKey(u, v);
    edgeStates[k] = "active";
    const pu = find(u);
    const pv = find(v);
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `考慮邊 ${u}-${v}（${w}）。find(${u})=${pu}，find(${v})=${pv}`,
      structureLabel: "MST 邊",
      structure: [...mst],
    });
    if (pu !== pv) {
      parent[pu] = pv;
      edgeStates[k] = "tree";
      nodeStates[u] = "visited";
      nodeStates[v] = "visited";
      mst.push(`${u}-${v} (${w})`);
      frames.push({
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        message: `不同集合 → 加入 MST，並查集合併。`,
        structureLabel: "MST 邊",
        structure: [...mst],
      });
    } else {
      edgeStates[k] = "rejected";
      frames.push({
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        message: `同一集合 → 會形成環，捨棄。`,
        structureLabel: "MST 邊",
        structure: [...mst],
      });
    }
  }
  frames.push({
    nodeStates: Object.fromEntries(
      DEMO_GRAPH.nodes.map((n) => [n.id, "done" as const])
    ),
    edgeStates: { ...edgeStates },
    message: `MST 完成。總權重 ${mst
      .map((s) => Number(s.match(/\((\d+)\)/)?.[1] ?? 0))
      .reduce((a, b) => a + b, 0)}。`,
    structureLabel: "MST 邊",
    structure: [...mst],
  });
  return frames;
}

const TOPO = {
  nodes: [
    { id: "1", x: 50, y: 118 },
    { id: "2", x: 150, y: 48 },
    { id: "3", x: 150, y: 188 },
    { id: "4", x: 270, y: 48 },
    { id: "5", x: 270, y: 188 },
    { id: "6", x: 380, y: 118 },
  ],
  edges: [
    ["1", "2"],
    ["1", "3"],
    ["2", "4"],
    ["3", "4"],
    ["3", "5"],
    ["4", "6"],
    ["5", "6"],
  ] as [string, string][],
};

export const TOPO_GRAPH = TOPO;

export function topoTrace(): GraphFrame[] {
  const indeg: Record<string, number> = {};
  const g: Record<string, string[]> = {};
  for (const n of TOPO.nodes) {
    indeg[n.id] = 0;
    g[n.id] = [];
  }
  for (const [u, v] of TOPO.edges) {
    g[u].push(v);
    indeg[v]++;
  }
  const frames: GraphFrame[] = [];
  const nodeStates: Record<string, GraphNodeState> = Object.fromEntries(
    TOPO.nodes.map((n) => [n.id, "idle"])
  );
  const edgeStates: Record<string, GraphEdgeState> = {};
  const q = TOPO.nodes.map((n) => n.id).filter((id) => indeg[id] === 0);
  q.forEach((id) => (nodeStates[id] = "queued"));
  const order: string[] = [];
  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: "Kahn 演算法：入度為 0 的點先入佇列。",
    structureLabel: "Queue / 拓樸序",
    structure: [`Q=${q.join(",")}`, `序=${order.join(" ")}`],
  });
  while (q.length) {
    const u = q.shift()!;
    nodeStates[u] = "current";
    order.push(u);
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `取出 ${u}，寫入拓樸序。`,
      structureLabel: "Queue / 拓樸序",
      structure: [`Q=${q.join(",") || "∅"}`, `序=${order.join(" ")}`],
    });
    for (const v of g[u]) {
      const k = `${u}>${v}`;
      edgeStates[k] = "active";
      indeg[v]--;
      frames.push({
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        message: `邊 ${u}→${v} 刪除，${v} 入度變 ${indeg[v]}`,
        structureLabel: "Queue / 拓樸序",
        structure: [`Q=${q.join(",") || "∅"}`, `序=${order.join(" ")}`],
      });
      if (indeg[v] === 0) {
        q.push(v);
        nodeStates[v] = "queued";
        edgeStates[k] = "tree";
        frames.push({
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          message: `${v} 入度歸零，入隊。`,
          structureLabel: "Queue / 拓樸序",
          structure: [`Q=${q.join(",")}`, `序=${order.join(" ")}`],
        });
      }
    }
    nodeStates[u] = "visited";
  }
  frames.push({
    nodeStates: Object.fromEntries(
      TOPO.nodes.map((n) => [n.id, "done" as const])
    ),
    edgeStates: { ...edgeStates },
    message: `拓樸序：${order.join(" → ")}。若還有點沒出來，圖中有環。`,
    structureLabel: "Queue / 拓樸序",
    structure: [`序=${order.join(" ")}`],
  });
  return frames;
}

export function knapsackTrace(): TableFrame[] {
  const items = [
    { name: "A", w: 2, v: 3 },
    { name: "B", w: 3, v: 4 },
    { name: "C", w: 4, v: 5 },
  ];
  const W = 5;
  const n = items.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array(W + 1).fill(0)
  );
  const frames: TableFrame[] = [];
  const rowLabels = ["∅", ...items.map((it) => `${it.name}(${it.w},${it.v})`)];
  const colLabels = Array.from({ length: W + 1 }, (_, i) => String(i));
  const tableHint = {
    rowTitle: "輪到哪一件（往下 = 多考慮一件）",
    colTitle: "背包容量 0～5",
    legend: "格子裡的數字 = 目前能拿到的最大價值",
  };
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [],
    ...tableHint,
    message:
      "三件東西 A、B、C，背包只能裝重量 5。\n每一格在問：只用到這一列為止的物品、容量剛好是這一欄時，最多能裝多少價值。最上面那列是「什麼都還沒選」，所以全是 0。",
  });
  for (let i = 1; i <= n; i++) {
    const { w, v, name } = items[i - 1];
    for (let cap = 0; cap <= W; cap++) {
      const skip = dp[i - 1][cap];
      dp[i][cap] = skip;
      if (cap >= w) {
        dp[i][cap] = Math.max(dp[i][cap], dp[i - 1][cap - w] + v);
      }
      const take = cap >= w ? dp[i - 1][cap - w] + v : null;
      frames.push({
        rowLabels,
        colLabels,
        cells: dp.map((r) => [...r]),
        highlight: [
          { r: i, c: cap, role: "current" },
          { r: i - 1, c: cap, role: "read" },
          ...(cap >= w ? [{ r: i - 1, c: cap - w, role: "read" as const }] : []),
        ],
        ...tableHint,
        message:
          cap < w
            ? `輪到 ${name}（重 ${w}、價值 ${v}），容量只有 ${cap}。\n東西比背包還重，拿不了，這格直接抄上一列：${skip}。`
            : `輪到 ${name}（重 ${w}、價值 ${v}），容量 ${cap}。\n不拿：上一列同容量是 ${skip}。\n拿：扣掉重量 ${w} 後剩 ${cap - w}，上一列那格是 ${
                dp[i - 1][cap - w]
              }，再加價值 ${v} → ${take}。\n兩者取大，這格寫 ${dp[i][cap]}。`,
      });
    }
  }
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [{ r: n, c: W, role: "current" }],
    ...tableHint,
    message: `右下角 ${dp[n][W]} 就是答案。每件最多拿一次；這裡最優是 A+B（重量 5、價值 7）。`,
  });
  return frames;
}

export function lcsTrace(): TableFrame[] {
  const X = "ABCB";
  const Y = "BDCB";
  const m = X.length;
  const n = Y.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );
  const frames: TableFrame[] = [];
  const rowLabels = ["（空）", ...X.split("")];
  const colLabels = ["（空）", ...Y.split("")];
  const tableHint = {
    rowTitle: `字串 X = ${X}（往下多對一個字）`,
    colTitle: `字串 Y = ${Y}（往右多對一個字）`,
    legend: "格子 = 這兩個前綴的最長共同子序列長度",
  };
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [],
    ...tableHint,
    message: `左邊往下是 "${X}"，上面往右是 "${Y}"。\n子序列可以跳字，但不能調序。第一列／第一欄是空字串，長度都是 0。`,
  });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (X[i - 1] === Y[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        frames.push({
          rowLabels,
          colLabels,
          cells: dp.map((r) => [...r]),
          highlight: [
            { r: i, c: j, role: "current" },
            { r: i - 1, c: j - 1, role: "read" },
          ],
          ...tableHint,
          message: `兩邊都對到「${X[i - 1]}」，可以收進共同子序列。\n看左上角舊長度 ${dp[i - 1][j - 1]}，加 1，這格寫 ${dp[i][j]}。`,
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        frames.push({
          rowLabels,
          colLabels,
          cells: dp.map((r) => [...r]),
          highlight: [
            { r: i, c: j, role: "current" },
            { r: i - 1, c: j, role: "read" },
            { r: i, c: j - 1, role: "read" },
          ],
          ...tableHint,
          message: `「${X[i - 1]}」和「${Y[j - 1]}」不一樣，這個字對不上。\n上面是 ${dp[i - 1][j]}（丟掉 X 這個字），左邊是 ${dp[i][j - 1]}（丟掉 Y 這個字）。取較大的 ${dp[i][j]}。`,
        });
      }
    }
  }
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [{ r: m, c: n, role: "current" }],
    ...tableHint,
    message: `右下角 ${dp[m][n]} 就是 LCS 長度。其中一種排法是 BCB（可以跳字，不必連續）。`,
  });
  return frames;
}

export function floydTrace(): TableFrame[] {
  const labels = ["A", "B", "C", "D"];
  const INF = 99;
  let d = [
    [0, 3, INF, 5],
    [2, 0, INF, 4],
    [INF, 1, 0, INF],
    [INF, INF, 2, 0],
  ];
  const frames: TableFrame[] = [];
  frames.push({
    rowLabels: labels,
    colLabels: labels,
    cells: d.map((r) => r.map((x) => (x >= INF ? "∞" : x))),
    highlight: [],
    rowTitle: "從這一列的點出發",
    colTitle: "走到這一欄的點",
    legend: "∞＝目前還走不通",
    message: "Floyd：這張表是「從列走到欄」的目前最短路。∞ 代表還沒走通過。每一輪多允許一個中繼站。",
  });
  for (let k = 0; k < 4; k++) {
    const next = d.map((r) => [...r]);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cand = d[i][k] + d[k][j];
        frames.push({
          rowLabels: labels,
          colLabels: labels,
          cells: next.map((r) => r.map((x) => (x >= INF ? "∞" : x))),
          highlight: [
            { r: i, c: j },
            { r: i, c: k },
            { r: k, c: j },
          ],
          message: `這輪允許經過 ${labels[k]}。\n直走 ${labels[i]}→${labels[j]} 目前是 ${
            d[i][j] >= INF ? "∞（走不通）" : d[i][j]
          }。\n繞 ${labels[i]}→${labels[k]}→${labels[j]} 是 ${
            d[i][k] >= INF || d[k][j] >= INF ? "∞（其中一段走不通）" : cand
          }。取比較短的。`,
        });
        if (d[i][k] + d[k][j] < next[i][j]) next[i][j] = d[i][k] + d[k][j];
      }
    }
    d = next;
    frames.push({
      rowLabels: labels,
      colLabels: labels,
      cells: d.map((r) => r.map((x) => (x >= INF ? "∞" : x))),
      highlight: [],
      message: `中繼站 ${labels[k]} 這一輪結束。表上的數字都是「最多只能經過 ${labels[k]} 與更早中繼站」的最短路。`,
    });
  }
  frames.push({
    rowLabels: labels,
    colLabels: labels,
    cells: d.map((r) => r.map((x) => (x >= INF ? "∞" : x))),
    highlight: [],
    message: "完成。時間 Θ(V³)，可處理負權（但不能有負環）。",
  });
  return frames;
}

export function getArrayTrace(slug: string): ArrayFrame[] {
  switch (slug) {
    case "merge-sort":
      return mergeSortTrace();
    case "quick-sort":
      return quickSortTrace();
    case "heap-sort":
      return heapSortTrace();
    case "binary-search":
      return binarySearchTrace();
    case "bubble-sort":
      return bubbleSortTrace();
    case "insertion-sort":
      return insertionSortTrace();
    case "selection-sort":
      return selectionSortTrace();
    case "counting-sort":
      return countingSortTrace();
    case "radix-sort":
      return radixSortTrace();
    case "quickselect":
      return quickselectTrace();
    case "binary-search-answer":
      return binarySearchAnswerTrace();
    case "heap":
      return heapDsTrace();
    default:
      return [];
  }
}

export function getGraphTrace(slug: string): GraphFrame[] {
  switch (slug) {
    case "bfs":
      return bfsTrace();
    case "dfs":
      return dfsTrace();
    case "dijkstra":
      return dijkstraTrace();
    case "kruskal":
      return kruskalTrace();
    case "topo-sort":
      return topoTrace();
    case "prim":
      return primTrace();
    case "bellman-ford":
      return bellmanFordTrace();
    case "vertex-cover":
      return vertexCoverTrace();
    case "max-flow":
      return maxFlowTrace();
    case "scc":
      return sccTrace();
    default:
      return [];
  }
}

export function getTableTrace(slug: string): TableFrame[] {
  switch (slug) {
    case "knapsack":
      return knapsackTrace();
    case "lcs":
      return lcsTrace();
    case "floyd-warshall":
      return floydTrace();
    case "lis":
      return lisTrace();
    case "subset-sum":
      return subsetSumTrace();
    case "edit-distance":
      return editDistanceTrace();
    case "matrix-chain":
      return matrixChainTrace();
    case "unbounded-knapsack":
      return unboundedKnapsackTrace();
    case "fractional-knapsack":
      return fractionalKnapsackTrace();
    default:
      return [];
  }
}

export type CoverElemState = "uncovered" | "new" | "covered";
export type CoverSetState = "idle" | "best" | "picked" | "stale";

export type SetCoverFrame = {
  universe: { id: string; state: CoverElemState }[];
  sets: {
    name: string;
    elements: string[];
    remaining: number;
    state: CoverSetState;
  }[];
  picked: string[];
  message: string;
};

const COVER_U = ["1", "2", "3", "4", "5", "6"];
const COVER_F: { name: string; elements: string[] }[] = [
  { name: "S1", elements: ["1", "2", "3", "4"] },
  { name: "S2", elements: ["1", "2", "5"] },
  { name: "S3", elements: ["3", "4", "6"] },
];

export function setCoverTrace(): SetCoverFrame[] {
  const frames: SetCoverFrame[] = [];
  const remaining = new Set(COVER_U);
  const covered = new Set<string>();
  const picked: string[] = [];
  const unused = COVER_F.map((s) => ({ ...s }));

  const snapshot = (
    message: string,
    newly: string[] = [],
    best: string | null = null
  ): SetCoverFrame => ({
    universe: COVER_U.map((id) => ({
      id,
      state: newly.includes(id)
        ? "new"
        : covered.has(id)
          ? "covered"
          : "uncovered",
    })),
    sets: COVER_F.map((s) => {
      const rem = s.elements.filter((x) => remaining.has(x)).length;
      const isPicked = picked.includes(s.name);
      return {
        name: s.name,
        elements: s.elements,
        remaining: rem,
        state: isPicked
          ? "picked"
          : best === s.name
            ? "best"
            : rem === 0
              ? "stale"
              : "idle",
      };
    }),
    picked: [...picked],
    message,
  });

  frames.push(
    snapshot(
      "宇宙 U={1..6}。貪婪每輪選「還能新蓋最多元素」的集合；平手取編號小的。"
    )
  );

  while (remaining.size && unused.length) {
    let bestIdx = 0;
    let bestGain = -1;
    const gains: string[] = [];
    unused.forEach((s, i) => {
      const g = s.elements.filter((x) => remaining.has(x)).length;
      gains.push(`${s.name} 新蓋 ${g}`);
      if (g > bestGain) {
        bestGain = g;
        bestIdx = i;
      }
    });
    if (bestGain <= 0) break;
    const choice = unused[bestIdx]!;
    frames.push(
      snapshot(
        `剩餘 {${[...remaining].join(",")}}。${gains.join("；")} → 選 ${choice.name}。`,
        [],
        choice.name
      )
    );
    const newly = choice.elements.filter((x) => remaining.has(x));
    picked.push(choice.name);
    for (const x of newly) {
      remaining.delete(x);
      covered.add(x);
    }
    unused.splice(bestIdx, 1);
    frames.push(
      snapshot(
        `加入 ${choice.name}，新覆蓋 {${newly.join(",")}}。已選 {${picked.join(", ")}}。`,
        newly
      )
    );
  }

  frames.push(
    snapshot(
      `貪婪用了 ${picked.length} 個集合：{${picked.join(", ")}}。OPT 是 {S2, S3} 只要 2 個。`
    )
  );
  return frames;
}

export function getSetCoverTrace(slug: string): SetCoverFrame[] {
  return slug === "set-cover" ? setCoverTrace() : [];
}

export type LayoutEdge = {
  u: string;
  v: string;
  w?: number;
  directed: boolean;
};

export const BF_GRAPH = {
  nodes: [
    { id: "S", x: 50, y: 118 },
    { id: "A", x: 180, y: 48 },
    { id: "B", x: 180, y: 188 },
    { id: "C", x: 320, y: 118 },
  ],
  edges: [
    ["S", "A", 4],
    ["S", "B", 5],
    ["A", "B", -3],
    ["A", "C", 6],
    ["B", "C", 2],
  ] as [string, string, number][],
};

export const FLOW_GRAPH = {
  nodes: [
    { id: "s", x: 50, y: 118 },
    { id: "A", x: 180, y: 48 },
    { id: "B", x: 180, y: 188 },
    { id: "t", x: 320, y: 118 },
  ],
  edges: [
    ["s", "A", 3],
    ["s", "B", 2],
    ["A", "B", 1],
    ["A", "t", 2],
    ["B", "t", 4],
  ] as [string, string, number][],
};

export function graphLayout(slug: string): {
  nodes: { id: string; x: number; y: number }[];
  edges: LayoutEdge[];
} {
  if (slug === "topo-sort") {
    return {
      nodes: TOPO_GRAPH.nodes,
      edges: TOPO_GRAPH.edges.map(([u, v]) => ({ u, v, directed: true })),
    };
  }
  if (slug === "bellman-ford") {
    return {
      nodes: BF_GRAPH.nodes,
      edges: BF_GRAPH.edges.map(([u, v, w]) => ({ u, v, w, directed: true })),
    };
  }
  if (slug === "max-flow") {
    return {
      nodes: FLOW_GRAPH.nodes,
      edges: FLOW_GRAPH.edges.map(([u, v, w]) => ({ u, v, w, directed: true })),
    };
  }
  if (slug === "scc") {
    return {
      nodes: SCC_GRAPH.nodes,
      edges: SCC_GRAPH.edges.map(([u, v]) => ({ u, v, directed: true })),
    };
  }
  return {
    nodes: DEMO_GRAPH.nodes,
    edges: DEMO_GRAPH.undirected.map(([u, v, w]) => ({
      u,
      v,
      w,
      directed: false,
    })),
  };
}

export function primTrace(start = "A"): GraphFrame[] {
  const g = adjList();
  const frames: GraphFrame[] = [];
  const inT = new Set<string>([start]);
  const nodeStates = idleGraph();
  const edgeStates: Record<string, GraphEdgeState> = {};
  nodeStates[start] = "visited";
  const mst: string[] = [];
  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: `Prim 從 ${start} 長樹：每次選「一端在樹內、一端在樹外」的最輕邊。`,
    structureLabel: "MST",
    structure: [],
  });
  while (inT.size < DEMO_GRAPH.nodes.length) {
    let best: { u: string; v: string; w: number } | null = null;
    for (const u of inT) {
      for (const { to, w } of g[u]) {
        if (inT.has(to)) continue;
        const k = edgeKey(u, to);
        edgeStates[k] = "active";
        if (!best || w < best.w) best = { u, v: to, w };
      }
    }
    if (!best) break;
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `跨切最輕邊 ${best.u}-${best.v}（${best.w}）。`,
      structureLabel: "MST",
      structure: [...mst],
    });
    const k = edgeKey(best.u, best.v);
    edgeStates[k] = "tree";
    inT.add(best.v);
    nodeStates[best.v] = "visited";
    mst.push(`${best.u}-${best.v} (${best.w})`);
    for (const e of Object.keys(edgeStates)) {
      if (edgeStates[e] === "active") edgeStates[e] = "idle";
    }
    edgeStates[k] = "tree";
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `把 ${best.v} 納入樹。`,
      structureLabel: "MST",
      structure: [...mst],
    });
  }
  frames.push({
    nodeStates: Object.fromEntries(
      DEMO_GRAPH.nodes.map((n) => [n.id, "done" as const])
    ),
    edgeStates: { ...edgeStates },
    message: `Prim 完成，與 Kruskal 同一棵 MST（總權重 ${mst
      .map((s) => Number(s.match(/\((\d+)\)/)?.[1] ?? 0))
      .reduce((a, b) => a + b, 0)}）。`,
    structureLabel: "MST",
    structure: [...mst],
  });
  return frames;
}

export function bellmanFordTrace(): GraphFrame[] {
  const nodes = BF_GRAPH.nodes.map((n) => n.id);
  const edges = BF_GRAPH.edges;
  const dist: Record<string, number> = {};
  const nodeStates: Record<string, GraphNodeState> = {};
  for (const id of nodes) {
    dist[id] = Infinity;
    nodeStates[id] = "idle";
  }
  dist["S"] = 0;
  nodeStates["S"] = "queued";
  const frames: GraphFrame[] = [];
  const fmt = () =>
    Object.fromEntries(
      Object.entries(dist).map(([k, v]) => [k, v === Infinity ? "∞" : v])
    );
  const edgeStates: Record<string, GraphEdgeState> = {};
  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: "Bellman-Ford：對所有邊做 |V|-1 輪鬆弛。邊權可為負。",
    structureLabel: "距離",
    structure: Object.entries(fmt()).map(([k, v]) => `${k}:${v}`),
    dist: fmt(),
  });
  for (let round = 1; round <= nodes.length - 1; round++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      const k = `${u}>${v}`;
      edgeStates[k] = "active";
      frames.push({
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        message: `第 ${round} 輪鬆弛 ${u}→${v}（${w}）：d[${v}] 現 ${
          dist[v] === Infinity ? "∞" : dist[v]
        }，候選 ${dist[u] === Infinity ? "∞" : dist[u] + w}`,
        structureLabel: "距離",
        structure: Object.entries(fmt()).map(([k, v]) => `${k}:${v}`),
        dist: fmt(),
      });
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed = true;
        edgeStates[k] = "relaxed";
        nodeStates[v] = "queued";
        frames.push({
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          message: `更新 d[${v}] = ${dist[v]}`,
          structureLabel: "距離",
          structure: Object.entries(fmt()).map(([k, v]) => `${k}:${v}`),
          dist: fmt(),
        });
      } else {
        edgeStates[k] = "rejected";
      }
    }
    if (!changed) break;
  }
  frames.push({
    nodeStates: Object.fromEntries(nodes.map((id) => [id, "done" as const])),
    edgeStates: { ...edgeStates },
    message: "再做一輪若還能更新，就有負環。本圖沒有。",
    structureLabel: "距離",
    structure: Object.entries(fmt()).map(([k, v]) => `${k}:${v}`),
    dist: fmt(),
  });
  return frames;
}

export function vertexCoverTrace(): GraphFrame[] {
  const frames: GraphFrame[] = [];
  const cover = new Set<string>();
  const remaining = DEMO_GRAPH.undirected.map(([u, v, w]) => [u, v, w] as const);
  const nodeStates = idleGraph();
  const edgeStates: Record<string, GraphEdgeState> = {};
  const taken: string[] = [];
  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: "2-approx：任取一條剩餘邊，兩端都放進覆蓋，刪掉與這兩點關聯的邊。選出的邊形成匹配。",
    structureLabel: "覆蓋 / 匹配邊",
    structure: [],
  });
  while (remaining.length) {
    const [u, v] = remaining[0]!;
    const k = edgeKey(u, v);
    edgeStates[k] = "active";
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `取匹配邊 ${u}-${v}，兩端都進覆蓋。`,
      structureLabel: "覆蓋 / 匹配邊",
      structure: [`C={${[...cover].join(",") || "∅"}}`, ...taken],
    });
    cover.add(u);
    cover.add(v);
    nodeStates[u] = "visited";
    nodeStates[v] = "visited";
    edgeStates[k] = "tree";
    taken.push(`${u}-${v}`);
    const next = remaining.filter(([a, b]) => a !== u && a !== v && b !== u && b !== v);
    for (const [a, b] of remaining) {
      if (a === u || a === v || b === u || b === v) {
        const ek = edgeKey(a, b);
        if (edgeStates[ek] !== "tree") edgeStates[ek] = "rejected";
      }
    }
    remaining.length = 0;
    remaining.push(...next);
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `覆蓋 C={${[...cover].join(", ")}}。虛線邊已被這兩點蓋掉。`,
      structureLabel: "覆蓋 / 匹配邊",
      structure: [`C={${[...cover].join(",")}}`, ...taken],
    });
  }
  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: `|C|=${cover.size} ≤ 2·OPT，因為 OPT 至少要為每條匹配邊付一個點。`,
    structureLabel: "覆蓋 / 匹配邊",
    structure: [`C={${[...cover].join(",")}}`, ...taken],
  });
  return frames;
}

export function maxFlowTrace(): GraphFrame[] {
  type E = { u: string; v: string; cap: number; flow: number };
  const edges: E[] = FLOW_GRAPH.edges.map(([u, v, cap]) => ({
    u,
    v,
    cap,
    flow: 0,
  }));
  const nodes = FLOW_GRAPH.nodes.map((n) => n.id);
  const frames: GraphFrame[] = [];
  const labels = () =>
    Object.fromEntries(
      edges.map((e) => [`${e.u}>${e.v}`, `${e.flow}/${e.cap}`])
    );
  const snap = (
    message: string,
    nodeStates: Record<string, GraphNodeState>,
    edgeStates: Record<string, GraphEdgeState>,
    extra: string[] = []
  ): GraphFrame => ({
    nodeStates,
    edgeStates,
    message,
    structureLabel: "流 / 路徑",
    structure: [
      `值=${edges.reduce((s, e) => (e.u === "s" ? s + e.flow : s), 0)}`,
      ...extra,
    ],
    edgeLabels: labels(),
  });

  const idleN = Object.fromEntries(nodes.map((id) => [id, "idle" as const]));
  frames.push(
    snap("Edmonds–Karp：殘餘網路做 BFS 找增廣路，瓶頸為路徑上殘餘容量最小者。", {
      ...idleN,
    }, {})
  );

  const residual = (u: string, v: string) => {
    const fwd = edges.find((e) => e.u === u && e.v === v);
    if (fwd) return fwd.cap - fwd.flow;
    const back = edges.find((e) => e.u === v && e.v === u);
    if (back) return back.flow;
    return 0;
  };
  const neighbors = (u: string) => {
    const out: string[] = [];
    for (const n of nodes) if (n !== u && residual(u, n) > 0) out.push(n);
    return out;
  };

  let guard = 0;
  while (guard++ < 8) {
    const prev: Record<string, string | null> = Object.fromEntries(
      nodes.map((id) => [id, null])
    );
    const seen = new Set(["s"]);
    const q = ["s"];
    const nodeStates: Record<string, GraphNodeState> = { ...idleN, s: "queued" };
    const edgeStates: Record<string, GraphEdgeState> = {};
    let found = false;
    while (q.length) {
      const u = q.shift()!;
      nodeStates[u] = "current";
      if (u === "t") {
        found = true;
        break;
      }
      for (const v of neighbors(u)) {
        if (seen.has(v)) continue;
        seen.add(v);
        prev[v] = u;
        q.push(v);
        nodeStates[v] = "queued";
        edgeStates[`${u}>${v}`] = "active";
      }
      if (u !== "s") nodeStates[u] = "visited";
    }
    if (!found) {
      frames.push(
        snap("找不到增廣路，最大流確定。最小割是殘餘網路中從 s 走得到的點。", {
          ...idleN,
          s: "done",
          t: "done",
        }, edgeStates)
      );
      break;
    }
    const path: string[] = [];
    let x: string | null = "t";
    while (x) {
      path.push(x);
      x = prev[x];
    }
    path.reverse();
    let bottle = Infinity;
    for (let i = 0; i < path.length - 1; i++) {
      bottle = Math.min(bottle, residual(path[i]!, path[i + 1]!));
    }
    frames.push(
      snap(
        `增廣路 ${path.join("→")}，瓶頸 ${bottle}。`,
        { ...idleN, ...Object.fromEntries(path.map((id) => [id, "current" as const])) },
        Object.fromEntries(
          path.slice(0, -1).map((u, i) => [`${u}>${path[i + 1]}`, "tree" as const])
        ),
        [path.join("→")]
      )
    );
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i]!;
      const v = path[i + 1]!;
      const fwd = edges.find((e) => e.u === u && e.v === v);
      if (fwd) fwd.flow += bottle;
      else {
        const back = edges.find((e) => e.u === v && e.v === u);
        if (back) back.flow -= bottle;
      }
    }
    frames.push(
      snap(`沿路加上 ${bottle}。目前最大流下界已更新。`, { ...idleN }, {}, [
        path.join("→"),
      ])
    );
  }
  return frames;
}

export function lisTrace(): TableFrame[] {
  const a = [3, 1, 4, 2, 5];
  const n = a.length;
  const dp = Array(n).fill(1);
  const frames: TableFrame[] = [];
  const cols = a.map((v, i) => `${i}:${v}`);
  frames.push({
    rowLabels: ["a", "dp"],
    colLabels: cols,
    cells: [a, [...dp]],
    highlight: [],
    message: "LIS：每個位置問「以這個數字當結尾，最長能遞增多長」。一開始每個自己都是 1。",
  });
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      frames.push({
        rowLabels: ["a", "dp"],
        colLabels: cols,
        cells: [a, [...dp]],
        highlight: [
          { r: 0, c: i },
          { r: 0, c: j },
          { r: 1, c: i },
          { r: 1, c: j },
        ],
        message:
          a[j] < a[i]
            ? `看前面的 ${a[j]} 能不能接到現在的 ${a[i]} 前面。可以（${a[j]} < ${a[i]}），長度變成 ${dp[j]}+1。這格取 max，目前 ${Math.max(dp[i], dp[j] + 1)}。`
            : `前面的 ${a[j]} 沒有比 ${a[i]} 小，接不上，略過。`,
      });
      if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  frames.push({
    rowLabels: ["a", "dp"],
    colLabels: cols,
    cells: [a, [...dp]],
    highlight: [{ r: 1, c: dp.indexOf(Math.max(...dp)) }],
    message: `最長是 ${Math.max(...dp)}。例如 1,2,5 或 3,4,5——可以跳過中間的數字，但順序不能改。`,
  });
  return frames;
}

export function subsetSumTrace(): TableFrame[] {
  const nums = [3, 4, 5];
  const T = 7;
  const n = nums.length;
  const dp: boolean[][] = Array.from({ length: n + 1 }, () =>
    Array(T + 1).fill(false)
  );
  for (let i = 0; i <= n; i++) dp[i][0] = true;
  const frames: TableFrame[] = [];
  const rowLabels = ["還沒選", "考慮 3", "再加 4", "再加 5"];
  const colLabels = Array.from({ length: T + 1 }, (_, s) => String(s));
  const show = () => dp.map((r) => r.map((v) => (v ? "T" : "F")));
  const yn = (b: boolean) => (b ? "可以" : "不行");
  const tableHint = {
    rowTitle: "已經考慮過哪些數字（往下 = 多一個）",
    colTitle: "想湊出來的和 0～7",
    legend: "T＝湊得到　F＝湊不到",
  };
  frames.push({
    rowLabels,
    colLabels,
    cells: show(),
    highlight: [],
    ...tableHint,
    message:
      "數字 3、4、5，問能不能剛好加出 7。\n每一格只回答是非題：用到這一列為止的數字，能不能湊出這一欄的和。最左欄「和 = 0」永遠是 T——什麼都不拿，和就是 0。",
  });
  for (let i = 1; i <= n; i++) {
    const x = nums[i - 1]!;
    for (let s = 1; s <= T; s++) {
      const skip = dp[i - 1][s]!;
      const canTake = s >= x;
      const take = canTake ? dp[i - 1][s - x]! : false;
      dp[i][s] = skip || take;
      frames.push({
        rowLabels,
        colLabels,
        cells: show(),
        highlight: [
          { r: i, c: s, role: "current" },
          { r: i - 1, c: s, role: "read" },
          ...(canTake ? [{ r: i - 1, c: s - x, role: "read" as const }] : []),
        ],
        ...tableHint,
        message: canTake
          ? `輪到數字 ${x}，問能不能湊出 ${s}。\n不用 ${x}：看上一列「湊 ${s}」→ ${yn(skip)}。\n用掉 ${x}：剩下要湊 ${s - x}，看上一列 → ${yn(take)}。\n兩條路有一條通，這格就寫 T。結果：${yn(dp[i][s]!)}。`
          : `輪到數字 ${x}，問能不能湊出 ${s}。\n${x} 比 ${s} 大，拿了會超，所以只能看「不用它」：上一列湊 ${s} 是 ${yn(skip)}。這格照抄。`,
      });
    }
  }
  frames.push({
    rowLabels,
    colLabels,
    cells: show(),
    highlight: [{ r: n, c: T, role: "current" }],
    ...tableHint,
    message: `右下角是 T：用 3 和 4 可以湊出 7。\n這張表的大小跟「目標 7」成正比，所以叫偽多項式——目標寫成很大的數時，格子會爆炸。`,
  });
  return frames;
}

export function editDistanceTrace(): TableFrame[] {
  const X = "CAT";
  const Y = "CUT";
  const m = X.length;
  const n = Y.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  const frames: TableFrame[] = [];
  const rowLabels = ["ε", ...X.split("")];
  const colLabels = ["ε", ...Y.split("")];
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [],
    message: `要把 "${X}" 改成 "${Y}"。每一格是「左邊這個前綴」改成「上面那個前綴」最少要幾步。刪 = 看上面 +1，插 = 看左邊 +1，替換 = 看左上 +1（字一樣就 +0）。`,
  });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = X[i - 1] === Y[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
      frames.push({
        rowLabels,
        colLabels,
        cells: dp.map((r) => [...r]),
        highlight: [
          { r: i, c: j },
          { r: i - 1, c: j },
          { r: i, c: j - 1 },
          { r: i - 1, c: j - 1 },
        ],
        message:
          cost === 0
            ? `「${X[i - 1]}」和「${Y[j - 1]}」一樣，不用改這個字。沿用左上角 ${dp[i - 1][j - 1]} 步。`
            : `「${X[i - 1]}」要變成「${Y[j - 1]}」。三種改法：\n替換（左上 ${dp[i - 1][j - 1]}+1）、刪掉 X 這個字（上 ${dp[i - 1][j]}+1）、插入 Y 這個字（左 ${dp[i][j - 1]}+1）。\n最少是 ${dp[i][j]}。`,
      });
    }
  }
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [{ r: m, c: n }],
    message: `最少 ${dp[m][n]} 步：把中間的 A 換成 U，CAT 就變成 CUT。`,
  });
  return frames;
}

export function matrixChainTrace(): TableFrame[] {
  const p = [10, 20, 30, 40];
  const n = p.length - 1;
  const m: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const frames: TableFrame[] = [];
  const labels = ["A1 10×20", "A2 20×30", "A3 30×40"];
  const show = () => m.map((r) => r.map((v) => (v === 0 ? 0 : v)));
  frames.push({
    rowLabels: labels,
    colLabels: labels,
    cells: show(),
    highlight: [],
    message: "矩陣相乘可以換括號，答案一樣、乘法次數不一樣。格子 m[i][j] = 把第 i 到第 j 個矩陣乘完，最少要幾次數字相乘。對角是 0（只剩一個矩陣，不用乘）。",
  });
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      m[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = m[i][k] + m[k + 1][j] + p[i]! * p[k + 1]! * p[j + 1]!;
        frames.push({
          rowLabels: labels,
          colLabels: labels,
          cells: show().map((r, ri) =>
            r.map((v, ci) => (ri === i && ci === j && !Number.isFinite(m[i][j]) ? "…" : v))
          ),
          highlight: [
            { r: i, c: j },
            { r: i, c: k },
            { r: k + 1, c: j },
          ],
          message: `最後一次乘法切在 A${k + 1} 後面：左邊 ${m[i][k]} 次 + 右邊 ${m[k + 1][j]} 次 + 把兩塊乘在一起 ${p[i]}×${p[k + 1]}×${p[j + 1]} = ${cost}。`,
        });
        if (cost < m[i][j]) m[i][j] = cost;
      }
    }
  }
  frames.push({
    rowLabels: labels,
    colLabels: labels,
    cells: show(),
    highlight: [{ r: 0, c: n - 1 }],
    message: `最少 ${m[0][n - 1]} 次乘法。(A1 A2)A3 = 10·20·30 + 10·30·40 = 18000；A1(A2 A3)=32000。`,
  });
  return frames;
}

export function unboundedKnapsackTrace(): TableFrame[] {
  const coins = [1, 5, 11];
  const W = 15;
  const dp = Array(W + 1).fill(Infinity);
  dp[0] = 0;
  const frames: TableFrame[] = [];
  const colLabels = Array.from({ length: W + 1 }, (_, i) => String(i));
  const show = () => [dp.map((v) => (v === Infinity ? "∞" : v))];
  frames.push({
    rowLabels: ["最少枚數"],
    colLabels,
    cells: show(),
    highlight: [{ r: 0, c: 0 }],
    message: "零錢：每種硬幣能用很多次。格子 dp[x] = 湊出 x 元最少要幾枚。0 元是 0 枚。",
  });
  for (const c of coins) {
    for (let x = c; x <= W; x++) {
      if (dp[x - c] + 1 < dp[x]) dp[x] = dp[x - c] + 1;
      frames.push({
        rowLabels: ["最少枚數"],
        colLabels,
        cells: show(),
        highlight: [
          { r: 0, c: x },
          { r: 0, c: x - c },
        ],
        message: `拿出一枚 ${c} 元，剩下 ${x - c} 元先前最少 ${
          dp[x - c] === Infinity ? "還湊不出" : `${dp[x - c]} 枚`
        }。加上這枚是 ${
          dp[x] === Infinity ? "∞" : dp[x]
        } 枚。和「不用這枚」比，留下較少的。`,
      });
    }
  }
  frames.push({
    rowLabels: ["最少枚數"],
    colLabels,
    cells: show(),
    highlight: [{ r: 0, c: W }],
    message: `15 元最少 ${dp[W]} 枚（11+1×4，或 5×3）。貪婪先拿 11 也剛好不是最差。`,
  });
  return frames;
}

export function fractionalKnapsackTrace(): TableFrame[] {
  const items = [
    { name: "A", w: 10, v: 60 },
    { name: "B", w: 20, v: 100 },
    { name: "C", w: 30, v: 120 },
  ];
  const W = 50;
  const sorted = [...items].sort((a, b) => b.v / b.w - a.v / a.w);
  const frames: TableFrame[] = [];
  const rowLabels = sorted.map((it) => `${it.name} 密度${(it.v / it.w).toFixed(1)}`);
  const colLabels = ["重量", "價值", "帶走"];
  const taken = sorted.map(() => 0);
  frames.push({
    rowLabels,
    colLabels,
    cells: sorted.map((it, i) => [it.w, it.v, taken[i]!]),
    highlight: [],
    message: "分數背包：依價值密度排序，能整件就整件，最後一件可切。容量 50。",
  });
  let cap = W;
  let value = 0;
  for (let i = 0; i < sorted.length; i++) {
    const it = sorted[i]!;
    const take = Math.min(it.w, cap);
    taken[i] = take;
    value += (take / it.w) * it.v;
    cap -= take;
    frames.push({
      rowLabels,
      colLabels,
      cells: sorted.map((x, j) => [x.w, x.v, taken[j]!]),
      highlight: [{ r: i, c: 2 }],
      message: `拿 ${it.name} ${take}/${it.w}，累計價值 ${value}，剩餘容量 ${cap}。`,
    });
    if (cap === 0) break;
  }
  frames.push({
    rowLabels,
    colLabels,
    cells: sorted.map((x, j) => [x.w, x.v, taken[j]!]),
    highlight: [],
    message: `最優 ${value}。0/1 不能切，這題若改 0/1 答案會不同。`,
  });
  return frames;
}

export type IntervalState = "idle" | "cand" | "picked" | "rejected";
export type IntervalFrame = {
  intervals: {
    name: string;
    start: number;
    end: number;
    state: IntervalState;
  }[];
  cursor?: number;
  message: string;
  picked: string[];
};

const ACT = [
  { name: "A", start: 1, end: 4 },
  { name: "B", start: 3, end: 5 },
  { name: "C", start: 0, end: 6 },
  { name: "D", start: 5, end: 7 },
  { name: "E", start: 5, end: 9 },
  { name: "F", start: 8, end: 11 },
  { name: "G", start: 8, end: 12 },
  { name: "H", start: 12, end: 16 },
];

export function activityTrace(): IntervalFrame[] {
  const sorted = [...ACT].sort((a, b) => a.end - b.end);
  const frames: IntervalFrame[] = [];
  const state: Record<string, IntervalState> = Object.fromEntries(
    ACT.map((x) => [x.name, "idle"])
  );
  const snap = (message: string, cursor?: number): IntervalFrame => ({
    intervals: ACT.map((x) => ({ ...x, state: state[x.name]! })),
    cursor,
    message,
    picked: sorted.filter((x) => state[x.name] === "picked").map((x) => x.name),
  });
  frames.push(snap("依結束時間排序後，每次選「結束最早且與已選不衝突」的工作。"));
  let lastEnd = -Infinity;
  for (const it of sorted) {
    state[it.name] = "cand";
    frames.push(
      snap(`考慮 ${it.name} [${it.start},${it.end}]。上一件結束於 ${lastEnd === -Infinity ? "−∞" : lastEnd}。`, it.end)
    );
    if (it.start >= lastEnd) {
      state[it.name] = "picked";
      lastEnd = it.end;
      frames.push(snap(`不衝突 → 選 ${it.name}。`, it.end));
    } else {
      state[it.name] = "rejected";
      frames.push(snap(`${it.name} 與已選重疊，捨棄。`, lastEnd));
    }
  }
  frames.push(snap("最優排程：選中的工作數最多（結束最早是正確的貪婪選擇）。"));
  return frames;
}

export function getIntervalTrace(slug: string): IntervalFrame[] {
  return slug === "activity-selection" ? activityTrace() : [];
}
