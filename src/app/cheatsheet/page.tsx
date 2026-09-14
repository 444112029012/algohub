import type { Metadata } from "next";
import Link from "next/link";
import { sortingCheat } from "@/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "複雜度速查",
  description: "研究所常考排序、圖論與 DP 的時間空間對照表。",
};

const graphRows = [
  ["BFS", "Θ(V+E)", "無權最短路、層序", "有權圖不能直接當最短路"],
  ["DFS", "Θ(V+E)", "環、拓樸、SCC", "不是無權最短路"],
  ["Dijkstra", "O((V+E) log V)", "非負權單源最短路", "負權請改 Bellman-Ford"],
  ["Bellman-Ford", "Θ(VE)", "可負權、可偵測負環", "比 Dijkstra 慢"],
  ["Floyd–Warshall", "Θ(V³)", "全點對、可負權", "有負環時對角會 < 0"],
  ["Kruskal", "O(E log E)", "MST、稀疏圖", "並查集成環判斷"],
  ["Prim", "O(V²) 或 O(E log V)", "MST、稠密圖", "從點長樹"],
  ["Kahn 拓樸", "Θ(V+E)", "DAG 排程", "排不出來就有環"],
];

const dpRows = [
  ["0/1 背包", "Θ(nW)", "每件至多一次", "一維要倒序"],
  ["Unbounded 背包", "Θ(nW)", "可重複", "一維要正序"],
  ["分數背包", "O(n log n)", "可切割", "密度貪婪，不是 DP"],
  ["子集覆蓋（貪婪）", "O(m² n)", "每次選新覆蓋最多", "精確版 NP-hard，近似比 H(n)"],
  ["Huffman", "O(n log n)", "合併頻率最小的兩棵樹", "前綴碼、平均碼長"],
  ["LCS", "Θ(mn)", "子序列可跳字", "別當成 substring"],
  ["LIS（耐心排序）", "O(n log n)", "最長遞增子序列", "DP 樸素是 O(n²)"],
];

export default function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <p className="text-xs tracking-[0.2em] text-vermillion">CHEATSHEET</p>
        <h1 className="font-heading mt-2 text-3xl sm:text-4xl">複雜度與對照速查</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          選擇題最常出「哪個穩定、哪個最壞 n²、哪個不能有負權」。先盯這幾張表，再進各篇教材看證明直覺與手算。
        </p>
      </div>

      <Card className="paper-card overflow-hidden">
        <CardHeader>
          <CardTitle>排序</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0 pb-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["演算法", "最好", "平均", "最壞", "空間", "穩定", "原地"].map((h) => (
                  <th key={h} className="px-4 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortingCheat.map((r) => (
                <tr key={r.name} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{r.name}</td>
                  <td className="px-4 py-2 font-mono text-xs">{r.best}</td>
                  <td className="px-4 py-2 font-mono text-xs">{r.avg}</td>
                  <td className="px-4 py-2 font-mono text-xs">{r.worst}</td>
                  <td className="px-4 py-2 font-mono text-xs">{r.space}</td>
                  <td className="px-4 py-2">{r.stable ? "是" : "否"}</td>
                  <td className="px-4 py-2">{r.inPlace ? "是" : "否"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="paper-card overflow-hidden">
        <CardHeader>
          <CardTitle>圖論</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0 pb-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["演算法", "時間", "典型用途", "陷阱"].map((h) => (
                  <th key={h} className="px-4 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {graphRows.map((r) => (
                <tr key={r[0]} className="border-t border-border">
                  {r.map((c) => (
                    <td key={c} className="px-4 py-2">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="paper-card overflow-hidden">
        <CardHeader>
          <CardTitle>動態規劃與貪婪</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto px-0 pb-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {["問題", "時間", "重點", "別搞混"].map((h) => (
                  <th key={h} className="px-4 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpRows.map((r) => (
                <tr key={r[0]} className="border-t border-border">
                  {r.map((c) => (
                    <td key={c} className="px-4 py-2">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        完整推導與動畫請回{" "}
        <Link href="/" className="text-foreground underline-offset-4 hover:underline">
          教材目錄
        </Link>
        。
      </p>
    </div>
  );
}
