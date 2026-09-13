"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CodeLang } from "@/data/types";

const LABELS: Record<CodeLang, string> = {
  python: "Python",
  cpp: "C++",
  typescript: "TypeScript",
};

export function CodeTabs({ codes }: { codes: Record<CodeLang, string> }) {
  const [copied, setCopied] = useState<CodeLang | null>(null);

  async function copy(lang: CodeLang) {
    await navigator.clipboard.writeText(codes[lang]);
    setCopied(lang);
    window.setTimeout(() => setCopied(null), 1200);
  }

  return (
    <Tabs defaultValue="python">
      <TabsList>
        {(Object.keys(LABELS) as CodeLang[]).map((lang) => (
          <TabsTrigger key={lang} value={lang}>
            {LABELS[lang]}
          </TabsTrigger>
        ))}
      </TabsList>
      {(Object.keys(LABELS) as CodeLang[]).map((lang) => (
        <TabsContent key={lang} value={lang}>
          <div className="relative">
            <Button
              size="xs"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copy(lang)}
            >
              {copied === lang ? "已複製" : "複製"}
            </Button>
            <pre className="overflow-x-auto rounded-xl bg-[#1a2744] p-4 pt-10 text-[13px] leading-relaxed text-[#f4efe4]">
              <code>{codes[lang]}</code>
            </pre>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function PseudoBlock({ text }: { text: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
      {text}
    </pre>
  );
}
