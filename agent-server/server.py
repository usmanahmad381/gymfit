"""Self-hosted ChatKit server that streams the GymFit agent (RAG-backed by your
OpenAI Vector Store) to the chat bubble in the Next.js site.

Run:
    uvicorn server:app --reload --port 8000
The single POST /chatkit endpoint handles every ChatKit operation.
"""

import os

# Trust the Windows certificate store so HTTPS works behind antivirus/VPN/proxy
# TLS interception (fixes CERTIFICATE_VERIFY_FAILED). Must run before any request.
import truststore

truststore.inject_into_ssl()

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse

load_dotenv()

from agents import Runner  # noqa: E402  (import after env is loaded)
from chatkit.agents import AgentContext, simple_to_agent_input, stream_agent_response  # noqa: E402
from chatkit.server import ChatKitServer, StreamingResult  # noqa: E402

from gymfit_agent import gymfit_agent  # noqa: E402
from store import MemoryStore  # noqa: E402


class GymFitServer(ChatKitServer[dict]):
    async def respond(self, thread, input, context):
        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context,
        )

        # Feed recent history (chronological) to the agent for multi-turn memory.
        items_page = await self.store.load_thread_items(
            thread.id, after=None, limit=20, order="asc", context=context
        )
        history = list(items_page.data)

        # Make sure the message that triggered this turn is included, even if the
        # store hasn't persisted it yet — otherwise the agent never sees the
        # user's actual question and repeats a generic reply.
        if input is not None and all(
            getattr(item, "id", None) != getattr(input, "id", None) for item in history
        ):
            history.append(input)

        input_items = await simple_to_agent_input(history)
        print(f"[respond] thread={thread.id} history_items={len(history)}", flush=True)

        result = Runner.run_streamed(gymfit_agent, input_items, context=agent_context)
        async for event in stream_agent_response(agent_context, result):
            yield event


server = GymFitServer(MemoryStore())

app = FastAPI()

# Allow the Next.js dev/prod origins to call this server from the browser.
ALLOWED_ORIGINS = os.environ.get(
    "CHATKIT_ALLOWED_ORIGINS", "http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chatkit")
async def chatkit(request: Request):
    result = await server.process(await request.body(), context={})
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    return Response(content=result.json, media_type="application/json")


@app.get("/health")
def health():
    return {"ok": True}
