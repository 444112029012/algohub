import type { Algorithm } from "./types";

export const greedyExtraLessons: Algorithm[] = [
  {
    slug: "activity-selection",
    name: "活動選擇",
    english: "Activity Selection",
    category: "greedy",
    examWeight: "極高",
    tags: ["貪婪最優", "區間", "排序"],
    summary:
      "一條時間軸上選最多互不重疊的活動。正確貪婪是「每次選結束最早的」。這題貪婪就是 OPT，常拿來對照子集覆蓋「貪婪不是最優」。",
    idea: "把活動依結束時間排序。第一個結束的一定在某最優解裡（換元論證：任何最優解的第一件都可以換成它，不會更差）。刪掉衝突的，對剩餘子問題遞迴。",
    whenToUse: [
      "教室排課、會議廳、單處理器不搶佔",
      "證明「什麼時候貪婪有最優子結構」",
    ],
    examTips: [
      "依開始時間或依長度貪婪都會錯，要能舉反例。",
      "加權活動選擇（每件有價值）改 DP，O(n log n) 加二分。",
      "區間圖著色 = 最大重疊數 = 貪婪掃線。",
    ],
    pitfalls: [
      "選最短的或選開始最早的。",
      "結束相同時沒定義平手規則導致和解答差一件（件數仍應相同）。",
    ],
    complexity: {
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "Θ(n)",
    },
    complexityNote: "瓶頸是排序；已排序後線性掃描。",
    workedExample: {
      title: "CLRS 縮小版",
      input: "A[1,4] B[3,5] C[0,6] D[5,7] E[5,9] F[8,11] G[8,12] H[12,16]",
      steps: [
        { title: "依結束排序", detail: "A4, B5, C6, D7, E9, F11, G12, H16。" },
        { title: "選 A", detail: "B、C 與 A 重疊，捨棄。" },
        { title: "選 D", detail: "E 與 D 重疊。" },
        { title: "選 F 再 H", detail: "G 與 F 重疊。答案 A,D,F,H 共 4 件。" },
      ],
      result: "{A, D, F, H}",
    },
    visualizer: "intervals",
    pseudocode: `ACTIVITY-SELECTOR(s, f)          // f 已遞增
  A ← {1}
  k ← 1
  for i ← 2 to n
    if s[i] ≥ f[k]
      A ← A ∪ {i}
      k ← i
  return A`,
    codes: {
      python: `def activity_selection(acts: list[tuple[str, int, int]]) -> list[str]:
    acts = sorted(acts, key=lambda x: x[2])
    picked: list[str] = []
    last_end = -10**9
    for name, start, end in acts:
        if start >= last_end:
            picked.append(name)
            last_end = end
    return picked`,
      cpp: `vector<int> activity(vector<int> s, vector<int> f) {
    int n = (int)s.size();
    vector<int> idx(n);
    iota(idx.begin(), idx.end(), 0);
    sort(idx.begin(), idx.end(), [&](int a, int b) { return f[a] < f[b]; });
    vector<int> A;
    int last = -1;
    for (int i : idx)
        if (last < 0 || s[i] >= f[last]) {
            A.push_back(i);
            last = i;
        }
    return A;
}`,
      typescript: `function activitySelection(acts: { name: string; start: number; end: number }[]) {
  const sorted = [...acts].sort((a, b) => a.end - b.end);
  const picked: string[] = [];
  let last = -Infinity;
  for (const a of sorted) {
    if (a.start >= last) {
      picked.push(a.name);
      last = a.end;
    }
  }
  return picked;
}`,
    },
    quiz: [
      {
        id: "as1",
        prompt: "不重疊最多活動的正確貪婪鍵？",
        options: ["開始最早", "長度最短", "結束最早", "價值密度"],
        answer: 2,
        explanation: "結束最早留下最長的剩餘時間軸。",
      },
      {
        id: "as2",
        prompt: "每件活動有不同價值時？",
        options: ["同一貪婪仍最優", "改 DP（加權區間）", "Dijkstra", "3-SAT"],
        answer: 1,
        explanation: "沒有「結束最早一定最優」的換元，要用 DP。",
      },
      {
        id: "as3",
        prompt: "這題貪婪相對子集覆蓋？",
        options: [
          "兩者都保證最優",
          "活動選擇最優，子集覆蓋只近似",
          "兩者都只有 H(n)",
          "活動選擇 NP-hard",
        ],
        answer: 1,
        explanation: "這正是對照題的標準答案。",
      },
    ],
    related: ["set-cover", "fractional-knapsack", "huffman"],
  },
  {
    slug: "fractional-knapsack",
    name: "分數背包",
    english: "Fractional Knapsack",
    category: "greedy",
    examWeight: "高",
    tags: ["貪婪最優", "密度", "可切割"],
    summary:
      "物品可切，容量 W，最大價值。依價值密度 v/w 由大到小拿，最後一件可切。0/1 不能這樣做。",
    idea: "最優解一定優先把密度高的拿滿。若某最優解先拿了密度較低的，可以換成密度高的提高總價值（交換論證）。",
    whenToUse: [
      "原料可分割、金沙可秤重",
      "對照 0/1 背包為什麼必須 DP",
    ],
    examTips: [
      "時間 O(n log n) 排序。",
      "0/1 用密度貪婪有反例。",
      "無限背包／零錢貪婪只在正規幣制才對。",
    ],
    pitfalls: ["0/1 也用密度貪婪。"],
    complexity: {
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "Θ(n)",
    },
    complexityNote: "排序密度後線性掃描。",
    workedExample: {
      title: "W=50，(w,v)=(10,60),(20,100),(30,120)",
      input: "密度 6、5、4",
      steps: [
        { title: "A 全拿", detail: "重 10，價值 60，剩 40。" },
        { title: "B 全拿", detail: "重 20，價值 100，剩 20。" },
        { title: "C 切 20/30", detail: "價值 80。總計 240。" },
      ],
      result: "240；若 0/1 只能 A+B=160 或 B+C=220",
    },
    visualizer: "table",
    pseudocode: `FRACTIONAL-KNAPSACK(items, W)
  依 v/w 遞減排序
  value ← 0
  for each item
    take ← min(item.w, W)
    value ← value + take * (item.v / item.w)
    W ← W - take
    if W = 0: break
  return value`,
    codes: {
      python: `def fractional_knapsack(items: list[tuple[int, int]], W: int) -> float:
    items = sorted(items, key=lambda iv: iv[1] / iv[0], reverse=True)
    value = 0.0
    for w, v in items:
        take = min(w, W)
        value += take * (v / w)
        W -= take
        if W == 0:
            break
    return value`,
      cpp: `double frac_knapsack(vector<pair<int,int>> it, int W) {
    sort(it.begin(), it.end(), [](auto& a, auto& b){
        return (double)a.second/a.first > (double)b.second/b.first;
    });
    double val=0;
    for (auto [w,v]: it) {
        int take=min(w,W);
        val += take * (v/(double)w);
        W -= take; if (!W) break;
    }
    return val;
}`,
      typescript: `function fractionalKnapsack(items: { w: number; v: number }[], W: number) {
  const sorted = [...items].sort((a, b) => b.v / b.w - a.v / a.w);
  let value = 0;
  for (const it of sorted) {
    const take = Math.min(it.w, W);
    value += take * (it.v / it.w);
    W -= take;
    if (!W) break;
  }
  return value;
}`,
    },
    quiz: [
      {
        id: "fk1",
        prompt: "分數背包的貪婪鍵？",
        options: ["重量最輕", "價值最高", "價值／重量", "結束時間"],
        answer: 2,
        explanation: "密度。",
      },
      {
        id: "fk2",
        prompt: "同一組物品改成 0/1，密度貪婪？",
        options: ["仍最優", "可能更差，要用 DP", "改 Huffman", "改 BFS"],
        answer: 1,
        explanation: "不能切時交換論證失敗。",
      },
      {
        id: "fk3",
        prompt: "時間？",
        options: ["Θ(nW)", "O(n log n)", "Θ(2^n)", "Θ(n³)"],
        answer: 1,
        explanation: "排序。",
      },
    ],
    related: ["knapsack", "activity-selection", "unbounded-knapsack"],
  },
];
