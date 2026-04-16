"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface ChatWindowProps {
  messages: Message[];
  isThinking: boolean;
}

export function ChatWindow({ messages, isThinking }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <ScrollArea className="flex-1 px-4 py-4">
      <div className="space-y-4 max-w-3xl mx-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              )}
            >
              {msg.role === "assistant" && (
                <div className="text-xs font-semibold mb-1 opacity-60">Alex（面接官）</div>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="text-xs font-semibold mb-1 opacity-60">Alex（面接官）</div>
              <div className="flex gap-1 items-center h-5">
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
