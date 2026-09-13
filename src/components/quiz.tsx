"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/data/types";
import { cn } from "@/lib/utils";

export function Quiz({
  questions,
  slug,
}: {
  questions: QuizQuestion[];
  slug: string;
}) {
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);

  const answered = questions.filter((q) => picked[q.id] !== undefined).length;
  const correct = questions.filter((q) => picked[q.id] === q.answer).length;

  function submit() {
    setRevealed(true);
    try {
      const raw = localStorage.getItem("algo-quiz") ?? "{}";
      const map = JSON.parse(raw) as Record<string, number>;
      map[slug] = correct;
      localStorage.setItem("algo-quiz", JSON.stringify(map));
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-5">
      {questions.map((q, idx) => {
        const choice = picked[q.id];
        return (
          <fieldset key={q.id} className="space-y-2">
            <legend className="text-sm font-medium">
              {idx + 1}. {q.prompt}
            </legend>
            <div className="grid gap-1.5">
              {q.options.map((opt, i) => {
                const selected = choice === i;
                const isAns = revealed && i === q.answer;
                const isWrong = revealed && selected && i !== q.answer;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      setPicked((s) => ({ ...s, [q.id]: i }))
                    }
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      selected && !revealed && "border-primary bg-primary/5",
                      isAns && "border-teal bg-teal/15",
                      isWrong && "border-vermillion bg-vermillion/10",
                      !selected && !isAns && "border-border hover:bg-muted/60"
                    )}
                  >
                    <span className="mr-2 font-mono text-xs text-muted-foreground">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <p className="text-xs text-muted-foreground">{q.explanation}</p>
            )}
          </fieldset>
        );
      })}
      <div className="flex items-center gap-3">
        <Button onClick={submit} disabled={answered < questions.length}>
          對答案
        </Button>
        {revealed && (
          <p className="text-sm">
            得分 {correct} / {questions.length}
            {correct === questions.length
              ? " · 這題型你可以上考場了。"
              : " · 對照解釋再走一遍步驟。"}
          </p>
        )}
      </div>
    </div>
  );
}
