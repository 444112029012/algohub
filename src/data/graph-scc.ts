import type { Algorithm } from "./types";

export const graphSccLessons: Algorithm[] = [
  {
    slug: "scc",
    name: "強連通分量",
    english: "SCC · Kosaraju / Tarjan",
    category: "graph",
    examWeight: "極高",
    tags: ["有向圖", "Kosaraju", "Tarjan"],
    summary:
      "有向圖裡，一群點如果沿著箭頭彼此都走得到對方，就是一個強連通分量。Kosaraju 做兩次 DFS（第二次走反向圖），Tarjan 做一次 DFS 加一個 low 值。時間都是 Θ(V+E)。每個分量縮成一個點之後，圖一定沒有環。",
    idea: "先用 DFS 記下每個點「走完離開」的時間。越晚離開的點，越可能在源頭那一側。把所有箭頭反過來，從最晚離開的點再 DFS，一次走完的就是同一個分量。Tarjan 則是邊走邊記：如果還能走回自己，就還在同一個分量裡。",
    whenToUse: [
      "2-SAT、有向圖連通性、死鎖／依賴收縮",
      "先縮 SCC 再 DP／拓樸",
    ],
    examTips: [
      "無向圖的連通分量用一次 DFS／BFS 或並查集即可；SCC 是有向圖的概念。",
      "縮點後無環：若兩個分量互相有邊，應合成一個分量。",
      "Kosaraju 第二次一定要走反向圖。只做一次 DFS 的完成時間不是 SCC。",
      "Tarjan 的 low 只考慮還在堆疊上的點（當前路徑），否則會跨分量。",
    ],
    pitfalls: [
      "第二輪仍走原圖。",
      "把「弱連通」（忽略方向後連通）當成強連通。",
    ],
    complexity: {
      timeBest: "Θ(V+E)",
      timeAvg: "Θ(V+E)",
      timeWorst: "Θ(V+E)",
      space: "Θ(V+E)",
    },
    complexityNote: "Kosaraju 建反向圖；Tarjan 只要一個鄰接表加堆疊。",
    workedExample: {
      title: "A→B→C→A，A→D，D↔E，E→F",
      input: "六點有向圖",
      steps: [
        { title: "第一輪 DFS", detail: "從 A 走進 A-B-C 環再走到 D-E-F。完成序約 C,B,F,E,D,A。" },
        { title: "反向圖", detail: "邊全部翻轉。" },
        { title: "倒序 DFS", detail: "從 A 開始得到 {A,B,C}，再 {D,E}，最後 {F}。" },
      ],
      result: "三個 SCC：{A,B,C}、{D,E}、{F}。縮點 A-B-C → D-E → F 是一條鏈。",
    },
    visualizer: "graph",
    pseudocode: `KOSARAJU(G)
  order ← []
  DFS 原圖，離開 u 時 order.append(u)
  GT ← G 的反向圖
  依 reverse(order) 對 GT 做 DFS
  每一棵新 DFS 樹 = 一個 SCC

TARJAN(u)                       // 一次 DFS
  dfn[u] ← low[u] ← time++
  stack.push(u)
  for v in adj[u]
    if v 未拜訪: TARJAN(v); low[u] ← min(low[u], low[v])
    else if v 在 stack: low[u] ← min(low[u], dfn[v])
  if low[u] = dfn[u]
    彈 stack 直到 u，形成一個 SCC`,
    codes: {
      python: `def kosaraju(n: int, edges: list[tuple[int, int]]) -> list[list[int]]:
    g = [[] for _ in range(n)]
    gt = [[] for _ in range(n)]
    for u, v in edges:
        g[u].append(v)
        gt[v].append(u)
    order, seen = [], [False] * n

    def dfs(u: int) -> None:
        seen[u] = True
        for v in g[u]:
            if not seen[v]:
                dfs(v)
        order.append(u)

    for u in range(n):
        if not seen[u]:
            dfs(u)
    seen = [False] * n
    comps: list[list[int]] = []

    def rdfs(u: int, bucket: list[int]) -> None:
        seen[u] = True
        bucket.append(u)
        for v in gt[u]:
            if not seen[v]:
                rdfs(v, bucket)

    for u in reversed(order):
        if not seen[u]:
            b: list[int] = []
            rdfs(u, b)
            comps.append(b)
    return comps`,
      cpp: `vector<vector<int>> kosaraju(int n, vector<pair<int,int>> e) {
    vector<vector<int>> g(n), gt(n), comps;
    for (auto [u,v] : e) { g[u].push_back(v); gt[v].push_back(u); }
    vector<int> order; vector<char> seen(n, 0);
    function<void(int)> dfs = [&](int u) {
        seen[u] = 1;
        for (int v : g[u]) if (!seen[v]) dfs(v);
        order.push_back(u);
    };
    for (int i = 0; i < n; ++i) if (!seen[i]) dfs(i);
    fill(seen.begin(), seen.end(), 0);
    function<void(int, vector<int>&)> rdfs = [&](int u, vector<int>& b) {
        seen[u] = 1; b.push_back(u);
        for (int v : gt[u]) if (!seen[v]) rdfs(v, b);
    };
    for (int i = n - 1; i >= 0; --i) if (!seen[order[i]]) {
        vector<int> b; rdfs(order[i], b); comps.push_back(b);
    }
    return comps;
}`,
      typescript: `function kosaraju(n: number, edges: [number, number][]) {
  const g: number[][] = Array.from({ length: n }, () => []);
  const gt: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    gt[v].push(u);
  }
  const order: number[] = [];
  const seen = Array(n).fill(false);
  const dfs = (u: number) => {
    seen[u] = true;
    for (const v of g[u]) if (!seen[v]) dfs(v);
    order.push(u);
  };
  for (let u = 0; u < n; u++) if (!seen[u]) dfs(u);
  seen.fill(false);
  const comps: number[][] = [];
  const rdfs = (u: number, b: number[]) => {
    seen[u] = true;
    b.push(u);
    for (const v of gt[u]) if (!seen[v]) rdfs(v, b);
  };
  for (const u of order.reverse()) {
    if (!seen[u]) {
      const b: number[] = [];
      rdfs(u, b);
      comps.push(b);
    }
  }
  return comps;
}`,
    },
    quiz: [
      {
        id: "scc1",
        prompt: "Kosaraju 第二次 DFS 走？",
        options: ["原圖、任意順序", "反向圖、依完成時間倒序", "BFS", "最小生成樹"],
        answer: 1,
        explanation: "反向＋倒序才能切出 SCC。",
      },
      {
        id: "scc2",
        prompt: "把每個 SCC 縮成一點後？",
        options: ["可能有環", "一定是 DAG", "一定是樹", "一定強連通"],
        answer: 1,
        explanation: "分量之間若互相可達，本來就該同一分量。",
      },
      {
        id: "scc3",
        prompt: "Tarjan 何時彈出一個分量？",
        options: ["dfn[u]=0", "low[u]=dfn[u]", "u 沒有出邊", "完成時間最大"],
        answer: 1,
        explanation: "沒有邊能走到更早的祖先，u 是分量根。",
      },
    ],
    related: ["dfs", "topo-sort", "two-sat"],
  },
  {
    slug: "two-sat",
    name: "2-SAT",
    english: "2-SAT",
    category: "graph",
    examWeight: "高",
    tags: ["可滿足性", "SCC", "implication graph"],
    summary:
      "每個括號裡剛好兩個條件時，這題可以在多項式時間解完。把「a 或 b」畫成兩條箭頭：不是 a 就一定是 b、不是 b 就一定是 a。再求強連通分量；如果某個變數和它的否定在同一個分量，就無解。三個條件一組的 3-SAT 反而是 NPC。",
    idea: "「a 或 b」的意思是：a 若是假的，b 就必須是真的。圖上的邊就是這種強制關係。若 x 能走到 ¬x、¬x 又能走到 x，賦值會打架。否則把分量縮成沒有環的圖，從後面往前設值即可。",
    whenToUse: [
      "每個約束只牽涉兩個布林變數",
      "說明「為什麼 2-SAT 容易、3-SAT 難」",
    ],
    examTips: [
      "變數 x 拆成點 x 與 ¬x，共 2n 點、O(m) 邊，Θ(n+m)。",
      "不可滿足 ⇔ 存在 x，x 與 ¬x 同 SCC。",
      "3-SAT 不能這樣建：一個三元子句推不出兩條 implication 就夠用。",
      "(x∨x) 是 (x)，仍可放進 2-SAT（¬x→x）。",
    ],
    pitfalls: [
      "忘了每個子句要加兩條反向 implication。",
      "x 與 ¬x 同分量仍硬給值。",
      "以為 2-SAT 也 NP-complete。",
    ],
    complexity: {
      timeBest: "Θ(n+m)",
      timeAvg: "Θ(n+m)",
      timeWorst: "Θ(n+m)",
      space: "Θ(n+m)",
    },
    complexityNote: "n 個變數、m 個子句。瓶頸是 SCC。",
    workedExample: {
      title: "(x∨y) ∧ (¬x∨y) ∧ (¬y∨z)",
      input: "三個二元子句",
      steps: [
        { title: "implication", detail: "(x∨y)⇒ ¬x→y、¬y→x；(¬x∨y)⇒ x→y、¬y→¬x；(¬y∨z)⇒ y→z、¬z→¬y。" },
        { title: "SCC", detail: "y 與 z 可同向強制；x 與 ¬x 不在同一分量。" },
        { title: "賦值", detail: "y 必須真（x 真或假都會推到 y），z 真。x 可假。滿足。" },
      ],
      result: "可滿足，例如 x=假、y=真、z=真",
    },
    visualizer: "none",
    pseudocode: `TWOSAT(n, clauses)
  建圖：對每個 (a ∨ b)
    加邊 ¬a → b、¬b → a
  對 2n 個點做 SCC
  for x ← 1 to n
    if scc[x] = scc[¬x]: return UNSAT
  依縮點 DAG 的逆拓樸賦值
  return SAT`,
    codes: {
      python: `def two_sat(n: int, clauses: list[tuple[int, int]]) -> bool:
    # 文字：x 用 2x，¬x 用 2x+1
    g = [[] for _ in range(2 * n)]
    def add_imp(a: int, b: int) -> None:
        g[a].append(b)

    def v(lit: int) -> int:
        x = abs(lit) - 1
        return 2 * x + (0 if lit > 0 else 1)

    for a, b in clauses:
        add_imp(v(-a), v(b))
        add_imp(v(-b), v(a))

    order, seen = [], [False] * (2 * n)

    def dfs(u: int) -> None:
        seen[u] = True
        for w in g[u]:
            if not seen[w]:
                dfs(w)
        order.append(u)

    for u in range(2 * n):
        if not seen[u]:
            dfs(u)
    gt = [[] for _ in range(2 * n)]
    for u in range(2 * n):
        for w in g[u]:
            gt[w].append(u)
    comp = [-1] * (2 * n)
    cid = 0

    def rdfs(u: int) -> None:
        comp[u] = cid
        for w in gt[u]:
            if comp[w] == -1:
                rdfs(w)

    for u in reversed(order):
        if comp[u] == -1:
            rdfs(u)
            cid += 1
    return all(comp[2 * i] != comp[2 * i + 1] for i in range(n))`,
      cpp: `bool two_sat(int n, vector<pair<int,int>> cl) {
    int N = 2 * n;
    vector<vector<int>> g(N), gt(N);
    auto id = [&](int lit) {
        int x = abs(lit) - 1;
        return 2 * x + (lit > 0 ? 0 : 1);
    };
    for (auto [a,b] : cl) {
        g[id(-a)].push_back(id(b));
        g[id(-b)].push_back(id(a));
    }
    for (int u = 0; u < N; ++u) for (int v : g[u]) gt[v].push_back(u);
    vector<int> order, comp(N, -1); vector<char> seen(N, 0);
    function<void(int)> dfs = [&](int u) {
        seen[u] = 1; for (int v : g[u]) if (!seen[v]) dfs(v); order.push_back(u);
    };
    for (int i = 0; i < N; ++i) if (!seen[i]) dfs(i);
    int cid = 0;
    function<void(int)> rdfs = [&](int u) {
        comp[u] = cid; for (int v : gt[u]) if (comp[v] < 0) rdfs(v);
    };
    for (int i = N - 1; i >= 0; --i) if (comp[order[i]] < 0) { rdfs(order[i]); ++cid; }
    for (int i = 0; i < n; ++i) if (comp[2*i] == comp[2*i+1]) return false;
    return true;
}`,
      typescript: `function twoSat(n: number, clauses: [number, number][]) {
  const N = 2 * n;
  const g: number[][] = Array.from({ length: N }, () => []);
  const id = (lit: number) => {
    const x = Math.abs(lit) - 1;
    return 2 * x + (lit > 0 ? 0 : 1);
  };
  for (const [a, b] of clauses) {
    g[id(-a)].push(id(b));
    g[id(-b)].push(id(a));
  }
  const order: number[] = [];
  const seen = Array(N).fill(false);
  const dfs = (u: number) => {
    seen[u] = true;
    for (const v of g[u]) if (!seen[v]) dfs(v);
    order.push(u);
  };
  for (let i = 0; i < N; i++) if (!seen[i]) dfs(i);
  const gt: number[][] = Array.from({ length: N }, () => []);
  for (let u = 0; u < N; u++) for (const v of g[u]) gt[v].push(u);
  const comp = Array(N).fill(-1);
  let cid = 0;
  const rdfs = (u: number) => {
    comp[u] = cid;
    for (const v of gt[u]) if (comp[v] < 0) rdfs(v);
  };
  for (const u of [...order].reverse()) {
    if (comp[u] < 0) {
      rdfs(u);
      cid++;
    }
  }
  for (let i = 0; i < n; i++) if (comp[2 * i] === comp[2 * i + 1]) return false;
  return true;
}`,
    },
    quiz: [
      {
        id: "sat1",
        prompt: "2-SAT 的複雜度類？",
        options: ["NP-complete", "在 P（SCC 線性）", "PSPACE-complete", "不可判定"],
        answer: 1,
        explanation: "implication graph + SCC。3-SAT 才是 NPC。",
      },
      {
        id: "sat2",
        prompt: "子句 (a∨b) 對應哪兩條邊？",
        options: ["a→b、b→a", "¬a→b、¬b→a", "a→¬b、b→¬a", "只要 ¬a→b"],
        answer: 1,
        explanation: "a 假則 b 真，反之亦然。",
      },
      {
        id: "sat3",
        prompt: "不可滿足的充要條件？",
        options: ["圖有環", "某 x 與 ¬x 在同一 SCC", "沒有匯點", "變數超過 2"],
        answer: 1,
        explanation: "x 與 ¬x 互相可達，賦值矛盾。有環不一定矛盾。",
      },
    ],
    related: ["scc", "three-sat", "topo-sort"],
  },
];
