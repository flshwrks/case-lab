"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { SparringSession, Message, SessionFeedback, CaseType } from "@/types";
import { saveSession } from "@/lib/storage";

interface UseSparringSessionReturn {
  session: SparringSession | null;
  isThinking: boolean;
  isLoadingFeedback: boolean;
  error: string | null;
  startSession: (caseId: string, caseTitle: string, caseType: CaseType) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  requestHint: () => Promise<void>;
  endSession: () => Promise<void>;
  resetSession: () => void;
}

export function useSparringSession(): UseSparringSessionReturn {
  const [session, setSession] = useState<SparringSession | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const callChatAPI = useCallback(
    async (currentSession: SparringSession, requestingHint = false): Promise<string | null> => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const apiMessages = currentSession.messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, caseId: currentSession.caseId, requestingHint }),
          signal: abortRef.current.signal,
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        return data.content as string;
      } catch (err) {
        if ((err as Error).name === "AbortError") return null;
        throw err;
      }
    },
    []
  );

  // Shared logic for sendMessage and requestHint
  const addUserMessageAndRespond = useCallback(
    async (userContent: string, requestingHint: boolean, errorMsg: string) => {
      if (!session || isThinking) return;
      setError(null);

      const userMessage: Message = { id: uuidv4(), role: "user", content: userContent, timestamp: Date.now() };
      const updatedSession: SparringSession = { ...session, messages: [...session.messages, userMessage] };
      setSession(updatedSession);
      setIsThinking(true);

      try {
        const content = await callChatAPI(updatedSession, requestingHint);
        if (!content) return;
        const aiMessage: Message = { id: uuidv4(), role: "assistant", content, timestamp: Date.now() };
        setSession((prev) => prev ? { ...prev, messages: [...prev.messages, aiMessage] } : prev);
      } catch {
        setError(errorMsg);
      } finally {
        setIsThinking(false);
      }
    },
    [session, isThinking, callChatAPI]
  );

  const startSession = useCallback(
    async (caseId: string, caseTitle: string, caseType: CaseType) => {
      setError(null);
      const newSession: SparringSession = {
        id: uuidv4(), caseId, caseTitle, caseType,
        messages: [], status: "active", feedback: null,
        startedAt: Date.now(), endedAt: null,
      };
      setSession(newSession);
      setIsThinking(true);
      try {
        const content = await callChatAPI(newSession, false);
        if (!content) return;
        const aiMessage: Message = { id: uuidv4(), role: "assistant", content, timestamp: Date.now() };
        setSession((prev) => prev ? { ...prev, messages: [aiMessage] } : prev);
      } catch {
        setError("面接官との接続に失敗しました。");
      } finally {
        setIsThinking(false);
      }
    },
    [callChatAPI]
  );

  const sendMessage = useCallback(
    (text: string) => addUserMessageAndRespond(text, false, "応答の取得に失敗しました。再度お試しください。"),
    [addUserMessageAndRespond]
  );

  const requestHint = useCallback(
    () => addUserMessageAndRespond("ヒントをください。", true, "ヒントの取得に失敗しました。"),
    [addUserMessageAndRespond]
  );

  const endSession = useCallback(async () => {
    if (!session) return;
    setIsLoadingFeedback(true);
    setError(null);

    const endedSession: SparringSession = { ...session, status: "awaiting_feedback", endedAt: Date.now() };
    setSession(endedSession);

    try {
      const transcript = endedSession.messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, caseId: session.caseId }),
      });
      const feedback: SessionFeedback = await res.json();
      const completedSession: SparringSession = { ...endedSession, status: "feedback_ready", feedback };
      setSession(completedSession);
      await saveSession(completedSession);
    } catch {
      setError("フィードバックの取得に失敗しました。");
      setSession((prev) => prev ? { ...prev, status: "active" } : prev);
    } finally {
      setIsLoadingFeedback(false);
    }
  }, [session]);

  const resetSession = useCallback(() => {
    abortRef.current?.abort();
    setSession(null);
    setIsThinking(false);
    setIsLoadingFeedback(false);
    setError(null);
  }, []);

  return { session, isThinking, isLoadingFeedback, error, startSession, sendMessage, requestHint, endSession, resetSession };
}
