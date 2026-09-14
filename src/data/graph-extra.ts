import type { Algorithm } from "./types";

export const graphExtraLessons: Algorithm[] = [
  {
    slug: "bellman-ford",
    name: "Bellman-Ford",
    english: "Bellman-Ford",
    category: "graph",
    examWeight: "極高",
    tags: ["最短路徑", "負權", "負環"],
    summary:
      "單源最短路，允許負邊權：對所有邊做 |V|-1 輪鬆弛。第 |V| 輪還能更新就代表有從源點可達的負環。這是 Dijkstra 不能用時的標準答案。",
    idea: "最短路若不經負環，最多 |V|-1 條邊。每一輪鬆弛保證「最多 k 條邊的最短路」被算對。多一輪還下降，只能是負環。",
    whenToUse: [
      "匯差、帶懲罰的路網",
      "需要偵測負環（套利）",
      "邊很少時 Θ(VE) 可接受",
    ],
    examTips: [
      "Dijkstra：非負權；Bellman-Ford：可負權；Floyd：全點對。",
      "SPFA 是 queue 優化，最壞仍 Θ(VE)，考試以 BF 為準。",
      "有負環時「最短路」無下界，只能報錯或找負環本身。",
    ],
    pitfalls: [
      "有負邊仍用 Dijkstra。",
      "只做 |V|-2 輪，少一輪可能還沒傳完。",
    ],
    complexity: {
      timeBest: "Θ(VE)",
      timeAvg: "Θ(VE)",
      timeWorst: "Θ(VE)",
      space: "Θ(V)",
    },
    complexityNote: "|V|-1 輪，每輪掃 E 條邊。",
    workedExample: {
      title: "S 出發，含負邊 A→B = -3",
      input: "S→A 4，S→B 5，A→B -3，A→C 6，B→C 2",
      steps: [
        { title: "初始化", detail: "d[S]=0，其餘 ∞。" },
        { title: "第一輪", detail: "A←4，B←5，之後 A→B 把 B 改成 1，C 經 B 變 3。" },
        { title: "以後輪次", detail: "不再下降。多一輪確認無負環。" },
      ],
      result: "S:0 A:4 B:1 C:3",
    },
    visualizer: "graph",
    pseudocode: `BELLMAN-FORD(G, w, s)
  初始化 d[s]←0，其餘 ∞
  for i ← 1 to |V|-1
    for each edge (u,v)
      RELAX(u,v,w)
  for each edge (u,v)
    if d[v] > d[u] + w(u,v): return NEGATIVE-CYCLE
  return d`,
    codes: {
      python: `def bellman_ford(n: int, edges: list[tuple[int, int, int]], s: int):
    dist = [10**18] * n
    dist[s] = 0
    for _ in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            return None  # 負環
    return dist`,
      cpp: `vector<long long> bf(int n, vector<array<int,3>> e, int s) {
    const long long INF=4e18;
    vector<long long> d(n, INF); d[s]=0;
    for (int i=0;i<n-1;++i)
      for (auto [u,v,w]: e) if (d[u]+w<d[v]) d[v]=d[u]+w;
    for (auto [u,v,w]: e) if (d[u]+w<d[v]) return {}; // 負環
    return d;
}`,
      typescript: `function bellmanFord(
  n: number,
  edges: [number, number, number][],
  s: number
) {
  const dist = Array(n).fill(Infinity);
  dist[s] = 0;
  for (let i = 0; i < n - 1; i++)
    for (const [u, v, w] of edges)
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
  for (const [u, v, w] of edges)
    if (dist[u] + w < dist[v]) return null;
  return dist;
}`,
    },
    quiz: [
      {
        id: "bf1",
        prompt: "Bellman-Ford 相對 Dijkstra 的關鍵能力？",
        options: ["較快", "可處理負權並偵測負環", "只要 BFS", "只能 DAG"],
        answer: 1,
        explanation: "代價是 Θ(VE)。",
      },
      {
        id: "bf2",
        prompt: "為什麼鬆弛 |V|-1 輪？",
        options: [
          "隨便選的",
          "簡單最短路最多 |V|-1 條邊",
          "等於邊數",
          "主定理",
        ],
        answer: 1,
        explanation: "第 k 輪處理最多 k 條邊的路徑。",
      },
      {
        id: "bf3",
        prompt: "第 |V| 輪還能放鬆代表？",
        options: ["算法寫錯", "存在可達負環", "圖不連通", "需要 Dijkstra"],
        answer: 1,
        explanation: "再走一圈還變短。",
      },
    ],
    related: ["dijkstra", "floyd-warshall", "topo-sort"],
  },
  {
    slug: "prim",
    name: "Prim 最小生成樹",
    english: "Prim MST",
    category: "graph",
    examWeight: "極高",
    tags: ["MST", "切性質", "從點長樹"],
    summary:
      "從一個起點長出 MST：每次選跨越「樹內／樹外」這個切的最輕邊。和 Kruskal 答案相同，實作比較像 Dijkstra。稠密圖用矩陣 O(V²) 往往比 Kruskal 划算。",
    idea: "切性質：跨過任一切的最輕邊必在某棵 MST。Prim 的切就是「目前樹 vs 其餘點」。",
    whenToUse: [
      "稠密圖 MST",
      "已經有鄰接矩陣、不想排序所有邊",
    ],
    examTips: [
      "Kruskal：排序邊 + 並查集，稀疏圖好。Prim：切最輕邊，稠密圖好。",
      "兩者都要求無向圖。有向是最小樹形圖。",
      "key[v] 類似 Dijkstra 的 dist，但不會加總路徑，只記連到樹的邊權。",
    ],
    pitfalls: [
      "把 Prim 的 key 加成路徑長（那就變成 Dijkstra）。",
      "有向圖硬套。",
    ],
    complexity: {
      timeBest: "O(V²) 矩陣",
      timeAvg: "O(E log V) heap",
      timeWorst: "同左",
      space: "Θ(V)",
    },
    complexityNote: "和 Dijkstra 同一套資料結構分析。",
    workedExample: {
      title: "從 A 長樹",
      input: "與 Kruskal 同一張示範圖",
      steps: [
        { title: "A", detail: "跨切最輕是 AB=1。" },
        { title: "納 B", detail: "接著 BE=1 或 AD=2，選 BE。" },
        { title: "納 E 再 F", detail: "EF=1。然後 AD=2、CF=3。" },
      ],
      result: "與 Kruskal 同權重的 MST",
    },
    visualizer: "graph",
    pseudocode: `PRIM(G, w, r)
  for each u: key[u]←∞; π[u]←NIL
  key[r]←0
  Q ← V
  while Q ≠ ∅
    u ← EXTRACT-MIN(Q)
    for each v in Adj[u]
      if v ∈ Q and w(u,v) < key[v]
        π[v]←u; key[v]←w(u,v)`,
    codes: {
      python: `def prim(n: int, adj: list[list[tuple[int, int]]], r: int = 0) -> int:
    import heapq
    seen = [False] * n
    pq = [(0, r)]
    total = 0
    while pq:
        w, u = heapq.heappop(pq)
        if seen[u]:
            continue
        seen[u] = True
        total += w
        for v, x in adj[u]:
            if not seen[v]:
                heapq.heappush(pq, (x, v))
    return total`,
      cpp: `int prim(vector<vector<pair<int,int>>>& g, int r=0) {
    int n=g.size(); vector<int> key(n, 1e9), vis(n);
    key[r]=0; int ans=0;
    for (int t=0;t<n;++t) {
        int u=-1;
        for (int i=0;i<n;++i) if (!vis[i] && (u<0 || key[i]<key[u])) u=i;
        vis[u]=1; ans+=key[u];
        for (auto [v,w]: g[u]) if (!vis[v] && w<key[v]) key[v]=w;
    }
    return ans;
}`,
      typescript: `function prim(adj: { to: number; w: number }[][], r = 0) {
  const n = adj.length;
  const seen = Array(n).fill(false);
  const key = Array(n).fill(Infinity);
  key[r] = 0;
  let ans = 0;
  for (let t = 0; t < n; t++) {
    let u = -1;
    for (let i = 0; i < n; i++)
      if (!seen[i] && (u < 0 || key[i] < key[u])) u = i;
    seen[u] = true;
    ans += key[u];
    for (const { to, w } of adj[u])
      if (!seen[to] && w < key[to]) key[to] = w;
  }
  return ans;
}`,
    },
    quiz: [
      {
        id: "pr1",
        prompt: "Prim 與 Dijkstra 最關鍵的差別？",
        options: [
          "一個不能用 heap",
          "Prim 的 key 是連到樹的邊權，不是路徑和",
          "Prim 處理負環",
          "沒有差別",
        ],
        answer: 1,
        explanation: "切最輕邊 vs 來源最短路。",
      },
      {
        id: "pr2",
        prompt: "稠密圖 MST 較常選？",
        options: ["Kruskal", "Prim 矩陣 O(V²)", "Bellman-Ford", "KMP"],
        answer: 1,
        explanation: "不必排序 Θ(V²) 條邊。",
      },
      {
        id: "pr3",
        prompt: "Prim 適用？",
        options: ["有向圖", "無向加權連通圖", "DAG 最長路", "2-SAT"],
        answer: 1,
        explanation: "無向 MST。",
      },
    ],
    related: ["kruskal", "dijkstra", "hamilton-tsp"],
  },
  {
    slug: "max-flow",
    name: "最大流與二分圖匹配",
    english: "Max-Flow & Bipartite Matching",
    category: "graph",
    examWeight: "極高",
    tags: ["網路流", "增廣路", "最小割"],
    summary:
      "從源點 s 到匯點 t 的最大流量。Ford–Fulkerson 找增廣路；Edmonds–Karp 用 BFS，O(VE²)。最大流＝最小割。二分圖最大匹配可化成單位容量網路流。",
    idea: "殘餘網路記錄還能往前送、以及可退回的流量。有增廣路就能加流；沒有時，s 側可達點構成最小割。匹配：加超級源連左部、右部連超級匯，邊容量 1，最大流＝最大匹配。",
    whenToUse: [
      "管線、交通、任務指派",
      "二分圖配對（工作／人）",
      "邊不相交路徑條數（Menger）",
    ],
    examTips: [
      "Ford–Fulkerson 若容量無理數可能不終止；整數容量最多加 maxflow 次。",
      "Edmonds–Karp：每次 BFS 最短增廣路，O(VE²)。",
      "Dinic 更快，考試提到即可。",
      "Hall 婚姻定理是匹配存在的充要條件，常和最大流一起出。",
    ],
    pitfalls: [
      "忘了反向邊，無法退流。",
      "把最大流當最短路。",
    ],
    complexity: {
      timeBest: "EK：O(V E²)",
      timeAvg: "同左",
      timeWorst: "FF 看增廣次數",
      space: "Θ(V+E)",
    },
    complexityNote: "整數容量時 FF 最多 O(E F) 其中 F 為最大流值。",
    workedExample: {
      title: "s-A-t、s-B-t，A→B 容量 1",
      input: "sA3, sB2, AB1, At2, Bt4",
      steps: [
        { title: "s→A→t", detail: "瓶頸 2，流=2。" },
        { title: "s→B→t", detail: "瓶頸 2，流=4。" },
        { title: "s→A→B→t", detail: "瓶頸 1，流=5。無法再增廣。" },
      ],
      result: "最大流 5 = 最小割容量",
    },
    visualizer: "graph",
    pseudocode: `EDMONDS-KARP(G, s, t)
  f ← 0
  while 殘餘網路存在 s-t 路（BFS）
    p ← 最短增廣路
    b ← p 上殘餘容量最小值
    沿 p 加流 b（反向邊減 b）
    f ← f + b
  return f

二分圖匹配：加 s、t，s→左、右→t 容量 1，原邊容量 1。`,
    codes: {
      python: `from collections import deque

def edmonds_karp(n: int, cap: list[list[int]], s: int, t: int) -> int:
    flow = 0
    residual = [row[:] for row in cap]
    while True:
        prev = [-1] * n
        q = deque([s])
        prev[s] = s
        while q and prev[t] < 0:
            u = q.popleft()
            for v in range(n):
                if prev[v] < 0 and residual[u][v] > 0:
                    prev[v] = u
                    q.append(v)
        if prev[t] < 0:
            break
        b = 10**9
        v = t
        while v != s:
            u = prev[v]
            b = min(b, residual[u][v])
            v = u
        v = t
        while v != s:
            u = prev[v]
            residual[u][v] -= b
            residual[v][u] += b
            v = u
        flow += b
    return flow`,
      cpp: `int ek(vector<vector<int>> r, int s, int t) {
    int n=r.size(), flow=0;
    while (true) {
        vector<int> p(n,-1); queue<int> q; q.push(s); p[s]=s;
        while (!q.empty() && p[t]<0) {
            int u=q.front(); q.pop();
            for (int v=0;v<n;++v) if (p[v]<0 && r[u][v]>0) { p[v]=u; q.push(v); }
        }
        if (p[t]<0) break;
        int b=1e9; for (int v=t; v!=s; v=p[v]) b=min(b, r[p[v]][v]);
        for (int v=t; v!=s; v=p[v]) { r[p[v]][v]-=b; r[v][p[v]]+=b; }
        flow+=b;
    }
    return flow;
}`,
      typescript: `function edmondsKarp(cap: number[][], s: number, t: number) {
  const n = cap.length;
  const r = cap.map((row) => [...row]);
  let flow = 0;
  while (true) {
    const prev = Array(n).fill(-1);
    const q = [s];
    prev[s] = s;
    for (let qi = 0; qi < q.length && prev[t] < 0; qi++) {
      const u = q[qi]!;
      for (let v = 0; v < n; v++)
        if (prev[v] < 0 && r[u][v] > 0) {
          prev[v] = u;
          q.push(v);
        }
    }
    if (prev[t] < 0) break;
    let b = Infinity;
    for (let v = t; v !== s; v = prev[v]) b = Math.min(b, r[prev[v]][v]);
    for (let v = t; v !== s; v = prev[v]) {
      r[prev[v]][v] -= b;
      r[v][prev[v]] += b;
    }
    flow += b;
  }
  return flow;
}`,
    },
    quiz: [
      {
        id: "mf1",
        prompt: "最大流最小割定理說？",
        options: [
          "流等於邊數",
          "最大 s-t 流 = 最小 s-t 割容量",
          "流等於最短路",
          "只能偶數",
        ],
        answer: 1,
        explanation: "殘餘網路 s 側就是最小割。",
      },
      {
        id: "mf2",
        prompt: "Edmonds–Karp 找增廣路用？",
        options: ["DFS 任意路", "殘餘網路 BFS（最短路）", "Dijkstra 負權", "並查集"],
        answer: 1,
        explanation: "保證 O(VE²)。",
      },
      {
        id: "mf3",
        prompt: "二分圖最大匹配與最大流？",
        options: [
          "無關",
          "加源匯、容量 1，最大流＝最大匹配",
          "等於 MST",
          "NP-complete",
        ],
        answer: 1,
        explanation: "單位容量網路。Hopcroft–Karp 更快，概念相同。",
      },
    ],
    related: ["bfs", "vertex-cover", "topo-sort"],
  },
];
