# GymFit Agent Server (RAG)

A self-hosted **ChatKit** server that streams a RAG-backed **OpenAI Agents SDK**
agent to the chat bubble on the GymFit site. Retrieval is an **OpenAI Vector
Store** queried by the hosted `FileSearchTool` — no manual embedding.

## Why your ingestion changed

Your original loop embedded each chunk with `text-embedding-3-small` and
upserted it into a custom index. An OpenAI Vector Store **chunks and embeds
uploaded files itself** and the agent's `FileSearchTool` embeds the query at
retrieval time. So `embed()` + `index.upsert()` is replaced by uploading files
in `ingest.py`, and there is no retrieval code to write.

## Setup

```bash
cd agent-server
python -m venv .venv && . .venv/Scripts/activate   # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env        # fill in OPENAI_API_KEY
```

## 1. Ingest your knowledge base

Put `gymfit_rag.jsonl` in this folder (or set `RAG_JSONL`), then:

```bash
python ingest.py
```

Copy the printed `GYMFIT_VECTOR_STORE_ID=vs_...` into `.env`.

## 2. Run the server

```bash
uvicorn server:app --reload --port 8000
```

## 3. Point the site at it

The Next.js widget already reads these from the project-root `.env.local`:

```
NEXT_PUBLIC_CHATKIT_URL=http://localhost:8000/chatkit
NEXT_PUBLIC_CHATKIT_DOMAIN_KEY=local-dev
```

Run `npm run dev` in the project root and open the bubble.

## Notes / things to confirm for your SDK versions

- **`domainKey`**: `local-dev` works on localhost. For production, register your
  domain in the OpenAI dashboard and use the key it gives you.
- **Store**: `store.py` is in-memory (resets on restart). For production copy the
  canonical `MyChatKitStore` from the ChatKit quickstart and back it with a DB.
- **Dead code**: `src/app/api/chatkit/session/route.ts` was for the old hosted
  workflow and is no longer used — safe to delete.
- Pin exact package versions once installed (`pip freeze > requirements.txt`);
  the ChatKit Python SDK is young and its `Page`/`Store` signatures may shift.
