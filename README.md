# GymFit

A modern gym website (Next.js + Tailwind CSS) with an AI chat assistant powered
by a RAG agent (OpenAI Agents SDK + ChatKit + an OpenAI Vector Store).

## Structure

- **`src/`** — Next.js 15 App Router site (landing page + floating chat bubble).
- **`agent-server/`** — Python ChatKit server hosting the RAG "GymFit Assistant".
  See [agent-server/README.md](agent-server/README.md) for setup.

## Run locally

```bash
# 1. Website (terminal 1)
npm install
npm run dev                     # http://localhost:3000

# 2. Agent server (terminal 2) — see agent-server/README.md
cd agent-server
python -m venv .venv && .venv\Scripts\Activate.ps1
pip install -r requirements.txt
# add your OPENAI_API_KEY to agent-server/.env, then:
python ingest.py                # builds the vector store
uvicorn server:app --port 8000
```

## Configuration

Copy the `.env.example` files and fill in your own values. **Never commit real
API keys** — `.env` files are gitignored.

- `agent-server/.env` — `OPENAI_API_KEY`, `GYMFIT_VECTOR_STORE_ID`
- `.env.local` — `NEXT_PUBLIC_CHATKIT_URL`, `NEXT_PUBLIC_CHATKIT_DOMAIN_KEY`

## Deploying

- **Website** → Vercel (connect this repo, set the `NEXT_PUBLIC_*` env vars).
- **Agent server** → a Python host (Render, Railway, Fly.io). Point
  `NEXT_PUBLIC_CHATKIT_URL` at its public URL and add that origin to
  `CHATKIT_ALLOWED_ORIGINS`.

> GitHub itself hosts the code only — it cannot run the Next.js or Python
> servers. Use the hosts above for the running app.
