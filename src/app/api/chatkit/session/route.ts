import { NextResponse } from "next/server";

// Never cache the token exchange.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const workflowId = process.env.CHATKIT_WORKFLOW_ID;

  if (!apiKey || !workflowId) {
    return NextResponse.json(
      {
        error:
          "ChatKit is not configured. Set OPENAI_API_KEY and CHATKIT_WORKFLOW_ID in .env.local.",
      },
      { status: 500 },
    );
  }

  // Identify the end user. In production, derive this from your auth/session
  // instead of trusting a value from the client.
  let user = "anonymous";
  try {
    const body = await request.json();
    if (typeof body?.user === "string" && body.user.trim()) {
      user = body.user.trim();
    }
  } catch {
    // No/invalid JSON body — fall back to the anonymous user id.
  }

  const res = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "OpenAI-Beta": "chatkit_beta=v1",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      workflow: { id: workflowId },
      user,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json(
      { error: "Failed to create ChatKit session.", detail },
      { status: res.status },
    );
  }

  const { client_secret } = await res.json();
  return NextResponse.json({ client_secret });
}
