"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCaseById, CASE_TYPE_LABELS } from "@/data/cases";
import { useModelAnswer } from "@/hooks/useModelAnswer";
import { loadSession } from "@/lib/storage";
import { ModelAnswerDisplay } from "@/components/model-answer/ModelAnswerDisplay";
import { CompareView } from "@/components/model-answer/CompareView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BookOpen, GitCompare } from "lucide-react";
import type { SparringSession } from "@/types";
import Link from "next/link";

interface Props {
  params: Promise<{ caseId: string }>;
}

export default function ModelAnswerPage({ params }: Props) {
  const { caseId } = use(params);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const customPrompt = searchParams.get("customPrompt") ?? undefined;

  const [previousSession, setPreviousSession] = useState<SparringSession | null>(null);

  const { content, isStreaming, error, generate, reset } = useModelAnswer();
  const caseDoc = getCaseById(caseId);

  // Load session (if provided) then generate — single effect, no hasLoaded gate needed
  useEffect(() => {
    // For custom cases, caseDoc won't exist — that's fine, API handles it via customPrompt
    if (!caseDoc && !customPrompt) return;

    if (sessionId) {
      loadSession(sessionId)
        .then((s) => {
          setPreviousSession(s ?? null);
          const transcript = s?.messages
            .filter((m) => m.role !== "system")
            .map((m) => ({ role: m.role, content: m.content }));
          generate({ caseId, userTranscript: transcript, customPrompt, customCaseType: caseId });
        })
        .catch(() => generate({ caseId, customPrompt, customCaseType: caseId }));
    } else {
      generate({ caseId, customPrompt, customCaseType: caseId });
    }
  // generate is stable (empty useCallback deps) — intentionally omitted to avoid re-runs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, sessionId, caseDoc, customPrompt]);

  if (!caseDoc && !customPrompt) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <p className="text-muted-foreground">ケースが見つかりません。</p>
        <Link href="/model-answer">
          <Button variant="outline" className="mt-4">
            ← ケース一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const hasComparison = !!previousSession;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <Link href="/model-answer" className="text-sm text-muted-foreground hover:text-foreground">
            ← 一覧
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium truncate max-w-[300px]">{caseDoc?.title ?? "カスタムケース"}</span>
          {caseDoc && (
            <Badge variant="outline" className="text-xs">
              {CASE_TYPE_LABELS[caseDoc.type]}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            reset();
            const transcript = previousSession?.messages
              .filter((m) => m.role !== "system")
              .map((m) => ({ role: m.role, content: m.content }));
            generate({ caseId, userTranscript: transcript });
          }}
          disabled={isStreaming}
          className="text-xs"
        >
          再生成
        </Button>
      </div>

      {/* Case prompt card */}
      <div className="px-4 pt-4 pb-0 max-w-5xl mx-auto w-full">
        <Card className="bg-muted/50">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">ケース問題文</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{caseDoc?.prompt ?? customPrompt}</p>
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 pt-3 max-w-5xl mx-auto w-full">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0 px-4 py-4 max-w-5xl mx-auto w-full">
        {hasComparison ? (
          <Tabs defaultValue="compare" className="flex flex-col h-full">
            <TabsList className="mb-3 self-start">
              <TabsTrigger value="compare" className="gap-1 text-xs">
                <GitCompare className="h-3 w-3" />
                比較ビュー
              </TabsTrigger>
              <TabsTrigger value="model" className="gap-1 text-xs">
                <BookOpen className="h-3 w-3" />
                模範解答のみ
              </TabsTrigger>
            </TabsList>
            <TabsContent value="compare" className="flex-1 min-h-0 mt-0">
              <CompareView
                transcript={previousSession!.messages}
                modelAnswerContent={content}
                isStreaming={isStreaming}
              />
            </TabsContent>
            <TabsContent value="model" className="flex-1 min-h-0 mt-0 overflow-auto">
              <ModelAnswerDisplay content={content} isStreaming={isStreaming} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="overflow-auto h-full">
            {!content && isStreaming && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>模範解答を生成中...</span>
              </div>
            )}
            <ModelAnswerDisplay content={content} isStreaming={isStreaming} />
          </div>
        )}
      </div>
    </div>
  );
}
