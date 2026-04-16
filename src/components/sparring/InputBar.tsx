"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Send, Square } from "lucide-react";

interface InputBarProps {
  onSend: (text: string) => void;
  onHint: () => void;
  onEnd: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export function InputBar({ onSend, onHint, onEnd, disabled, isLoading }: InputBarProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-3xl mx-auto space-y-2">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="回答を入力してください（Enterで送信、Shift+Enterで改行）"
            disabled={disabled || isLoading}
            className="flex-1 min-h-[80px] max-h-[200px] resize-none text-sm"
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSend}
              disabled={disabled || isLoading || !text.trim()}
              size="icon"
              className="h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onHint}
              disabled={disabled || isLoading}
              className="text-xs gap-1"
            >
              <Lightbulb className="h-3 w-3" />
              ヒントをください
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onEnd}
            disabled={isLoading}
            className="text-xs gap-1"
          >
            <Square className="h-3 w-3" />
            セッション終了・フィードバック取得
          </Button>
        </div>
      </div>
    </div>
  );
}
