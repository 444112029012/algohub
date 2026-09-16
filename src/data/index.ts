import { dpExtraLessons } from "./dp-extra";
import { dpLessons } from "./dp";
import { dsExtraLessons } from "./ds-extra";
import { graphExtraLessons } from "./graph-extra";
import { graphLessons } from "./graph";
import { graphSccLessons } from "./graph-scc";
import { greedyExtraLessons } from "./greedy-extra";
import { npLessons } from "./np";
import { otherLessons } from "./other";
import { searchExtraLessons } from "./search-extra";
import { sortingExtraLessons } from "./sorting-extra";
import { sortingLessons } from "./sorting";
import { CATEGORIES, type Algorithm, type CategoryId } from "./types";

export { CATEGORIES };
export type { Algorithm, CategoryId };

export const algorithms: Algorithm[] = [
  ...sortingLessons,
  ...sortingExtraLessons,
  ...searchExtraLessons,
  ...graphLessons,
  ...graphExtraLessons,
  ...graphSccLessons,
  ...dpLessons,
  ...dpExtraLessons,
  ...greedyExtraLessons,
  ...npLessons,
  ...dsExtraLessons,
  ...otherLessons,
];

export const algorithmMap = new Map(algorithms.map((a) => [a.slug, a]));

export function getAlgorithm(slug: string) {
  return algorithmMap.get(slug);
}

export function algorithmsByCategory(id: CategoryId) {
  return algorithms.filter((a) => a.category === id);
}

export const sortingCheat = [
  {
    name: "氣泡排序",
    best: "Θ(n)",
    avg: "Θ(n²)",
    worst: "Θ(n²)",
    space: "Θ(1)",
    stable: true,
    inPlace: true,
  },
  {
    name: "插入排序",
    best: "Θ(n)",
    avg: "Θ(n²)",
    worst: "Θ(n²)",
    space: "Θ(1)",
    stable: true,
    inPlace: true,
  },
  {
    name: "選擇排序",
    best: "Θ(n²)",
    avg: "Θ(n²)",
    worst: "Θ(n²)",
    space: "Θ(1)",
    stable: false,
    inPlace: true,
  },
  {
    name: "合併排序",
    best: "Θ(n log n)",
    avg: "Θ(n log n)",
    worst: "Θ(n log n)",
    space: "Θ(n)",
    stable: true,
    inPlace: false,
  },
  {
    name: "快速排序",
    best: "Θ(n log n)",
    avg: "Θ(n log n)",
    worst: "Θ(n²)",
    space: "Θ(log n)",
    stable: false,
    inPlace: true,
  },
  {
    name: "堆積排序",
    best: "Θ(n log n)",
    avg: "Θ(n log n)",
    worst: "Θ(n log n)",
    space: "Θ(1)",
    stable: false,
    inPlace: true,
  },
  {
    name: "計數排序",
    best: "Θ(n+k)",
    avg: "Θ(n+k)",
    worst: "Θ(n+k)",
    space: "Θ(n+k)",
    stable: true,
    inPlace: false,
  },
  {
    name: "基數排序 LSD",
    best: "Θ(d(n+r))",
    avg: "Θ(d(n+r))",
    worst: "Θ(d(n+r))",
    space: "Θ(n+r)",
    stable: true,
    inPlace: false,
  },
];
