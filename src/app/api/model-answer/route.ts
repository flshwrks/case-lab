export const runtime = "nodejs";

import { NextRequest } from "next/server";
import anthropic from "@/lib/anthropic";
import { getCaseById } from "@/data/cases";
import { buildModelAnswerSystemPrompt, buildCustomCaseDoc } from "@/lib/prompts";
import type { ModelAnswerRequest, CaseType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: ModelAnswerRequest = await req.json();
    const { caseId, userTranscript, customPrompt, customCaseType } = body;

    const caseDoc = getCaseById(caseId)
      ?? (customPrompt ? buildCustomCaseDoc(customPrompt, (customCaseType ?? caseId) as CaseType) : null);
    if (!caseDoc) {
      return new Response("Case not found", { status: 404 });
    }

    const systemPrompt = buildModelAnswerSystemPrompt(caseDoc, userTranscript);

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: "模範解答を作成してください。",
        },
      ],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Model answer API error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
