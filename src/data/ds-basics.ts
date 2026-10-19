import type { Algorithm } from "./types";

export const dsBasicLessons: Algorithm[] = [
  {
    slug: "stack",
    name: "堆疊",
    english: "Stack",
    category: "ds",
    examWeight: "高",
    tags: ["後進先出", "DFS", "呼叫堆疊"],
    summary:
      "後進先出：最後放進去的，最先拿出來。DFS、函式呼叫、括號匹配、瀏覽器上一頁，都是堆疊。",
    idea: "想像一疊盤子。放進 3、再放 1、再放 4，頂端是 4，下一次拿走的一定是 4，不是最早的 3。陣列用尾端當頂端時，放進和取出都是 O(1)。它不管中間的人，所以不能拿來做 BFS。",
    whenToUse: [
      "深度優先、遞迴改寫、括號與運算式",
      "需要「最近的未完成工作」",
    ],
    examTips: [
      "push／pop 都看頂端，O(1)。",
      "DFS 用堆疊，BFS 用佇列。兩者對調，走訪順序就錯。",
      "遞迴的系統呼叫堆疊太深會溢位，改成自己管理的堆疊可控制。",
    ],
    pitfalls: ["從底端取，變成佇列。", "空堆疊還 pop。"],
    complexity: {
      timeBest: "push／pop Θ(1)",
      timeAvg: "Θ(1)",
      timeWorst: "Θ(1)",
      space: "Θ(n)",
    },
    complexityNote: "鏈結或動態陣列的尾端操作均攤 Θ(1)。",
    workedExample: {
      title: "依序放 3、1、4，取出，再放 2",
      input: "空堆疊，右邊當頂端",
      steps: [
        { title: "放 3、1、4", detail: "頂端從 3 換成 1，再換成 4。" },
        { title: "取出", detail: "拿走 4，頂端回到 1。" },
        { title: "放 2", detail: "從頂端往下是 2、1、3。" },
      ],
      result: "最後堆疊底到頂：3, 1, 2",
    },
    visualizer: "table",
    pseudocode: `PUSH(S, x): S.append(x)
POP(S): return S.removeLast()
TOP(S): return S.last
EMPTY(S): return |S| = 0`,
    codes: {
      python: `class Stack:
    def __init__(self):
        self.a: list[int] = []

    def push(self, x: int) -> None:
        self.a.append(x)

    def pop(self) -> int:
        if not self.a:
            raise IndexError("empty")
        return self.a.pop()

    def top(self) -> int:
        return self.a[-1]`,
      cpp: `struct Stack {
    vector<int> a;
    void push(int x) { a.push_back(x); }
    int pop() { int x = a.back(); a.pop_back(); return x; }
    int top() const { return a.back(); }
    bool empty() const { return a.empty(); }
};`,
      typescript: `class Stack {
  private a: number[] = [];
  push(x: number) { this.a.push(x); }
  pop() {
    const x = this.a.pop();
    if (x === undefined) throw new Error("empty");
    return x;
  }
  top() { return this.a[this.a.length - 1]; }
}`,
    },
    quiz: [
      {
        id: "st1",
        prompt: "依序 push 3、1、4 之後 pop，拿到什麼？",
        options: ["3", "1", "4", "空"],
        answer: 2,
        explanation: "最後放的 4 在頂端，先被拿走。",
      },
      {
        id: "st2",
        prompt: "走訪圖時，用堆疊展開的是？",
        options: ["BFS", "DFS", "Dijkstra", "Kruskal"],
        answer: 1,
        explanation: "堆疊是後進先出，會先把一條路走深，那是 DFS。BFS 用佇列。",
      },
      {
        id: "st3",
        prompt: "陣列實作堆疊，頂端放在哪裡才能讓 push／pop 都是 O(1)？",
        options: ["永遠在下標 0", "尾端", "中間", "隨機位置"],
        answer: 1,
        explanation: "尾端加入和刪除不用搬移其他元素。",
      },
    ],
    related: ["queue", "dfs", "heap"],
  },
  {
    slug: "queue",
    name: "佇列",
    english: "Queue",
    category: "ds",
    examWeight: "高",
    tags: ["先進先出", "BFS", "SPFA"],
    summary:
      "先進先出：先排進來的先離開。BFS、印表機、Bellman-Ford 的佇列優化，都用佇列決定下一個處理誰。",
    idea: "人排隊。A 先來，接著 B、C。下一個離開的是 A，不是最後來的 C。新的人排到尾端。用頭、尾兩個下標，或雙向佇列，放進和離開都是 O(1)。把它當堆疊用，BFS 的層序就亂了。",
    whenToUse: [
      "廣度優先、一層一層處理",
      "只想處理「狀態剛改變」的點（SPFA）",
    ],
    examTips: [
      "enqueue 在尾、dequeue 在頭，都是 O(1)。",
      "BFS 用佇列；DFS 用堆疊。",
      "環形佇列要分開「滿」和「空」，通常浪費一格或另記長度。",
    ],
    pitfalls: ["從頭插入又從頭刪，變成堆疊。", "用一般陣列每次刪頭都搬移，變成 O(n)。"],
    complexity: {
      timeBest: "enqueue／dequeue Θ(1)",
      timeAvg: "Θ(1)",
      timeWorst: "Θ(1)",
      space: "Θ(n)",
    },
    complexityNote: "雙端或環形實作才是 Θ(1)。每次刪除陣列第 0 格是 Θ(n)。",
    workedExample: {
      title: "A、B、C 依序進來，A 離開，D 再進來",
      input: "空佇列，左邊是頭",
      steps: [
        { title: "A B C 進來", detail: "頭是 A，尾是 C。" },
        { title: "離開", detail: "A 先走，頭換成 B。" },
        { title: "D 進來", detail: "D 排到尾。隊伍是 B、C、D。" },
      ],
      result: "離開順序以 A 為先",
    },
    visualizer: "table",
    pseudocode: `ENQUEUE(Q, x): Q.appendBack(x)
DEQUEUE(Q): return Q.removeFront()
FRONT(Q): return Q.first`,
    codes: {
      python: `from collections import deque

class Queue:
    def __init__(self):
        self.q: deque[str] = deque()

    def enqueue(self, x: str) -> None:
        self.q.append(x)

    def dequeue(self) -> str:
        if not self.q:
            raise IndexError("empty")
        return self.q.popleft()`,
      cpp: `struct Queue {
    deque<string> q;
    void enqueue(string x) { q.push_back(x); }
    string dequeue() { string x = q.front(); q.pop_front(); return x; }
    bool empty() const { return q.empty(); }
};`,
      typescript: `class Queue<T> {
  private q: T[] = [];
  private head = 0;
  enqueue(x: T) { this.q.push(x); }
  dequeue(): T {
    if (this.head >= this.q.length) throw new Error("empty");
    return this.q[this.head++];
  }
}`,
    },
    quiz: [
      {
        id: "q1",
        prompt: "依序進入 A、B、C 後第一次 dequeue，離開的是？",
        options: ["C", "B", "A", "空"],
        answer: 2,
        explanation: "先進先出，A 最早，先離開。",
      },
      {
        id: "q2",
        prompt: "BFS 為什麼用佇列而不是堆疊？",
        options: [
          "佇列比較省記憶體",
          "先發現的點要先展開，才是一層一層",
          "堆疊不能存點",
          "佇列可以排序邊權",
        ],
        answer: 1,
        explanation: "先發現的在頭，先被展開，同一層會在下一層之前走完。",
      },
      {
        id: "q3",
        prompt: "Bellman-Ford 的佇列優化，誰該進佇列？",
        options: [
          "所有點每輪都進",
          "距離剛變短、而且目前不在佇列裡的點",
          "邊權為負的點",
          "已經定案的點",
        ],
        answer: 1,
        explanation: "只處理可能再傳出更短路的點；已在佇列就不必重複排。",
      },
    ],
    related: ["stack", "bfs", "bellman-ford"],
  },
  {
    slug: "bst",
    name: "二元搜尋樹",
    english: "Binary Search Tree",
    category: "ds",
    examWeight: "極高",
    tags: ["搜尋樹", "中序", "比較"],
    summary:
      "左子樹的鍵都比根小，右子樹都比根大。找一個鍵從根比較，小往左、大往右。它不是堆積：堆積的左右沒有大小順序。",
    idea: "空樹放進 8，8 就是根。3 比 8 小，掛在左邊；10 比 8 大，掛在右邊。再放 1，先跟 8 比往左，再跟 3 比還是往左。中序走一遍會由小到大。若插入順序是已排序的，樹會歪成一條鏈，搜尋變成 O(n)，所以考試會接著問 AVL 或紅黑樹。",
    whenToUse: [
      "需要找任意鍵、插入、刪除，而且在意順序",
      "對照 heap：heap 只會取最值，不會找「有沒有 6」",
    ],
    examTips: [
      "搜尋、插入平均 O(h)，平衡時 h=Θ(log n)，歪掉時 Θ(n)。",
      "中序走訪得到排序結果。",
      "刪除有兩個孩子時，用中序後繼（右子樹最小值）或前驅補上。",
      "堆積的父 ≥ 子，左右誰大都行；BST 左右不能交換。",
    ],
    pitfalls: [
      "把 heap 的陣列下標公式用到 BST。",
      "允許相等鍵卻沒規定放左或放右，查找會漏。",
    ],
    complexity: {
      timeBest: "Θ(log n) 平衡",
      timeAvg: "Θ(log n)",
      timeWorst: "Θ(n) 退化成鏈",
      space: "Θ(n)",
    },
    complexityNote: "高度決定一切。已排序插入是最壞情況。",
    workedExample: {
      title: "依序插入 8、3、10、1、6",
      input: "空樹",
      steps: [
        { title: "8", detail: "成為根。" },
        { title: "3 和 10", detail: "3 在左，10 在右。" },
        { title: "1", detail: "8 的左、再比 3 還小，掛在 3 的左。" },
        { title: "6", detail: "往左到 3，比 3 大，掛在 3 的右。" },
      ],
      result: "中序：1, 3, 6, 8, 10",
    },
    visualizer: "graph",
    pseudocode: `SEARCH(t, k)
  if t = nil or t.key = k: return t
  if k < t.key: return SEARCH(t.left, k)
  else return SEARCH(t.right, k)

INSERT：沿 SEARCH 走到空位，把新節點掛上`,
    codes: {
      python: `class Node:
    def __init__(self, key: int):
        self.key = key
        self.left: "Node | None" = None
        self.right: "Node | None" = None

def insert(t: Node | None, key: int) -> Node:
    if t is None:
        return Node(key)
    if key < t.key:
        t.left = insert(t.left, key)
    elif key > t.key:
        t.right = insert(t.right, key)
    return t

def search(t: Node | None, key: int) -> bool:
    if t is None:
        return False
    if key == t.key:
        return True
    return search(t.left if key < t.key else t.right, key)`,
      cpp: `struct Node { int key; Node *l=nullptr,*r=nullptr; Node(int k):key(k){} };
Node* insert(Node* t, int key) {
    if (!t) return new Node(key);
    if (key < t->key) t->l = insert(t->l, key);
    else if (key > t->key) t->r = insert(t->r, key);
    return t;
}
bool search(Node* t, int key) {
    if (!t) return false;
    if (key == t->key) return true;
    return search(key < t->key ? t->l : t->r, key);
}`,
      typescript: `type Node = { key: number; left: Node | null; right: Node | null };
function insert(t: Node | null, key: number): Node {
  if (!t) return { key, left: null, right: null };
  if (key < t.key) t.left = insert(t.left, key);
  else if (key > t.key) t.right = insert(t.right, key);
  return t;
}
function search(t: Node | null, key: number): boolean {
  if (!t) return false;
  if (key === t.key) return true;
  return search(key < t.key ? t.left : t.right, key);
}`,
    },
    quiz: [
      {
        id: "bst1",
        prompt: "二元搜尋樹和二元堆積差在哪？",
        options: [
          "完全一樣",
          "搜尋樹規定左小右大；堆積只規定父比孩子極端，左右無序",
          "堆積才能中序得到排序",
          "搜尋樹一定存在陣列下標 2i+1",
        ],
        answer: 1,
        explanation: "找任意鍵靠左小右大。堆積只保證根是最值。",
      },
      {
        id: "bst2",
        prompt: "已排序的鍵依序插入普通 BST，搜尋複雜度？",
        options: ["Θ(1)", "Θ(log n)", "Θ(n)", "Θ(n log n)"],
        answer: 2,
        explanation: "樹退化成鏈，高度 n。",
      },
      {
        id: "bst3",
        prompt: "哪一種走訪會把 BST 的鍵由小到大列出？",
        options: ["前序", "中序", "後序", "層序"],
        answer: 1,
        explanation: "中序是左、根、右，正好是排序。",
      },
    ],
    related: ["binary-search", "heap", "hash"],
  },
  {
    slug: "hash",
    name: "雜湊表",
    english: "Hash Table",
    category: "ds",
    examWeight: "極高",
    tags: ["雜湊", "碰撞", "均攤 O(1)"],
    summary:
      "用雜湊函數把鍵對到桶。找、插入、刪除平均 O(1)。不同的鍵若落到同一個桶就是碰撞，要用鏈結或開放定址處理。",
    idea: "五個桶，鍵放進「鍵 % 5」那個桶。12 餘 2，進桶 2。7 也餘 2，不能把 12 蓋掉，就在桶 2 後面再串一個 7。找 7 時只走桶 2 那條鏈，不用掃全部。鍵若很集中、桶又太少，鏈會變長，最壞退化成 O(n)。",
    whenToUse: [
      "要快速查「有沒有這個鍵」，不需要排序",
      "對照 BST：雜湊不保證中序，範圍查詢不方便",
    ],
    examTips: [
      "平均 O(1)，最壞 O(n)。不要寫成最壞也是 O(1)。",
      "鏈結法：同一個桶串成鏈。開放定址：碰撞就往下一格找。",
      "負載因子 α = n / 桶數。α 太大就要擴桶再重哈希。",
      "雜湊函數要讓鍵散開。只用一個常數當函數會全部撞在同一桶。",
    ],
    pitfalls: [
      "碰撞時直接覆蓋，舊鍵消失。",
      "把平均 O(1) 當成最壞 O(1)。",
      "用雜湊表做範圍搜尋（找所有 10 到 20）。",
    ],
    complexity: {
      timeBest: "Θ(1) 平均",
      timeAvg: "Θ(1)",
      timeWorst: "Θ(n)",
      space: "Θ(n)",
    },
    complexityNote: "鏈結法多花指標；開放定址省指標，但刪除要做標記，不能留一個真的空格。",
    workedExample: {
      title: "桶 0..4，依序放 12、8、7、15、22",
      input: "hash(k) = k % 5",
      steps: [
        { title: "12", detail: "12%5=2，桶 2 放 12。" },
        { title: "8", detail: "8%5=3，桶 3 放 8。" },
        { title: "7 和 22", detail: "都餘 2，接到桶 2 的鏈後面：12 → 7 → 22。" },
        { title: "15", detail: "15%5=0，桶 0 放 15。" },
      ],
      result: "找 22 只走桶 2",
    },
    visualizer: "table",
    pseudocode: `INSERT(k)
  b ← hash(k) mod m
  若桶 b 的鏈上沒有 k，把 k 接到鏈尾

SEARCH(k)
  只掃描桶 hash(k) 那一條鏈`,
    codes: {
      python: `class HashSet:
    def __init__(self, m: int = 5):
        self.m = m
        self.buckets: list[list[int]] = [[] for _ in range(m)]

    def add(self, key: int) -> None:
        b = self.buckets[key % self.m]
        if key not in b:
            b.append(key)

    def contains(self, key: int) -> bool:
        return key in self.buckets[key % self.m]`,
      cpp: `struct HashSet {
    int m = 5;
    vector<vector<int>> b{5};
    void add(int key) {
        auto& c = b[key % m];
        if (find(c.begin(), c.end(), key) == c.end()) c.push_back(key);
    }
    bool contains(int key) const {
        const auto& c = b[key % m];
        return find(c.begin(), c.end(), key) != c.end();
    }
};`,
      typescript: `class HashSet {
  constructor(private m = 5) {}
  private buckets: number[][] = Array.from({ length: this.m }, () => []);
  add(key: number) {
    const b = this.buckets[key % this.m];
    if (!b.includes(key)) b.push(key);
  }
  contains(key: number) {
    return this.buckets[key % this.m].includes(key);
  }
}`,
    },
    quiz: [
      {
        id: "h1",
        prompt: "鍵 12 和 7、桶數 5，為什麼會碰撞？",
        options: ["兩個都是奇數", "12%5 和 7%5 都是 2", "雜湊表不能放奇數", "12 比桶數大"],
        answer: 1,
        explanation: "餘數相同就進同一個桶。",
      },
      {
        id: "h2",
        prompt: "鏈結法碰到碰撞時該怎麼做？",
        options: [
          "蓋掉舊鍵",
          "在同一個桶的鏈上再接一個",
          "放棄插入",
          "改存到 BST 的根",
        ],
        answer: 1,
        explanation: "同一個餘數的鍵串成一條鏈。",
      },
      {
        id: "h3",
        prompt: "雜湊表搜尋的最壞情況？",
        options: ["Θ(1)", "Θ(log n)", "Θ(n)", "Θ(n²)"],
        answer: 2,
        explanation: "全部鍵撞進同一條鏈時，要掃過 n 個。平均才是 Θ(1)。",
      },
    ],
    related: ["bst", "counting-sort", "heap"],
  },
];
