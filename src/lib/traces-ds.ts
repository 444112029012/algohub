import type { GraphFrame, TableFrame } from "./traces";

export const BST_LAYOUT = {
  nodes: [
    { id: "8", x: 215, y: 40 },
    { id: "3", x: 110, y: 112 },
    { id: "10", x: 330, y: 112 },
    { id: "1", x: 48, y: 188 },
    { id: "6", x: 175, y: 188 },
  ],
  edges: [
    { u: "8", v: "3", directed: true },
    { u: "8", v: "10", directed: true },
    { u: "3", v: "1", directed: true },
    { u: "3", v: "6", directed: true },
  ],
};

export function bstTrace(): GraphFrame[] {
  const ids = BST_LAYOUT.nodes.map((n) => n.id);
  const nodeStates: GraphFrame["nodeStates"] = Object.fromEntries(
    ids.map((id) => [id, "idle" as const])
  );
  const edgeStates: GraphFrame["edgeStates"] = {};
  const frames: GraphFrame[] = [];
  const shown: string[] = [];

  const snap = (message: string) => {
    frames.push({
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates },
      message,
      structureLabel: "已放入",
      structure: [...shown],
      shown: [...shown],
    });
  };

  snap("空樹。依序放入 8、3、10、1、6。比現在這個點小就往左，大就往右。");

  shown.push("8");
  nodeStates["8"] = "current";
  snap("第一個數 8 沒有可比較的點，它就是根。");

  nodeStates["8"] = "visited";
  nodeStates["3"] = "current";
  shown.push("3");
  edgeStates["8>3"] = "tree";
  snap("3 比根 8 小，往左，左子是空的，所以 3 掛在 8 的左邊。");

  nodeStates["3"] = "visited";
  nodeStates["10"] = "current";
  shown.push("10");
  edgeStates["8>10"] = "tree";
  snap("10 比根 8 大，往右。右子是空的，10 掛在 8 的右邊。");

  nodeStates["10"] = "visited";
  nodeStates["3"] = "current";
  snap("1 比根 8 小，先走到左子 3。");
  nodeStates["3"] = "visited";
  nodeStates["1"] = "current";
  shown.push("1");
  edgeStates["3>1"] = "tree";
  snap("1 又比 3 小，3 的左邊是空的，1 掛在那裡。");

  nodeStates["1"] = "visited";
  nodeStates["8"] = "current";
  snap("6 比根 8 小，往左到 3。");
  nodeStates["8"] = "visited";
  nodeStates["3"] = "current";
  snap("6 比 3 大，往右。");
  nodeStates["3"] = "visited";
  nodeStates["6"] = "current";
  shown.push("6");
  edgeStates["3>6"] = "tree";
  snap("6 掛在 3 的右邊。左右有大小順序，這是搜尋樹，不是堆積。堆積只要求父節點比孩子大，左右可以沒有順序。");

  return frames;
}

function strip(
  rowTitle: string,
  colTitle: string,
  values: string[],
  hot: number | null,
  message: string,
  endLabel: string
): TableFrame {
  const labels =
    values.length === 0
      ? [" "]
      : values.map((_, i) => (i === hot ? endLabel : String(i)));
  return {
    rowLabels: [rowTitle],
    colLabels: labels,
    cells: [values.length ? values : ["（空）"]],
    highlight: hot === null || values.length === 0 ? [] : [{ r: 0, c: hot, role: "current" }],
    rowTitle,
    colTitle,
    message,
  };
}

export function stackTrace(): TableFrame[] {
  const s: string[] = [];
  const frames: TableFrame[] = [];
  const snap = (message: string, hot: number | null) => {
    frames.push(
      strip("堆疊", "右邊是頂端，下一個被拿走的是它", s, hot, message, "頂")
    );
  };
  snap("後進先出。想像一疊盤子：最後放上去的，最先拿下來。右邊當成頂端。", null);
  s.push("3");
  snap("放進 3。它現在是頂端。", 0);
  s.push("1");
  snap("再放進 1。1 壓在 3 上面，下一個取出的是 1，不是 3。", 1);
  s.push("4");
  snap("再放進 4。頂端換成 4。", 2);
  s.pop();
  snap("取出頂端 4。1 重新變成頂端。底下的 3 還沒輪到。", s.length - 1);
  s.push("2");
  snap("放進 2。現在從頂端往下是 2、1、3。DFS 走迷宮、函式呼叫，都是這種順序。", 2);
  return frames;
}

