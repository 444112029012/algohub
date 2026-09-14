import type { Algorithm } from "./types";

export const graphLessons: Algorithm[] = [
  {
    slug: "bfs",
    name: "廣度優先搜尋",
    english: "BFS",
    category: "graph",
    examWeight: "極高",
    tags: ["遍歷", "最短路徑", "佇列"],
    summary:
      "用佇列一層一層走訪。無權（或權重全為 1）的圖上，第一次走到就是最短路徑。時間 Θ(V+E)。",
    idea: "FIFO：先被發現的點先展開。距離 d(s,v) 隨層數 +1。可用來算連通分量、二分圖染色、最短路徑樹。",
    whenToUse: [
      "無權圖最短路徑",
      "層級關係（社交距離、最短招數）",
      "網格地圖走迷宮（每格代價相同）",
    ],
    examTips: [
      "資料結構是 Queue；DFS 是 Stack / 遞迴。",
      "複雜度鄰接表 Θ(V+E)，鄰接矩陣 Θ(V²)。",
      "有權圖不能直接 BFS，要 Dijkstra / 0-1 BFS。",
      "顏色：白（未訪）、灰（在佇列）、黑（展開完）——CLRS 考法。",
    ],
    pitfalls: [
      "在有不同邊權的圖上誤用 BFS 當最短路。",
      "沒有 visited，在無向圖會把同一點反覆入隊。",
    ],
    complexity: {
      timeBest: "Θ(V+E)",
      timeAvg: "Θ(V+E)",
      timeWorst: "Θ(V+E)",
      space: "Θ(V)",
    },
    complexityNote: "每個點入隊至多一次，每條邊檢查常數次。",
    workedExample: {
      title: "從 A 出發，鄰居依字母序",
      input: "無向圖 A—B—C，A—D，B—E，E—F，C—F",
      steps: [
        { title: "第 0 層", detail: "佇列 [A]，距離 0。" },
        { title: "第 1 層", detail: "A 的鄰居 B、D 入隊。距離皆 1。" },
        { title: "第 2 層", detail: "B 展開 C、E（A 已訪）；D 的 E 已在佇列。" },
        { title: "第 3 層", detail: "C、E 把 F 入隊，距離 3。結束。" },
      ],
      result: "訪問序約為 A, B, D, C, E, F；d(A,F)=3",
    },
    visualizer: "graph",
    pseudocode: `BFS(G, s)
  for each u in V: d[u] ← ∞; π[u] ← NIL
  d[s] ← 0
  Q ← {s}
  while Q 非空
    u ← DEQUEUE(Q)
    for each v in Adj[u]
      if d[v] = ∞
        d[v] ← d[u] + 1
        π[v] ← u
        ENQUEUE(Q, v)`,
    codes: {
      python: `from collections import deque

def bfs(graph: dict[str, list[str]], start: str) -> dict[str, int]:
    dist = {start: 0}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in graph[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist`,
      cpp: `vector<int> bfs(const vector<vector<int>>& g, int s) {
    int n = (int)g.size();
    vector<int> d(n, -1);
    queue<int> q;
    d[s] = 0; q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u]) if (d[v] < 0) {
            d[v] = d[u] + 1;
            q.push(v);
        }
    }
    return d;
}`,
      typescript: `function bfs(graph: Record<string, string[]>, start: string) {
  const dist: Record<string, number> = { [start]: 0 };
  const q = [start];
  while (q.length) {
    const u = q.shift()!;
    for (const v of graph[u] ?? []) {
      if (dist[v] === undefined) {
        dist[v] = dist[u] + 1;
        q.push(v);
      }
    }
  }
  return dist;
}`,
    },
    quiz: [
      {
        id: "bfs1",
        prompt: "BFS 使用的資料結構是？",
        options: ["Stack", "Queue", "Min-Heap", "並查集"],
        answer: 1,
        explanation: "先進先出才能保證按層展開。",
      },
      {
        id: "bfs2",
        prompt: "BFS 能保證最短路徑的條件？",
        options: [
          "任意有權圖",
          "邊權可為負",
          "無權或邊權全相同",
          "圖必須是樹",
        ],
        answer: 2,
        explanation: "層數 = 邊數。邊權不同時層數不再等於距離。",
      },
      {
        id: "bfs3",
        prompt: "鄰接表 BFS 的時間？",
        options: ["Θ(V)", "Θ(E)", "Θ(V+E)", "Θ(V log V)"],
        answer: 2,
        explanation: "掃過所有點與邊各常數次。",
      },
    ],
    related: ["dfs", "dijkstra", "topo-sort"],
  },
  {
    slug: "dfs",
    name: "深度優先搜尋",
    english: "DFS",
    category: "graph",
    examWeight: "極高",
    tags: ["遍歷", "時間戳", "拓樸"],
    summary:
      "沿一條路走到底再回溯。用堆疊或遞迴。時間戳（發現 / 完成時間）是分類邊、找環、做拓樸與強連通分量的關鍵。",
    idea: "遞迴展開鄰居。對有向圖，依完成時間戳可把邊分成樹邊、前向邊、後向邊、橫向邊。後向邊 ⇔ 有環。",
    whenToUse: [
      "偵測環、找連通 / 強連通分量（Tarjan / Kosaraju）",
      "拓樸排序（DAG 的完成時間反序）",
      "橋與割點、迷宮「一路走到死路」",
    ],
    examTips: [
      "時間戳括號性質：區間 [d[u], f[u]] 要麼不相交，要麼包含。",
      "無向圖只有樹邊與後向邊（沒有前向 / 橫向的標準分法）。",
      "複雜度同樣 Θ(V+E)。",
      "森林：對每個尚未拜訪的點當新源。",
    ],
    pitfalls: [
      "用 DFS 當無權最短路（那是 BFS）。",
      "有向圖後向邊才代表環；無向圖要注意不要把剛走來的父邊當環。",
    ],
    complexity: {
      timeBest: "Θ(V+E)",
      timeAvg: "Θ(V+E)",
      timeWorst: "Θ(V+E)",
      space: "Θ(V) 遞迴堆疊",
    },
    complexityNote: "每個點、每條邊被處理常數次。",
    workedExample: {
      title: "從 A 出發，鄰居依字母序",
      input: "同示範圖",
      steps: [
        { title: "深入", detail: "A→B→C→F，F 走完回到 C、B。" },
        { title: "回溯再走", detail: "B 還有 D、E 等未完成鄰居，繼續展開。" },
        { title: "時間戳", detail: "先完成的點 f 較小；DAG 拓樸可依 f 遞減輸出。" },
      ],
      result: "一條可能的發現序：A, B, C, F, E, D",
    },
    visualizer: "graph",
    pseudocode: `DFS(G)
  for each u: color[u] ← WHITE; π[u] ← NIL
  time ← 0
  for each u in V
    if color[u] = WHITE: DFS-VISIT(u)

DFS-VISIT(u)
  time ← time + 1; d[u] ← time; color[u] ← GRAY
  for each v in Adj[u]
    if color[v] = WHITE
      π[v] ← u; DFS-VISIT(v)
  color[u] ← BLACK
  time ← time + 1; f[u] ← time`,
    codes: {
      python: `def dfs(graph: dict[str, list[str]], start: str) -> list[str]:
    seen: set[str] = set()
    order: list[str] = []

    def visit(u: str) -> None:
        seen.add(u)
        order.append(u)
        for v in graph[u]:
            if v not in seen:
                visit(v)

    visit(start)
    return order`,
      cpp: `void dfs_visit(int u, const vector<vector<int>>& g,
               vector<int>& vis, vector<int>& order) {
    vis[u] = 1;
    order.push_back(u);
    for (int v : g[u]) if (!vis[v]) dfs_visit(v, g, vis, order);
}`,
      typescript: `function dfs(graph: Record<string, string[]>, start: string) {
  const seen = new Set<string>();
  const order: string[] = [];
  function visit(u: string) {
    seen.add(u);
    order.push(u);
    for (const v of graph[u] ?? []) if (!seen.has(v)) visit(v);
  }
  visit(start);
  return order;
}`,
    },
    quiz: [
      {
        id: "dfs1",
        prompt: "有向圖 DFS 中，哪種邊代表存在環？",
        options: ["樹邊", "前向邊", "後向邊", "橫向邊"],
        answer: 2,
        explanation: "後向邊指向灰色祖先，形成環。",
      },
      {
        id: "dfs2",
        prompt: "DFS 拓樸排序的規則是？",
        options: [
          "依發現時間遞增",
          "依完成時間遞減",
          "依入度遞增",
          "依邊權遞增",
        ],
        answer: 1,
        explanation: "完成越晚的點越該排前面（或把完成點 push 到 stack 再 pop）。",
      },
      {
        id: "dfs3",
        prompt: "DFS 與 BFS 的主要差別？",
        options: [
          "複雜度不同階",
          "一個只能用在有向圖",
          "展開次序：深 vs 廣，資料結構 stack vs queue",
          "只有 BFS 需要 visited",
        ],
        answer: 2,
        explanation: "兩者都是 Θ(V+E)，差在探索策略。",
      },
    ],
    related: ["bfs", "topo-sort", "union-find"],
  },
  {
    slug: "dijkstra",
    name: "Dijkstra 最短路徑",
    english: "Dijkstra",
    category: "graph",
    examWeight: "極高",
    tags: ["最短路徑", "貪婪", "非負權"],
    summary:
      "從來源反覆取出「目前距離最小且尚未確定」的點，並鬆弛它的出邊。邊權必須 ≥ 0。這是單源最短路的考試主力。",
    idea: "貪婪：非負權下，當一個點第一次從 priority queue 成為最小值被取出，它的距離不會再被改小。證明靠切邊：任何更短路徑都得經過已確定集合，不會更優。",
    whenToUse: [
      "單源、邊權非負",
      "路網、路由（權重為延遲 / 距離）",
      "需要實際路徑時順便記 predecessor",
    ],
    examTips: [
      "負權：反例存在，必須改 Bellman-Ford（可偵測負環）或 Johnson。",
      "實作：陣列選最小值 O(V²)，適合稠密圖；binary heap O((V+E) log V)；Fibonacci heap O(E + V log V)。",
      "和 BFS：全 1 權時 Dijkstra 退化概念近 BFS，但 BFS 佇列即可。",
      "不能直接用在有負環的圖；沒有負環但有負邊也不保證正確。",
    ],
    pitfalls: [
      "圖有負邊仍硬套 Dijkstra。",
      "把 decrease-key 忘了，重複把同一點丟進 heap 時要跳過過期狀態。",
    ],
    complexity: {
      timeBest: "O(V²) 或 O(E log V)",
      timeAvg: "依實作相同",
      timeWorst: "依實作相同",
      space: "Θ(V)",
    },
    complexityNote:
      "考試常要你寫「binary heap：O((V+E) log V）」或「稠密圖用陣列 O(V²）」。",
    workedExample: {
      title: "從 A 出發",
      input: "邊權見互動圖：AB1, AD2, BE1, EF1…",
      steps: [
        { title: "初始化", detail: "d[A]=0，其餘 ∞。" },
        { title: "取出 A", detail: "鬆弛 B←1、D←2。" },
        { title: "取出 B", detail: "C←1+4=5，E←1+1=2，D 維持 2（經 B 是 1+3=4 較差）。" },
        { title: "取出 D 或 E", detail: "繼續鬆弛，F 經 E 得到 3。" },
      ],
      result: "A:0 B:1 D:2 E:2 F:3 C:5",
    },
    visualizer: "graph",
    pseudocode: `DIJKSTRA(G, w, s)
  初始化 d[s]←0，其餘 ∞
  S ← ∅; Q ← V
  while Q 非空
    u ← EXTRACT-MIN(Q)
    S ← S ∪ {u}
    for each v in Adj[u]
      RELAX(u, v, w)   // if d[v] > d[u] + w(u,v)
                       //    d[v] ← d[u] + w(u,v); π[v] ← u`,
    codes: {
      python: `import heapq

def dijkstra(graph: dict[str, list[tuple[str, int]]], start: str):
    dist = {start: 0}
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d != dist.get(u, 10**18):
            continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, 10**18):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`,
      cpp: `vector<long long> dijkstra(const vector<vector<pair<int,int>>>& g, int s) {
    const long long INF = 4e18;
    vector<long long> d(g.size(), INF);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    d[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [du, u] = pq.top(); pq.pop();
        if (du != d[u]) continue;
        for (auto [v, w] : g[u]) if (du + w < d[v]) {
            d[v] = du + w;
            pq.push({d[v], v});
        }
    }
    return d;
}`,
      typescript: `function dijkstra(
  graph: Record<string, { to: string; w: number }[]>,
  start: string
) {
  const dist: Record<string, number> = { [start]: 0 };
  const used = new Set<string>();
  while (true) {
    let u: string | null = null;
    let best = Infinity;
    for (const [id, d] of Object.entries(dist)) {
      if (!used.has(id) && d < best) {
        best = d;
        u = id;
      }
    }
    if (u === null) break;
    used.add(u);
    for (const { to, w } of graph[u] ?? []) {
      const nd = dist[u] + w;
      if (nd < (dist[to] ?? Infinity)) dist[to] = nd;
    }
  }
  return dist;
}`,
    },
    quiz: [
      {
        id: "dj1",
        prompt: "Dijkstra 正確性的關鍵假設？",
        options: ["圖是 DAG", "邊權非負", "圖是無向的", "沒有環"],
        answer: 1,
        explanation: "取出最小值時距離已確定，靠的是邊權不能再變短（非負）。",
      },
      {
        id: "dj2",
        prompt: "有負權但無負環，應選？",
        options: ["BFS", "Dijkstra", "Bellman-Ford", "Kruskal"],
        answer: 2,
        explanation: "Bellman-Ford 做 V-1 輪鬆弛，可處理負權並偵測負環。",
      },
      {
        id: "dj3",
        prompt: "binary heap 實作的常見複雜度？",
        options: ["O(V+E)", "O((V+E) log V)", "O(V³)", "O(E log E)"],
        answer: 1,
        explanation: "最多 O(E) 次 decrease/push，每次 O(log V)。",
      },
    ],
    related: ["bfs", "floyd-warshall", "bellman-ford"],
  },
  {
    slug: "floyd-warshall",
    name: "Floyd–Warshall",
    english: "All-pairs shortest paths",
    category: "graph",
    examWeight: "高",
    tags: ["DP", "全點對", "O(V³)"],
    summary:
      "動態規劃求所有點對最短路：允許的中繼點從 1..k 逐步放寬。三層迴圈，Θ(V³)，程式極短，手填矩陣是常考題。",
    idea: "d[k][i][j] = min( d[k-1][i][j], d[k-1][i][k] + d[k-1][k][j] )。實作滾成二維陣列，k 在最外層。可處理負權；若某次 d[i][i]<0 則有負環。",
    whenToUse: [
      "V 不大（約 ≤400）的全點對最短路",
      "需要偵測負環或傳遞閉包（邊權改成布林 OR-AND）",
    ],
    examTips: [
      "k 必須在最外層，否則重用舊值會錯。",
      "初始化：d[i][i]=0，沒邊設 ∞，有邊設 w(i,j)。",
      "和 Dijkstra 跑 V 次：非負權時堆實作可能更快；有負權用 Johnson。",
      "空間 Θ(V²)。",
    ],
    pitfalls: ["k 放內層。", "∞+數字溢位，要用夠大的 INF 並避免 INF+INF。"],
    complexity: {
      timeBest: "Θ(V³)",
      timeAvg: "Θ(V³)",
      timeWorst: "Θ(V³)",
      space: "Θ(V²)",
    },
    complexityNote: "三層迴圈跑滿，和輸入稀疏程度無關。",
    workedExample: {
      title: "4 點有向圖手填",
      input: "A→B:3, A→D:5, B→A:2, B→D:4, C→B:1, D→C:2",
      steps: [
        { title: "k=A", detail: "任何 i→A→j 的路徑開始被考慮。" },
        { title: "k=B", detail: "C 可經 B 到 A、D。" },
        { title: "k=C、D", detail: "D→C→B→… 把更遠的點連起來。" },
      ],
      result: "互動表格會逐步填完整個距離矩陣",
    },
    visualizer: "table",
    pseudocode: `FLOYD-WARSHALL(w)
  d ← w
  for k ← 1 to n
    for i ← 1 to n
      for j ← 1 to n
        d[i][j] ← min(d[i][j], d[i][k] + d[k][j])
  return d`,
    codes: {
      python: `def floyd(d: list[list[float]]) -> list[list[float]]:
    n = len(d)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]
    return d`,
      cpp: `void floyd(vector<vector<long long>>& d) {
    int n = (int)d.size();
    for (int k = 0; k < n; ++k)
      for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j)
          if (d[i][k] + d[k][j] < d[i][j])
            d[i][j] = d[i][k] + d[k][j];
}`,
      typescript: `function floyd(d: number[][]) {
  const n = d.length;
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
  return d;
}`,
    },
    quiz: [
      {
        id: "fw1",
        prompt: "Floyd 最外層迴圈的 k 代表？",
        options: ["起點", "終點", "允許使用的中繼點編號上限", "邊權"],
        answer: 2,
        explanation: "DP 階段：最短路內部節點只准用 1..k。",
      },
      {
        id: "fw2",
        prompt: "時間複雜度？",
        options: ["Θ(V+E)", "Θ(V²)", "Θ(V³)", "Θ(V E)"],
        answer: 2,
        explanation: "三層 n 迴圈。",
      },
      {
        id: "fw3",
        prompt: "如何用 Floyd 判斷負環？",
        options: [
          "看有沒有 ∞",
          "若存在 i 使得 d[i][i] < 0",
          "若 k 放最內層",
          "無法判斷",
        ],
        answer: 1,
        explanation: "回到自己的最短路為負即負環。",
      },
    ],
    related: ["dijkstra", "knapsack", "lcs"],
  },
  {
    slug: "kruskal",
    name: "Kruskal 最小生成樹",
    english: "Kruskal MST",
    category: "graph",
    examWeight: "極高",
    tags: ["貪婪", "並查集", "MST"],
    summary:
      "邊依權重由小到大，不形成環就加入。環的判斷用並查集。這是 MST 考題最常要你手算的演算法。",
    idea: "MST 的切性質：跨過某個切、權重最小的邊一定在某棵 MST 裡。Kruskal 每次加全域最輕且安全的邊。",
    whenToUse: [
      "無向連通加權圖的最小生成樹",
      "稀疏圖（先排序邊）",
      "叢集、網路佈線最小成本",
    ],
    examTips: [
      "複雜度 O(E log E) 受排序主導；並查集幾乎 O(E α(V))。",
      "Prim：從點長樹，稠密圖用矩陣 O(V²) 較佳。",
      "邊權可為負（沒有環的疑慮，因為根本不形成環）。",
      "不連通則得到最小生成森林。",
      "唯一 MST ⇔ 每次選的輕邊是該切唯一最輕。",
    ],
    pitfalls: [
      "用在有向圖（那是最小樹形圖，不是 Kruskal）。",
      "忘記並查集，改 DFS 查環，複雜度變差且易寫錯。",
    ],
    complexity: {
      timeBest: "O(E log E)",
      timeAvg: "O(E log E)",
      timeWorst: "O(E log E)",
      space: "Θ(V)",
    },
    complexityNote: "排序 O(E log E)；幾乎線性的 Union-Find 不是瓶頸。",
    workedExample: {
      title: "示範圖由小到大加邊",
      input: "AB1, BE1, EF1, AD2, CF3, BD3, BC4, DE5",
      steps: [
        { title: "加 AB, BE, EF", detail: "權 1，皆不形成環。" },
        { title: "加 AD", detail: "權 2，A 與 D 尚未連通。" },
        { title: "加 CF", detail: "權 3，C 接到 F。" },
        { title: "其餘", detail: "BD、BC、DE 都會成環，捨棄。V-1=5 條邊。" },
      ],
      result: "MST 權重 1+1+1+2+3 = 8",
    },
    visualizer: "graph",
    pseudocode: `KRUSKAL(G, w)
  A ← ∅
  for each v: MAKE-SET(v)
  將邊依 w 遞增排序
  for each (u,v) in 排序後的邊
    if FIND(u) ≠ FIND(v)
      A ← A ∪ {(u,v)}
      UNION(u, v)
  return A`,
    codes: {
      python: `def kruskal(n: int, edges: list[tuple[int, int, int]]) -> int:
    parent = list(range(n))

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    total = 0
    used = 0
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        pu, pv = find(u), find(v)
        if pu != pv:
            parent[pu] = pv
            total += w
            used += 1
            if used == n - 1:
                break
    return total`,
      cpp: `struct DSU {
    vector<int> p, r;
    DSU(int n): p(n), r(n,0) { iota(p.begin(), p.end(), 0); }
    int find(int x){ return p[x]==x?x:p[x]=find(p[x]); }
    bool unite(int a,int b){
        a=find(a); b=find(b); if(a==b) return false;
        if(r[a]<r[b]) swap(a,b);
        p[b]=a; if(r[a]==r[b]) r[a]++; return true;
    }
};
int kruskal(int n, vector<array<int,3>> e) {
    sort(e.begin(), e.end(), [](auto& a, auto& b){ return a[2]<b[2]; });
    DSU d(n); int ans=0, used=0;
    for (auto [u,v,w]: e) if (d.unite(u,v)) { ans+=w; if(++used==n-1) break; }
    return ans;
}`,
      typescript: `function kruskal(n: number, edges: [number, number, number][]) {
  const p = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (p[x] === x ? x : (p[x] = find(p[x])));
  let ans = 0, used = 0;
  for (const [u, v, w] of [...edges].sort((a, b) => a[2] - b[2])) {
    const pu = find(u), pv = find(v);
    if (pu !== pv) {
      p[pu] = pv;
      ans += w;
      if (++used === n - 1) break;
    }
  }
  return ans;
}`,
    },
    quiz: [
      {
        id: "kr1",
        prompt: "Kruskal 用什麼判斷「加這條邊會不會成環」？",
        options: ["BFS 層數", "並查集是否同一集合", "入度是否為 0", "邊權正負"],
        answer: 1,
        explanation: "同一連通分量再加邊必成環。",
      },
      {
        id: "kr2",
        prompt: "Prim 與 Kruskal 的直覺差異？",
        options: [
          "一個只能處理負權",
          "Prim 從點長樹，Kruskal 從邊貪婪",
          "複雜度永遠 Kruskal 較優",
          "Prim 用在有向圖",
        ],
        answer: 1,
        explanation: "兩者都求 MST；實作適合的圖密度不同。",
      },
      {
        id: "kr3",
        prompt: "n 個點的連通 MST 有幾條邊？",
        options: ["n", "n-1", "n/2", "E-V"],
        answer: 1,
        explanation: "樹的邊數 = 點數 - 1。",
      },
    ],
    related: ["union-find", "dijkstra", "prim"],
  },
  {
    slug: "topo-sort",
    name: "拓樸排序",
    english: "Topological Sort",
    category: "graph",
    examWeight: "高",
    tags: ["DAG", "Kahn", "DFS"],
    summary:
      "把有向無環圖的點排成一線，使每條邊都從左指向右。課表先修、編譯依賴、DP on DAG 都靠它。",
    idea: "兩種標準作法：(1) Kahn：不斷取入度 0 的點；(2) DFS：依完成時間反序。若無法排出全部點，圖中有環。",
    whenToUse: [
      "先修關係、工作排程",
      "在 DAG 上做最短 / 最長路（依拓樸序鬆弛，O(V+E)）",
    ],
    examTips: [
      "僅 DAG 有拓樸序；有環則不存在。",
      "拓樸序不一定唯一。",
      "Kahn 用 queue；若用 min-heap 可得到字典序最小的拓樸序。",
      "複雜度 Θ(V+E)。",
    ],
    pitfalls: ["對無向圖做拓樸。", "有環仍輸出部分序列卻宣稱成功。"],
    complexity: {
      timeBest: "Θ(V+E)",
      timeAvg: "Θ(V+E)",
      timeWorst: "Θ(V+E)",
      space: "Θ(V)",
    },
    complexityNote: "每個點出隊一次，每條邊扣一次入度。",
    workedExample: {
      title: "Kahn 手算",
      input: "1→2→4→6，1→3→4，3→5→6",
      steps: [
        { title: "入度", detail: "1:0, 2:1, 3:1, 4:2, 5:1, 6:2。佇列先放 1。" },
        { title: "取 1", detail: "2、3 入度變 0，入隊。" },
        { title: "取 2、3", detail: "4 的入度從 2 降到 0；5 入度變 0。" },
        { title: "取 4、5 再 6", detail: "一種拓樸序：1,2,3,4,5,6。" },
      ],
      result: "1 → 2 → 3 → 4 → 5 → 6（不唯一）",
    },
    visualizer: "graph",
    pseudocode: `KAHN(G)
  for each u: indeg[u] ← |入邊|
  Q ← {u | indeg[u]=0}
  order ← []
  while Q 非空
    u ← DEQUEUE(Q); append u to order
    for each v in Adj[u]
      indeg[v] ← indeg[v] - 1
      if indeg[v]=0: ENQUEUE(Q, v)
  if |order| < |V|: return HAS-CYCLE
  return order`,
    codes: {
      python: `from collections import deque

def topo_sort(n: int, edges: list[tuple[int, int]]) -> list[int] | None:
    g = [[] for _ in range(n)]
    indeg = [0] * n
    for u, v in edges:
        g[u].append(v)
        indeg[v] += 1
    q = deque([i for i in range(n) if indeg[i] == 0])
    order: list[int] = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else None`,
      cpp: `vector<int> topo(int n, const vector<vector<int>>& g) {
    vector<int> indeg(n), order; queue<int> q;
    for (int u=0;u<n;++u) for (int v:g[u]) indeg[v]++;
    for (int i=0;i<n;++i) if (!indeg[i]) q.push(i);
    while (!q.empty()) {
        int u=q.front(); q.pop(); order.push_back(u);
        for (int v:g[u]) if (--indeg[v]==0) q.push(v);
    }
    if ((int)order.size()!=n) return {};
    return order;
}`,
      typescript: `function topoSort(n: number, edges: [number, number][]) {
  const g: number[][] = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  for (const [u, v] of edges) {
    g[u].push(v);
    indeg[v]++;
  }
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order: number[] = [];
  while (q.length) {
    const u = q.shift()!;
    order.push(u);
    for (const v of g[u]) if (--indeg[v] === 0) q.push(v);
  }
  return order.length === n ? order : null;
}`,
    },
    quiz: [
      {
        id: "tp1",
        prompt: "拓樸排序存在的充要條件？",
        options: ["圖連通", "圖是有向無環（DAG）", "邊權非負", "二分圖"],
        answer: 1,
        explanation: "有向環會造成循環依賴。",
      },
      {
        id: "tp2",
        prompt: "Kahn 演算法中佇列取出的點滿足？",
        options: ["出度 0", "入度 0（當前殘餘圖）", "權重最小", "DFS 完成時間最大"],
        answer: 1,
        explanation: "沒有未處理的先修科目。",
      },
      {
        id: "tp3",
        prompt: "DAG 最短路的最佳作法？",
        options: [
          "Dijkstra 是唯一選擇",
          "依拓樸序鬆弛，O(V+E)，可含負權",
          "一定要用 Floyd",
          "只能 BFS",
        ],
        answer: 1,
        explanation: "拓樸序保證鬆弛順序正確，不必 heap。",
      },
    ],
    related: ["dfs", "bfs", "dijkstra"],
  },
];
