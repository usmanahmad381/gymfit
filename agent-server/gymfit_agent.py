"""The GymFit assistant: an Agents SDK agent whose RAG is your OpenAI Vector
Store, reached via the hosted FileSearchTool (no custom retrieval code)."""

import os

from agents import Agent, FileSearchTool

VECTOR_STORE_ID = os.environ.get("GYMFIT_VECTOR_STORE_ID")
if not VECTOR_STORE_ID:
    raise RuntimeError(
        "GYMFIT_VECTOR_STORE_ID is not set. Run `python ingest.py` first, then "
        "put the printed vs_... id in agent-server/.env."
    )

INSTRUCTIONS = """
You are the GymFit Assistant — a friendly, concise front-desk helper for the
GymFit fitness club. You ONLY help with GymFit: its classes, schedules, pricing,
memberships, facilities, coaching, hours, location, and contact details.

Rules:
- Always ground answers in the GymFit knowledge base using file search.
- Stay strictly on-topic. If a question is NOT about GymFit (e.g. general
  knowledge, other companies, coding, world facts), do NOT answer it — even if
  you know the answer. Politely decline in one sentence and steer back, e.g.
  "I'm the GymFit assistant, so I can only help with our classes, memberships,
  and facilities. What would you like to know about GymFit?"
- If the knowledge base doesn't cover a GymFit question, say so plainly and
  suggest contacting the club (hello@gymfit.com / +1 (555) 123-4567).
- Never invent prices, hours, or policies. Keep replies short and helpful.
""".strip()

gymfit_agent = Agent(
    name="GymFit Assistant",
    # gpt-4.1-mini: much cheaper than gpt-4.1 and plenty capable for a FAQ bot.
    # Swap to "gpt-4.1" for max quality or "gpt-4.1-nano" for the lowest cost.
    model="gpt-4.1-mini",
    instructions=INSTRUCTIONS,
    tools=[
        FileSearchTool(
            vector_store_ids=[VECTOR_STORE_ID],
            max_num_results=5,
        ),
    ],
)
