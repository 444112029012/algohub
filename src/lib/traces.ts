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
};

export type TableFrame = {
  rowLabels: string[];
  colLabels: string[];
  cells: (number | string)[][];
  highlight: { r: number; c: number }[];
  message: string;
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
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [],
    message: "0/1 背包：列是物品、欄是容量。dp[i][w] = 前 i 件、容量 w 的最大價值。",
  });
  for (let i = 1; i <= n; i++) {
    const { w, v, name } = items[i - 1];
    for (let cap = 0; cap <= W; cap++) {
      dp[i][cap] = dp[i - 1][cap];
      if (cap >= w) {
        dp[i][cap] = Math.max(dp[i][cap], dp[i - 1][cap - w] + v);
      }
      frames.push({
        rowLabels,
        colLabels,
        cells: dp.map((r) => [...r]),
        highlight: [
          { r: i, c: cap },
          { r: i - 1, c: cap },
          ...(cap >= w ? [{ r: i - 1, c: cap - w }] : []),
        ],
        message:
          cap < w
            ? `物品 ${name} 重 ${w} > 容量 ${cap}，只能不拿：${dp[i][cap]}`
            : `物品 ${name}：不拿 ${dp[i - 1][cap]} vs 拿 ${
                dp[i - 1][cap - w]
              }+${v} → ${dp[i][cap]}`,
      });
    }
  }
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [{ r: n, c: W }],
    message: `答案 dp[${n}][${W}] = ${dp[n][W]}。每件物品最多拿一次。`,
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
  const rowLabels = ["ε", ...X.split("")];
  const colLabels = ["ε", ...Y.split("")];
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [],
    message: `LCS("${X}", "${Y}")。字元相同取左上 +1，否則取上或左的較大值。`,
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
            { r: i, c: j },
            { r: i - 1, c: j - 1 },
          ],
          message: `${X[i - 1]} = ${Y[j - 1]}，dp=${dp[i - 1][j - 1]}+1 = ${
            dp[i][j]
          }`,
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        frames.push({
          rowLabels,
          colLabels,
          cells: dp.map((r) => [...r]),
          highlight: [
            { r: i, c: j },
            { r: i - 1, c: j },
            { r: i, c: j - 1 },
          ],
          message: `${X[i - 1]} ≠ ${Y[j - 1]}，max(上 ${dp[i - 1][j]}, 左 ${
            dp[i][j - 1]
          }) = ${dp[i][j]}`,
        });
      }
    }
  }
  frames.push({
    rowLabels,
    colLabels,
    cells: dp.map((r) => [...r]),
    highlight: [{ r: m, c: n }],
    message: `LCS 長度 = ${dp[m][n]}（其中一解為 BCB）。`,
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
    message: "Floyd–Warshall：對每個中繼點 k，嘗試 i→k→j 是否更短。",
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
          message: `k=${labels[k]}，檢查 ${labels[i]}→${labels[j]}：目前 ${
            d[i][j] >= INF ? "∞" : d[i][j]
          } vs ${labels[i]}→${labels[k]}→${labels[j]} = ${
            d[i][k] >= INF || d[k][j] >= INF ? "∞" : cand
          }`,
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
      message: `以 ${labels[k]} 為中繼後的距離矩陣。`,
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
    default:
      return [];
  }
}

export function graphLayout(slug: string) {
  if (slug === "topo-sort") return TOPO_GRAPH;
  return {
    nodes: DEMO_GRAPH.nodes,
    edges: DEMO_GRAPH.undirected.map(([u, v, w]) => ({
      u,
      v,
      w,
      directed: false as const,
    })),
  };
}
