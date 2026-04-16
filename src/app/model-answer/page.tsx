"use client";

import { useRouter } from "next/navigation";
import { CASES, CASE_TYPE_LABELS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/data/cases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModelAnswerIndexPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">模範解答モード</h2>
        <p className="text-sm text-muted-foreground mt-1">
          MBB水準のモデルアンサーを確認できます。壁打き後の比較にも使えます。
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
              <CardDescription className="text-xs">{c.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{c.prompt}</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/model-answer/${c.id}`)}
              >
                模範解答を見る
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
