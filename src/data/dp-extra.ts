import type { Algorithm } from "./types";

export const dpExtraLessons: Algorithm[] = [
  {
    slug: "lis",
    name: "最長遞增子序列",
    english: "LIS",
    category: "dp",
    examWeight: "高",
    tags: ["DP", "耐心排序", "O(n log n)"],
    summary:
      "在序列裡找最長、嚴格遞增、可不連續的子序列。樸素 DP 是 O(n²)；維護 tails 陣列二分是 O(n log n)。可化成與排序後序列的 LCS。",
    idea: "dp[i] = 1 + max{ dp[j] | j<i 且 a[j]<a[i] }（沒有則 1）。O(n log n)：tails[k] = 長度 k+1 的遞增子序列的最小結尾。新元素二分插入／替換。",
    whenToUse: [
      "最長上升走勢、盒子套盒（多維要排序）",
      "對照 LCS：LIS(A) = LCS(A, sort(unique(A)))",
    ],
    examTips: [
      "子序列可跳；子陣列必須連續（最長遞增子陣列是另一題）。",
      "patience sorting 的堆數 = LIS 長度。",
      "要還原序列需額外 prev 指標。",
    ],
    pitfalls: ["寫成非嚴格遞增卻用 <。", "二分寫成 lower_bound 對非嚴格的條件搞反。"],
    complexity: {
      timeBest: "O(n log n)",
      timeAvg: "O(n log n) 或 O(n²)",
      timeWorst: "O(n²) 樸素",
      space: "Θ(n)",
    },
    complexityNote: "考試常要你兩種都寫得出遞迴式。",
    workedExample: {
      title: "[3,1,4,2,5]",
      input: "dp 逐格",
      steps: [
        { title: "3、1", detail: "各是 1。" },
        { title: "4", detail: "可接在 3 或 1 後 → 2。" },
        { title: "2", detail: "接在 1 後 → 2。" },
        { title: "5", detail: "接在 4 或 2 後 → 3。例如 1,2,5。" },
      ],
      result: "長度 3",
    },
    visualizer: "table",
    pseudocode: `LIS-DP(A)
  for i ← 1 to n
    dp[i] ← 1
    for j ← 1 to i-1
      if A[j] < A[i]: dp[i] ← max(dp[i], dp[j]+1)
  return max(dp)

LIS-NLOGN：維護 tails，對每個 x 做 lower_bound 替換。`,
    codes: {
      python: `def lis_n2(a: list[int]) -> int:
    n = len(a)
    dp = [1] * n
    for i in range(n):
        for j in range(i):
            if a[j] < a[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp, default=0)

def lis_nlogn(a: list[int]) -> int:
    import bisect
    tails: list[int] = []
    for x in a:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)`,
      cpp: `int lis(vector<int> a) {
    vector<int> t;
    for (int x: a) {
        auto it = lower_bound(t.begin(), t.end(), x);
        if (it==t.end()) t.push_back(x); else *it=x;
    }
    return (int)t.size();
}`,
      typescript: `function lisN2(a: number[]) {
  const dp = Array(a.length).fill(1);
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < i; j++)
      if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
  return dp.length ? Math.max(...dp) : 0;
}`,
    },
    quiz: [
      {
        id: "lis1",
        prompt: "樸素 LIS DP 時間？",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
        answer: 2,
        explanation: "每個 i 掃前面的 j。",
      },
      {
        id: "lis2",
        prompt: "tails 陣列 + 二分的時間？",
        options: ["O(n²)", "O(n log n)", "O(2^n)", "O(n)"],
        answer: 1,
        explanation: "每個元素一次 lower_bound。",
      },
      {
        id: "lis3",
        prompt: "LIS 與 LCS？",
        options: [
          "無關",
          "LIS(A) 等於 A 與其遞增排序（去重）的 LCS",
          "LIS 必須連續",
          "LCS 比較快",
        ],
        answer: 1,
        explanation: "這是經典化約。",
      },
    ],
    related: ["lcs", "binary-search", "edit-distance"],
  },
  {
    slug: "edit-distance",
    name: "編輯距離",
    english: "Edit Distance / Levenshtein",
    category: "dp",
    examWeight: "高",
    tags: ["DP", "字串", "對齊"],
    summary:
      "把字串 X 變成 Y，插入、刪除、替換各成本 1，求最少操作。表格長得像 LCS，差在對角有 0/1 成本。",
    idea: "dp[i][j] = 前綴 Xᵢ 變 Yⱼ。字元相同走左上；否則 min(刪、插、替)+1。LCS 長度與編輯距離在只有插刪時相關：n+m-2·LCS。",
    whenToUse: [
      "拼寫校正、DNA 對齊（可改權重）",
      "diff 的簡化模型",
    ],
    examTips: [
      "base：dp[i][0]=i、dp[0][j]=j。",
      "只允許插刪時，距離 = n+m-2·LCS。",
      "時間 Θ(mn)，空間可滾成 Θ(min(m,n))。",
    ],
    pitfalls: ["和 LCS 轉移抄錯：相同時 LCS +1、編輯距離 +0。"],
    complexity: {
      timeBest: "Θ(mn)",
      timeAvg: "Θ(mn)",
      timeWorst: "Θ(mn)",
      space: "Θ(mn)",
    },
    complexityNote: "和 LCS 同階。",
    workedExample: {
      title: "CAT → CUT",
      input: "見表格",
      steps: [
        { title: "C=C", detail: "對角 0。" },
        { title: "A vs U", detail: "替換成本 1。" },
        { title: "T=T", detail: "總距離 1。" },
      ],
      result: "1（A→U）",
    },
    visualizer: "table",
    pseudocode: `EDIT(X, Y)
  for i←0 to m: dp[i][0]←i
  for j←0 to n: dp[0][j]←j
  for i←1 to m
    for j←1 to n
      if X[i]=Y[j]: dp[i][j] ← dp[i-1][j-1]
      else dp[i][j] ← 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[m][n]`,
    codes: {
      python: `def edit_distance(x: str, y: str) -> int:
    m, n = len(x), len(y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]`,
      cpp: `int edit(const string& x, const string& y) {
    int m=x.size(), n=y.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1));
    for (int i=0;i<=m;++i) dp[i][0]=i;
    for (int j=0;j<=n;++j) dp[0][j]=j;
    for (int i=1;i<=m;++i)
      for (int j=1;j<=n;++j)
        dp[i][j] = x[i-1]==y[j-1] ? dp[i-1][j-1]
          : 1+min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
    return dp[m][n];
}`,
      typescript: `function editDistance(x: string, y: string) {
  const m = x.length, n = y.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        x[i - 1] === y[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}`,
    },
    quiz: [
      {
        id: "ed1",
        prompt: "字元相同時轉移？",
        options: ["一定 +1", "抄左上", "抄左", "歸零"],
        answer: 1,
        explanation: "不必操作。",
      },
      {
        id: "ed2",
        prompt: "只有插刪、沒有替換時？",
        options: ["n+m", "n+m-2·LCS", "LCS", "0"],
        answer: 1,
        explanation: "刪掉非 LCS、插入對方非 LCS。",
      },
      {
        id: "ed3",
        prompt: "時間？",
        options: ["Θ(m+n)", "Θ(mn)", "Θ(n log n)", "Θ(n² log n)"],
        answer: 1,
        explanation: "和 LCS 一樣填表。",
      },
    ],
    related: ["lcs", "kmp", "lis"],
  },
  {
    slug: "matrix-chain",
    name: "矩陣鏈乘",
    english: "Matrix Chain Multiplication",
    category: "dp",
    examWeight: "高",
    tags: ["區間 DP", "括號化", "O(n³)"],
    summary:
      "一連串矩陣相乘，乘法結合律不改變結果但改變次數。DP 枚舉最後一次相乘的切開點，時間 Θ(n³)。這是區間 DP 的樣板。",
    idea: "m[i,j] = min_k m[i,k]+m[k+1,j]+p_{i-1} p_k p_j。先算長度 2 的鏈，再 3、直到整條。",
    whenToUse: [
      "括號化、最優 BST、石子合併同一型",
      "證明「結合律問題」用區間 DP",
    ],
    examTips: [
      "n 個矩陣有 n+1 個維度。",
      "Catalan 數是括號化方案數，不是最少乘法。",
      "填表順序：依區間長度。",
    ],
    pitfalls: ["k 的範圍寫成 1..n 而不是 i..j-1。", "維度下標偏移。"],
    complexity: {
      timeBest: "Θ(n³)",
      timeAvg: "Θ(n³)",
      timeWorst: "Θ(n³)",
      space: "Θ(n²)",
    },
    complexityNote: "區間個數 O(n²)，每個枚舉切開點 O(n)。",
    workedExample: {
      title: "10×20、20×30、30×40",
      input: "三個矩陣",
      steps: [
        { title: "(A1 A2)A3", detail: "10·20·30 + 10·30·40 = 6000+12000=18000。" },
        { title: "A1(A2 A3)", detail: "20·30·40 + 10·20·40 = 24000+8000=32000。" },
      ],
      result: "最少 18000，先乘前兩個",
    },
    visualizer: "table",
    pseudocode: `MATRIX-CHAIN(p[0..n])
  for i←1 to n: m[i][i]←0
  for len←2 to n
    for i←1 to n-len+1
      j ← i+len-1
      m[i][j] ← ∞
      for k←i to j-1
        q ← m[i][k]+m[k+1][j]+p[i-1]p[k]p[j]
        m[i][j] ← min(m[i][j], q)
  return m[1][n]`,
    codes: {
      python: `def matrix_chain(p: list[int]) -> int:
    n = len(p) - 1
    m = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            m[i][j] = 10**18
            for k in range(i, j):
                q = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1]
                if q < m[i][j]:
                    m[i][j] = q
    return m[0][n - 1]`,
      cpp: `int matrix_chain(vector<int> p) {
    int n=p.size()-1;
    vector<vector<long long>> m(n, vector<long long>(n,0));
    for (int len=2; len<=n; ++len)
      for (int i=0;i+len-1<n;++i) {
        int j=i+len-1; m[i][j]=4e18;
        for (int k=i;k<j;++k)
          m[i][j]=min(m[i][j], m[i][k]+m[k+1][j]+1LL*p[i]*p[k+1]*p[j+1]);
      }
    return (int)m[0][n-1];
}`,
      typescript: `function matrixChain(p: number[]) {
  const n = p.length - 1;
  const m = Array.from({ length: n }, () => Array(n).fill(0));
  for (let len = 2; len <= n; len++)
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      m[i][j] = Infinity;
      for (let k = i; k < j; k++)
        m[i][j] = Math.min(
          m[i][j],
          m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1]
        );
    }
  return m[0][n - 1];
}`,
    },
    quiz: [
      {
        id: "mc1",
        prompt: "矩陣鏈乘 DP 時間？",
        options: ["Θ(n)", "Θ(n²)", "Θ(n³)", "Θ(n!)"],
        answer: 2,
        explanation: "區間 × 切開點。",
      },
      {
        id: "mc2",
        prompt: "Catalan 數在這題代表？",
        options: ["最少乘法次數", "括號化方案數", "矩陣個數", "近似比"],
        answer: 1,
        explanation: "方案數不是成本。",
      },
      {
        id: "mc3",
        prompt: "填表順序？",
        options: ["任意", "依區間長度由短到長", "只能對角", "DFS 後序"],
        answer: 1,
        explanation: "長區間依賴短區間。",
      },
    ],
    related: ["knapsack", "lcs", "edit-distance"],
  },
  {
    slug: "unbounded-knapsack",
    name: "無限背包與零錢",
    english: "Unbounded Knapsack / Coin Change",
    category: "dp",
    examWeight: "高",
    tags: ["DP", "可重複", "貪婪陷阱"],
    summary:
      "每種物品／硬幣可用無限次。一維 DP 容量要從小到大（和 0/1 的倒序相反）。貪婪只對正規幣制正確，例如 {1,5,11} 湊 15 就不能只看最大面額。",
    idea: "dp[x] = min（或 max）over 硬幣 c：dp[x-c]+1。先枚舉物品再枚舉容量，讓同一硬幣被重複用。",
    whenToUse: [
      "零錢最少枚數、方案數",
      "可重複選的資源配置",
    ],
    examTips: [
      "0/1：倒序；Unbounded：正序。這是選擇題送分。",
      "方案數把 min 改成加總。",
      "貪婪反例：1,5,11 湊 15，11+4×1=5 枚，但 3×5=3 枚。",
    ],
    pitfalls: ["正序倒序寫反變成另一種背包。", "以為任何幣制貪婪都對。"],
    complexity: {
      timeBest: "Θ(nW)",
      timeAvg: "Θ(nW)",
      timeWorst: "Θ(nW)",
      space: "Θ(W)",
    },
    complexityNote: "偽多項式，與 0/1 同階不同順序。",
    workedExample: {
      title: "硬幣 1,5,11，金額 15",
      input: "見表格",
      steps: [
        { title: "用 1", detail: "每個金額至少能用 n 枚 1。" },
        { title: "用 5", detail: "15 變成 3 枚。" },
        { title: "用 11", detail: "11+4×1=5 枚，比 3 差，dp 保留 3。" },
      ],
      result: "最少 3 枚",
    },
    visualizer: "table",
    pseudocode: `COIN-CHANGE(coins, W)
  dp[0] ← 0; 其餘 ∞
  for c in coins
    for x ← c to W
      dp[x] ← min(dp[x], dp[x-c] + 1)
  return dp[W]`,
    codes: {
      python: `def coin_change(coins: list[int], W: int) -> int:
    dp = [10**9] * (W + 1)
    dp[0] = 0
    for c in coins:
        for x in range(c, W + 1):
            dp[x] = min(dp[x], dp[x - c] + 1)
    return dp[W] if dp[W] < 10**9 else -1`,
      cpp: `int coin(vector<int> c, int W) {
    vector<int> dp(W+1, 1e9); dp[0]=0;
    for (int x: c) for (int s=x;s<=W;++s) dp[s]=min(dp[s], dp[s-x]+1);
    return dp[W]>=1e9 ? -1 : dp[W];
}`,
      typescript: `function coinChange(coins: number[], W: number) {
  const dp = Array(W + 1).fill(Infinity);
  dp[0] = 0;
  for (const c of coins)
    for (let x = c; x <= W; x++) dp[x] = Math.min(dp[x], dp[x - c] + 1);
  return Number.isFinite(dp[W]) ? dp[W] : -1;
}`,
    },
    quiz: [
      {
        id: "ub1",
        prompt: "無限背包一維容量迴圈方向？",
        options: ["從大到小（同 0/1）", "從小到大", "任意", "必須二維"],
        answer: 1,
        explanation: "正序讓同一物品被重複使用。",
      },
      {
        id: "ub2",
        prompt: "硬幣 {1,5,11} 湊 15，貪婪先拿 11？",
        options: ["最優 2 枚", "不是最優，DP 得 3 枚五元", "無解", "要用 Dijkstra"],
        answer: 1,
        explanation: "11+四個 1 共 5 枚，三個 5 只要 3。",
      },
      {
        id: "ub3",
        prompt: "0/1 與 unbounded 的記憶口訣？",
        options: [
          "都正序",
          "0/1 倒序、unbounded 正序",
          "都倒序",
          "跟排序穩定度有關",
        ],
        answer: 1,
        explanation: "送分題。",
      },
    ],
    related: ["knapsack", "fractional-knapsack", "subset-sum"],
  },
];
