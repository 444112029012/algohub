# 演算法研究室｜研究所常考演算法

針對資訊研究所入學考試整理的互動教材：每支演算法包含介紹、複雜度、手算步驟、虛擬碼、Python / C++ / TypeScript，以及（在排序、圖論、DP 上）可逐步播放的示意。

## 涵蓋範圍

- 排序：Merge / Quick / Heap，外加氣泡、插入、選擇的對照表
- 搜尋：二分搜尋與邊界
- 圖論：BFS、DFS、Dijkstra、Floyd–Warshall、Kruskal、拓樸排序
- 動態規劃：0/1 背包、LCS
- 其他：並查集、KMP、Huffman、主定理

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
