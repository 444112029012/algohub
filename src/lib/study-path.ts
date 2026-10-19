export const studyPath = [
  { title: "堆疊與佇列", slugs: [["stack", "堆疊"], ["queue", "佇列"]] },
  { title: "圖的遍歷", slugs: [["bfs", "廣度優先搜尋"], ["dfs", "深度優先搜尋"]] },
  { title: "最短路徑", slugs: [["dijkstra", "Dijkstra"], ["bellman-ford", "Bellman-Ford"], ["floyd-warshall", "Floyd–Warshall"]] },
  { title: "最小生成樹", slugs: [["kruskal", "Kruskal"], ["prim", "Prim"]] },
  { title: "動態規劃", slugs: [["knapsack", "0/1 背包"], ["lcs", "最長共同子序列"]] },
  { title: "貪婪演算法", slugs: [["activity-selection", "活動選擇"]] },
  { title: "分治與主定理", slugs: [["master-theorem", "主定理"]] },
  { title: "NP 完備化約", slugs: [["three-sat", "3-SAT"]] },
] as const;

export type PathStop = {
  slug: string;
  label: string;
  station: number;
  title: string;
};

const flat: PathStop[] = studyPath.flatMap((step, i) =>
  step.slugs.map(([slug, label]) => ({
    slug,
    label,
    station: i + 1,
    title: step.title,
  }))
);

export const studyPathSlugs = new Set(flat.map((s) => s.slug));

export function studyNeighbors(slug: string) {
  const index = flat.findIndex((s) => s.slug === slug);
  if (index < 0) return null;
  return {
    current: flat[index]!,
    prev: flat[index - 1],
    next: flat[index + 1],
  };
}