export function queueTrace(): TableFrame[] {
  const q: string[] = [];
  const frames: TableFrame[] = [];
  const snap = (message: string) => {
    frames.push(
      strip(
        "佇列",
        "左邊是頭，下一個被拿走的是它；新的人排到右邊",
        q,
        q.length ? 0 : null,
        message,
        "頭"
      )
    );
  };
  snap("先進先出。人排隊：先來的先走。左邊是頭。BFS 就是用這個順序展開鄰居。");
  q.push("A");
  snap("A 來排隊。隊伍裡只有 A，它既是頭也是尾。");
  q.push("B");
  snap("B 排到後面。下一個離開的仍是 A。");
  q.push("C");
  snap("C 再排到後面。隊伍是 A、B、C。");
  q.shift();
  snap("A 離開。頭換成 B。A 不會插回隊伍中間。");
  q.push("D");
  snap("D 排到尾端。現在是 B、C、D。先發現的點先處理，就是 BFS。");
  return frames;
}

export function hashTrace(): TableFrame[] {
  const buckets = ["·", "·", "·", "·", "·"];
  const frames: TableFrame[] = [];
  const snap = (key: number | null, message: string) => {
    const b = key === null ? -1 : key % 5;
    frames.push({
      rowLabels: ["鏈"],
      colLabels: ["0", "1", "2", "3", "4"],
      cells: [buckets.map((x) => x)],
      highlight: b < 0 ? [] : [{ r: 0, c: b, role: "current" }],
      colTitle: "桶編號 = 鍵 % 5",
      rowTitle: "同一個餘數串成一條鏈",
      legend: "· 代表這個桶還是空的",
      message,
    });
  };
  snap(null, "五個桶，編號 0 到 4。鍵放進「鍵除以 5 的餘數」那個桶。不同的鍵若餘數相同，就在同一個桶裡排隊，這叫碰撞。");
  const put = (key: number) => {
    const b = key % 5;
    buckets[b] = buckets[b] === "·" ? String(key) : `${buckets[b]} → ${key}`;
    const collided = buckets[b].includes("→");
    snap(
      key,
      collided
        ? `${key} ÷ 5 餘 ${b}，桶 ${b} 已經有人。接到鏈的後面，不必改別人的位置。`
        : `${key} ÷ 5 餘 ${b}，桶 ${b} 是空的，它是這個桶的第一個。`
    );
  };
  put(12);
  put(8);
  put(7);
  put(15);
  put(22);
  return frames;
}

export function unionFindTrace(): TableFrame[] {
  const ids = ["A", "B", "C", "D", "E", "F"];
  const parent: Record<string, string> = Object.fromEntries(ids.map((id) => [id, id]));
  const frames: TableFrame[] = [];
  const snap = (message: string, hi: string[]) => {
    frames.push({
      rowLabels: ["父親"],
      colLabels: ids,
      cells: [ids.map((id) => parent[id])],
      highlight: hi.map((id) => ({ r: 0, c: ids.indexOf(id), role: "current" as const })),
      colTitle: "這個人",
      rowTitle: "他的老大（父親）。自己指向自己就是一組的代表",
      legend: "亮起來的是這一步被改到的人",
      message,
    });
  };
  const find = (x: string): string => (parent[x] === x ? x : find(parent[x]));
  snap("六個人一開始各成一組。格子裡的字母是他的父親；自己指向自己，代表他就是這組的老大。", []);
  const unite = (x: string, y: string) => {
    const rx = find(x);
    const ry = find(y);
    if (rx === ry) {
      snap(`${x} 和 ${y} 的老大都是 ${rx}，已經同組，不用再合併。`, [x, y, rx]);
      return;
    }
    parent[ry] = rx;
    snap(
      `${x} 的老大是 ${rx}，${y} 的老大是 ${ry}，不同組。\n把 ${ry} 掛到 ${rx} 下面，所以 ${ry} 的父親改成 ${rx}。問兩人是否同組，就是看老大是不是同一個人。`,
      [ry, rx]
    );
  };
  unite("A", "B");
  unite("B", "E");
  unite("E", "F");
  unite("C", "F");
  snap(
    "找老大的路上，可以把沿路的人直接改掛到老大，樹就不會變成一條長鏈。這叫路徑壓縮。\nD 的父親還是 D，所以 D 和 A 仍是不同組。",
    ["D", "A"]
  );
  return frames;
}

