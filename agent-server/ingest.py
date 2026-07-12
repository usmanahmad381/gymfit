"""
Load gymfit_rag.jsonl into an OpenAI Vector Store.

This REPLACES your manual embed() + index.upsert() loop. An OpenAI Vector
Store chunks and embeds every file you upload automatically (managed embedding
model), so you do NOT call text-embedding-3-small yourself, and there is no
custom retrieval code — the agent's FileSearchTool queries the store for you.

Run once:
    python ingest.py
Then copy the printed GYMFIT_VECTOR_STORE_ID into agent-server/.env
"""

import json
import os

# Use the Windows certificate store so HTTPS works behind antivirus/VPN/proxy
# TLS interception (fixes CERTIFICATE_VERIFY_FAILED). Must run before any request.
import truststore

truststore.inject_into_ssl()

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI()  # reads OPENAI_API_KEY from env

JSONL_PATH = os.environ.get("RAG_JSONL", "gymfit_rag.jsonl")


def flatten_attributes(metadata: dict) -> dict:
    """Vector-store file attributes must be scalar (str | int | float | bool),
    and File Search allows at most 16 of them. Drop/serialize anything else."""
    attrs: dict[str, object] = {}
    for key, value in (metadata or {}).items():
        if isinstance(value, (str, int, float, bool)):
            attrs[key] = value
        else:
            attrs[key] = json.dumps(value)  # e.g. lists -> JSON string
        if len(attrs) == 16:
            break
    return attrs


def main() -> None:
    store = client.vector_stores.create(name="gymfit-rag")
    print(f"Created vector store: {store.id}")

    count = 0
    with open(JSONL_PATH, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            doc = json.loads(line)

            # Upload the chunk text as a small file. File Search will chunk +
            # embed it; attributes stay attached for metadata filtering.
            uploaded = client.files.create(
                file=(f"{doc['id']}.txt", doc["text"].encode("utf-8")),
                purpose="assistants",
            )
            client.vector_stores.files.create_and_poll(
                vector_store_id=store.id,
                file_id=uploaded.id,
                attributes=flatten_attributes(doc.get("metadata", {})),
            )
            count += 1
            print(f"  [{count}] indexed {doc['id']}")

    print(f"\nDone. Indexed {count} documents.")
    _persist_vector_store_id(store.id)


def _persist_vector_store_id(vs_id: str) -> None:
    """Write GYMFIT_VECTOR_STORE_ID into agent-server/.env automatically."""
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    lines: list[str] = []
    if os.path.exists(env_path):
        with open(env_path, encoding="utf-8") as f:
            lines = f.read().splitlines()

    key = "GYMFIT_VECTOR_STORE_ID"
    replaced = False
    for i, line in enumerate(lines):
        if line.strip().startswith(f"{key}="):
            lines[i] = f"{key}={vs_id}"
            replaced = True
            break
    if not replaced:
        lines.append(f"{key}={vs_id}")

    with open(env_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f">>> Saved {key}={vs_id} to {env_path}")


if __name__ == "__main__":
    main()
