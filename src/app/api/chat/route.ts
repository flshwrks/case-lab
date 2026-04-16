export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { getCaseById } from "@/data/cases";
import { buildInterviewerSystemPrompt } from "@/lib/prompts";
import type { ChatRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, caseId, requestingHint } = body;

    const caseDoc = getCaseById(caseId);
    if (!caseDoc) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const systemPrompt = buildInterviewerSystemPrompt(caseDoc, requestingHint);

    // Non-streaming: return complete response for realistic interview feel
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "面接官の応答に失敗しました。再度お試しください。" },
      { status: 500 }
    );
  }
}