export function kmpTrace(): TableFrame[] {
  const p = ["A", "B", "A", "B", "C"];
  const lps = ["0", "·", "·", "·", "·"];
  const frames: TableFrame[] = [];
  const snap = (i: number, message: string) => {
    frames.push({
      rowLabels: ["模式", "LPS"],
      colLabels: ["0", "1", "2", "3", "4"],
      cells: [p, [...lps]],
      highlight: [
        { r: 0, c: i, role: "current" },
        { r: 1, c: i, role: "current" },
      ],
      colTitle: "模式的第幾個字（從 0 開始）",
      rowTitle: "LPS = 這個前綴最長的「真」前後綴有多長",
      legend: "真前後綴必須比整個字串短",
      message,
    });
  };
  snap(0, "模式是 ABABC。匹配失敗時不要把文章的指針退回去，只滑動模式。\n能滑多少，看「前面這一段的開頭，同時也是它的結尾」有多長。單一個 A 沒有比自己更短的前後綴，LPS[0] = 0。");
  lps[1] = "0";
  snap(1, "看到 AB。開頭 A 和結尾 B 不同，接不起來。LPS[1] = 0。");
  lps[2] = "1";
  snap(2, "看到 ABA。開頭的 A 同時是結尾，長度 1。LPS[2] = 1。");
  lps[3] = "2";
  snap(3, "看到 ABAB。開頭的 AB 同時是結尾，長度 2。LPS[3] = 2。\n之後若在這裡失敗，模式不必回到 0，只要對齊還重疊的 AB。");
  lps[4] = "0";
  snap(4, "看到 ABABC。C 接不上下一個該對上的 A，也沒有更短的前後綴。LPS[4] = 0。\n整張表是 0, 0, 1, 2, 0。文章的指針只會往前，所以時間是 Θ(文章長度 + 模式長度)。");
  return frames;
}

export function huffmanTrace(): TableFrame[] {
  let groups = [
    { name: "C1", f: 1 },
    { name: "D1", f: 1 },
    { name: "B2", f: 2 },
    { name: "E3", f: 3 },
    { name: "A5", f: 5 },
  ];
  const frames: TableFrame[] = [];
  const snap = (message: string, hot: number[]) => {
    frames.push({
      rowLabels: ["頻率"],
      colLabels: groups.map((g) => g.name),
      cells: [groups.map((g) => g.f)],
      highlight: hot.map((c) => ({ r: 0, c, role: "current" as const })),
      colTitle: "還沒合併完的組（已依頻率由小到大）",
      rowTitle: "這一組出現幾次",
      legend: "亮起來的是這一步被捆在一起的兩組",
      message,
    });
  };
  snap(
    "A 出現 5 次、B 2 次、C 和 D 各 1 次、E 3 次。\n碼不能有一個是另一個的開頭，解碼才不會分岔。出現少的字碼可以比較長，所以每次把目前最少的兩組捆起來。",
    []
  );
  const merge = (explain: string) => {
    const [a, b] = groups;
    const node = { name: `${a.name}+${b.name}`, f: a.f + b.f };
    groups = [...groups.slice(2), node].sort((x, y) => x.f - y.f || x.name.localeCompare(y.name));
    const idx = groups.findIndex((g) => g.name === node.name);
    snap(explain, [idx]);
  };
  merge("最少的是 C 和 D，各 1 次。捆成一組，頻率 1+1=2。這組以後的碼會比 A 長。");
  merge("現在最少的是 B（2）和剛捆好的 CD（2）。再捆成頻率 4。");
  merge("最少的是 E（3）和 BCD（4）。捆成 7。");
  merge("最後剩下 A（5）和剛才那組（7）。捆成 12。A 最常出現，所以它的碼最短。");
  return frames;
}
