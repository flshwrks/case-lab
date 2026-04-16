"use client";

import { CASES, CASE_TYPE_LABELS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/data/cases";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CaseDoc } from "@/types";

interface CaseSelectorProps {
  onSelect: (caseDoc: CaseDoc) => void;
}

export function CaseSelector({ onSelect }: CaseSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">ケースを選択</h2>
        <p className="text-sm text-muted-foreground mt-1">
          AIが本物のMBB面接官として壁打ちを行います。
        </p>
      </div>
      <div className="grid gap-4">
        {CASES.map((c) => (
          <Card key={c.id} className="hover:border-primary transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-snug">{c.title}</CardTitle>
                <div className="flex gap-1 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {CASE_TYPE_LABELS[c.type]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${DIFFICULTY_COLORS[c.difficulty]}`}
                  >
                    {DIFFICULTY_LABELS[c.difficulty]}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                {c.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{c.prompt}</p>
              <Button size="sm" onClick={() => onSelect(c)} className="w-full">
                このケースで壁打ちを開始
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
