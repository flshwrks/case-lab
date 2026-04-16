"use client";

import { useRouter } from "next/navigation";
import { useSparringSession } from "@/hooks/useSparringSession";
import { CaseSelector } from "@/components/sparring/CaseSelector";
import { ChatWindow } from "@/components/sparring/ChatWindow";
import { InputBar } from "@/components/sparring/InputBar";
import { FeedbackPanel } from "@/components/sparring/FeedbackPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import type { CaseDoc, CaseType } from "@/types";
import { CASE_TYPE_LABELS } from "@/data/cases";

export default function SparringPage() {
  const router = useRouter();
  const {
    session,
    isThinking,
    isLoadingFeedback,
    error,
    startSession,
    sendMessage,
    requestHint,
    endSession,
    resetSession,
  } = useSparringSession();

  const handleCaseSelect = (caseDoc: CaseDoc) => {
    startSession(caseDoc.id, caseDoc.title, caseDoc.type);
  };

  const handleCustom = (caseType: CaseType, customPrompt: string) => {
    startSession(caseType, "カスタムケース", caseType, customPrompt);
  };

  const handleViewModelAnswer = () => {
    if (!session) return;
    const params = new URLSearchParams();
    params.set("sessionId", session.id);
    if (session.customPrompt) params.set("customPrompt", session.customPrompt);
    router.push(`/model-answer/${session.caseId}?${params.toString()}`);
  };

  // Case selection screen
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <CaseSelector onSelect={handleCaseSelect} onCustom={handleCustom} />
      </div>
    );
  }

  // Loading feedback
  if (isLoadingFeedback) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          フィードバックを生成中です...（30秒ほどかかる場合があります）
        </p>
      </div>
    );
  }

  // Feedback screen
  if (session.status === "feedback_ready" && session.feedback) {
    return (
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 mb-4">
          <h2 className="text-xl font-semibold">セッション完了</h2>
          <p className="text-sm text-muted-foreground">{session.caseTitle}</p>
        </div>
        <FeedbackPanel
          feedback={session.feedback}
          onRestart={resetSession}
          onViewModelAnswer={handleViewModelAnswer}
        />
      </div>
    );
  }

  // Active session
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Session header */}
      <div className="border-b border-border px-4 py-2 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate max-w-[300px]">
            {session.caseTitle}
          </span>
          <Badge variant="outline" className="text-xs">
            {CASE_TYPE_LABELS[session.caseType]}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {error}
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={resetSession} className="text-xs">
            ← ケース選択に戻る
          </Button>
        </div>
      </div>

      {/* Chat area */}
      <ChatWindow messages={session.messages} isThinking={isThinking} />

      {/* Input */}
      <InputBar
        onSend={sendMessage}
        onHint={requestHint}
        onEnd={endSession}
        disabled={isThinking || session.status !== "active"}
        isLoading={isThinking}
      />
    </div>
  );
}
