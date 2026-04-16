"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { ModelAnswerRequest } from "@/types";

interface UseModelAnswerReturn {
  content: string;
  isStreaming: boolean;
  error: string | null;
  generate: (req: ModelAnswerRequest) => Promise<void>;
  reset: () => void;
}

export function useModelAnswer(): UseModelAnswerReturn {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const generate = useCallback(async (req: ModelAnswerRequest) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setContent("");
    setError(null);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/model-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Stream error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data) as { text: string };
            setContent((prev) => prev + parsed.text);
          } catch {
            // ignore malformed chunks
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("模範解答の生成に失敗しました。再度お試しください。");
      }
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setContent("");
    setError(null);
    setIsStreaming(false);
  }, []);

  return { content, isStreaming, error, generate, reset };
}
