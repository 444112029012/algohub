import type { Algorithm } from "./types";

export const otherLessons: Algorithm[] = [
  {
    slug: "union-find",
    name: "並查集",
    english: "Disjoint Set / Union-Find",
    category: "ds",
    examWeight: "極高",
    tags: ["資料結構", "Kruskal", "路徑壓縮"],
    summary:
      "維護不相交集合：Find 問兩人是否同組，Union 合併。搭配路徑壓縮與按秩合併，單次操作幾乎是常數 α(n)。Kruskal、連通性離線詢問都靠它。",
    idea: "每個集合是一棵樹，根是代表元。Find 沿父指標走到根；Union 把較淺的根掛到較深的根。路徑壓縮：找的路上點都直接掛到根。",
    whenToUse: [
      "動態連通、最小生成樹",
      "等價關係閉包、帳號合併",
      "Kruskal、離線「加邊後是否連通」",
    ],
    examTips: [
      "只有路徑壓縮，或只有按秩，均攤都很好；兩者一起是 α(n)（反阿克曼，可視為 ≤4）。",
      "考試默認：Find 幾乎 O(1)、n 次操作 ≈ O(n)。",
      "不能高效支援「刪邊」——那要其他結構。",
    ],
    pitfalls: ["Union 沒掛根而是掛任意點，樹退化成鏈。", "Find 沒壓縮又沒按秩，最壞 O(n)。"],
    complexity: {
      timeBest: "α(n) 均攤",
      timeAvg: "α(n) 均攤",
      timeWorst: "α(n) 均攤（路徑壓縮+按秩）",
      space: "Θ(n)",
    },
    complexityNote: "沒優化時 Find 最壞 Θ(n)。優化後當作常數即可。",
    workedExample: {
      title: "處理邊 (A,B), (B,E), (E,F), (A,D), (C,F)",
      input: "六個單點集合",
      steps: [
        { title: "Union A B", detail: "B 的根改為 A（或反之）。" },
        { title: "Union B E", detail: "Find(B)=A，把 E 掛到 A。" },
        { title: "Find(F) vs Find(C)", detail: "尚未合併時不同根；加 C-F 後同一棵 MST 樹。" },
      ],
      result: "最後幾乎全部連成同一集合（見 Kruskal 動畫）",
    },
    visualizer: "none",
    pseudocode: `MAKE-SET(x): parent[x]←x; rank[x]←0

FIND(x)
  if parent[x] ≠ x
    parent[x] ← FIND(parent[x])   // 路徑壓縮
  return parent[x]

UNION(x, y)
  rx ← FIND(x); ry ← FIND(y)
  if rx = ry: return
  if rank[rx] < rank[ry]: parent[rx] ← ry
  else if rank[rx] > rank[ry]: parent[ry] ← rx
  else: parent[ry] ← rx; rank[rx] ← rank[rx] + 1`,
    codes: {
      python: `class DSU:
    def __init__(self, n: int):
        self.p = list(range(n))
        self.r = [0] * n

    def find(self, x: int) -> int:
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a: int, b: int) -> bool:
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        if self.r[a] < self.r[b]:
            a, b = b, a
        self.p[b] = a
        if self.r[a] == self.r[b]:
            self.r[a] += 1
        return True`,
      cpp: `struct DSU {
    vector<int> p, r;
    DSU(int n): p(n), r(n,0) { iota(p.begin(), p.end(), 0); }
    int find(int x){ return p[x]==x ? x : p[x]=find(p[x]); }
    bool unite(int a, int b){
        a=find(a); b=find(b); if(a==b) return false;
        if(r[a]<r[b]) swap(a,b);
        p[b]=a; if(r[a]==r[b]) r[a]++; return true;
    }
};`,
      typescript: `class DSU {
  p: number[];
  r: number[];
  constructor(n: number) {
    this.p = Array.from({ length: n }, (_, i) => i);
    this.r = Array(n).fill(0);
  }
  find(x: number): number {
    return this.p[x] === x ? x : (this.p[x] = this.find(this.p[x]));
  }
  union(a: number, b: number) {
    a = this.find(a);
    b = this.find(b);
    if (a === b) return false;
    if (this.r[a] < this.r[b]) [a, b] = [b, a];
    this.p[b] = a;
    if (this.r[a] === this.r[b]) this.r[a]++;
    return true;
  }
}`,
    },
    quiz: [
      {
        id: "uf1",
        prompt: "路徑壓縮 + 按秩合併的均攤複雜度？",
        options: ["Θ(n)", "Θ(log n)", "α(n)（幾乎常數）", "Θ(1) 最壞嚴格"],
        answer: 2,
        explanation: "反阿克曼函數增長極慢，實務當 O(1)，理論不是嚴格最壞 O(1)。",
      },
      {
        id: "uf2",
        prompt: "Kruskal 為什麼需要並查集？",
        options: [
          "算最短路徑",
          "O(1) 判斷兩端是否已連通（會不會成環）",
          "排序邊",
          "找負環",
        ],
        answer: 1,
        explanation: "同一集合代表已在同一棵樹。",
      },
      {
        id: "uf3",
        prompt: "按秩合併的「秩」近似代表？",
        options: ["集合大小的精確值", "樹高的上界", "邊權", "DFS 時間戳"],
        answer: 1,
        explanation: "把矮的掛到高的，避免長鏈。",
      },
    ],
    related: ["kruskal", "bfs", "dfs"],
  },
  {
    slug: "kmp",
    name: "KMP 字串匹配",
    english: "Knuth–Morris–Pratt",
    category: "string",
    examWeight: "高",
    tags: ["字串", "LPS", "線性時間"],
    summary:
      "在文本 T 裡找模式 P，預先算 LPS（最長真前後綴），匹配失敗時模式自己對齊，不必把文本指標回退。時間 Θ(n+m)，手算 LPS 是熱門題。",
    idea: "暴力匹配失敗會把 T 的指標往回。KMP 利用「P 的前綴也是後綴」的資訊，只移動 P。LPS[i] = P[0..i] 最長的真前後綴長度。",
    whenToUse: [
      "單模式、長文本的多次失敗會很痛的情況",
      "需要保證線性時間的匹配",
    ],
    examTips: [
      "建 LPS 本身也是 KMP 思想，O(m)。",
      "匹配 O(n)。合計 O(n+m)。",
      "手算：對 P=ABABC，LPS 約 [0,0,1,2,0] 之類，務必逐步寫。",
      "和有限自動機匹配、Boyer–Moore 對照時，KMP 重點是「不回退文本」。",
    ],
    pitfalls: ["LPS 把整個字串當前後綴（真前綴必須嚴格較短）。", "失敗時 j=lps[j-1] 寫成 j=0 失去加速。"],
    complexity: {
      timeBest: "Θ(n+m)",
      timeAvg: "Θ(n+m)",
      timeWorst: "Θ(n+m)",
      space: "Θ(m)",
    },
    complexityNote: "i 只增不減，j 的增加與減少攤還線性。",
    workedExample: {
      title: "P = ABABC 的 LPS",
      input: "len=5",
      steps: [
        { title: "索引 0", detail: "單字元沒有真前後綴，lps[0]=0。" },
        { title: "索引 1（AB）", detail: "A≠B，lps[1]=0。" },
        { title: "索引 2（ABA）", detail: "前後綴 A，lps[2]=1。" },
        { title: "索引 3（ABAB）", detail: "前後綴 AB，lps[3]=2。" },
        { title: "索引 4（ABABC）", detail: "無法延續，lps[4]=0。" },
      ],
      result: "LPS = [0, 0, 1, 2, 0]",
    },
    visualizer: "none",
    pseudocode: `COMPUTE-LPS(P)
  lps[0] ← 0; len ← 0; i ← 1
  while i < m
    if P[i] = P[len]: len++; lps[i]←len; i++
    else if len ≠ 0: len ← lps[len-1]
    else: lps[i]←0; i++

KMP-SEARCH(T, P)
  計算 lps
  i ← j ← 0
  while i < n
    if T[i] = P[j]: i++; j++
      if j = m: 輸出 i-j; j ← lps[j-1]
    else if j>0: j ← lps[j-1]
    else: i++`,
    codes: {
      python: `def kmp(text: str, pat: str) -> list[int]:
    m = len(pat)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pat[i] == pat[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    hits: list[int] = []
    i = j = 0
    while i < len(text):
        if text[i] == pat[j]:
            i += 1
            j += 1
            if j == m:
                hits.append(i - j)
                j = lps[j - 1]
        elif j:
            j = lps[j - 1]
        else:
            i += 1
    return hits`,
      cpp: `vector<int> kmp(const string& t, const string& p) {
    int m=p.size(); vector<int> lps(m), hits;
    for (int i=1,len=0;i<m;) {
        if (p[i]==p[len]) lps[i++]=++len;
        else if (len) len=lps[len-1];
        else lps[i++]=0;
    }
    for (int i=0,j=0;i<(int)t.size();) {
        if (t[i]==p[j]) { ++i; ++j; if (j==m){ hits.push_back(i-j); j=lps[j-1]; } }
        else if (j) j=lps[j-1];
        else ++i;
    }
    return hits;
}`,
      typescript: `function kmp(text: string, pat: string) {
  const m = pat.length;
  const lps = Array(m).fill(0);
  for (let i = 1, len = 0; i < m; ) {
    if (pat[i] === pat[len]) lps[i++] = ++len;
    else if (len) len = lps[len - 1];
    else lps[i++] = 0;
  }
  const hits: number[] = [];
  for (let i = 0, j = 0; i < text.length; ) {
    if (text[i] === pat[j]) {
      i++; j++;
      if (j === m) {
        hits.push(i - j);
        j = lps[j - 1];
      }
    } else if (j) j = lps[j - 1];
    else i++;
  }
  return hits;
}`,
    },
    quiz: [
      {
        id: "kmp1",
        prompt: "KMP 相對暴力法的關鍵？",
        options: [
          "文本指標遇到失敗可以回退任意距離",
          "失敗時用 LPS 移動模式，文本不回退",
          "一定要雜湊",
          "只能匹配單一字元",
        ],
        answer: 1,
        explanation: "這就是線性保證的來源。",
      },
      {
        id: "kmp2",
        prompt: "P=AAAA 的 lps[3]？",
        options: ["0", "1", "2", "3"],
        answer: 3,
        explanation: "AAAA 長度 4，最長真前後綴 AAA，長度 3。",
      },
      {
        id: "kmp3",
        prompt: "KMP 總時間？",
        options: ["Θ(nm)", "Θ(n+m)", "Θ(n log m)", "Θ(m²+n²)"],
        answer: 1,
        explanation: "建表 O(m)+匹配 O(n)。",
      },
    ],
    related: ["lcs", "binary-search", "master-theorem"],
  },
  {
    slug: "huffman",
    name: "Huffman 編碼",
    english: "Huffman Coding",
    category: "greedy",
    examWeight: "高",
    tags: ["貪婪", "前綴碼", "優先佇列"],
    summary:
      "依字元頻率建最優前綴碼：每次合併頻率最小的兩棵樹。考試愛考「畫樹、寫碼、算平均長度」。",
    idea: "前綴碼：沒有任何碼是另一個碼的前綴，才能無歧義解碼。貪婪：頻率最低的兩個符號應該有最長的碼，所以先合併它們。",
    whenToUse: [
      "靜態頻率已知的無失真壓縮",
      "證明貪婪選擇性質的經典例子",
    ],
    examTips: [
      "n 個符號會有 n-1 次合併，樹有 2n-1 個節點。",
      "平均碼長 = Σ fᵢ · depthᵢ（或內部節點權重和）。",
      "頻率相同時樹不唯一，但加權路徑長相同。",
      "用 min-heap，時間 O(n log n)。",
      "不是萬用壓縮：要整數頻率、獨立符號模型。",
    ],
    pitfalls: ["建成後綴碼而不是前綴碼。", "忘記左 0 右 1 的約定導致和解答碼字不同但長度對。"],
    complexity: {
      timeBest: "O(n log n)",
      timeAvg: "O(n log n)",
      timeWorst: "O(n log n)",
      space: "Θ(n)",
    },
    complexityNote: "2n-2 次 heap 操作。",
    workedExample: {
      title: "頻率 A:5 B:2 C:1 D:1 E:3",
      input: "五個葉節點",
      steps: [
        { title: "合併 C,D", detail: "最小的 1 與 1 → 節點 2。" },
        { title: "合併 B 與 CD", detail: "B:2 與 2 → 節點 4。" },
        { title: "合併 E 與 BCD", detail: "E:3 與 4 → 7。" },
        { title: "最後與 A", detail: "A:5 與 7 → 12。A 的碼較短。" },
      ],
      result: "一種可能：A=0, E=10, B=110, C=1110, D=1111",
    },
    visualizer: "none",
    pseudocode: `HUFFMAN(C)
  n ← |C|
  Q ← C            // min-priority queue，key=頻率
  for i ← 1 to n-1
    z ← 新節點
    z.left ← EXTRACT-MIN(Q)
    z.right ← EXTRACT-MIN(Q)
    z.freq ← z.left.freq + z.right.freq
    INSERT(Q, z)
  return EXTRACT-MIN(Q)   // 根`,
    codes: {
      python: `import heapq
from collections import Counter

def huffman_codes(text: str) -> dict[str, str]:
    freq = Counter(text)
    heap: list = [[f, t, c] for c, f in freq.items()]
    # 節點：[freq, tie, char or [left, right]]
    heapq.heapify(heap)
    tie = 0
    while len(heap) > 1:
        a = heapq.heappop(heap)
        b = heapq.heappop(heap)
        tie += 1
        heapq.heappush(heap, [a[0] + b[0], tie, [a, b]])
    codes: dict[str, str] = {}

    def walk(node: list, prefix: str) -> None:
        payload = node[2]
        if isinstance(payload, str):
            codes[payload] = prefix or "0"
        else:
            walk(payload[0], prefix + "0")
            walk(payload[1], prefix + "1")

    walk(heap[0], "")
    return codes`,
      cpp: `// 概念：priority_queue 存 (freq, id)，合併 n-1 次後對樹 DFS 賦碼
// 完整樹節點結構略，考試默寫上述 HUFFMAN 虛擬碼即可。`,
      typescript: `type HuffNode = { f: number; ch?: string; l?: HuffNode; r?: HuffNode };

function huffmanCodes(freq: Record<string, number>) {
  const nodes: HuffNode[] = Object.entries(freq).map(([ch, f]) => ({ f, ch }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f);
    const l = nodes.shift()!, r = nodes.shift()!;
    nodes.push({ f: l.f + r.f, l, r });
  }
  const codes: Record<string, string> = {};
  const walk = (n: HuffNode, p: string) => {
    if (n.ch !== undefined) codes[n.ch] = p || "0";
    else {
      if (n.l) walk(n.l, p + "0");
      if (n.r) walk(n.r, p + "1");
    }
  };
  if (nodes[0]) walk(nodes[0], "");
  return codes;
}`,
    },
    quiz: [
      {
        id: "hf1",
        prompt: "Huffman 每次合併的是？",
        options: ["頻率最高的兩棵樹", "頻率最低的兩棵樹", "任意兩葉", "最深的兩葉"],
        answer: 1,
        explanation: "讓罕見符號走較深的路徑。",
      },
      {
        id: "hf2",
        prompt: "Huffman 碼是哪一種碼？",
        options: ["固定長度碼", "前綴碼", "後綴碼", "雜湊碼"],
        answer: 1,
        explanation: "葉節點路徑天然形成前綴碼。",
      },
      {
        id: "hf3",
        prompt: "n 個符號的 Huffman 樹合併次數？",
        options: ["n", "n-1", "n log n", "2n"],
        answer: 1,
        explanation: "每次減少一棵樹，直到剩根。",
      },
    ],
    related: ["kruskal", "knapsack", "set-cover"],
  },
  {
    slug: "set-cover",
    name: "子集覆蓋",
    english: "Set Cover",
    category: "greedy",
    examWeight: "高",
    tags: ["貪婪", "近似演算法", "NP-hard", "集合覆蓋"],
    summary:
      "用最少個子集蓋住整個宇宙 U。精確版是 NP-hard；研究所常考的是「每次選覆蓋最多尚未覆蓋元素」的貪婪法，以及近似比 H(n)（調和數）。",
    idea: "還沒蓋到的元素叫剩餘宇宙。每輪掃過所有還沒被選的集合，選「與剩餘宇宙交集最大」的那一個（平手依編號）。把新蓋到的元素從剩餘裡刪掉，直到蓋完。這個策略沒有最優子結構到能保證 OPT，但可以證明解的大小 ≤ H(s)·OPT，s 是最大集合的元素數，H(s)=1+1/2+…+1/s ≤ ln s + 1。",
    whenToUse: [
      "設施選址、感測器佈點、測驗題組覆蓋知識點",
      "需要可行解、允許近似，而不是指數時間的精確 DP",
      "點覆蓋、Hitting Set 等可化成集合覆蓋的問題",
    ],
    examTips: [
      "判定版「能否用 k 個集合蓋完」是 NP-complete；優化版 NP-hard。",
      "貪婪近似比 H(n)，n=|U| 或最大集合大小 s。H(n)≈ ln n + γ。",
      "除非 P=NP，不存在比 (1-o(1)) ln n 更好的多項式近似（Feige）。",
      "加權版改選「新覆蓋數 / 成本」最大的集合，近似比仍是 H(n)。",
      "Vertex Cover：每條邊當元素、每個點當「關聯邊」的集合。圖上另有 2-approx（取最大匹配的兩端）。",
      "證明直覺：把 OPT 的代價均攤到元素上，第 i 個被蓋的元素最多分到 OPT/i，加總就是 H。",
    ],
    pitfalls: [
      "以為貪婪一定最優——下面例子貪婪 3、OPT 2。",
      "平手時沒寫清楚規則，手算會和解答選到不同集合。",
      "把「最大集合」理解成原始大小，而不是「還能新蓋幾個」。",
      "和 0/1 背包、集合包裝（Set Packing，選的集合要互斥）搞反。",
    ],
    complexity: {
      timeBest: "O(m n)",
      timeAvg: "O(m² n) 樸素",
      timeWorst: "O(m² n) 樸素",
      space: "Θ(m n)",
    },
    complexityNote:
      "m 個集合、宇宙 n 個元素。每輪掃描所有集合算新覆蓋，最多選 m 次。用堆積可再降，考試默認寫樸素即可。",
    workedExample: {
      title: "貪婪 ≠ OPT 的標準小例子",
      input: "U={1,2,3,4,5,6}，S1={1,2,3,4}，S2={1,2,5}，S3={3,4,6}",
      steps: [
        {
          title: "第 1 輪：比新覆蓋數",
          detail:
            "S1 新蓋 4 個，S2、S3 各 3 個。選 S1。剩餘 {5,6}。",
        },
        {
          title: "第 2 輪",
          detail: "S2 新蓋 {5}（1 個），S3 新蓋 {6}（1 個）。平手選編號較小的 S2。剩餘 {6}。",
        },
        {
          title: "第 3 輪",
          detail: "S3 新蓋 {6}，選 S3。剩餘空集合，結束。",
        },
        {
          title: "對照 OPT",
          detail:
            "S2 ∪ S3 = {1,2,5,3,4,6} = U，兩個集合就夠。貪婪用了 3 個。比值 3/2 ≤ H(4)=1+1/2+1/3+1/4=2.083（S1 最大，s=4）。",
        },
      ],
      result: "貪婪 {S1,S2,S3}，OPT={S2,S3}",
    },
    visualizer: "sets",
    pseudocode: `GREEDY-SET-COVER(U, F)
  C ← ∅                  // 已選的集合
  R ← U                  // 尚未覆蓋的元素
  while R ≠ ∅
    選 S ∈ F\\C 使得 |S ∩ R| 最大
    C ← C ∪ {S}
    R ← R \\ S
  return C

加權版：選使 |S ∩ R| / cost(S) 最大的 S。
近似保證：|C| ≤ H(s) · OPT，s = max |S|。`,
    codes: {
      python: `def greedy_set_cover(universe: set[str], family: dict[str, set[str]]) -> list[str]:
    remaining = set(universe)
    unused = dict(family)
    picked: list[str] = []
    while remaining and unused:
        name = max(unused, key=lambda k: len(unused[k] & remaining))
        if not (unused[name] & remaining):
            break
        picked.append(name)
        remaining -= unused.pop(name)
    return picked

U = {"1", "2", "3", "4", "5", "6"}
F = {
    "S1": {"1", "2", "3", "4"},
    "S2": {"1", "2", "5"},
    "S3": {"3", "4", "6"},
}
print(greedy_set_cover(U, F))  # ['S1', 'S2', 'S3']`,
      cpp: `vector<string> greedy_set_cover(
    const set<int>& U,
    const vector<pair<string, set<int>>>& F
) {
    set<int> rem = U;
    vector<int> used(F.size(), 0);
    vector<string> picked;
    while (!rem.empty()) {
        int best = -1, gain = 0;
        for (int i = 0; i < (int)F.size(); ++i) if (!used[i]) {
            int g = 0;
            for (int x : F[i].second) if (rem.count(x)) ++g;
            if (g > gain) { gain = g; best = i; }
        }
        if (best < 0 || gain == 0) break;
        used[best] = 1;
        picked.push_back(F[best].first);
        for (int x : F[best].second) rem.erase(x);
    }
    return picked;
}`,
      typescript: `function greedySetCover(
  universe: string[],
  family: Record<string, string[]>
) {
  const remaining = new Set(universe);
  const unused = { ...family };
  const picked: string[] = [];
  while (remaining.size) {
    let best = "";
    let gain = 0;
    for (const [name, els] of Object.entries(unused)) {
      const g = els.filter((x) => remaining.has(x)).length;
      if (g > gain) {
        gain = g;
        best = name;
      }
    }
    if (!best || gain === 0) break;
    picked.push(best);
    for (const x of unused[best]) remaining.delete(x);
    delete unused[best];
  }
  return picked;
}`,
    },
    quiz: [
      {
        id: "sc1",
        prompt: "集合覆蓋問題（精確求最少集合數）屬於？",
        options: [
          "P，有線性時間演算法",
          "NP-hard（判定版 NP-complete）",
          "只能用動態規劃，沒有貪婪",
          "和最小生成樹一樣有切性質保證最優",
        ],
        answer: 1,
        explanation: "經典 NP-complete；貪婪只給近似解。",
      },
      {
        id: "sc2",
        prompt: "貪婪集合覆蓋（每次選新覆蓋最多）的近似比？",
        options: [
          "永遠 2",
          "H(n)（調和數，約 ln n）",
          "n（集合數）",
          "沒有保證，可任意差",
        ],
        answer: 1,
        explanation: "H(s)≤ln s+1，s 為最大集合大小；這幾乎已是多項式演算法能達到的最佳。",
      },
      {
        id: "sc3",
        prompt: "U={1..6}，S1={1,2,3,4}，S2={1,2,5}，S3={3,4,6}。貪婪與 OPT 各選幾個集合？",
        options: [
          "貪婪 2、OPT 2",
          "貪婪 3、OPT 2",
          "貪婪 2、OPT 3",
          "貪婪 1、OPT 1",
        ],
        answer: 1,
        explanation: "S1 先被選（新蓋 4），再補 S2、S3；OPT 直接 S2∪S3。",
      },
    ],
    related: ["huffman", "vertex-cover", "activity-selection"],
  },
  {
    slug: "master-theorem",
    name: "主定理",
    english: "Master Theorem",
    category: "complexity",
    examWeight: "極高",
    tags: ["遞迴式", "分治", "漸進分析"],
    summary:
      "解 T(n)=a T(n/b)+f(n) 的速查表。研究所幾乎必考：判斷三情況、log_b a、以及不能套用的反例。",
    idea: "遞迴樹有 log_b n 層，每層節點數乘 a，葉節點總成本 Θ(n^{log_b a})。把 f(n) 與葉成本比大小：誰大聽誰的；同階就多一個 log。",
    whenToUse: [
      "標準分治：Merge Sort、二分、Strassen 這類固定切法",
      "a、b 為常數，子問題大小相同",
    ],
    examTips: [
      "情況 1：f(n) = O(n^{log_b a - ε})，葉主導，T=Θ(n^{log_b a})。",
      "情況 2：f(n)=Θ(n^{log_b a} log^k n)，常見 k=0 則 T=Θ(n^{log_b a} log n)。",
      "情況 3：f 較大且滿足正則性 a f(n/b) ≤ c f(n)，c<1，則 T=Θ(f(n))。",
      "Merge Sort：a=2,b=2,f=n → 情況 2 → Θ(n log n)。",
      "不能用：子問題大小不同（如 T(n)=T(n/3)+T(2n/3)+n 要用遞迴樹 / Akra-Bazzi）。",
      "f 在葉與根之間「卡在縫隙」也不能硬套。",
    ],
    pitfalls: [
      "比較指數時忘記 ε 必須 >0。",
      "情況 3 忘了檢查正則性。",
      "把 T(n)=2T(n-1)+1 當成主定理（那是減治，答案 Θ(2^n)）。",
    ],
    complexity: {
      timeBest: "視情況",
      timeAvg: "視情況",
      timeWorst: "視情況",
      space: "—",
    },
    complexityNote: "主定理給的是遞迴式的解，不是單一演算法的複雜度。",
    workedExample: {
      title: "三道標準題",
      input: "判斷情況並給 Θ",
      steps: [
        {
          title: "T(n)=8T(n/2)+n²",
          detail: "log_b a = 3，n² vs n³，f 較小（ε=1）→ 情況 1 → Θ(n³)。",
        },
        {
          title: "T(n)=2T(n/2)+n",
          detail: "log_b a=1，f=Θ(n) → 情況 2 → Θ(n log n)。",
        },
        {
          title: "T(n)=2T(n/2)+n²",
          detail: "n² 比 n 大，正則性 2·(n/2)²=n²/2 ≤ c n² → 情況 3 → Θ(n²)。",
        },
      ],
      result: "Θ(n³)、Θ(n log n)、Θ(n²)",
    },
    visualizer: "none",
    pseudocode: `主定理（常見形式）
  T(n) = a T(n/b) + f(n),  a≥1, b>1

  令 c_crit = log_b a
  1) f(n) = O(n^{c_crit - ε}) , ε>0     ⇒  T(n)=Θ(n^{c_crit})
  2) f(n) = Θ(n^{c_crit} log^k n), k≥0
        k=0 ⇒ Θ(n^{c_crit} log n)
        k≥0 一般 ⇒ Θ(n^{c_crit} log^{k+1} n)
  3) f(n) = Ω(n^{c_crit + ε}) 且 a f(n/b) ≤ c f(n), c<1
        ⇒  T(n)=Θ(f(n))`,
    codes: {
      python: `import math

def master_case(a: float, b: float, f_exp: float) -> str:
    """比較 f(n)=Θ(n^{f_exp}) 與 n^{log_b a}（忽略 log 因子與正則性）。"""
    crit = math.log(a) / math.log(b)
    eps = 1e-9
    if f_exp < crit - eps:
        return f"情況 1 → Θ(n^{crit:.3g})"
    if abs(f_exp - crit) < eps:
        return f"情況 2 → Θ(n^{crit:.3g} log n)"
    return f"情況 3（需正則性）→ Θ(n^{f_exp:.3g})"

print(master_case(2, 2, 1))  # Merge Sort
print(master_case(8, 2, 2))
print(master_case(2, 2, 2))`,
      cpp: `// 主定理是分析工具，通常用手算。
// 記住：Merge Sort (2,2,n) → n log n
// Binary Search (1,2,1) → log n
// 一般遞迴樹：層成本 a^i * f(n/b^i)`,
      typescript: `function masterCase(a: number, b: number, fExp: number) {
  const crit = Math.log(a) / Math.log(b);
  if (fExp < crit - 1e-9) return \`情況 1 → Θ(n^\${crit.toFixed(3)})\`;
  if (Math.abs(fExp - crit) < 1e-9) return \`情況 2 → Θ(n^\${crit.toFixed(3)} log n)\`;
  return \`情況 3 → Θ(n^\${fExp})\`;
}`,
    },
    quiz: [
      {
        id: "mt1",
        prompt: "T(n)=2T(n/2)+n 的解？",
        options: ["Θ(n)", "Θ(n log n)", "Θ(n²)", "Θ(log n)"],
        answer: 1,
        explanation: "Merge Sort 型，情況 2。",
      },
      {
        id: "mt2",
        prompt: "T(n)=T(n/2)+1（二分搜尋）？",
        options: ["Θ(1)", "Θ(log n)", "Θ(n)", "Θ(n log n)"],
        answer: 1,
        explanation: "a=1,b=2,f=1，log_b a=0，情況 2 → Θ(log n)。",
      },
      {
        id: "mt3",
        prompt: "哪一個不能直接套用標準主定理？",
        options: [
          "T(n)=4T(n/2)+n",
          "T(n)=T(n/3)+T(2n/3)+n",
          "T(n)=7T(n/2)+n²",
          "T(n)=2T(n/2)+n log n（可用延伸情況 2）",
        ],
        answer: 1,
        explanation: "子問題大小不同，標準 aT(n/b) 形式不成立。",
      },
    ],
    related: ["merge-sort", "binary-search", "quick-sort"],
  },
];
