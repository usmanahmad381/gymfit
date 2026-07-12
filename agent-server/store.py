"""A minimal in-memory ChatKit Store — conversations live only while the
process runs. This mirrors the official quickstart's MyChatKitStore; swap it
for a Postgres/Redis-backed Store before production.

If your installed chatkit version has slightly different Page/Store signatures,
copy the canonical MyChatKitStore verbatim from:
https://openai.github.io/chatkit-python/quickstart/
"""

from collections import defaultdict

from chatkit.store import NotFoundError, Store
from chatkit.types import Attachment, Page, ThreadItem, ThreadMetadata


class MemoryStore(Store[dict]):
    def __init__(self) -> None:
        self.threads: dict[str, ThreadMetadata] = {}
        self.items: dict[str, list[ThreadItem]] = defaultdict(list)
        self.attachments: dict[str, Attachment] = {}

    def _paginate(self, rows: list, after: str | None, limit: int, order: str):
        # Preserve insertion order (chronological); item IDs are NOT sortable.
        rows = list(rows) if order == "asc" else list(reversed(rows))
        start = 0
        if after is not None:
            ids = [r.id for r in rows]
            start = ids.index(after) + 1 if after in ids else 0
        window = rows[start : start + limit]
        has_more = start + limit < len(rows)
        next_after = window[-1].id if window and has_more else None
        return Page(data=window, has_more=has_more, after=next_after)

    async def load_thread(self, thread_id: str, context: dict) -> ThreadMetadata:
        if thread_id not in self.threads:
            raise NotFoundError(f"thread {thread_id} not found")
        return self.threads[thread_id]

    async def save_thread(self, thread: ThreadMetadata, context: dict) -> None:
        self.threads[thread.id] = thread

    async def load_threads(
        self, limit: int, after: str | None, order: str, context: dict
    ) -> Page:
        return self._paginate(list(self.threads.values()), after, limit, order)

    async def load_thread_items(
        self, thread_id: str, after: str | None, limit: int, order: str, context: dict
    ) -> Page:
        return self._paginate(self.items[thread_id], after, limit, order)

    async def add_thread_item(
        self, thread_id: str, item: ThreadItem, context: dict
    ) -> None:
        self.items[thread_id].append(item)

    async def save_item(self, thread_id: str, item: ThreadItem, context: dict) -> None:
        bucket = self.items[thread_id]
        for i, existing in enumerate(bucket):
            if existing.id == item.id:
                bucket[i] = item
                return
        bucket.append(item)

    async def load_item(
        self, thread_id: str, item_id: str, context: dict
    ) -> ThreadItem:
        for item in self.items[thread_id]:
            if item.id == item_id:
                return item
        raise NotFoundError(f"item {item_id} not found")

    async def delete_thread(self, thread_id: str, context: dict) -> None:
        self.threads.pop(thread_id, None)
        self.items.pop(thread_id, None)

    async def delete_thread_item(
        self, thread_id: str, item_id: str, context: dict
    ) -> None:
        self.items[thread_id] = [i for i in self.items[thread_id] if i.id != item_id]

    async def save_attachment(self, attachment: Attachment, context: dict) -> None:
        self.attachments[attachment.id] = attachment

    async def load_attachment(self, attachment_id: str, context: dict) -> Attachment:
        if attachment_id not in self.attachments:
            raise NotFoundError(f"attachment {attachment_id} not found")
        return self.attachments[attachment_id]

    async def delete_attachment(self, attachment_id: str, context: dict) -> None:
        self.attachments.pop(attachment_id, None)
