import type {
  ArrayFrame,
  ArrayKind,
  GraphEdgeState,
  GraphFrame,
} from "./traces";

const SMALL = [5, 1, 4, 2, 8];

function rangeHi(
  lo: number,
  hi: number,
  kind: ArrayKind
): { index: number; kind: ArrayKind }[] {
  const out = [];
  for (let i = lo; i <= hi; i++) out.push({ index: i, kind });
  return out;
}

export function bubbleSortTrace(input = SMALL): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a = [...input];
  frames.push({
    array: [...a],
    highlights: [],
    message: `氣泡排序：每一輪把尚未定位區間裡相鄰的大的往右推。本輪若沒交換就可提前結束。`,
  });
  for (let n = a.length; n > 1; n--) {
    let swapped = false;
    frames.push({
      array: [...a],
      highlights: rangeHi(0, n - 1, "range"),
      message: `第 ${a.length - n + 1} 輪：掃描 [0..${n - 1}]，最大的會「浮」到位置 ${n - 1}。`,
    });
    for (let i = 0; i < n - 1; i++) {
      frames.push({
        array: [...a],
        highlights: [
          { index: i, kind: "compare" },
          { index: i + 1, kind: "compare" },
        ],
        message: `比較 ${a[i]} 與 ${a[i + 1]}${a[i] > a[i + 1] ? " → 要交換" : " → 已順序"}`,
      });
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
        frames.push({
          array: [...a],
          highlights: [
            { index: i, kind: "swap" },
            { index: i + 1, kind: "swap" },
          ],
          message: `交換後：[${a.join(", ")}]`,
        });
      }
    }
    frames.push({
      array: [...a],
      highlights: a.map((_, i) =>
        i >= n - 1 ? { index: i, kind: "sorted" as const } : { index: i, kind: "range" as const }
      ),
      message: `位置 ${n - 1} 已定位為 ${a[n - 1]}。${swapped ? "" : "本輪零交換，提早結束。"}`,
    });
    if (!swapped) break;
  }
  frames.push({
    array: [...a],
    highlights: a.map((_, i) => ({ index: i, kind: "sorted" as const })),
    message: `完成：[${a.join(", ")}]。穩定、原地；最好 Θ(n)，最壞 Θ(n²)。`,
  });
  return frames;
}

export function insertionSortTrace(input = SMALL): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a = [...input];
  frames.push({
    array: [...a],
    highlights: [{ index: 0, kind: "sorted" }],
    message: `插入排序：左半已排序，每次把下一個元素插入正確位置。`,
  });
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    frames.push({
      array: [...a],
      highlights: [
        ...rangeHi(0, i - 1, "sorted"),
        { index: i, kind: "write" },
      ],
      message: `插入 key=${key}（原位置 ${i}）到左邊已排序區。`,
    });
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      frames.push({
        array: [...a],
        highlights: [
          { index: j, kind: "compare" },
          { index: j + 1, kind: "write" },
        ],
        message: `${a[j]} > ${key}，把 ${a[j]} 右移一格`,
      });
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
    frames.push({
      array: [...a],
      highlights: rangeHi(0, i, "sorted"),
      message: `key=${key} 放到索引 ${j + 1}。前 ${i + 1} 個已排序。`,
    });
  }
  frames.push({
    array: [...a],
    highlights: a.map((_, i) => ({ index: i, kind: "sorted" as const })),
    message: `完成。已接近排序時幾乎線性，這是它當「小陣列收尾」的原因。`,
  });
  return frames;
}

export function selectionSortTrace(input = SMALL): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a = [...input];
  frames.push({
    array: [...a],
    highlights: [],
    message: `選擇排序：每輪在未排序區找最小值，與左端交換。比較次數固定。`,
  });
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    frames.push({
      array: [...a],
      highlights: [
        ...rangeHi(0, i - 1, "sorted"),
        { index: i, kind: "write" },
      ],
      message: `未排序從 ${i} 開始，先假設最小值是 ${a[i]}。`,
    });
    for (let j = i + 1; j < a.length; j++) {
      frames.push({
        array: [...a],
        highlights: [
          { index: min, kind: "pivot" },
          { index: j, kind: "compare" },
        ],
        message: `比較 ${a[j]} 與目前最小 ${a[min]}`,
      });
      if (a[j] < a[min]) min = j;
    }
    [a[i], a[min]] = [a[min], a[i]];
    frames.push({
      array: [...a],
      highlights: [
        { index: i, kind: "swap" },
        { index: min, kind: "swap" },
      ],
      message: `本輪最小 ${a[i]} 換到位置 ${i}。`,
    });
  }
  frames.push({
    array: [...a],
    highlights: a.map((_, i) => ({ index: i, kind: "sorted" as const })),
    message: `完成。永遠 Θ(n²) 次比較，不穩定（相等元素可能被換過）。`,
  });
  return frames;
}

