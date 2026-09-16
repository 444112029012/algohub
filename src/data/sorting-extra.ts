import type { Algorithm } from "./types";

export const sortingExtraLessons: Algorithm[] = [
  {
    slug: "bubble-sort",
    name: "氣泡排序",
    english: "Bubble Sort",
    category: "sorting",
    examWeight: "中",
    tags: ["穩定排序", "原地", "交換"],
    summary:
      "反覆掃描相鄰元素，大的往右「浮」成氣泡。有提早結束時最好 Θ(n)，沒有則永遠 Θ(n²)。選擇題拿來對照穩定／原地／最壞 n²。",
    idea: "第 i 輪保證最大的 i 個已就位在右端。若某一輪零次交換，序列已排序可停。相鄰交換且用 > 而非 ≥，相等元素不翻轉，因此穩定。",
    whenToUse: [
      "教學、證明「相鄰交換 ⇒ 穩定」",
      "n 極小或幾乎已排序（有旗標）",
      "不當正式排序答案——研究所要的是和 Merge/Quick/Heap 對照",
    ],
    examTips: [
      "最好 Θ(n)（已排序 + 提早結束）、平均／最壞 Θ(n²)、空間 Θ(1)、穩定、原地。",
      "交換次數等於逆序對數。已排序逆序對 0。",
      "cocktail shaker 是雙向氣泡，考試較少。",
    ],
    pitfalls: [
      "沒寫提早結束卻宣稱最好 Θ(n)。",
      "用 ≥ 比較會失去穩定。",
    ],
    complexity: {
      timeBest: "Θ(n)",
      timeAvg: "Θ(n²)",
      timeWorst: "Θ(n²)",
      space: "Θ(1)",
      stable: true,
      inPlace: true,
    },
    complexityNote: "最好情況必須偵測「本輪無交換」。否則每輪仍掃完全長，最好也是 Θ(n²)。",
    workedExample: {
      title: "手算 [5, 1, 4, 2, 8]",
      input: "[5, 1, 4, 2, 8]",
      steps: [
        { title: "第 1 輪", detail: "5↔1、5↔4、5↔2，8 已在右。→ [1,4,2,5,8]" },
        { title: "第 2 輪", detail: "4↔2 → [1,2,4,5,8]" },
        { title: "第 3 輪", detail: "已有序，零交換，停止。" },
      ],
      result: "[1, 2, 4, 5, 8]",
    },
    visualizer: "array",
    pseudocode: `BUBBLE-SORT(A)
  n ← |A|
  for i ← n downto 2
    swapped ← false
    for j ← 1 to i-1
      if A[j] > A[j+1]
        交換 A[j], A[j+1]
        swapped ← true
    if not swapped: return`,
    codes: {
      python: `def bubble_sort(a: list[int]) -> None:
    n = len(a)
    for end in range(n, 1, -1):
        swapped = False
        for j in range(end - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            return`,
      cpp: `void bubble_sort(vector<int>& a) {
    for (int n = (int)a.size(); n > 1; --n) {
        bool swapped = false;
        for (int j = 0; j < n - 1; ++j)
            if (a[j] > a[j + 1]) {
                swap(a[j], a[j + 1]);
                swapped = true;
            }
        if (!swapped) return;
    }
}`,
      typescript: `function bubbleSort(a: number[]) {
  for (let n = a.length; n > 1; n--) {
    let swapped = false;
    for (let j = 0; j < n - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) return;
  }
}`,
    },
    quiz: [
      {
        id: "bb1",
        prompt: "氣泡排序（有提早結束）的最好／最壞？",
        options: ["Θ(n)／Θ(n²)", "Θ(n²)／Θ(n²)", "Θ(n log n)／Θ(n²)", "Θ(n)／Θ(n log n)"],
        answer: 0,
        explanation: "已排序掃一輪即可；逆序要 n-1 輪。",
      },
      {
        id: "bb2",
        prompt: "氣泡排序穩定且原地？",
        options: ["穩定、非原地", "不穩定、原地", "穩定、原地", "不穩定、非原地"],
        answer: 2,
        explanation: "相鄰、嚴格大於才換。",
      },
      {
        id: "bb3",
        prompt: "交換次數等於？",
        options: ["n-1", "逆序對數量", "n log n", "最大值"],
        answer: 1,
        explanation: "每個逆序對恰好被相鄰交換消除一次。",
      },
    ],
    related: ["insertion-sort", "selection-sort", "merge-sort"],
  },
  {
    slug: "insertion-sort",
    name: "插入排序",
    english: "Insertion Sort",
    category: "sorting",
    examWeight: "中",
    tags: ["穩定排序", "原地", "幾乎有序"],
    summary:
      "左半維持已排序，每次把下一個元素插入正確位置。幾乎有序時接近線性，Quick / Merge 的小區間收尾常用它。",
    idea: "打牌整理手牌：抽出 key，比它大的已排序元素右移，空位放下 key。用 > 右移（不是 ≥）可穩定。",
    whenToUse: [
      "n 很小（大約 < 20）或幾乎已排序",
      "線上／串流：資料一個一個到",
      "當 Merge/Quick 的 base case",
    ],
    examTips: [
      "最好 Θ(n)、最壞 Θ(n²)（嚴格遞減）、穩定、原地。",
      "移動次數 = 逆序對（每個逆序對右移一次）。",
      "二分插入只少比較、不少移動，最壞仍 Θ(n²)。",
    ],
    pitfalls: [
      "和選擇排序搞混：插入是「插到已排序區」，選擇是「選最小放到左端」。",
      "key 用 ≥ 判斷會不穩定。",
    ],
    complexity: {
      timeBest: "Θ(n)",
      timeAvg: "Θ(n²)",
      timeWorst: "Θ(n²)",
      space: "Θ(1)",
      stable: true,
      inPlace: true,
    },
    complexityNote: "最好每個 key 都已大於左邊（已遞增）。最壞每次都移到最左。",
    workedExample: {
      title: "手算 [5, 1, 4, 2, 8]",
      input: "[5, 1, 4, 2, 8]",
      steps: [
        { title: "插 1", detail: "5 右移 → [1,5,4,2,8]" },
        { title: "插 4", detail: "5 右移 → [1,4,5,2,8]" },
        { title: "插 2", detail: "5、4 右移 → [1,2,4,5,8]" },
        { title: "插 8", detail: "已最大，不動。", },
      ],
      result: "[1, 2, 4, 5, 8]",
    },
    visualizer: "array",
    pseudocode: `INSERTION-SORT(A)
  for i ← 2 to n
    key ← A[i]
    j ← i-1
    while j ≥ 1 and A[j] > key
      A[j+1] ← A[j]
      j ← j-1
    A[j+1] ← key`,
    codes: {
      python: `def insertion_sort(a: list[int]) -> None:
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key`,
      cpp: `void insertion_sort(vector<int>& a) {
    for (int i = 1; i < (int)a.size(); ++i) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) {
            a[j + 1] = a[j];
            --j;
        }
        a[j + 1] = key;
    }
}`,
      typescript: `function insertionSort(a: number[]) {
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
}`,
    },
    quiz: [
      {
        id: "is1",
        prompt: "插入排序最好情況？",
        options: ["Θ(1)", "Θ(n)", "Θ(n log n)", "Θ(n²)"],
        answer: 1,
        explanation: "已排序時內層 while 立刻失敗，只做 n-1 次比較。",
      },
      {
        id: "is2",
        prompt: "插入 vs 選擇，何者最好可線性？",
        options: ["兩者都可以", "只有插入", "只有選擇", "都不能"],
        answer: 1,
        explanation: "選擇每輪都掃完未排序區，永遠 Θ(n²)。",
      },
      {
        id: "is3",
        prompt: "插入排序穩定？",
        options: ["否", "是，若以 > 而非 ≥ 右移", "只有 linked list 才穩定", "不原地所以不穩定"],
        answer: 1,
        explanation: "相等不強迫右移，相對次序不變。",
      },
    ],
    related: ["bubble-sort", "selection-sort", "quick-sort"],
  },
  {
    slug: "selection-sort",
    name: "選擇排序",
    english: "Selection Sort",
    category: "sorting",
    examWeight: "中",
    tags: ["不穩定", "原地", "固定比較次數"],
    summary:
      "每輪在未排序區找最小值，與左端交換。比較次數永遠 Θ(n²)，交換很少（最多 n-1 次）。標準實作不穩定。",
    idea: "第 i 輪把全域剩下的最小值放到 i。寫資料昂貴、比較便宜時，少交換是賣點；考試則常問「為什麼不穩定、為什麼沒有最好 Θ(n)」。",
    whenToUse: [
      "交換成本極高（例如很大的物件、EEPROM）",
      "對照：同樣 Θ(n²)，選擇沒有最好線性",
    ],
    examTips: [
      "最好＝平均＝最壞 Θ(n²)。沒有提早結束。",
      "不穩定：2a, 1, 2b 可能把 2a 與 1 交換，2a 跑到 2b 後面。",
      "交換次數 O(n)，氣泡／插入最壞 O(n²) 次寫入。",
    ],
    pitfalls: [
      "以為「已排序可以比較快」——標準選擇不會。",
      "說它穩定。除非特別記原始下標。",
    ],
    complexity: {
      timeBest: "Θ(n²)",
      timeAvg: "Θ(n²)",
      timeWorst: "Θ(n²)",
      space: "Θ(1)",
      stable: false,
      inPlace: true,
    },
    complexityNote: "兩層迴圈比較次數固定 n(n-1)/2。",
    workedExample: {
      title: "手算 [5, 1, 4, 2, 8]",
      input: "[5, 1, 4, 2, 8]",
      steps: [
        { title: "min=1 與 5 換", detail: "[1,5,4,2,8]" },
        { title: "min=2 與 5 換", detail: "[1,2,4,5,8]" },
        { title: "其後", detail: "4、5、8 已就位。" },
      ],
      result: "[1, 2, 4, 5, 8]",
    },
    visualizer: "array",
    pseudocode: `SELECTION-SORT(A)
  for i ← 1 to n-1
    min ← i
    for j ← i+1 to n
      if A[j] < A[min]: min ← j
    交換 A[i], A[min]`,
    codes: {
      python: `def selection_sort(a: list[int]) -> None:
    n = len(a)
    for i in range(n - 1):
        m = i
        for j in range(i + 1, n):
            if a[j] < a[m]:
                m = j
        a[i], a[m] = a[m], a[i]`,
      cpp: `void selection_sort(vector<int>& a) {
    int n = (int)a.size();
    for (int i = 0; i < n - 1; ++i) {
        int m = i;
        for (int j = i + 1; j < n; ++j)
            if (a[j] < a[m]) m = j;
        swap(a[i], a[m]);
    }
}`,
      typescript: `function selectionSort(a: number[]) {
  for (let i = 0; i < a.length - 1; i++) {
    let m = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[m]) m = j;
    [a[i], a[m]] = [a[m], a[i]];
  }
}`,
    },
    quiz: [
      {
        id: "ss1",
        prompt: "選擇排序最好時間？",
        options: ["Θ(n)", "Θ(n log n)", "Θ(n²)", "Θ(1)"],
        answer: 2,
        explanation: "每輪都要掃完未排序區找最小。",
      },
      {
        id: "ss2",
        prompt: "標準選擇排序穩定嗎？",
        options: ["穩定", "不穩定", "視輸入", "只有偶數 n 穩定"],
        answer: 1,
        explanation: "最小值與左端交換可能跨過相等元素。",
      },
      {
        id: "ss3",
        prompt: "選擇排序的交換次數上界？",
        options: ["Θ(n²)", "n-1", "n log n", "逆序對數"],
        answer: 1,
        explanation: "每輪至多換一次，共 n-1 輪。",
      },
    ],
    related: ["bubble-sort", "insertion-sort", "heap-sort"],
  },
  {
    slug: "counting-sort",
    name: "計數排序",
    english: "Counting Sort",
    category: "sorting",
    examWeight: "高",
    tags: ["非比較排序", "穩定", "Θ(n+k)"],
    summary:
      "當元素是 0..k 的整數，用計數表取代比較。時間 Θ(n+k)，穩定版從右往左填，是基數排序的零件。",
    idea: "count[v] 記 v 出現幾次，改前綴和後 count[v] 是「≤ v 的個數」。從輸入右邊取出 v，放到 out[count[v]-1]，才能讓原本較右的相同值仍在右邊（穩定）。",
    whenToUse: [
      "k = O(n) 的整數鍵（成績 0–100、位元 0–9）",
      "作為 LSD radix 的穩定子程序",
    ],
    examTips: [
      "比較排序下界 Ω(n log n) 對它無效——它不是比較排序。",
      "k=n² 時 Θ(n+k) 比 Merge 差。",
      "穩定與否取決於實作；考試默認「從右填」的穩定版。",
    ],
    pitfalls: [
      "從左往右填，失去穩定，radix 會錯。",
      "把 Θ(n+k) 講成線性卻忘了 k 可能很大。",
    ],
    complexity: {
      timeBest: "Θ(n+k)",
      timeAvg: "Θ(n+k)",
      timeWorst: "Θ(n+k)",
      space: "Θ(n+k)",
      stable: true,
      inPlace: false,
    },
    complexityNote: "n 次讀取、k 次前綴、n 次寫出。額外 count 與 out 陣列。",
    workedExample: {
      title: "穩定計數 [4, 2, 2, 8, 3, 3, 1]，k=8",
      input: "[4, 2, 2, 8, 3, 3, 1]",
      steps: [
        { title: "計數", detail: "1:1, 2:2, 3:2, 4:1, 8:1" },
        { title: "前綴和", detail: "≤1 有 1 個，≤2 有 3 個，≤3 有 5 個…" },
        { title: "從右填", detail: "先放最後的 1，再 3、3、8、2、2、4。兩個 2、兩個 3 相對次序不變。" },
      ],
      result: "[1, 2, 2, 3, 3, 4, 8]",
    },
    visualizer: "array",
    pseudocode: `COUNTING-SORT(A, k)          // A[i] ∈ 0..k
  C[0..k] ← 0
  for i ← 1 to n: C[A[i]] ← C[A[i]] + 1
  for v ← 1 to k: C[v] ← C[v] + C[v-1]
  for i ← n downto 1
    B[C[A[i]]] ← A[i]
    C[A[i]] ← C[A[i]] - 1
  return B`,
    codes: {
      python: `def counting_sort(a: list[int]) -> list[int]:
    k = max(a, default=0)
    c = [0] * (k + 1)
    for x in a:
        c[x] += 1
    for v in range(1, k + 1):
        c[v] += c[v - 1]
    out = [0] * len(a)
    for x in reversed(a):
        c[x] -= 1
        out[c[x]] = x
    return out`,
      cpp: `vector<int> counting_sort(vector<int> a) {
    if (a.empty()) return a;
    int k = *max_element(a.begin(), a.end());
    vector<int> c(k + 1), b(a.size());
    for (int x : a) ++c[x];
    for (int v = 1; v <= k; ++v) c[v] += c[v - 1];
    for (int i = (int)a.size() - 1; i >= 0; --i) {
        --c[a[i]];
        b[c[a[i]]] = a[i];
    }
    return b;
}`,
      typescript: `function countingSort(a: number[]) {
  const k = Math.max(0, ...a);
  const c = Array(k + 1).fill(0);
  for (const x of a) c[x]++;
  for (let v = 1; v <= k; v++) c[v] += c[v - 1];
  const out = Array(a.length).fill(0);
  for (let i = a.length - 1; i >= 0; i--) {
    c[a[i]]--;
    out[c[a[i]]] = a[i];
  }
  return out;
}`,
    },
    quiz: [
      {
        id: "cs1",
        prompt: "計數排序時間？",
        options: ["Θ(n log n)", "Θ(n+k)", "Θ(n²)", "Θ(nk)"],
        answer: 1,
        explanation: "掃 n 次、值域 k 次。",
      },
      {
        id: "cs2",
        prompt: "為什麼從右往左寫出？",
        options: ["比較快", "為了穩定", "為了原地", "為了少用空間"],
        answer: 1,
        explanation: "相同鍵時，原本較右的仍較右。",
      },
      {
        id: "cs3",
        prompt: "比較排序 Ω(n log n) 為何不限制計數排序？",
        options: ["它比較次數仍 n log n", "它不是用比較決定順序", "k 一定是常數", "它不穩定"],
        answer: 1,
        explanation: "下界假設只靠兩兩比較。",
      },
    ],
    related: ["radix-sort", "merge-sort", "quick-sort"],
  },
  {
    slug: "radix-sort",
    name: "基數排序",
    english: "Radix Sort",
    category: "sorting",
    examWeight: "高",
    tags: ["非比較排序", "穩定", "LSD"],
    summary:
      "由低位到高位，每一位做一次穩定計數排序。d 位、進位 r 時 Θ(d(n+r))。LSD 依賴穩定；MSD 是另一套。",
    idea: "個位排好且穩定後，再排十位時，十位相同的人會保留個位次序，於是兩位都對。如此推到最高位。",
    whenToUse: [
      "固定位數的整數或定長字串",
      "32-bit 可拆 4 個 8-bit 位元組，r=256",
    ],
    examTips: [
      "必須穩定。不穩定的位數排序會把低位成果打亂。",
      "d=Θ(log_r U)，U 是值上界。",
      "MSD radix 像 trie，可跳過前導 0，但實作與穩定性討論不同。考試預設 LSD。",
    ],
    pitfalls: [
      "先排高位（卻用 LSD 直覺）會錯。",
      "位數排序用不穩定的選擇排序。",
    ],
    complexity: {
      timeBest: "Θ(d(n+r))",
      timeAvg: "Θ(d(n+r))",
      timeWorst: "Θ(d(n+r))",
      space: "Θ(n+r)",
      stable: true,
      inPlace: false,
    },
    complexityNote: "十進位 r=10；位元組 r=256。d 是位數。",
    workedExample: {
      title: "LSD [38, 27, 43, 3, 9, 82, 10]",
      input: "先個位再十位，每一輪穩定計數、從右填",
      steps: [
        {
          title: "個位",
          detail:
            "個位 8,7,3,3,9,2,0。從右填後 [10, 82, 43, 3, 27, 38, 9]（0 在最左，兩個 3 仍是 43 在 3 左邊）。",
        },
        {
          title: "十位",
          detail: "十位 1,8,4,0,2,3,0。穩定排完得到 [3, 9, 10, 27, 38, 43, 82]。",
        },
      ],
      result: "[3, 9, 10, 27, 38, 43, 82]",
    },
    visualizer: "array",
    pseudocode: `RADIX-SORT(A, d)            // d 位，進位 r=10
  for exp ← 0 to d-1
    COUNTING-SORT by digit (A[i] / 10^exp) mod 10
    // 必須穩定`,
    codes: {
      python: `def radix_sort(a: list[int]) -> list[int]:
    if not a:
        return a
    exp = 1
    m = max(a)
    while m // exp:
        a = _by_digit(a, exp)
        exp *= 10
    return a

def _by_digit(a: list[int], exp: int) -> list[int]:
    c = [0] * 10
    for x in a:
        c[(x // exp) % 10] += 1
    for i in range(1, 10):
        c[i] += c[i - 1]
    out = [0] * len(a)
    for x in reversed(a):
        d = (x // exp) % 10
        c[d] -= 1
        out[c[d]] = x
    return out`,
      cpp: `vector<int> radix_sort(vector<int> a) {
    if (a.empty()) return a;
    int m = *max_element(a.begin(), a.end());
    for (int exp = 1; m / exp; exp *= 10) {
        vector<int> c(10), b(a.size());
        for (int x : a) ++c[(x / exp) % 10];
        for (int i = 1; i < 10; ++i) c[i] += c[i - 1];
        for (int i = (int)a.size() - 1; i >= 0; --i) {
            int d = (a[i] / exp) % 10;
            b[--c[d]] = a[i];
        }
        a.swap(b);
    }
    return a;
}`,
      typescript: `function radixSort(a: number[]) {
  if (!a.length) return a;
  let exp = 1;
  const m = Math.max(...a);
  while (Math.floor(m / exp)) {
    const c = Array(10).fill(0);
    for (const x of a) c[Math.floor(x / exp) % 10]++;
    for (let i = 1; i < 10; i++) c[i] += c[i - 1];
    const out = Array(a.length).fill(0);
    for (let i = a.length - 1; i >= 0; i--) {
      const d = Math.floor(a[i] / exp) % 10;
      c[d]--;
      out[c[d]] = a[i];
    }
    a = out;
    exp *= 10;
  }
  return a;
}`,
    },
    quiz: [
      {
        id: "rs1",
        prompt: "LSD 基數排序每一位必須？",
        options: ["不穩定也可以", "穩定", "是比較排序", "原地"],
        answer: 1,
        explanation: "不穩定會打亂已排好的低位。",
      },
      {
        id: "rs2",
        prompt: "時間 Θ(d(n+r)) 的 d、r？",
        options: ["d 資料數、r 逆序對", "d 位數、r 進位（值域）", "d 深度、r 根", "沒有意義"],
        answer: 1,
        explanation: "每一位做一次計數排序。",
      },
      {
        id: "rs3",
        prompt: "32-bit 整數拆 4 個 byte 時 r＝？",
        options: ["2", "10", "32", "256"],
        answer: 3,
        explanation: "一個位元組 0..255。",
      },
    ],
    related: ["counting-sort", "merge-sort", "quick-sort"],
  },
  {
    slug: "quickselect",
    name: "Quickselect",
    english: "Quickselect / Hoare Selection",
    category: "sorting",
    examWeight: "高",
    tags: ["選擇問題", "期望線性", "分治"],
    summary:
      "找第 k 小（或中位數）不必排完全部。Lomuto／Hoare 分割後只走樞紐的那一側。平均 Θ(n)，最壞 Θ(n²)。",
    idea: "分割完樞紐在 p。k=p 就找到；k<p 丟右邊；k>p 丟左邊。期望每次切半，T(n)=T(n/2)+Θ(n)=Θ(n)。最壞每次少 1 個變成 Θ(n²)。",
    whenToUse: [
      "中位數、第 k 名、BFPRT 對照",
      "不需要完整排序時比 Heap／排序快（平均）",
    ],
    examTips: [
      "隨機樞紐 ⇒ 期望 Θ(n)。最壞仍 n²。",
      "最壞線性：median-of-medians（5 個一組）可保證 Θ(n)，常數大。",
      "k 從 0 或 1 起算要在題目寫清。",
      "完整 Quicksort 兩側都遞迴；select 只一側。",
    ],
    pitfalls: [
      "兩側都遞迴，變成排序。",
      "k 與分割後索引的 0/1-based 搞混。",
    ],
    complexity: {
      timeBest: "Θ(n)",
      timeAvg: "Θ(n) 期望",
      timeWorst: "Θ(n²)",
      space: "Θ(log n) 期望／Θ(n) 最壞遞迴",
      stable: false,
      inPlace: true,
    },
    complexityNote: "主定理不直接套（切點隨機）。平均以積分／指示變數證明為 Θ(n)。",
    workedExample: {
      title: "在 [38,27,43,3,9,82,10] 找第 4 小（k=3）",
      input: "Lomuto，最右當樞紐",
      steps: [
        { title: "第一次分割", detail: "樞紐 10，就位後左邊都 ≤10。10 的索引若不是 3，看 k 在哪側。" },
        { title: "只走一側", detail: "直到樞紐索引 = 3。答案是 27。" },
      ],
      result: "第 4 小 = 27（排序後 [3,9,10,27,...]）",
    },
    visualizer: "array",
    pseudocode: `QUICKSELECT(A, lo, hi, k)     // 0-based，找 A 的第 k 小
  if lo = hi: return A[lo]
  p ← PARTITION(A, lo, hi)
  if k = p: return A[p]
  if k < p: return QUICKSELECT(A, lo, p-1, k)
  else:     return QUICKSELECT(A, p+1, hi, k)`,
    codes: {
      python: `def quickselect(a: list[int], k: int) -> int:
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        pivot = a[hi]
        i = lo
        for j in range(lo, hi):
            if a[j] <= pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[hi] = a[hi], a[i]
        if k == i:
            return a[i]
        if k < i:
            hi = i - 1
        else:
            lo = i + 1
    raise ValueError`,
      cpp: `int quickselect(vector<int>& a, int k) {
    int lo = 0, hi = (int)a.size() - 1;
    while (lo <= hi) {
        int pivot = a[hi], i = lo;
        for (int j = lo; j < hi; ++j)
            if (a[j] <= pivot) swap(a[i++], a[j]);
        swap(a[i], a[hi]);
        if (k == i) return a[i];
        if (k < i) hi = i - 1;
        else lo = i + 1;
    }
    return -1;
}`,
      typescript: `function quickselect(a: number[], k: number) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    if (k === i) return a[i];
    if (k < i) hi = i - 1;
    else lo = i + 1;
  }
  return undefined;
}`,
    },
    quiz: [
      {
        id: "qs1",
        prompt: "Quickselect 平均時間？",
        options: ["Θ(log n)", "Θ(n)", "Θ(n log n)", "Θ(n²)"],
        answer: 1,
        explanation: "期望每次問題規模縮小為常數比例，加總幾何級數。",
      },
      {
        id: "qs2",
        prompt: "和 Quicksort 的關鍵差？",
        options: ["不用樞紐", "只遞迴一側", "一定穩定", "只要陣列已排序"],
        answer: 1,
        explanation: "排序兩側都要；選擇只需要 k 所在那側。",
      },
      {
        id: "qs3",
        prompt: "保證最壞線性的是？",
        options: ["永遠最右當樞紐", "median-of-medians", "氣泡選第 k", "BFS"],
        answer: 1,
        explanation: "BFPRT：五個一組取中位數再當樞紐。",
      },
    ],
    related: ["quick-sort", "heap", "binary-search-answer"],
  },
];
