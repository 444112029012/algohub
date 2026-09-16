# 演算法研究室｜研究所常考演算法

針對資訊研究所入學考試整理的互動教材：每支演算法包含介紹、複雜度、手算步驟、虛擬碼、Python / C++ / TypeScript，並在適合的篇目提供逐步示意。

## 涵蓋範圍

- 排序：氣泡／插入／選擇、Merge／Quick／Heap、計數／基數、Quickselect
- 搜尋：二分搜尋、答案上二分
- 圖論：BFS、DFS、Dijkstra、Bellman-Ford、Floyd–Warshall、Kruskal、Prim、拓樸、最大流、SCC、2-SAT
- 動態規劃：0/1 背包、無限背包／零錢、LCS、LIS、編輯距離、矩陣鏈乘、子集和
- 貪婪：Huffman、活動選擇、分數背包、子集覆蓋
- NP 與近似：3-SAT、團與獨立集、點覆蓋、擊中集、哈密頓／TSP
- 其他：Heap、並查集、KMP、主定理

## 本機執行

需要 Node.js 18+。

```bash
npm install
npm run dev -- --port 43127 --hostname 127.0.0.1
```

瀏覽器打開提示的網址。

```bash
npm run build
npm start
```

## 怎麼讀

1. 首頁依考頻與主題挑一篇。
2. 先看「想法」和複雜度，再按「下一步」對著手算。
3. 虛擬碼對完再看實作；最後做三題自我測驗。
4. 選擇題前先翻「複雜度速查」。