export function countingSortTrace(input = [4, 2, 2, 8, 3, 3, 1]): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a = [...input];
  const k = Math.max(...a);
  const cnt = Array(k + 1).fill(0);
  frames.push({
    array: [...a],
    highlights: [],
    message: `計數排序：值域 1..${k}。先數每個值出現幾次，再從右往左填回去以保持穩定。`,
  });
  for (let i = 0; i < a.length; i++) {
    cnt[a[i]]++;
    frames.push({
      array: [...a],
      highlights: [{ index: i, kind: "compare" }],
      message: `讀 ${a[i]}，count[${a[i]}]=${cnt[a[i]]}。計數表：[${cnt.join(", ")}]`,
    });
  }
  for (let v = 1; v <= k; v++) cnt[v] += cnt[v - 1];
  frames.push({
    array: [...a],
    highlights: [],
    message: `改成前綴和（≤v 的個數）：[${cnt.join(", ")}]。這就是每個值最後該放的位置 +1。`,
  });
  const out = Array(a.length).fill(0);
  for (let i = a.length - 1; i >= 0; i--) {
    const v = a[i];
    cnt[v]--;
    out[cnt[v]] = v;
    frames.push({
      array: [...out],
      highlights: [{ index: cnt[v], kind: "write" }],
      message: `從右取 ${v}，放到 out[${cnt[v]}]。從右填才能穩定。`,
    });
  }
  frames.push({
    array: [...out],
    highlights: out.map((_, i) => ({ index: i, kind: "sorted" as const })),
    message: `完成。時間 Θ(n+k)，不是比較排序，k 太大就改用基數排序。`,
  });
  return frames;
}

export function radixSortTrace(
  input = [38, 27, 43, 3, 9, 82, 10]
): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  let a = [...input];
  frames.push({
    array: [...a],
    highlights: [],
    message: `LSD 基數排序：先排個位、再十位。每一輪必須用穩定的計數排序。`,
  });
  const max = Math.max(...a);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    frames.push({
      array: [...a],
      highlights: [],
      message: `依 ${exp === 1 ? "個" : "十"}位（exp=${exp}）做穩定計數排序。`,
    });
    const cnt = Array(10).fill(0);
    for (const x of a) cnt[Math.floor(x / exp) % 10]++;
    for (let i = 1; i < 10; i++) cnt[i] += cnt[i - 1];
    const out = Array(a.length).fill(0);
    for (let i = a.length - 1; i >= 0; i--) {
      const d = Math.floor(a[i] / exp) % 10;
      cnt[d]--;
      out[cnt[d]] = a[i];
    }
    a = out;
    frames.push({
      array: [...a],
      highlights: a.map((_, i) => ({ index: i, kind: "write" as const })),
      message: `排完這一碼：[${a.join(", ")}]`,
    });
  }
  frames.push({
    array: [...a],
    highlights: a.map((_, i) => ({ index: i, kind: "sorted" as const })),
    message: `完成。d 碼、值域 10 時時間 Θ(d(n+10))。穩定才保證高位不會打亂低位。`,
  });
  return frames;
}

export function quickselectTrace(
  input = [38, 27, 43, 3, 9, 82, 10],
  k = 3
): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a = [...input];
  frames.push({
    array: [...a],
    highlights: [],
    message: `Quickselect 找第 ${k + 1} 小（0-based 索引 k=${k}）。只遞迴樞紐的那一側。`,
  });

  function partition(lo: number, hi: number) {
    const pivot = a[hi];
    frames.push({
      array: [...a],
      highlights: [
        ...rangeHi(lo, hi, "range"),
        { index: hi, kind: "pivot" },
      ],
      message: `區間 [${lo}..${hi}]，樞紐 ${pivot}`,
      lo,
      hi,
    });
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    frames.push({
      array: [...a],
      highlights: [{ index: i, kind: "pivot" }],
      message: `樞紐 ${a[i]} 就位索引 ${i}。目標 k=${k}。`,
      lo,
      hi,
    });
    return i;
  }

  function select(lo: number, hi: number): number {
    if (lo === hi) return a[lo];
    const p = partition(lo, hi);
    if (k === p) return a[p];
    if (k < p) {
      frames.push({
        array: [...a],
        highlights: rangeHi(lo, p - 1, "left"),
        message: `k < ${p}，丟右半，只看左邊。`,
      });
      return select(lo, p - 1);
    }
    frames.push({
      array: [...a],
      highlights: rangeHi(p + 1, hi, "right"),
      message: `k > ${p}，丟左半，只看右邊。`,
    });
    return select(p + 1, hi);
  }

  const ans = select(0, a.length - 1);
  frames.push({
    array: [...a],
    highlights: [{ index: k, kind: "sorted" }],
    message: `第 ${k + 1} 小是 ${ans}。平均 Θ(n)，最壞 Θ(n²)（退化成每次少 1）。`,
  });
  return frames;
}

