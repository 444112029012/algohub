export type CategoryId =
  | "sorting"
  | "search"
  | "graph"
  | "dp"
  | "greedy"
  | "ds"
  | "string"
  | "complexity"
  | "np";

export type ExamWeight = "極高" | "高" | "中";

export type VisualizerKind = "array" | "graph" | "table" | "sets" | "intervals" | "none";

export type CodeLang = "python" | "cpp" | "typescript";

export type Complexity = {
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  space: string;
  stable?: boolean;
  inPlace?: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type WorkedStep = {
  title: string;
  detail: string;
};

export type Algorithm = {
  slug: string;
  name: string;
  english: string;
  category: CategoryId;
  examWeight: ExamWeight;
  tags: string[];
  summary: string;
  idea: string;
  whenToUse: string[];
  examTips: string[];
  pitfalls: string[];
  complexity: Complexity;
  complexityNote: string;
  workedExample: {
    title: string;
    input: string;
    steps: WorkedStep[];
    result: string;
  };
  visualizer: VisualizerKind;
  visualizerSeed?: string;
  pseudocode: string;
  codes: Record<CodeLang, string>;
  quiz: QuizQuestion[];
  related: string[];
};

export const CATEGORIES: {
  id: CategoryId;
  name: string;
  english: string;
  blurb: string;
}[] = [
  {
    id: "sorting",
    name: "排序",
    english: "Sorting",
    blurb: "穩定度、原地、最壞情況是選擇題常客。",
  },
  {
    id: "search",
    name: "搜尋",
    english: "Search",
    blurb: "有序序列上的對數時間，以及邊界條件。",
  },
  {
    id: "graph",
    name: "圖論",
    english: "Graph",
    blurb: "遍歷、最短路徑、最小生成樹幾乎年年出現。",
  },
  {
    id: "dp",
    name: "動態規劃",
    english: "Dynamic Programming",
    blurb: "會寫遞迴式與填表順序，比背模板更重要。",
  },
  {
    id: "greedy",
    name: "貪婪",
    english: "Greedy",
    blurb: "最優子結構 + 貪婪選擇性質要能證明或舉反例。",
  },
  {
    id: "np",
    name: "NP 與近似",
    english: "NP & Approximation",
    blurb: "化約方向、2-approx 與 H(n) 是選擇題主力。",
  },
  {
    id: "ds",
    name: "資料結構",
    english: "Data Structures",
    blurb: "Heap、並查集常作為其他演算法的零件。",
  },
  {
    id: "string",
    name: "字串",
    english: "String",
    blurb: "KMP 的 LPS 表是手算題熱門。",
  },
  {
    id: "complexity",
    name: "複雜度",
    english: "Complexity",
    blurb: "主定理三情況與常見遞迴式必須熟。",
  },
];
