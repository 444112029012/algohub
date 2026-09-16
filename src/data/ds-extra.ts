import type { Algorithm } from "./types";

export const dsExtraLessons: Algorithm[] = [
  {
    slug: "heap",
    name: "堆積（優先佇列）",
    english: "Binary Heap / Priority Queue",
    category: "ds",
    examWeight: "極高",
    tags: ["完全二元樹", "優先佇列", "O(log n)"],
    summary:
      "用陣列存完全二元樹，父節點 ≥（或 ≤）孩子。取最值 O(1)，插入／刪最值 O(log n)，一次建堆 Θ(n)。這是 Dijkstra、Huffman、Heap Sort 的零件，要和「堆積排序」分開記。",
    idea: "0-based：左孩 2i+1、右孩 2i+2、父 ⌊(i-1)/2⌋。插入放在尾端再上浮；刪最值把尾端搬到根再下沉。Build-Heap 從最後非葉往根 heapify，高度 h 的節點約 n/2^{h+1}，總成本 Θ(n)。",
    whenToUse: [
      "重複取最小／最大：排程、Huffman、Dijkstra、Prim",
      "需要 k 個最大：大小 k 的 heap",
      "不需要搜任意鍵（那是平衡樹）",
    ],
    examTips: [
      "陣列表示、孩子下標是送分題。1-based 才是 2i、2i+1。",
      "Build Θ(n) ≠ n 次 insert 的 Θ(n log n)。",
      "Heap Sort 用同一結構，但不穩定。PQ 本身不管穩定。",
      "decrease-key：binary heap O(log n)（要有 handle）；Fibonacci heap 均攤 O(1)，Dijkstra 考口頭。",
    ],
    pitfalls: [
      "0-based 寫成 2i、2i+1。",
      "以為建堆是 O(n log n)。",
      "把 Heap 和 BST 搞混：heap 不支援任意鍵搜尋。",
    ],
    complexity: {
      timeBest: "find-min Θ(1)",
      timeAvg: "insert／extract Θ(log n)",
      timeWorst: "build Θ(n)",
      space: "Θ(n)",
    },
    complexityNote: "高度 ⌊log₂ n⌋。合併兩個 heap：binary heap 要 Θ(n)，binomial／Fibonacci 較優，考試較少。",
    workedExample: {
      title: "Max-Heap 插入 38, 27, 43, 82 再取出",
      input: "空堆",
      steps: [
        { title: "插 38、27", detail: "27 當左孩，27<38，不必上浮。[38,27]" },
        { title: "插 43", detail: "43 當右孩 >38，與根交換。[43,27,38]" },
        { title: "插 82", detail: "82 先當 27 的左孩，上浮過 27、再過 43。[82,43,38,27]" },
        { title: "extract-max", detail: "82 與 27 換再縮小，27 下沉與 43 換。[43,27,38]" },
      ],
      result: "取出 82，堆剩 [43, 27, 38]",
    },
    visualizer: "array",
    pseudocode: `INSERT(A, x)
  A.append(x)
  i ← |A|
  while i > 1 and A[PARENT(i)] < A[i]
    交換 A[i], A[PARENT(i)]
    i ← PARENT(i)

EXTRACT-MAX(A)
  max ← A[1]
  A[1] ← A[n]; n ← n-1
  MAX-HEAPIFY(A, 1)
  return max

BUILD-MAX-HEAP(A)
  for i ← ⌊n/2⌋ downto 1
    MAX-HEAPIFY(A, i)`,
    codes: {
      python: `class MaxHeap:
    def __init__(self):
        self.a: list[int] = []

    def _swim(self, i: int) -> None:
        while i > 0:
            p = (i - 1) // 2
            if self.a[p] >= self.a[i]:
                break
            self.a[p], self.a[i] = self.a[i], self.a[p]
            i = p

    def push(self, x: int) -> None:
        self.a.append(x)
        self._swim(len(self.a) - 1)

    def pop(self) -> int:
        a = self.a
        a[0], a[-1] = a[-1], a[0]
        x = a.pop()
        i, n = 0, len(a)
        while True:
            l, r, m = 2 * i + 1, 2 * i + 2, i
            if l < n and a[l] > a[m]:
                m = l
            if r < n and a[r] > a[m]:
                m = r
            if m == i:
                break
            a[i], a[m] = a[m], a[i]
            i = m
        return x`,
      cpp: `struct MaxHeap {
    vector<int> a;
    void push(int x) {
        a.push_back(x);
        int i = (int)a.size() - 1;
        while (i > 0) {
            int p = (i - 1) / 2;
            if (a[p] >= a[i]) break;
            swap(a[p], a[i]); i = p;
        }
    }
    int pop() {
        int x = a[0];
        a[0] = a.back(); a.pop_back();
        int i = 0, n = (int)a.size();
        while (true) {
            int l = 2*i+1, r = 2*i+2, m = i;
            if (l < n && a[l] > a[m]) m = l;
            if (r < n && a[r] > a[m]) m = r;
            if (m == i) break;
            swap(a[i], a[m]); i = m;
        }
        return x;
    }
};`,
      typescript: `class MaxHeap {
  a: number[] = [];
  push(x: number) {
    this.a.push(x);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.a[p] >= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]];
    const x = a.pop()!;
    let i = 0;
    while (true) {
      const l = 2 * i + 1, r = 2 * i + 2;
      let m = i;
      if (l < a.length && a[l] > a[m]) m = l;
      if (r < a.length && a[r] > a[m]) m = r;
      if (m === i) break;
      [a[i], a[m]] = [a[m], a[i]];
      i = m;
    }
    return x;
  }
}`,
    },
    quiz: [
      {
        id: "hp1",
        prompt: "0-based 陣列，索引 i 的左孩？",
        options: ["2i", "2i+1", "2i+2", "⌊i/2⌋"],
        answer: 1,
        explanation: "左 2i+1、右 2i+2。1-based 才是 2i。",
      },
      {
        id: "hp2",
        prompt: "Build-Heap 時間？",
        options: ["Θ(n log n)", "Θ(n)", "Θ(log n)", "Θ(n²)"],
        answer: 1,
        explanation: "從非葉往上 heapify，級數收斂到線性。",
      },
      {
        id: "hp3",
        prompt: "Binary heap 支援高效的任意鍵搜尋？",
        options: ["O(log n) 像 BST", "否，最壞要掃整個陣列", "O(1)", "只有 Max-Heap 可以"],
        answer: 1,
        explanation: "heap 只保證根是最值，中序不是排序。",
      },
    ],
    related: ["heap-sort", "dijkstra", "huffman"],
  },
];
