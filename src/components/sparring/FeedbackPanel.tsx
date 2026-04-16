"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { READINESS_CONFIG } from "@/data/cases";
import type { SessionFeedback } from "@/types";
import { RotateCcw, BookOpen } from "lucide-react";

interface FeedbackPanelProps {
  feedback: SessionFeedback;
  onRestart: () => void;
  onViewModelAnswer: () => void;
}

type DimensionKey = keyof SessionFeedback["dimensions"];

const dimensionLabels: Record<DimensionKey, string> = {
  mece: "MECE度",
  hypothesis_driven: "仮説思考",
  quantitative: "定量精度",
  structure: "論理構成",
  communication: "コミュニケーション",
};

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full ${
            i <= score ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function FeedbackPanel({
  feedback,
  onRestart,
  onViewModelAnswer,
}: FeedbackPanelProps) {
  const readiness = READINESS_CONFIG[feedback.mckinsey_readiness];

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* Overall */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">セッションフィードバック</CardTitle>
            <Badge variant="outline" className={readiness.color}>
              {readiness.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {feedback.overall}
          </p>
        </CardContent>
      </Card>

      {/* Dimensions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">評価軸（5軸）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.entries(feedback.dimensions) as [DimensionKey, (typeof feedback.dimensions)[DimensionKey]][]).map(([key, dim]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  {dimensionLabels[key]}
                </span>
                <span className="text-sm font-bold">{dim.score}/5</span>
              </div>
              <ScoreBar score={dim.score} />
              <p className="text-xs text-muted-foreground mt-1">
                {dim.observation}
              </p>
              <p className="text-xs text-primary mt-0.5 font-medium">
                → {dim.suggestion}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-green-700">強み</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="text-xs flex gap-2">
                  <span className="text-green-600 flex-shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
              {feedback.strengths.length === 0 && (
                <li className="text-xs text-muted-foreground">なし</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-amber-700">改善点</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {feedback.improvements.map((s, i) => (
                <li key={i} className="text-xs flex gap-2">
                  <span className="text-amber-600 flex-shrink-0">△</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onRestart} className="flex-1 gap-2">
          <RotateCcw className="h-4 w-4" />
          新しいセッションを開始
        </Button>
        <Button onClick={onViewModelAnswer} className="flex-1 gap-2">
          <BookOpen className="h-4 w-4" />
          模範解答と比較する
        </Button>
      </div>
    </div>
  );
}
