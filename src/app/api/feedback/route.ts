export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { getCaseById } from "@/data/cases";
import { buildFeedbackSystemPrompt, buildFallbackFeedback, buildCustomCaseDoc } from "@/lib/prompts";
import type { FeedbackRequest, SessionFeedback, CaseType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: FeedbackRequest = await req.json();
    const { transcript, caseId, customPrompt } = body;

    const caseDoc = getCaseById(caseId)
      ?? (customPrompt ? buildCustomCaseDoc(customPrompt, (caseId as CaseType) ?? "profitability") : null);
    if (!caseDoc) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const systemPrompt = buildFeedbackSystemPrompt(caseDoc);
    const transcriptText = transcript
      .map(
        (m) =>
          `[${m.role === "user" ? "候補者" : "面接官"}]: ${m.content}`
      )
      .join("\n\n");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      temperature: 0,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `以下の面接トランスクリプトを評価してください:\n\n${transcriptText}`,
        },
      ],
    });

    const raw =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    let feedback: SessionFeedback;
    try {
      // Strip any accidental markdown fences
      const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      feedback = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse feedback JSON:", raw);
      feedback = buildFallbackFeedback();
    }

    return NextResponse.json(feedback);
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(buildFallbackFeedback(), { status: 200 });
  }
}
