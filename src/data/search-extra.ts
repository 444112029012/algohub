import type { Algorithm } from "./types";

export const searchExtraLessons: Algorithm[] = [
  {
    slug: "binary-search-answer",
    name: "答案上二分",
    english: "Binary Search on the Answer",
    category: "search",
    examWeight: "極高",
    tags: ["單調謂詞", "參數搜尋", "最佳化"],
    summary:
      "不是在陣列裡找值，而是在「答案的值域」上二分。只要謂詞「x 夠大就可行」單調，就能在 Θ(T log R) 找到最小（或最大）可行答案。研究所實作題與選擇題都愛出。",
    idea: "設 check(x) 表示「把答案當成 x 時能否在限制內完成」。若 check 由 false 變 true 只跳一次，最小可行 x 就是第一個 true。對 x 二分，每次花 T 時間檢查。經典：Koko 吃香蕉、運送包裹的最小承重、最小最大負荷。",
    whenToUse: [
      "最小化最大值／最大化最小值，且單調",
      "直接 DP／貪心不好寫，但給定答案容易驗證",
      "實數答案配 EPS；整數答案用 lo/hi 邊界",
    ],
    examTips: [
      "先證明單調：x 可行 ⇒ x+1 可行（求最小時）。",
      "check 本身常是貪婪或模擬，必須 O(T) 正確。",
      "整數最小可行：可行就 hi=mid-1 並記錄 ans；不可行 lo=mid+1。",
      "和「陣列二分」差在：搜尋空間是答案，不是下標。",
    ],
    pitfalls: [
      "謂詞不單調還硬套（例如有兩個峰）。",
      "可行時寫 lo=mid 又用 lo+hi+1 溢位／無限迴圈。",
      "check 用浮點累加卻拿去比整數時限。",
    ],
    complexity: {
      timeBest: "Θ(T log R)",
      timeAvg: "Θ(T log R)",
      timeWorst: "Θ(T log R)",
      space: "Θ(1) 外加 check",
    },
    complexityNote: "R 是答案上界（例如 max(piles) 或 Σ weights）。T 是一次 check 的時間，常見 Θ(n)。",
    workedExample: {
      title: "Koko：堆 [3,6,7,11]，H=8 小時，求最小速度",
      input: "速度值域 1..11。check(x)=Σ ceil(p/x) ≤ 8",
      steps: [
        { title: "試 6", detail: "ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)=1+1+2+2=6 ≤8，可行，試更慢。" },
        { title: "試 3", detail: "1+2+3+4=10 >8，太慢。" },
        { title: "試 4", detail: "1+2+2+3=8 ≤8，可行。再不能更小。" },
      ],
      result: "最小速度 4",
    },
    visualizer: "array",
    pseudocode: `MIN-FEASIBLE(lo, hi)          // 求最小可行答案
  ans ← hi
  while lo ≤ hi
    mid ← ⌊(lo+hi)/2⌋
    if CHECK(mid)
      ans ← mid
      hi ← mid-1
    else
      lo ← mid+1
  return ans

CHECK 必須單調：x 可行 ⇒ x+1 可行。`,
    codes: {
      python: `def min_speed(piles: list[int], h: int) -> int:
    def ok(v: int) -> bool:
        return sum((p + v - 1) // v for p in piles) <= h
    lo, hi = 1, max(piles)
    ans = hi
    while lo <= hi:
        mid = (lo + hi) // 2
        if ok(mid):
            ans = mid
            hi = mid - 1
        else:
            lo = mid + 1
    return ans`,
      cpp: `bool ok(const vector<int>& p, int h, int v) {
    long long need = 0;
    for (int x : p) need += (x + v - 1LL) / v;
    return need <= h;
}
int min_speed(vector<int> p, int h) {
    int lo = 1, hi = *max_element(p.begin(), p.end()), ans = hi;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (ok(p, h, mid)) { ans = mid; hi = mid - 1; }
        else lo = mid + 1;
    }
    return ans;
}`,
      typescript: `function minSpeed(piles: number[], h: number) {
  const ok = (v: number) =>
    piles.reduce((s, p) => s + Math.ceil(p / v), 0) <= h;
  let lo = 1, hi = Math.max(...piles), ans = hi;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (ok(mid)) {
      ans = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return ans;
}`,
    },
    quiz: [
      {
        id: "bsa1",
        prompt: "答案上二分能用的前提？",
        options: ["資料已排序", "可行與否對答案單調", "圖是 DAG", "必須是比較排序"],
        answer: 1,
        explanation: "搜的是答案軸，不是原陣列下標。",
      },
      {
        id: "bsa2",
        prompt: "求最小可行 x，check(mid) 為真時？",
        options: ["lo = mid+1", "hi = mid-1 並記下 ans", "直接回傳 mid-1", "放棄二分"],
        answer: 1,
        explanation: "還可能有更小的可行解。",
      },
      {
        id: "bsa3",
        prompt: "Koko 一次 check 的時間？",
        options: ["Θ(1)", "Θ(n) 掃過每堆", "Θ(n log n)", "Θ(n²)"],
        answer: 1,
        explanation: "對每個 pile 算 ceil(p/v)。",
      },
    ],
    related: ["binary-search", "quickselect", "lis"],
  },
];
