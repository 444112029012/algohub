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
  ["Dijkstra", "O((V+E) log V)", "非負權單源最短路", "負權應改用 Bellman-Ford"],
  ["Bellman-Ford", "Θ(VE)", "可負權、可偵測負環", "佇列優化最壞仍 Θ(VE)"],
  ["Floyd–Warshall", "Θ(V³)", "全點對、可負權", "有負環時對角會 < 0"],
  ["Kruskal", "O(E log E)", "MST、稀疏圖", "並查集成環判斷"],
  ["Prim", "O(V²) 或 O(E log V)", "MST、稠密圖", "由頂點向外擴張"],
  ["Kahn 拓樸", "Θ(V+E)", "DAG 排程", "無法完成排序即存在環"],
  ["SCC Kosaraju／Tarjan", "Θ(V+E)", "有向圖強連通、縮點", "第二次要走反向圖"],
  ["2-SAT", "Θ(n+m)", "implication + SCC", "x 與 ¬x 同分量 ⇒ 無解"],
  ["最大流 EK", "O(V E²)", "增廣路、最小割", "須保留反向邊"],
];

const dpRows = [
  ["0/1 背包", "Θ(nW)", "每件至多一次", "一維要倒序"],
  ["Unbounded 背包", "Θ(nW)", "可重複", "一維要正序"],
  ["分數背包", "O(n log n)", "可切割", "密度貪婪，不是 DP"],
  ["子集覆蓋（貪婪）", "O(m² n)", "每次選新覆蓋最多", "精確版 NP-hard，近似比 H(n)"],
  ["Huffman", "O(n log n)", "合併頻率最小的兩棵樹", "前綴碼、平均碼長"],
  ["LCS", "Θ(mn)", "子序列可跳字", "不是最長共同子字串"],
  ["LIS（耐心排序）", "O(n log n)", "最長遞增子序列", "DP 樸素是 O(n²)"],
  ["編輯距離", "Θ(mn)", "插刪替", "相同走左上 +0"],
  ["矩陣鏈乘", "Θ(n³)", "區間 DP 括號化", "Catalan 是方案數"],
  ["活動選擇", "O(n log n)", "結束最早", "貪婪即最優"],
];

function CheatTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <Card className="cheat-fit paper-card overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="cheat-cards space-y-2 px-4 pb-4">
          {rows.map((row) => (
            <div key={row[0]} className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="font-medium">{row[0]}</p>
              <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {headers.slice(1).map((header, index) => (
                  <div key={header} className="min-w-0">
                    <dt className="text-muted-foreground">{header}</dt>
                    <dd className="break-words">{row[index + 1]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
        <div className="cheat-grid">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-3 py-2 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-t border-border">
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`} className="px-3 py-2 align-top break-words">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CheatsheetPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs tracking-[0.2em] text-vermillion">CHEATSHEET</p>
        <h1 className="font-heading mt-2 text-[clamp(1.75rem,4vw,2.5rem)]">複雜度與對照速查</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          選擇題最常出「哪個穩定、哪個最壞 n²、哪個不能有負權」。先盯這幾張表，再進各篇教材看證明直覺與手算。
        </p>
      </div>

      <CheatTable
        title="排序"
        headers={["演算法", "最好", "平均", "最壞", "空間", "穩定", "原地"]}
        rows={sortingCheat.map((r) => [
          r.name,
          r.best,
          r.avg,
          r.worst,
          r.space,
          r.stable ? "是" : "否",
          r.inPlace ? "是" : "否",
        ])}
      />

      <CheatTable title="圖論" headers={["演算法", "時間", "典型用途", "陷阱"]} rows={graphRows} />

      <CheatTable title="動態規劃與貪婪"         headers={["問題", "時間", "重點", "常見混淆"]} rows={dpRows} />

      <CheatTable
        title="搜尋與資料結構"
        headers={["主題", "時間", "重點", "常見混淆"]}
        rows={[
          ["二分搜尋", "Θ(log n)", "已排序／單調", "lo/hi 邊界"],
          ["二分搜尋答案", "Θ(T log R)", "謂詞單調", "搜尋空間是答案，不是下標"],
          ["Quickselect", "期望 Θ(n)", "第 k 小、只走一側", "最壞 n²；BFPRT 最壞線性"],
          ["堆疊", "push／pop Θ(1)", "後進先出", "深度優先搜尋用堆疊，廣度優先搜尋用佇列"],
          ["佇列", "enqueue／dequeue Θ(1)", "先進先出", "以陣列刪除隊首為 Θ(n)"],
          ["二元搜尋樹", "平衡 Θ(log n)", "左小右大", "不平衡時 Θ(n)；不是堆積"],
          ["雜湊表", "平均 Θ(1)", "鍵 % 桶數，碰撞用鏈", "最壞 Θ(n)"],
          ["二元堆積", "insert／pop O(log n)", "建堆 Θ(n)", "0-based 左孩 2i+1"],
          ["並查集", "α(n) 均攤", "路徑壓縮＋按秩", "不支援刪邊"],
        ]}
      />
      <CheatTable
        title="NP-complete 與近似"
        headers={["問題", "關係", "考試重點", "近似"]}
        rows={[
          ["3-SAT", "化約起點（2-SAT 在 P）", "A ≤p B 表示 B 至少與 A 一樣難", "—"],
          ["團／獨立集", "補圖互化", "獨立集大小 k ⇔ 點覆蓋 n-k", "團沒有好的常數近似"],
          ["點覆蓋", "V\\C 是獨立集", "匹配兩端", "2-approx"],
          ["子集覆蓋／擊中集", "關聯矩陣對偶", "每次選新覆蓋最多", "H(n)≈ln n"],
          ["哈密頓／TSP", "歐拉在 P、哈密頓 NPC", "度量才有 MST 加倍", "度量 2-approx"],
          ["子集和／分割", "弱 NPC", "Θ(nT) 偽多項式", "有 FPTAS"],
        ]}
      />

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
