"use client";

import { useEffect } from "react";

export function RememberVisit({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("algo-seen") ?? "[]") as unknown;
      const seen = Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
      if (!seen.includes(slug)) {
        seen.push(slug);
        localStorage.setItem("algo-seen", JSON.stringify(seen));
      }
    } catch {
      /* 私人瀏覽或額度滿了就略過 */
    }
  }, [slug]);
  return null;
}