export function binarySearchAnswerTrace(): ArrayFrame[] {
  const piles = [3, 6, 7, 11];
  const h = 8;
  const speeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const frames: ArrayFrame[] = [];

  function hours(speed: number) {
    return piles.reduce((s, p) => s + Math.ceil(p / speed), 0);
  }

  frames.push({
    array: [...speeds],
    highlights: [],
    message: `答案上二分：香蕉堆 [${piles.join(", ")}]，限 ${h} 小時。棒子是「速度」，不是堆本身。`,
  });
  let lo = 0;
  let hi = speeds.length - 1;
  let ans = hi;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const speed = speeds[mid];
    const used = hours(speed);
    const ok = used <= h;
    frames.push({
      array: [...speeds],
      highlights: [
        ...rangeHi(lo, hi, "range"),
        { index: mid, kind: "mid" },
      ],
      message: `試速度 ${speed}：需要 ${used} 小時，${ok ? `≤ ${h}，可行，往更小找` : `> ${h}，太慢，往更大找`}。`,
      lo,
      hi,
      mid,
    });
    if (ok) {
      ans = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  frames.push({
    array: [...speeds],
    highlights: [{ index: ans, kind: "sorted" }],
    message: `最小可行速度是 ${speeds[ans]}。謂詞「速度 ≥ x 就來得及」單調，才能二分。`,
  });
  return frames;
}

export function heapDsTrace(): ArrayFrame[] {
  const frames: ArrayFrame[] = [];
  const a: number[] = [];

  function pushFrame(msg: string, kind: ArrayKind = "write") {
    frames.push({
      array: a.length ? [...a] : [0],
      highlights: a.map((_, i) => ({ index: i, kind })),
      message: msg,
    });
  }

  function swim(i: number) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (a[p] >= a[i]) break;
      frames.push({
        array: [...a],
        highlights: [
          { index: p, kind: "pivot" },
          { index: i, kind: "swap" },
        ],
        message: `上浮：孩子 ${a[i]} > 父 ${a[p]}，交換（父=⌊(i-1)/2⌋）。`,
      });
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }

  function insert(x: number) {
    a.push(x);
    frames.push({
      array: [...a],
      highlights: [{ index: a.length - 1, kind: "write" }],
      message: `插入 ${x} 到陣列尾端（完全二元樹下一個空位；0-based 左孩 2i+1）。`,
    });
    swim(a.length - 1);
  }

  insert(38);
  insert(27);
  insert(43);
  insert(82);
  frames.push({
    array: [...a],
    highlights: a.map((_, i) => ({ index: i, kind: "sorted" as const })),
    message: `堆頂 ${a[0]} 是最大值。取最大：與最後一個交換，縮小堆，再下沉。`,
  });
  const max = a[0];
  a[0] = a[a.length - 1];
  a.pop();
  frames.push({
    array: [...a],
    highlights: [{ index: 0, kind: "pivot" }],
    message: `取出 ${max}。新根是 ${a[0]}，可能違反堆性質，開始下沉。`,
  });
  let i = 0;
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let largest = i;
    if (l < a.length && a[l] > a[largest]) largest = l;
    if (r < a.length && a[r] > a[largest]) largest = r;
    if (largest === i) break;
    frames.push({
      array: [...a],
      highlights: [
        { index: i, kind: "pivot" },
        { index: largest, kind: "swap" },
      ],
      message: `下沉：${a[i]} 與較大的孩子 ${a[largest]} 交換。`,
    });
    [a[i], a[largest]] = [a[largest], a[i]];
    i = largest;
  }
  pushFrame(`堆恢復。插入／刪最值都是 O(log n)；建堆一次是 Θ(n) 不是 Θ(n log n)。`, "sorted");
  return frames;
}

