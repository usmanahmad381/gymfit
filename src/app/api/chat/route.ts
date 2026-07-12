import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `
You are the GymFit Assistant — a friendly, concise front-desk helper for the
GymFit fitness club. You ONLY help with GymFit: its classes, schedules, pricing,
memberships, facilities, coaching, hours, location, and contact details.

Rules:
- Answer using the GymFit knowledge base (file search) as your source of truth.
- Stay strictly on-topic. If a question is NOT about GymFit (general knowledge,
  other companies, coding, world facts), politely decline in one sentence and
  steer back to GymFit — do not answer it even if you know the answer.
- If the knowledge base doesn't cover a GymFit question, say so and suggest
  contacting the club (hello@gymfit.com / +1 (555) 123-4567).
- Never invent prices, hours, or policies. Keep replies short and helpful.
`.trim();

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const vectorStoreId = process.env.GYMFIT_VECTOR_STORE_ID;

  if (!apiKey || !vectorStoreId) {
    return NextResponse.json(
      { error: "Server is not configured (missing OPENAI_API_KEY or GYMFIT_VECTOR_STORE_ID)." },
      { status: 500 },
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await request.json();
    if (Array.isArray(body?.messages)) messages = body.messages;
  } catch {
    // fall through to validation below
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorStoreId],
          max_num_results: 5,
        },
      ],
    });

    // Strip file-citation markers like  that file search sometimes inlines.
    const reply = (response.output_text ?? "")
      .replace(/【[^】]*】/g, "")
      .trim();

    return NextResponse.json({ reply: reply || "Sorry, I couldn't find an answer to that." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Assistant error: ${message}` }, { status: 502 });
  }
}
