"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CASES, CASE_TYPE_LABELS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/data/cases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shuffle, PenLine, ChevronDown, ChevronUp } from "lucide-react";
import type { CaseType } from "@/types";

export default function ModelAnswerIndexPage() {
  const router = useRouter();
  const [customType, setCustomType] = useState<CaseType>("profitability");
  const [customText, setCustomText] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleRandom = () => {
    const randomCase = CASES[Math.floor(Math.random() * CASES.length)];
    router.push(`/model-answer/${randomCase.id}`);
  };

  const handleCustomSubmit = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    const params = new URLSearchParams();
    params.set("customPrompt", trimmed);
    router.push(`/model-answer/${customType}?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">模範解答モード</h2>
        <p className="text-sm text-muted-foreground mt-1">
          MBB水準のモデルアンサーを確認できます。壁打ち後の比較にも使えます。
        </p>
      </div>

      {/* Random + Custom buttons */}
      <div className="flex gap-2 mb-5">
        <Button variant="outline" className="flex-1 gap-2" onClick={handleRandom}>
          <Shuffle className="h-4 w-4" />
          ランダムに見る
        </Button>
        <Button
          variant={showCustom ? "secondary" : "outline"}
          className="flex-1 gap-2"
          onClick={() => setShowCustom((v) => !v)}
        >
          <PenLine className="h-4 w-4" />
          カスタムテーマ
          {showCustom ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </div>

      {/* Custom theme form */}
      {showCustom && (
        <Card className="border-primary/40 bg-primary/5 mb-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">カスタムテーマの模範解答を生成</CardTitle>
            <CardDescription className="text-xs">
              自由にケースのテーマを入力してください。AIがMBB水準の模範解答を作成します。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">ケース種別</label>
              <Select value={customType} onValueChange={(v) => setCustomType(v as CaseType)}>
                <SelectTrigger className="text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CASE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="text-sm">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">ケースの内容</label>
              <Textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="例: 国内大手航空会社の収益が3年連続で低下しています。原因を特定し、改善施策を提案してください。"
                className="text-sm min-h-[100px] resize-none"
              />
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={handleCustomSubmit}
              disabled={!customText.trim()}
            >
              模範解答を生成
            </Button>
          </CardContent>
        </Card>
      )}

      <Separator className="mb-5" />

      {/* Preset cases */}
      <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">プリセットケース</p>
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