export const SCC_GRAPH = {
  nodes: [
    { id: "A", x: 70, y: 48 },
    { id: "B", x: 210, y: 48 },
    { id: "C", x: 350, y: 48 },
    { id: "D", x: 70, y: 188 },
    { id: "E", x: 210, y: 188 },
    { id: "F", x: 350, y: 188 },
  ],
  edges: [
    ["A", "B"],
    ["B", "C"],
    ["C", "A"],
    ["A", "D"],
    ["D", "E"],
    ["E", "D"],
    ["E", "F"],
  ] as [string, string][],
};

export function sccTrace(): GraphFrame[] {
  const nodes = SCC_GRAPH.nodes.map((n) => n.id);
  const edges = SCC_GRAPH.edges;
  const g: Record<string, string[]> = {};
  const gt: Record<string, string[]> = {};
  for (const id of nodes) {
    g[id] = [];
    gt[id] = [];
  }
  for (const [u, v] of edges) {
    g[u].push(v);
    gt[v].push(u);
  }
  for (const id of nodes) {
    g[id].sort();
    gt[id].sort();
  }

  const frames: GraphFrame[] = [];
  const dirKey = (u: string, v: string) => `${u}>${v}`;
  const nodeStates: GraphFrame["nodeStates"] = Object.fromEntries(
    nodes.map((id) => [id, "idle" as const])
  );
  const edgeStates: Record<string, GraphEdgeState> = {};

  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: {},
    message:
      "Kosaraju 分兩輪。\n第一輪：對原圖做 DFS，每個點「走完離開」時記進完成序。\n第二輪：把所有箭頭反過來，從完成序最晚的點再 DFS——一次走完的點就是同一個強連通分量。",
    structureLabel: "完成序",
    structure: [],
  });

  const seen = new Set<string>();
  const order: string[] = [];

  function dfs1(u: string) {
    seen.add(u);
    nodeStates[u] = "current";
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `第一輪：走進 ${u}（沿箭頭往深處走，還沒離開）。`,
      structureLabel: "完成序",
      structure: [...order],
    });
    for (const v of g[u]) {
      const k = dirKey(u, v);
      if (!seen.has(v)) {
        edgeStates[k] = "tree";
        dfs1(v);
      } else edgeStates[k] = edgeStates[k] === "tree" ? "tree" : "rejected";
    }
    nodeStates[u] = "visited";
    order.push(u);
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `${u} 的鄰居都走完了，把它記進完成序（越晚離開越先當第二輪起點）。`,
      structureLabel: "完成序",
      structure: [...order],
    });
  }

  for (const u of nodes) if (!seen.has(u)) dfs1(u);

  frames.push({
    nodeStates: { ...nodeStates },
    edgeStates: { ...edgeStates },
    message: `完成序從早到晚：${order.join(" ")}。現在把箭頭全部反過來，從最晚的 ${order[order.length - 1]} 開始第二輪。`,
    structureLabel: "完成序",
    structure: [...order],
  });

  for (const id of nodes) nodeStates[id] = "idle";
  const assigned = new Set<string>();
  const comps: string[][] = [];

  function dfs2(u: string, bucket: string[]) {
    assigned.add(u);
    bucket.push(u);
    nodeStates[u] = "current";
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `第二輪（反向圖）：${u} 加進目前這個分量 {${bucket.join(", ")}}。反向還走得到的，就是同一個分量。`,
      structureLabel: "SCC",
      structure: comps.map((c) => `{${c.join("")}}`).concat([`{${bucket.join("")}}`]),
    });
    for (const v of gt[u]) {
      if (!assigned.has(v)) {
        edgeStates[dirKey(v, u)] = "relaxed";
        dfs2(v, bucket);
      }
    }
    nodeStates[u] = "done";
  }

  for (let i = order.length - 1; i >= 0; i--) {
    const u = order[i];
    if (assigned.has(u)) continue;
    const bucket: string[] = [];
    dfs2(u, bucket);
    comps.push(bucket);
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message: `這一輪走完，得到一個強連通分量 {${bucket.join(", ")}}——裡面的點彼此都走得到。`,
      structureLabel: "SCC",
      structure: comps.map((c) => `{${c.join("")}}`),
    });
  }

  frames.push({
    nodeStates: Object.fromEntries(nodes.map((id) => [id, "done" as const])),
    edgeStates: { ...edgeStates },
    message: `三個分量：{A,B,C}、{D,E}、{F}。把每個分量縮成一個點之後不會有環，才能接著做拓樸或 2-SAT。`,
    structureLabel: "SCC",
    structure: comps.map((c) => `{${c.join("")}}`),
  });
  return frames;
}
