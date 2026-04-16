"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadHistory, deleteSession } from "@/lib/storage";
import type { SparringSession } from "@/types";
import { CASE_TYPE_LABELS, READINESS_CONFIG } from "@/data/cases";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, BookOpen } from "lucide-react";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SparringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadHistory().then(({ sessions }) => {
      setSessions(sessions.filter((s) => s.status === "feedback_ready"));
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <p className="text-muted-foreground text-sm">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">セッション履歴</h2>
        <p className="text-sm text-muted-foreground mt-1">
          完了したセッションの一覧です。
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">完了したセッションがありません。</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/sparring")}
          >
            壁打きを始める
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const readiness = s.feedback
              ? READINESS_CONFIG[s.feedback.mckinsey_readiness]
              : null;
            const duration = s.endedAt
              ? Math.round((s.endedAt - s.startedAt) / 60000)
              : null;

            return (
              <Card key={s.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm">{s.caseTitle}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(s.startedAt).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {duration !== null && ` · ${duration}分`}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {CASE_TYPE_LABELS[s.caseType]}
                      </Badge>
                      {readiness && (
                        <Badge variant="outline" className={`text-xs ${readiness.color}`}>
                          {readiness.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {s.feedback && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {s.feedback.overall}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1 text-xs"
                      onClick={() =>
                        router.push(
                          `/model-answer/${s.caseId}?sessionId=${s.id}`
                        )
                      }
                    >
                      <BookOpen className="h-3 w-3" />
                      模範解答と比較
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive gap-1 text-xs"
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
