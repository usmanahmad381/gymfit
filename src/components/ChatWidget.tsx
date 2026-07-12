"use client";

import { useEffect, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";

// Self-hosted ChatKit server (agent-server/server.py). For the custom-server
// path the widget talks straight to your backend — no getClientSecret.
const CHATKIT_URL =
  process.env.NEXT_PUBLIC_CHATKIT_URL ?? "http://localhost:8000/chatkit";
// domainKey allowlists the page's origin for ChatKit's CDN script. "local-dev"
// works on localhost; register your production domain in the OpenAI dashboard
// and put its key here.
const CHATKIT_DOMAIN_KEY =
  process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_KEY ?? "local-dev";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  const { control } = useChatKit({
    api: {
      url: CHATKIT_URL,
      domainKey: CHATKIT_DOMAIN_KEY,
    },
    theme: {
      colorScheme: "dark",
      color: { accent: { primary: "#f43f1d", level: 2 } },
      radius: "round",
    },
  });

  // Close the panel with the Escape key.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      <div
        className={`w-[min(24rem,calc(100vw-3rem))] origin-bottom-right overflow-hidden rounded-2xl border border-white/10 bg-ink-soft shadow-2xl transition-all duration-200 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-xs text-white">
              G
            </span>
            GymFit Assistant
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="grid h-7 w-7 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
        <ChatKit control={control} className="h-[32rem] w-full" />
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-xl transition-all hover:bg-brand-dark hover:scale-105 active:scale-95"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
