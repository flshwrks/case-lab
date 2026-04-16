"use client";

import { useState } from "react";
import { CASES, CASE_TYPE_LABELS, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/data/cases";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shuffle, PenLine, ChevronDown, ChevronUp } from "lucide-react";
import type { CaseDoc, CaseType } from "@/types";

interface CaseSelectorProps {
  onSelect: (caseDoc: CaseDoc) => void;
  onCustom: (caseType: CaseType, customPrompt: string) => void;
}

export function CaseSelector({ onSelect, onCustom }: CaseSelectorProps) {
  const [customType, setCustomType] = useState<CaseType>("profitability");
  const [customText, setCustomText] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleRandom = () => {
    const randomCase = CASES[Math.floor(Math.random() * CASES.length)];
    onSelect(randomCase);
  };

  const handleCustomSubmit = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    onCustom(customType, trimmed);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">ケースを選択</h2>
        <p className="text-sm text-muted-foreground mt-1">
          AIが本物のMBB面接官として壁打ちを行います。
        </p>
      </div>

      {/* Random + Custom buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleRandom}
        >
          <Shuffle className="h-4 w-4" />
          ランダムに選ぶ
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
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">カスタムテーマを設定</CardTitle>
            <CardDescription className="text-xs">
              自由にケースのテーマを入力してください。AIが面接官として対話します。
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
              このテーマで壁打ちを開始
            </Button>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Preset cases */}
      <div>
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
                    <Badge variant="outline" className={`text-xs ${DIFFICULTY_COLORS[c.difficulty]}`}>
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
    </div>
  );
}
