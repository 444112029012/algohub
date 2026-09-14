import type { Algorithm } from "./types";

export const npLessons: Algorithm[] = [
  {
    slug: "vertex-cover",
    name: "點覆蓋",
    english: "Vertex Cover",
    category: "np",
    examWeight: "極高",
    tags: ["NP-complete", "2-approx", "匹配"],
    summary:
      "選最少的點，讓每條邊至少有一端被選。判定版 NP-complete；研究所最愛考「取匹配邊兩端」的 2-approx，以及它和獨立集、子集覆蓋的化約。",
    idea: "精確求最小點覆蓋是 NP-hard。2-approx：只要還有沒被蓋的邊，任意抓一條、兩端都放進 C，並刪掉碰這兩點的邊。抓過的邊兩兩不相鄰，形成匹配。OPT 至少要為每條匹配邊付 1 個點，所以 |C| ≤ 2·OPT。加權版用 LP 捨入仍是 2。",
    whenToUse: [
      "監控攝影機蓋住每條走廊（邊）",
      "證明某個問題 NP-complete 時，常從點覆蓋化過去",
      "需要保證 2 倍近似、而不是 H(n) 那種對數",
    ],
    examTips: [
      "C 是點覆蓋 ⇔ V\\C 是獨立集。因此兩者一起 NP-complete。",
      "子集覆蓋的特例：元素=邊、集合=「與某點關聯的邊」。",
      "「每次選目前度數最大的點」不是 2-approx 的標準證明，近似比可以更差。",
      "二分圖上點覆蓋等於最大匹配（König），多項式可解。",
      "匹配兩端法選出的邊是極大匹配，|C|=2|M|。",
    ],
    pitfalls: [
      "以為貪婪最高度一定 2-approx。",
      "把點覆蓋和邊覆蓋（選邊蓋點）搞反；邊覆蓋有多項式作法。",
      "化約方向寫反：應是「已知 NP-c 的問題 ≤p 新問題」。",
    ],
    complexity: {
      timeBest: "O(E) 2-approx",
      timeAvg: "O(E) 2-approx",
      timeWorst: "精確版指數",
      space: "Θ(V)",
    },
    complexityNote: "2-approx 掃邊一次即可。精確算法考試不要求實作，要會講 NP-complete。",
    workedExample: {
      title: "示範圖上取匹配邊",
      input: "無向圖 A—B—C，A—D，B—E，E—F，C—F，D—E，B—D",
      steps: [
        { title: "取 AB", detail: "C←{A,B}，刪 AB,AD,BC,BE,BD。" },
        { title: "剩餘 CF,DE,EF", detail: "取 CF，C←{A,B,C,F}，刪 CF,EF。" },
        { title: "剩餘 DE", detail: "取 DE，C←{A,B,C,F,D,E}。" },
        { title: "保證", detail: "|C| 是匹配大小的兩倍，故 ≤ 2·OPT。" },
      ],
      result: "一個 2-approx 點覆蓋（不必最優）",
    },
    visualizer: "graph",
    pseudocode: `APPROX-VERTEX-COVER(G)
  C ← ∅
  E' ← E[G]
  while E' ≠ ∅
    任取 (u,v) ∈ E'
    C ← C ∪ {u,v}
    從 E' 刪除所有與 u 或 v 關聯的邊
  return C
  // |C| ≤ 2 OPT；選出的邊是匹配`,
    codes: {
      python: `def approx_vertex_cover(edges: list[tuple[str, str]]) -> set[str]:
    remain = list(edges)
    cover: set[str] = set()
    while remain:
        u, v = remain[0]
        cover.update([u, v])
        remain = [(a, b) for a, b in remain if a not in (u, v) and b not in (u, v)]
    return cover`,
      cpp: `set<string> approx_vc(vector<pair<string,string>> e) {
    set<string> C;
    while (!e.empty()) {
        auto [u,v] = e[0];
        C.insert(u); C.insert(v);
        vector<pair<string,string>> nxt;
        for (auto [a,b]: e)
            if (a!=u && a!=v && b!=u && b!=v) nxt.push_back({a,b});
        e.swap(nxt);
    }
    return C;
}`,
      typescript: `function approxVertexCover(edges: [string, string][]) {
  const cover = new Set<string>();
  let remain = [...edges];
  while (remain.length) {
    const [u, v] = remain[0]!;
    cover.add(u); cover.add(v);
    remain = remain.filter(([a, b]) => a !== u && a !== v && b !== u && b !== v);
  }
  return cover;
}`,
    },
    quiz: [
      {
        id: "vc1",
        prompt: "標準 2-approx 點覆蓋每一步做什麼？",
        options: [
          "選目前度數最大的點",
          "任取一條剩餘邊，兩端都放進覆蓋",
          "隨機丟一半的點",
          "跑 Dijkstra",
        ],
        answer: 1,
        explanation: "取匹配邊兩端，證明靠「OPT 至少蓋匹配的一端」。",
      },
      {
        id: "vc2",
        prompt: "點覆蓋 C 與獨立集的關係？",
        options: [
          "C 本身是獨立集",
          "V\\C 是獨立集",
          "沒有關係",
          "C 是團",
        ],
        answer: 1,
        explanation: "沒被覆蓋的兩點之間不能有邊，否則那條邊沒被蓋。",
      },
      {
        id: "vc3",
        prompt: "二分圖最小點覆蓋？",
        options: [
          "仍是 NP-hard",
          "等於最大匹配（König）",
          "等於 |V|/2",
          "等於 MST 邊數",
        ],
        answer: 1,
        explanation: "König 定理：二分圖上兩者大小相等。",
      },
    ],
    related: ["set-cover", "clique-independent-set", "three-sat"],
  },
  {
    slug: "clique-independent-set",
    name: "團與獨立集",
    english: "Clique & Independent Set",
    category: "np",
    examWeight: "高",
    tags: ["NP-complete", "化約", "補圖"],
    summary:
      "團是完全子圖；獨立集是兩兩不相鄰的點集。兩者透過補圖互化，又和點覆蓋差一個補集。這是寫化約證明最常默的三件套。",
    idea: "G 有大小 k 的團 ⇔ 補圖 Ḡ 有大小 k 的獨立集。G 有大小 k 的獨立集 ⇔ G 有大小 |V|-k 的點覆蓋。所以三個判定問題同在 NP-complete。",
    whenToUse: [
      "社交網路裡找彼此都認識的小圈子（團）",
      "把 NP-complete 證明接到圖問題上",
    ],
    examTips: [
      "化約要畫清楚：給 G 怎麼造 G'，k 怎麼變 k'，是/否對應。",
      "最大團沒有好的多項式近似（n^{1-ε} 也很難）。",
      "區間圖、完美圖上有些變體可多項式解，一般圖不行。",
    ],
    pitfalls: [
      "把「完全子圖」寫成「連通子圖」。",
      "補圖邊的有無弄反。",
    ],
    complexity: {
      timeBest: "判定 NP-complete",
      timeAvg: "精確指數",
      timeWorst: "精確指數",
      space: "Θ(V+E)",
    },
    complexityNote: "暴力枚舉 k 點要 C(|V|,k)。考試重點是化約，不是實作。",
    workedExample: {
      title: "三角形就是 k=3 的團",
      input: "三點兩兩有邊 ⇔ 團；若去掉一條邊，最大團變 2，獨立集可到 2",
      steps: [
        { title: "團", detail: "K₃ 是大小 3 的團。" },
        { title: "補圖", detail: "K₃ 的補圖沒有邊，獨立集大小 3。" },
        { title: "點覆蓋", detail: "三點的 K₃ 最小點覆蓋是 2。" },
      ],
      result: "三個數字由 |V| 與補集關係綁在一起",
    },
    visualizer: "none",
    pseudocode: `關係（考試默寫）
  Clique(G,k)  ⇔  IndependentSet(Ḡ, k)
  IndependentSet(G,k)  ⇔  VertexCover(G, |V|-k)

判定 Clique / IndependentSet / VertexCover 都是 NP-complete。`,
    codes: {
      python: `def is_clique(g: dict[str, set[str]], nodes: list[str]) -> bool:
    s = set(nodes)
    return all(v in g[u] for u in s for v in s if u != v)

def is_independent(g: dict[str, set[str]], nodes: list[str]) -> bool:
    s = set(nodes)
    return all(v not in g[u] for u in s for v in s if u != v)

def vc_from_is(all_nodes: list[str], indep: list[str]) -> set[str]:
    return set(all_nodes) - set(indep)`,
      cpp: `// 化約是證明題。檢查函數：
// Clique：誘導子圖邊數 = k(k-1)/2
// Independent set：誘導子圖邊數 = 0
// Vertex cover：每條邊至少一端在 C`,
      typescript: `function isClique(adj: Record<string, string[]>, nodes: string[]) {
  const s = new Set(nodes);
  for (const u of s)
    for (const v of s)
      if (u !== v && !adj[u]?.includes(v)) return false;
  return true;
}`,
    },
    quiz: [
      {
        id: "cl1",
        prompt: "G 的補圖有大小 k 的獨立集，代表 G 有？",
        options: ["大小 k 的點覆蓋", "大小 k 的團", "哈密頓迴路", "MST"],
        answer: 1,
        explanation: "補圖不相鄰 ⇔ 原圖相鄰，獨立集對應團。",
      },
      {
        id: "cl2",
        prompt: "n 個點的圖，獨立集大小 k 時點覆蓋大小是？",
        options: ["k", "n-k", "n", "2k"],
        answer: 1,
        explanation: "補集就是點覆蓋。",
      },
      {
        id: "cl3",
        prompt: "下列何者正確？",
        options: [
          "最大團有 2-approx 像點覆蓋一樣簡單",
          "一般圖最大團沒有好的多項式近似",
          "團可以線性時間找",
          "獨立集等於匹配",
        ],
        answer: 1,
        explanation: "和點覆蓋不同，團的近似非常難。",
      },
    ],
    related: ["vertex-cover", "three-sat", "set-cover"],
  },
  {
    slug: "three-sat",
    name: "3-SAT",
    english: "3-SAT",
    category: "np",
    examWeight: "極高",
    tags: ["NP-complete", "Cook-Levin", "化約起點"],
    summary:
      "布林公式每子句恰好 3 個文字，問是否可滿足。Cook–Levin 讓 SAT 成為第一個 NP-complete 問題；3-SAT 是圖靈化約裡最常用的起點。2-SAT 反而在 P。",
    idea: "SAT 子句太長時，引入新變數拆成 3 元子句： (ℓ1∨ℓ2∨ℓ3∨ℓ4) 變成 (ℓ1∨ℓ2∨y)∧(¬y∨ℓ3∨ℓ4) 這類 splittings，多項式個新變數。2-SAT 可用implication graph 的 SCC 在線性時間解。",
    whenToUse: [
      "證明新問題 NP-complete：做 3-SAT ≤p 你的問題",
      "對照 2-SAT 為什麼突然變容易",
    ],
    examTips: [
      "NP-complete = 在 NP 裡，且所有 NP 都能化約到它。",
      "化約必須是多項式時間、保持是／否答案。",
      "3-SAT → 獨立集：每個文字一個點、子句內三點連成三角形、 complementary literals 連邊。",
      "HORN-SAT、2-SAT 在 P；3-SAT、Circuit-SAT 不在（除非 P=NP）。",
    ],
    pitfalls: [
      "說「NP 就是沒有效算法」——NP 是「是的實例有多項式證明」。",
      "2-SAT 也講成 NP-complete。",
    ],
    complexity: {
      timeBest: "2-SAT：O(n+m)",
      timeAvg: "3-SAT：指數",
      timeWorst: "3-SAT：指數",
      space: "Θ(n+m)",
    },
    complexityNote: "n 個變數的暴力 2^n。考試重點是定義與化約，不是解 SAT solver。",
    workedExample: {
      title: "拆長子句",
      input: "(x∨y∨z∨w)",
      steps: [
        { title: "引入 y1", detail: "(x∨y∨y1) ∧ (¬y1∨z∨w)。" },
        { title: "等價", detail: "原子句為真 ⇔ 新公式為真，變數與子句只多常數倍。" },
        { title: "接到獨立集", detail: "每個子句三個點形成三角形，選恰好一個文字為真。" },
      ],
      result: "SAT ≤p 3-SAT ≤p Independent Set ≤p Vertex Cover",
    },
    visualizer: "none",
    pseudocode: `3-SAT
  輸入：CNF，每子句 3 個文字
  問：是否存在 0/1 賦值使每個子句至少一個文字為真

標準化約鏈（方向：左邊 ≤p 右邊）
  SAT ≤p 3-SAT ≤p IndependentSet ≤p VertexCover
  3-SAT ≤p HamiltonianCycle ≤p TSP
  3-SAT ≤p SubsetSum`,
    codes: {
      python: `def eval_3sat(clauses: list[tuple[int, int, int]], assign: dict[int, bool]) -> bool:
    def lit(x: int) -> bool:
        return assign[x] if x > 0 else not assign[-x]
    return all(lit(a) or lit(b) or lit(c) for a, b, c in clauses)

# (x1 ∨ ¬x2 ∨ x3)
print(eval_3sat([(1, -2, 3)], {1: True, 2: True, 3: False}))`,
      cpp: `// 考試默寫化約鏈即可。2-SAT：建 implication graph，
// x∨y 變成 ¬x→y 與 ¬y→x，同一變數 x 與 ¬x 不能在同一 SCC。`,
      typescript: `function eval3Sat(
  clauses: [number, number, number][],
  assign: Record<number, boolean>
) {
  const lit = (x: number) => (x > 0 ? assign[x] : !assign[-x]);
  return clauses.every(([a, b, c]) => lit(a) || lit(b) || lit(c));
}`,
    },
    quiz: [
      {
        id: "sat1",
        prompt: "2-SAT 的複雜度類？",
        options: ["NP-complete", "P（implication graph / SCC）", "PSPACE-complete", "不可判定"],
        answer: 1,
        explanation: "每個變數與否定不能在同一強連通分量。",
      },
      {
        id: "sat2",
        prompt: "證明 X 是 NP-complete，需要？",
        options: [
          "只證明 X 在 NP",
          "X 在 NP，且某個 NP-complete 問題可多項式化約到 X",
          "只給指數算法",
          "證明 P≠NP",
        ],
        answer: 1,
        explanation: "成員 + 硬度（已知 NPC ≤p X）。",
      },
      {
        id: "sat3",
        prompt: "化約符號 A ≤p B 表示？",
        options: [
          "A 比較難",
          "A 可多項式化成 B，所以 B 至少和 A 一樣硬",
          "B 可化成 A",
          "兩者等價於排序",
        ],
        answer: 1,
        explanation: "用 B 的解法就能解 A，故 B 不會比較容易。",
      },
    ],
    related: ["clique-independent-set", "hamilton-tsp", "subset-sum"],
  },
  {
    slug: "hamilton-tsp",
    name: "哈密頓迴路與 TSP",
    english: "Hamiltonian Cycle & TSP",
    category: "np",
    examWeight: "高",
    tags: ["NP-complete", "TSP", "MST 近似"],
    summary:
      "哈密頓迴路要走過每個點恰好一次再回來。TSP 是它的優化版（總權重最小）。判定都 NP-complete；度量 TSP（三角不等式）可用 MST 做 2-approx。",
    idea: "有向／無向哈密頓都是 NP-c。TSP 判定「是否存在權重 ≤ K 的巡迴」同樣 NP-c。若距離滿足三角不等式，把 MST 的邊複製成歐拉迴路再捷徑，得到 ≤ 2·OPT 的巡迴。Christofides 再加最小完美匹配可到 1.5。",
    whenToUse: [
      "送貨路線、鑽孔路徑",
      "需要近似而不是精確解的度量空間",
    ],
    examTips: [
      "一般 TSP 沒有常數近似（除非 P=NP）。",
      "2-approx 必須有三角不等式，否則捷徑可能更長。",
      "歐拉迴路（每邊一次）在 P；哈密頓（每點一次）NP-c。這是超常考對照。",
      "DP Held–Karp 是 O(n² 2^n)，精確但仍指數。",
    ],
    pitfalls: [
      "把歐拉迴路講成 NP-complete。",
      "沒有三角不等式還硬套 MST 2-approx。",
    ],
    complexity: {
      timeBest: "歐拉：O(E)",
      timeAvg: "哈密頓／TSP：指數",
      timeWorst: "Held–Karp O(n² 2^n)",
      space: "O(n 2^n) DP",
    },
    complexityNote: "近似版建 MST 只要 O(E log V)。",
    workedExample: {
      title: "度量 TSP 的 2-approx 大綱",
      input: "完全圖、距離滿足 d(u,w) ≤ d(u,v)+d(v,w)",
      steps: [
        { title: "MST", detail: "OPT 巡迴拿掉一條邊是生成樹，故 MST ≤ OPT。" },
        { title: "加倍", detail: "每邊走兩次形成歐拉迴路，長度 2·MST ≤ 2·OPT。" },
        { title: "捷徑", detail: "已走過的點跳過；三角不等式讓捷徑不變更差。" },
      ],
      result: "巡迴長度 ≤ 2·OPT",
    },
    visualizer: "none",
    pseudocode: `METRIC-TSP-APPROX(G, d)        // 三角不等式
  T ← MST(G)
  把 T 每邊複製 → 歐拉圖
  EULER ← 歐拉迴路
  依 EULER 順序跳過重複點，得巡迴 H
  return H                      // w(H) ≤ 2 OPT

對照：歐拉迴路（邊）∈ P；哈密頓迴路（點）NP-c。`,
    codes: {
      python: `def mst_tsp_bound(mst_weight: float) -> float:
    """度量 TSP 2-approx 的上界：兩倍 MST。"""
    return 2 * mst_weight

# Held–Karp 概念：dp[S][v] = 從 0 走過 S 集合、停在 v 的最短長度
# 考試默寫狀態 2^n · n 即可。`,
      cpp: `// 歐拉：Hierholzer，所有點偶度。
// 哈密頓：沒有已知多項式算法。
// 度量 TSP：先 Kruskal/Prim 得 MST，再加倍捷徑。`,
      typescript: `function metricTspUpperBound(mstWeight: number) {
  return 2 * mstWeight;
}`,
    },
    quiz: [
      {
        id: "tsp1",
        prompt: "歐拉迴路與哈密頓迴路？",
        options: [
          "都 NP-complete",
          "歐拉在 P，哈密頓 NP-complete",
          "都在 P",
          "歐拉 NP-c，哈密頓在 P",
        ],
        answer: 1,
        explanation: "邊的巡迴看度數；點的巡迴是經典 NPC。",
      },
      {
        id: "tsp2",
        prompt: "MST 加倍做 TSP 近似的前提？",
        options: ["圖是 DAG", "三角不等式（度量）", "邊權為 1", "沒有負權即可"],
        answer: 1,
        explanation: "捷徑時要用 d(u,w)≤d(u,v)+d(v,w)。",
      },
      {
        id: "tsp3",
        prompt: "度量 TSP 的 MST 法近似比？",
        options: ["H(n)", "2", "n", "沒有保證"],
        answer: 1,
        explanation: "2·MST ≤ 2·OPT。Christofides 是 1.5。",
      },
    ],
    related: ["three-sat", "prim", "kruskal"],
  },
  {
    slug: "subset-sum",
    name: "子集和",
    english: "Subset Sum",
    category: "np",
    examWeight: "高",
    tags: ["NP-complete", "偽多項式", "背包"],
    summary:
      "給定整數與目標 T，問是否存在子集合加起來剛好 T。判定 NP-complete，但有 Θ(nT) 的 DP，所以是偽多項式——T 以數值而非位數進入複雜度。分割問題是它的親戚。",
    idea: "dp[i][s]：前 i 個數能否湊 s。轉移不拿或拿。若 Σ=2T，Subset Sum(T) 就是 Partition（能否平分成兩堆）。弱 NP-complete：T 很大（指數級）時 DP 就不算多項式。",
    whenToUse: [
      "能否剛好付錢、檔案能否湊滿容量",
      "說明「偽多項式」與 0/1 背包的關係",
    ],
    examTips: [
      "強 NP-complete（如 3-SAT、TSP）沒有偽多項式 DP。",
      "Subset Sum、Knapsack 判定是弱 NPC。",
      "有 FPTAS（完全多項式近似），考試提到「可以近似到 1+ε」即可。",
    ],
    pitfalls: [
      "把 Θ(nT) 講成多項式——T 的輸入長度是 log T。",
      "和活動選擇搞混（那題不是數字和）。",
    ],
    complexity: {
      timeBest: "Θ(nT) DP",
      timeAvg: "Θ(nT)",
      timeWorst: "判定 NPC",
      space: "Θ(T)",
    },
    complexityNote: "一維滾動只要 Θ(T) 空間；數字可重複用就變成零錢問題。",
    workedExample: {
      title: "{3,4,5} 目標 7",
      input: "見逐步表格",
      steps: [
        { title: "空集合", detail: "只能湊 0。" },
        { title: "放入 3", detail: "0 與 3。" },
        { title: "放入 4", detail: "0,3,4,7。已經有 7。" },
      ],
      result: "3+4=7，答案是",
    },
    visualizer: "table",
    pseudocode: `SUBSET-SUM(A[1..n], T)
  dp[0][0] ← True
  for i ← 1 to n
    for s ← 0 to T
      dp[i][s] ← dp[i-1][s]
      if s ≥ A[i]: dp[i][s] ← dp[i][s] ∨ dp[i-1][s-A[i]]
  return dp[n][T]

PARTITION：若 Σ 為奇則否；否則 SubsetSum(Σ/2)`,
    codes: {
      python: `def subset_sum(nums: list[int], T: int) -> bool:
    dp = [False] * (T + 1)
    dp[0] = True
    for x in nums:
        for s in range(T, x - 1, -1):
            dp[s] = dp[s] or dp[s - x]
    return dp[T]`,
      cpp: `bool subset_sum(vector<int> a, int T) {
    vector<char> dp(T+1, 0); dp[0]=1;
    for (int x: a)
      for (int s=T; s>=x; --s) dp[s] = dp[s] || dp[s-x];
    return dp[T];
}`,
      typescript: `function subsetSum(nums: number[], T: number) {
  const dp = Array(T + 1).fill(false);
  dp[0] = true;
  for (const x of nums)
    for (let s = T; s >= x; s--) dp[s] = dp[s] || dp[s - x];
  return dp[T];
}`,
    },
    quiz: [
      {
        id: "ss1",
        prompt: "Θ(nT) 被稱為偽多項式是因為？",
        options: [
          "n 是指數",
          "T 以數值大小而非位數進入複雜度",
          "空間不是多項式",
          "它其實是 O(n log T)",
        ],
        answer: 1,
        explanation: "輸入 T 的長度是 Θ(log T)。",
      },
      {
        id: "ss2",
        prompt: "Partition（能否平分）與 Subset Sum？",
        options: [
          "無關",
          "Σ 為偶時等價於 SubsetSum(Σ/2)",
          "一定比較難",
          "在 P 而 Subset Sum 不是",
        ],
        answer: 1,
        explanation: "兩堆和相等 ⇔ 一堆剛好一半。",
      },
      {
        id: "ss3",
        prompt: "0/1 背包 DP 與 Subset Sum DP 的差別？",
        options: [
          "完全不同",
          "Subset Sum 是價值=重量、問能否剛好填滿",
          "背包不能用 DP",
          "Subset Sum 必須貪婪",
        ],
        answer: 1,
        explanation: "同一張表，一個求最大價值、一個求可達性和。",
      },
    ],
    related: ["knapsack", "three-sat", "unbounded-knapsack"],
  },
  {
    slug: "hitting-set",
    name: "擊中集",
    english: "Hitting Set",
    category: "np",
    examWeight: "中",
    tags: ["對偶", "子集覆蓋", "NP-complete"],
    summary:
      "給一堆集合，選最少元素使得每個集合都至少含一個被選元素。這是子集覆蓋的對偶：把「集合↔元素」對調即可，複雜度與貪婪近似完全一樣。",
    idea: "子集覆蓋：選集合來蓋元素。擊中集：選元素來戳集合。把關聯矩陣轉置，一邊的算法直接變成另一邊。因此也是 NPC，貪婪近似比同樣 H(n)。點覆蓋就是「每條邊當一個集合、端點當元素」的擊中集。",
    whenToUse: [
      "測驗要覆蓋每個章節（章節是集合、題目是元素）",
      "從點覆蓋／子集覆蓋翻譯過來的模型",
    ],
    examTips: [
      "轉置關聯矩陣：Set Cover ↔ Hitting Set。",
      "Vertex Cover = Hitting Set（集合=邊的兩個端點）。",
    ],
    pitfalls: ["以為擊中集比較容易。對偶不降難度。"],
    complexity: {
      timeBest: "貪婪 O(m² n)",
      timeAvg: "同左",
      timeWorst: "精確 NPC",
      space: "Θ(m n)",
    },
    complexityNote: "和子集覆蓋同一套分析。",
    workedExample: {
      title: "把子集覆蓋例子轉置",
      input: "元素 {S1,S2,S3}，集合 1={S1,S2}，2={S1,S2}，…",
      steps: [
        { title: "對偶", detail: "原子集覆蓋的元素變成這裡的集合。" },
        { title: "點覆蓋", detail: "每條邊 {u,v} 是一個要被擊中的 2-集合。" },
      ],
      result: "同一張關聯矩陣，只是行列對調",
    },
    visualizer: "none",
    pseudocode: `HITTING-SET 與 SET-COVER 對偶
  關聯矩陣 A[元素, 集合] 轉置後
  一邊的貪婪（每次選擊中最多未滿足集合的元素）
  近似比同樣 H(n)

VERTEX-COVER 是每條邊大小為 2 的 Hitting Set。`,
    codes: {
      python: `def greedy_hitting_set(sets: list[set[str]]) -> list[str]:
    remaining = [set(s) for s in sets]
    picked: list[str] = []
    univ = set().union(*remaining) if remaining else set()
    while remaining:
        best = max(univ, key=lambda e: sum(e in s for s in remaining), default=None)
        if best is None:
            break
        picked.append(best)
        remaining = [s for s in remaining if best not in s]
        univ.discard(best)
    return picked`,
      cpp: `// 對偶於 greedy set cover：選「出現在最多尚未擊中集合」的元素。`,
      typescript: `function greedyHittingSet(sets: string[][]) {
  let remain = sets.map((s) => new Set(s));
  const picked: string[] = [];
  const univ = new Set(sets.flat());
  while (remain.length) {
    let best = "";
    let hit = 0;
    for (const e of univ) {
      const h = remain.filter((s) => s.has(e)).length;
      if (h > hit) {
        hit = h;
        best = e;
      }
    }
    if (!best) break;
    picked.push(best);
    remain = remain.filter((s) => !s.has(best));
    univ.delete(best);
  }
  return picked;
}`,
    },
    quiz: [
      {
        id: "hs1",
        prompt: "擊中集與子集覆蓋的關係？",
        options: ["無關", "關聯矩陣轉置（對偶）", "一個在 P 一個 NPC", "近似比完全不同"],
        answer: 1,
        explanation: "行列對調，算法與 H(n) 一起走。",
      },
      {
        id: "hs2",
        prompt: "點覆蓋可視為？",
        options: ["分數背包", "每個集合大小為 2 的擊中集", "最短路", "歐拉迴路"],
        answer: 1,
        explanation: "每條邊兩個端點組成一個要擊中的集合。",
      },
      {
        id: "hs3",
        prompt: "擊中集貪婪近似比？",
        options: ["2", "H(n)", "n!", "1"],
        answer: 1,
        explanation: "對偶於子集覆蓋。",
      },
    ],
    related: ["set-cover", "vertex-cover", "activity-selection"],
  },
];
