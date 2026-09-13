import type { Algorithm } from "./types";

export const dpLessons: Algorithm[] = [
  {
    slug: "knapsack",
    name: "0/1 背包",
    english: "0/1 Knapsack",
    category: "dp",
    examWeight: "極高",
    tags: ["DP", "遞迴式", "填表"],
    summary:
      "n 件物品，每件只能拿或不拿，容量 W，求最大價值。這是動態規劃的樣板題：會寫 dp 定義與轉移比背程式重要。",
    idea: "dp[i][w] = 只考慮前 i 件、容量上限 w 的最大價值。第 i 件要不拿（= dp[i-1][w]），要嘛拿（w≥wᵢ 時 dp[i-1][w-wᵢ]+vᵢ）。可滾成一維，容量必須從大滾到小，才能保證每件只用一次。",
    whenToUse: [
      "選或不選、資源有限的最優化",
      "可化約成「容量 / 預算 / 時間」的組合問題",
    ],
    examTips: [
      "0/1：每件至多一次；Unbounded：可重複，一維要從小到大。",
      "分數背包（可切）用貪婪：價值密度排序，不是 DP。",
      "時間 Θ(nW)，偽多項式；W 很大時不能當真正的多項式。",
      "考試常要你寫遞迴式與 base case：dp[0][*]=0、dp[*][0]=0。",
    ],
    pitfalls: [
      "一維 0/1 卻從左到右更新，變成可重複拿。",
      "把 0/1 與分數背包的演算法搞反。",
    ],
    complexity: {
      timeBest: "Θ(nW)",
      timeAvg: "Θ(nW)",
      timeWorst: "Θ(nW)",
      space: "Θ(nW) 或 Θ(W)",
    },
    complexityNote: "狀態數 n·(W+1)，每格 O(1) 轉移。",
    workedExample: {
      title: "物品 (重,價)=(2,3),(3,4),(4,5)，W=5",
      input: "三列容量 0..5 的表格",
      steps: [
        { title: "只放 A(2,3)", detail: "容量≥2 的格子都是 3。" },
        { title: "加入 B(3,4)", detail: "w=3：max(3,4)=4；w=5：max(3, 3+4)=7（A+B）。" },
        { title: "加入 C(4,5)", detail: "w=5：不拿 C 是 7，拿 C 剩 1 裝不下 → 仍 7。" },
      ],
      result: "最優 7（A+B，重 5）",
    },
    visualizer: "table",
    pseudocode: `KNAPSACK(w[1..n], v[1..n], W)
  for i ← 0 to n: dp[i][0] ← 0
  for cap ← 0 to W: dp[0][cap] ← 0
  for i ← 1 to n
    for cap ← 1 to W
      dp[i][cap] ← dp[i-1][cap]
      if cap ≥ w[i]
        dp[i][cap] ← max(dp[i][cap], dp[i-1][cap - w[i]] + v[i])
  return dp[n][W]`,
    codes: {
      python: `def knapsack(weights: list[int], values: list[int], W: int) -> int:
    n = len(weights)
    dp = [0] * (W + 1)
    for i in range(n):
        w, v = weights[i], values[i]
        for cap in range(W, w - 1, -1):   # 倒序：0/1
            dp[cap] = max(dp[cap], dp[cap - w] + v)
    return dp[W]`,
      cpp: `int knapsack(vector<int> w, vector<int> v, int W) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < (int)w.size(); ++i)
        for (int cap = W; cap >= w[i]; --cap)
            dp[cap] = max(dp[cap], dp[cap - w[i]] + v[i]);
    return dp[W];
}`,
      typescript: `function knapsack(weights: number[], values: number[], W: number) {
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i], v = values[i];
    for (let cap = W; cap >= w; cap--)
      dp[cap] = Math.max(dp[cap], dp[cap - w] + v);
  }
  return dp[W];
}`,
    },
    quiz: [
      {
        id: "kp1",
        prompt: "0/1 背包一維 DP 容量迴圈的方向？",
        options: [
          "從小到大，保證每件只用一次",
          "從大到小，保證每件只用一次",
          "任意方向都可以",
          "必須二維，不能一維",
        ],
        answer: 1,
        explanation: "倒序時 dp[cap-w] 還是「沒放本件」的舊值。",
      },
      {
        id: "kp2",
        prompt: "分數背包（可切物品）的正確作法？",
        options: [
          "0/1 DP",
          "依價值密度貪婪",
          "Floyd",
          "BFS",
        ],
        answer: 1,
        explanation: "可切時密度高的先拿是最優；0/1 不能這樣做。",
      },
      {
        id: "kp3",
        prompt: "Θ(nW) 被稱為偽多項式是因為？",
        options: [
          "n 是指數",
          "W 以數值大小而非位數進入複雜度",
          "其實是 Θ(n log W)",
          "空間不是多項式",
        ],
        answer: 1,
        explanation: "輸入 W 的位數是 log W，W 本身是指數級。",
      },
    ],
    related: ["lcs", "huffman", "master-theorem"],
  },
  {
    slug: "lcs",
    name: "最長共同子序列",
    english: "LCS",
    category: "dp",
    examWeight: "極高",
    tags: ["DP", "字串", "子序列"],
    summary:
      "兩個字串裡最長、可不連續但須保序的共同子序列。dp 表格與「相同走左上、不同取 max(上,左)」幾乎每年都有人出。",
    idea: "若 Xᵢ=Yⱼ，LCS 長度 = LCS(Xᵢ₋₁,Yⱼ₋₁)+1；否則 = max( LCS(Xᵢ₋₁,Yⱼ), LCS(Xᵢ,Yⱼ₋₁) )。子字串（substring）必須連續，是另一題（常用 DP 或後綴結構）。",
    whenToUse: [
      "diff、版本比對、DNA 序列",
      "LIS 可化成 LCS（與排序後的不重複序列）",
    ],
    examTips: [
      "時間 Θ(mn)，空間可滾成 Θ(min(m,n))，但要還原字串需記方向。",
      "還原：從右下沿「相等就斜上」或「誰比較大往哪邊」。",
      "不要和最長共同子字串搞混。",
      "空字串 LCS=0，是 base case。",
    ],
    pitfalls: ["把子序列當成必須連續。", "填表時 i、j 對到字元下標偏移 1。"],
    complexity: {
      timeBest: "Θ(mn)",
      timeAvg: "Θ(mn)",
      timeWorst: "Θ(mn)",
      space: "Θ(mn)",
    },
    complexityNote: "每個 (i,j) 狀態算一次。",
    workedExample: {
      title: 'X="ABCB", Y="BDCB"',
      input: "5×5 含空字串的表",
      steps: [
        { title: "B=B", detail: "dp[1][1] 之後在對到 B 時 +1。" },
        { title: "不相等", detail: "取上方或左方較大值。" },
        { title: "右下角", detail: "長度 3，其中一解 BCB。" },
      ],
      result: "LCS 長度 3（BCB）",
    },
    visualizer: "table",
    pseudocode: `LCS-LENGTH(X, Y)
  m ← |X|; n ← |Y|
  for i ← 0 to m: c[i][0] ← 0
  for j ← 0 to n: c[0][j] ← 0
  for i ← 1 to m
    for j ← 1 to n
      if X[i] = Y[j]
        c[i][j] ← c[i-1][j-1] + 1
      else
        c[i][j] ← max(c[i-1][j], c[i][j-1])
  return c[m][n]`,
    codes: {
      python: `def lcs_length(x: str, y: str) -> int:
    m, n = len(x), len(y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
      cpp: `int lcs(const string& x, const string& y) {
    int m=x.size(), n=y.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1,0));
    for (int i=1;i<=m;++i)
      for (int j=1;j<=n;++j)
        dp[i][j] = x[i-1]==y[j-1] ? dp[i-1][j-1]+1
                                  : max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`,
      typescript: `function lcsLength(x: string, y: string) {
  const m = x.length, n = y.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        x[i - 1] === y[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}`,
    },
    quiz: [
      {
        id: "lcs1",
        prompt: "X[i]=Y[j] 時的轉移？",
        options: [
          "max(上, 左)",
          "左上 + 1",
          "上 + 1",
          "一律 0",
        ],
        answer: 1,
        explanation: "配對這個字元，問題縮成前綴 i-1, j-1。",
      },
      {
        id: "lcs2",
        prompt: "子序列與子字串的差別？",
        options: [
          "沒有差別",
          "子序列可跳字但仍保序；子字串必須連續",
          "子序列必須連續",
          "子字串可以任意重排",
        ],
        answer: 1,
        explanation: "ACE 是 ABCDE 的子序列，不是子字串。",
      },
      {
        id: "lcs3",
        prompt: "LCS 長度 DP 的時間？",
        options: ["Θ(m+n)", "Θ(mn)", "Θ(n log n)", "Θ(2^n)"],
        answer: 1,
        explanation: "表格 mn 格。",
      },
    ],
    related: ["knapsack", "kmp", "floyd-warshall"],
  },
];
