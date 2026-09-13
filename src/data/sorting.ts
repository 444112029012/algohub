import type { Algorithm } from "./types";

export const sortingLessons: Algorithm[] = [
  {
    slug: "merge-sort",
    name: "合併排序",
    english: "Merge Sort",
    category: "sorting",
    examWeight: "極高",
    tags: ["分治", "穩定排序", "遞迴"],
    summary:
      "把陣列對半切開、各自排好，再用線性時間合併兩條已排序序列。時間永遠 Θ(n log n)，是研究所對照 Quick Sort / Heap Sort 的基準答案。",
    idea: "分治法：T(n) = 2T(n/2) + Θ(n)。切半只要常數時間，真正的工作在合併。因為合併時「左邊 ≤ 右邊才取左邊」，相等元素不會翻轉相對次序，所以穩定。",
    whenToUse: [
      "需要保證最壞情況也是 O(n log n)",
      "需要穩定排序（例如先依科目、再依姓名）",
      "外部排序：資料在磁碟上，合併排序天生適合多路合併",
    ],
    examTips: [
      "遞迴樹有 log n 層，每層合併總成本 Θ(n) → Θ(n log n)。",
      "額外空間通常 Θ(n)（暫存陣列）。若題目問「原地」，標準實作不算。",
      "和 Quick Sort 比較：Merge 最壞較優、穩定、但不是原地；Quick 平均常數較小、原地、不穩定。",
      "主定理：a=2, b=2, f(n)=Θ(n)，n^{log_b a}=n，屬情況 2。",
    ],
    pitfalls: [
      "合併時若寫成 < 而不是 ≤，會失去穩定性。",
      "忘記把左或右半剩餘元素拷回去。",
      "遞迴邊界寫成 n==0 而不是 n<=1。",
    ],
    complexity: {
      timeBest: "Θ(n log n)",
      timeAvg: "Θ(n log n)",
      timeWorst: "Θ(n log n)",
      space: "Θ(n)",
      stable: true,
      inPlace: false,
    },
    complexityNote:
      "無論輸入是否已排序，分割深度與每層合併量都一樣，因此最好、平均、最壞同階。",
    workedExample: {
      title: "手算 [38, 27, 43, 3, 9, 82, 10]",
      input: "[38, 27, 43, 3, 9, 82, 10]",
      steps: [
        {
          title: "一路切半",
          detail:
            "[38,27,43,3,9,82,10] → [38,27,43] 與 [3,9,82,10] → 再切成 [38]、[27,43]、[3,9]、[82,10] → 直到單元素。",
        },
        {
          title: "合併最底層",
          detail:
            "[27] 與 [43] → [27,43]；[3] 與 [9] → [3,9]；[82] 與 [10] → [10,82]。",
        },
        {
          title: "再上一層",
          detail:
            "[38] 與 [27,43] → 比較 38 與 27，寫入 27；38 與 43，寫入 38；剩餘 43 → [27,38,43]。[3,9] 與 [10,82] → [3,9,10,82]。",
        },
        {
          title: "最後合併",
          detail:
            "左 [27,38,43] 右 [3,9,10,82]：3, 9, 10, 27, 38, 43, 82。",
        },
      ],
      result: "[3, 9, 10, 27, 38, 43, 82]",
    },
    visualizer: "array",
    pseudocode: `MERGE-SORT(A, lo, hi)
  if lo ≥ hi: return
  mid ← ⌊(lo + hi) / 2⌋
  MERGE-SORT(A, lo, mid)
  MERGE-SORT(A, mid + 1, hi)
  MERGE(A, lo, mid, hi)

MERGE(A, lo, mid, hi)
  L ← A[lo..mid]
  R ← A[mid+1..hi]
  i ← j ← 1
  for k ← lo to hi
    if L 已用完: A[k] ← R[j]; j ← j + 1
    else if R 已用完: A[k] ← L[i]; i ← i + 1
    else if L[i] ≤ R[j]: A[k] ← L[i]; i ← i + 1
    else: A[k] ← R[j]; j ← j + 1`,
    codes: {
      python: `def merge_sort(a: list[int]) -> list[int]:
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    return merge(left, right)

def merge(left: list[int], right: list[int]) -> list[int]:
    i = j = 0
    out: list[int] = []
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:          # ≤ 才能穩定
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:])
    out.extend(right[j:])
    return out

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

void merge_range(vector<int>& a, int lo, int mid, int hi) {
    vector<int> L(a.begin() + lo, a.begin() + mid + 1);
    vector<int> R(a.begin() + mid + 1, a.begin() + hi + 1);
    int i = 0, j = 0, k = lo;
    while (i < (int)L.size() && j < (int)R.size()) {
        if (L[i] <= R[j]) a[k++] = L[i++];
        else a[k++] = R[j++];
    }
    while (i < (int)L.size()) a[k++] = L[i++];
    while (j < (int)R.size()) a[k++] = R[j++];
}

void merge_sort(vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    merge_sort(a, lo, mid);
    merge_sort(a, mid + 1, hi);
    merge_range(a, lo, mid, hi);
}`,
      typescript: `function mergeSort(a: number[]): number[] {
  if (a.length <= 1) return a;
  const mid = Math.floor(a.length / 2);
  return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));
}

function merge(left: number[], right: number[]): number[] {
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}`,
    },
    quiz: [
      {
        id: "ms1",
        prompt: "Merge Sort 最好與最壞時間複雜度分別是？",
        options: [
          "Θ(n)、Θ(n log n)",
          "Θ(n log n)、Θ(n log n)",
          "Θ(n log n)、Θ(n²)",
          "Θ(n)、Θ(n²)",
        ],
        answer: 1,
        explanation: "每層合併總是 Θ(n)，層數 log n，與輸入順序無關。",
      },
      {
        id: "ms2",
        prompt: "下列何者正確？",
        options: [
          "Merge Sort 是原地且穩定",
          "Merge Sort 是原地但不穩定",
          "Merge Sort 通常需要額外 Θ(n) 空間且穩定",
          "Merge Sort 最壞是 Θ(n²)",
        ],
        answer: 2,
        explanation: "標準合併需要暫存陣列；用 ≤ 比較可保持穩定。",
      },
      {
        id: "ms3",
        prompt: "主定理套用 T(n)=2T(n/2)+Θ(n) 屬於哪一種情況？",
        options: ["情況 1（葉節點主導）", "情況 2（每層同階）", "情況 3（根節點主導）", "無法套用"],
        answer: 1,
        explanation: "n^{log_2 2}=n 與 f(n)=Θ(n) 同階，情況 2，答案 Θ(n log n)。",
      },
    ],
    related: ["quick-sort", "heap-sort", "master-theorem"],
  },
  {
    slug: "quick-sort",
    name: "快速排序",
    english: "Quick Sort",
    category: "sorting",
    examWeight: "極高",
    tags: ["分治", "原地", "期望 O(n log n)"],
    summary:
      "選一個樞紐，把較小的丟左邊、較大的丟右邊，再對兩側遞迴。實務上常數很小，但最壞會退化成 Θ(n²)，是選擇題最愛挖的陷阱。",
    idea: "分割（partition）是核心：樞紐會被放到「最終位置」。之後左邊全 ≤ pivot、右邊全 ≥ pivot，不必再跨側比較。平均遞迴樹平衡，深度 O(log n)；若每次都切成 1 與 n-1（已排序 + 固定取最右），就變成選擇排序等級的 n²。",
    whenToUse: [
      "記憶體內排序、不要求穩定",
      "平均效能優先（標準庫常混 introsort）",
      "需要原地、額外空間只要遞迴堆疊",
    ],
    examTips: [
      "最壞 Θ(n²)：已排序或全部相等 + 固定端點當 pivot。",
      "改善：隨機 pivot、三數取中、小區間改插入排序、Introsort（退化改 heap）。",
      "期望時間 Θ(n log n)，隨機化後高機率接近平衡。",
      "不是穩定排序。額外空間：Lomuto/Hoare 為 O(log n) 平均堆疊，最壞 O(n)。",
      "Quick Select 找第 k 小是同一個 partition，平均 Θ(n)。",
    ],
    pitfalls: [
      "把平均複雜度講成最壞複雜度。",
      "以為「一定比 Merge Sort 快」——最壞與穩定性都可能讓它輸。",
      "Hoare 與 Lomuto 的索引細節搞混，容易無限遞迴。",
    ],
    complexity: {
      timeBest: "Θ(n log n)",
      timeAvg: "Θ(n log n)",
      timeWorst: "Θ(n²)",
      space: "Θ(log n) 平均",
      stable: false,
      inPlace: true,
    },
    complexityNote:
      "最好是每次都對半切；最壞是每次只淘汰樞紐自己。隨機 pivot 把最壞變成極低機率事件。",
    workedExample: {
      title: "Lomuto 分割 [38, 27, 43, 3, 9, 82, 10]",
      input: "pivot = 10（最右）",
      steps: [
        {
          title: "掃描並交換",
          detail:
            "i 指向「下一個 ≤ pivot 應放置的位置」。27、3、9 都 ≤ 10，依序換到左邊；38、43、82 留在右側。",
        },
        {
          title: "樞紐就位",
          detail:
            "最後把 pivot 與 i 交換，得到 [9, 27, 3, 10, 43, 82, 38]，10 已在最終位置（索引 3）。",
        },
        {
          title: "遞迴兩側",
          detail:
            "左 [9,27,3] 再以 3 為樞紐…；右 [43,82,38] 以 38 為樞紐。直到區間長度 ≤ 1。",
        },
      ],
      result: "[3, 9, 10, 27, 38, 43, 82]",
    },
    visualizer: "array",
    pseudocode: `QUICKSORT(A, lo, hi)
  if lo < hi
    p ← PARTITION(A, lo, hi)   // pivot 的最終下標
    QUICKSORT(A, lo, p - 1)
    QUICKSORT(A, p + 1, hi)

PARTITION(A, lo, hi)            // Lomuto
  pivot ← A[hi]
  i ← lo
  for j ← lo to hi - 1
    if A[j] ≤ pivot
      交換 A[i], A[j]
      i ← i + 1
  交換 A[i], A[hi]
  return i`,
    codes: {
      python: `def quick_sort(a: list[int], lo=0, hi=None) -> None:
    if hi is None:
        hi = len(a) - 1
    if lo >= hi:
        return
    p = partition(a, lo, hi)
    quick_sort(a, lo, p - 1)
    quick_sort(a, p + 1, hi)

def partition(a: list[int], lo: int, hi: int) -> int:
    pivot = a[hi]
    i = lo
    for j in range(lo, hi):
        if a[j] <= pivot:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    return i`,
      cpp: `int partition(vector<int>& a, int lo, int hi) {
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; ++j)
        if (a[j] <= pivot) swap(a[i++], a[j]);
    swap(a[i], a[hi]);
    return i;
}
void quick_sort(vector<int>& a, int lo, int hi) {
    if (lo >= hi) return;
    int p = partition(a, lo, hi);
    quick_sort(a, lo, p - 1);
    quick_sort(a, p + 1, hi);
}`,
      typescript: `function partition(a: number[], lo: number, hi: number) {
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] <= pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  return i;
}
function quickSort(a: number[], lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  const p = partition(a, lo, hi);
  quickSort(a, lo, p - 1);
  quickSort(a, p + 1, hi);
}`,
    },
    quiz: [
      {
        id: "qs1",
        prompt: "對已排序陣列使用「永遠取最右當 pivot」的 Quick Sort，最壞複雜度？",
        options: ["Θ(n)", "Θ(n log n)", "Θ(n²)", "Θ(n log log n)"],
        answer: 2,
        explanation: "每次分割都得到 (n-1)+0，遞迴深度 n，總比較約 n²/2。",
      },
      {
        id: "qs2",
        prompt: "Quick Sort 一般實作的性質？",
        options: [
          "穩定、原地",
          "不穩定、原地",
          "穩定、非原地",
          "不穩定、需要 Θ(n) 額外陣列",
        ],
        answer: 1,
        explanation: "partition 會打亂相等元素次序；只需常數額外變數加遞迴堆疊。",
      },
      {
        id: "qs3",
        prompt: "下列哪項不能改善 Quick Sort 最壞情況？",
        options: [
          "隨機選擇 pivot",
          "三數取中",
          "改成永遠取第一個元素當 pivot",
          "Introsort：深度過深改 Heap Sort",
        ],
        answer: 2,
        explanation: "固定取端點正是造成最壞輸入的原因。",
      },
    ],
    related: ["merge-sort", "heap-sort", "binary-search"],
  },
  {
    slug: "heap-sort",
    name: "堆積排序",
    english: "Heap Sort",
    category: "sorting",
    examWeight: "極高",
    tags: ["選擇排序", "原地", "最壞 O(n log n)"],
    summary:
      "把陣列建成 Max-Heap，反覆把堆頂（最大值）換到尾端並縮小堆。保證 Θ(n log n)、原地，但不穩定。常和「heap 的陣列表示」一起考。",
    idea: "完全二元樹用陣列存：左孩 2i+1、右孩 2i+2、父 ⌊(i-1)/2⌋。建堆從最後一個非葉節點 ⌊n/2⌋-1 往根做 heapify，成本只有 Θ(n) 不是 Θ(n log n)。之後 n-1 次取出，每次 O(log n)。",
    whenToUse: [
      "需要最壞 O(n log n) 且希望原地",
      "不要求穩定",
      "Priority Queue / 圖演算法的零件（但排序本身 cache 表現常不如 Quick）",
    ],
    examTips: [
      "建堆 Θ(n)：高度 h 的節點約 n/2^{h+1} 個，heapify 成本 O(h)，級數收斂到 O(n)。",
      "整段 Heap Sort 仍是 Θ(n log n)，因為後面 n 次 extract-max。",
      "不穩定：相等元素可能在下沉時換邊。",
      "Max-Heap 做遞增排序；Min-Heap 做遞減。",
      "插入 O(log n)、取最值 O(1)、刪最值 O(log n)。",
    ],
    pitfalls: [
      "以為 Build-Heap 是 O(n log n)（逐一插入才是）。",
      "孩子下標寫成 2i、2i+1（那是 1-based）。0-based 是 2i+1、2i+2。",
      "heapify 完沒有繼續對被換下來的子樹遞迴。",
    ],
    complexity: {
      timeBest: "Θ(n log n)",
      timeAvg: "Θ(n log n)",
      timeWorst: "Θ(n log n)",
      space: "Θ(1)",
      stable: false,
      inPlace: true,
    },
    complexityNote:
      "建堆線性，n 次下沉各 O(log n)。額外空間只有幾個索引變數。",
    workedExample: {
      title: "陣列 [38, 27, 43, 3, 9, 82, 10] 建 Max-Heap",
      input: "最後非葉 = ⌊7/2⌋-1 = 2，從索引 2 往 0 heapify",
      steps: [
        {
          title: "heapify(2)：43 的孩子 82、10",
          detail: "82 最大，與 43 交換 → [38, 27, 82, 3, 9, 43, 10]。",
        },
        {
          title: "heapify(1)：27 的孩子 3、9",
          detail: "27 已最大，不動。",
        },
        {
          title: "heapify(0)：38 的孩子 27、82",
          detail: "與 82 交換 → [82, 27, 38, 3, 9, 43, 10]，再對索引 2 下沉，38 與 43 交換 → [82, 27, 43, 3, 9, 38, 10]。",
        },
        {
          title: "反覆取出",
          detail: "82 與最後元素交換並縮小堆，再 heapify 根，直到堆大小為 1。",
        },
      ],
      result: "[3, 9, 10, 27, 38, 43, 82]",
    },
    visualizer: "array",
    pseudocode: `HEAP-SORT(A)
  BUILD-MAX-HEAP(A)
  for i ← n downto 2
    交換 A[1], A[i]
    heap-size ← heap-size - 1
    MAX-HEAPIFY(A, 1)

BUILD-MAX-HEAP(A)
  for i ← ⌊n/2⌋ downto 1
    MAX-HEAPIFY(A, i)

MAX-HEAPIFY(A, i)
  l ← LEFT(i); r ← RIGHT(i)
  largest ← i 與孩子中值最大者
  if largest ≠ i
    交換 A[i], A[largest]
    MAX-HEAPIFY(A, largest)`,
    codes: {
      python: `def heap_sort(a: list[int]) -> None:
    n = len(a)
    for i in range(n // 2 - 1, -1, -1):
        heapify(a, n, i)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        heapify(a, end, 0)

def heapify(a: list[int], size: int, i: int) -> None:
    largest = i
    l, r = 2 * i + 1, 2 * i + 2
    if l < size and a[l] > a[largest]:
        largest = l
    if r < size and a[r] > a[largest]:
        largest = r
    if largest != i:
        a[i], a[largest] = a[largest], a[i]
        heapify(a, size, largest)`,
      cpp: `void heapify(vector<int>& a, int size, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest != i) {
        swap(a[i], a[largest]);
        heapify(a, size, largest);
    }
}
void heap_sort(vector<int>& a) {
    int n = (int)a.size();
    for (int i = n / 2 - 1; i >= 0; --i) heapify(a, n, i);
    for (int end = n - 1; end > 0; --end) {
        swap(a[0], a[end]);
        heapify(a, end, 0);
    }
}`,
      typescript: `function heapify(a: number[], size: number, i: number) {
  let largest = i;
  const l = 2 * i + 1, r = 2 * i + 2;
  if (l < size && a[l] > a[largest]) largest = l;
  if (r < size && a[r] > a[largest]) largest = r;
  if (largest !== i) {
    [a[i], a[largest]] = [a[largest], a[i]];
    heapify(a, size, largest);
  }
}
function heapSort(a: number[]) {
  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    heapify(a, end, 0);
  }
}`,
    },
    quiz: [
      {
        id: "hs1",
        prompt: "在已經放好 n 個元素的陣列上 Build-Heap，複雜度？",
        options: ["Θ(log n)", "Θ(n)", "Θ(n log n)", "Θ(n²)"],
        answer: 1,
        explanation: "由下往上 heapify，成本是 Σ O(h)·n/2^{h+1} = O(n)。",
      },
      {
        id: "hs2",
        prompt: "0-based 陣列中，索引 i 的右孩子是？",
        options: ["2i", "2i+1", "2i+2", "⌊i/2⌋"],
        answer: 2,
        explanation: "左 2i+1、右 2i+2；1-based 才是 2i 與 2i+1。",
      },
      {
        id: "hs3",
        prompt: "Heap Sort 的穩定度與額外空間？",
        options: [
          "穩定、Θ(n)",
          "穩定、Θ(1)",
          "不穩定、Θ(1)",
          "不穩定、Θ(n)",
        ],
        answer: 2,
        explanation: "原地不穩定，這是和 Merge Sort 對照的標準答案。",
      },
    ],
    related: ["merge-sort", "quick-sort", "dijkstra"],
  },
  {
    slug: "binary-search",
    name: "二分搜尋",
    english: "Binary Search",
    category: "search",
    examWeight: "高",
    tags: ["有序", "對數時間", "邊界"],
    summary:
      "在已排序序列上每次看中間，丟掉必定不含答案的一半。複雜度 Θ(log n)，研究所常考「能不能用」以及 lo/hi 邊界寫法。",
    idea: "若 A 遞增且目標為 t：比較 A[mid] 與 t。較小就丟左半（含 mid），較大就丟右半。循環不變量：若 t 存在，必在 [lo, hi] 內。",
    whenToUse: [
      "靜態、已排序的陣列",
      "單調謂詞上的參數搜尋（答案具單調性）",
      "lower_bound / upper_bound（第一個 ≥x、第一個 >x）",
    ],
    examTips: [
      "前提是單調。未排序不能二分。",
      "mid 用 lo+(hi-lo)/2 避免溢位（考試口頭提即可）。",
      "找邊界：要找第一個 ≥ t 時，相等也要收右界。",
      "時間 Θ(log n)，比較次數最多 ⌊log₂ n⌋+1。",
      "有序陣列插入仍可能 O(n)，所以「動態有序」常用平衡樹 / TreeMap。",
    ],
    pitfalls: [
      "while lo < hi 與 lo <= hi 混用，漏掉單元素區間。",
      "hi = mid-1 寫成 hi = mid 造成無限迴圈。",
      "對未排序資料硬套二分。",
    ],
    complexity: {
      timeBest: "Θ(1)",
      timeAvg: "Θ(log n)",
      timeWorst: "Θ(log n)",
      space: "Θ(1) 迭代 / Θ(log n) 遞迴",
    },
    complexityNote: "最好一次命中中點；最壞每次只少一半。",
    workedExample: {
      title: "在 [3, 9, 10, 27, 38, 43, 82] 找 27",
      input: "lo=0, hi=6, target=27",
      steps: [
        {
          title: "第一次",
          detail: "mid=3，A[3]=27，命中。",
        },
        {
          title: "若找 38",
          detail:
            "mid=3 → 27<38，lo=4；mid=5 → 43>38，hi=4；mid=4 → 38，命中。",
        },
        {
          title: "若找 8（不存在）",
          detail:
            "mid=3 → 27>8，hi=2；mid=1 → 9>8，hi=0；mid=0 → 3<8，lo=1；lo>hi，失敗。",
        },
      ],
      result: "27 在索引 3",
    },
    visualizer: "array",
    visualizerSeed: "sorted",
    pseudocode: `BINARY-SEARCH(A, t)
  lo ← 1; hi ← n
  while lo ≤ hi
    mid ← ⌊(lo + hi) / 2⌋
    if A[mid] = t: return mid
    else if A[mid] < t: lo ← mid + 1
    else: hi ← mid - 1
  return NOT-FOUND`,
    codes: {
      python: `def binary_search(a: list[int], t: int) -> int:
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == t:
            return mid
        if a[mid] < t:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

def lower_bound(a: list[int], t: int) -> int:
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < t:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
      cpp: `int binary_search_idx(const vector<int>& a, int t) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == t) return mid;
        if (a[mid] < t) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      typescript: `function binarySearch(a: number[], t: number) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === t) return mid;
    if (a[mid] < t) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    },
    quiz: [
      {
        id: "bs1",
        prompt: "n=16 的最壞比較次數數量級？",
        options: ["4", "8", "16", "32"],
        answer: 0,
        explanation: "log₂ 16 = 4，最壞約 ⌊log₂ n⌋+1 次，數量級就是 4。",
      },
      {
        id: "bs2",
        prompt: "二分搜尋的必要前提？",
        options: ["資料在雜湊表", "序列已依搜尋鍵單調排序", "資料是 Max-Heap", "圖是 DAG"],
        answer: 1,
        explanation: "必須能判斷答案落在中點的哪一側。",
      },
      {
        id: "bs3",
        prompt: "lower_bound（第一個 ≥ t）在相等時應？",
        options: [
          "直接回傳 mid 結束",
          "把右界收到 mid（繼續往左找）",
          "把左界推到 mid+1",
          "改線性掃描",
        ],
        answer: 1,
        explanation: "相等還可能有更左邊的相同值，要收 hi=mid。",
      },
    ],
    related: ["merge-sort", "quick-sort", "master-theorem"],
  },
];
