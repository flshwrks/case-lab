"use client";

import type { Message } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ModelAnswerDisplay } from "./ModelAnswerDisplay";

interface CompareViewProps {
  transcript: Message[];
  modelAnswerContent: string;
  isStreaming: boolean;
}

export function CompareView({
  transcript,
  modelAnswerContent,
  isStreaming,
}: CompareViewProps) {
  const userMessages = transcript.filter((m) => m.role === "user");

  return (
    <div className="grid grid-cols-2 gap-4 h-full min-h-0">
      {/* User's approach */}
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-semibold text-sm">あなたの回答</h3>
          <Badge variant="outline" className="text-xs">トランスクリプト</Badge>
        </div>
        <ScrollArea className="flex-1 border border-border rounded-lg p-3">
          <div className="space-y-3">
            {userMessages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <p className="text-xs text-muted-foreground mb-1">
                  {new Date(msg.timestamp).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Model answer */}
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-semibold text-sm">模範解答</h3>
          <Badge className="text-xs">MBB水準</Badge>
        </div>
        <ScrollArea className="flex-1 border border-border rounded-lg p-3">
          <ModelAnswerDisplay content={modelAnswerContent} isStreaming={isStreaming} />
        </ScrollArea>
      </div>
    </div>
  );
}
