export const studyPath = [
  { title: "堆疊與佇列", slugs: [["stack", "堆疊"], ["queue", "佇列"]] },
  { title: "先會走圖", slugs: [["bfs", "BFS"], ["dfs", "DFS"]] },
  { title: "最短路三兄弟", slugs: [["dijkstra", "Dijkstra"], ["bellman-ford", "Bellman-Ford"], ["floyd-warshall", "Floyd"]] },
  { title: "最小生成樹", slugs: [["kruskal", "Kruskal"], ["prim", "Prim"]] },
  { title: "動態規劃樣板", slugs: [["knapsack", "0/1 背包"], ["lcs", "LCS"]] },
  { title: "貪婪先看這題", slugs: [["activity-selection", "活動選擇"]] },
  { title: "遞迴式", slugs: [["master-theorem", "主定理"]] },
  { title: "化約從這裡出發", slugs: [["three-sat", "3-SAT"]] },
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
