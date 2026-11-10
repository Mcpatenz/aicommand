"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bot, MessageSquareText, User } from "lucide-react";

type ConversationSummary = {
  id: string;
  title: string | null;
  updatedAt: string;
  _count: { messages: number };
};

type ConversationDetail = {
  id: string;
  title: string | null;
  messages: Array<{ id: string; role: "user" | "assistant"; content: string; createdAt: string }>;
};

export default function HistoryPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selected, setSelected] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/conversations")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load history.");
        if (active) setConversations(data.conversations);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load history.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function openConversation(id: string) {
    setError(null);
    setSelected(null);
    try {
      const response = await fetch(`/api/conversations/${encodeURIComponent(id)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to open conversation.");
      setSelected(data.conversation);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to open conversation.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#0d1423] p-6">
        <h1 className="text-3xl font-semibold text-white">Conversation history</h1>
        <p className="mt-2 text-sm text-slate-400">Your locally stored chats, ordered by most recently updated.</p>
      </section>

      {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}

      <section className="grid gap-5 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-2 rounded-2xl border border-white/10 bg-[#0d1423] p-4">
          {loading && <p className="p-3 text-sm text-slate-400">Loading conversations…</p>}
          {!loading && conversations.length === 0 && <p className="p-3 text-sm text-slate-400">No saved conversations yet. Start chatting with Custom AI.</p>}
          {conversations.map((conversation) => (
            <button key={conversation.id} type="button" onClick={() => void openConversation(conversation.id)} className="w-full rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left transition hover:border-blue-400/30 hover:bg-blue-500/5">
              <div className="flex items-start gap-3">
                <MessageSquareText size={17} className="mt-0.5 shrink-0 text-blue-300" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{conversation.title || "Untitled conversation"}</div>
                  <div className="mt-1 text-xs text-slate-400">{conversation._count.messages} messages · {new Date(conversation.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="min-h-72 space-y-4 rounded-2xl border border-white/10 bg-[#0d1423] p-4 sm:p-6">
          {!selected ? <p className="text-sm text-slate-400">Select a conversation to view its messages.</p> : <>
            <h2 className="border-b border-white/10 pb-4 text-lg font-semibold text-white">{selected.title || "Untitled conversation"}</h2>
            <div className="max-h-[65vh] space-y-4 overflow-y-auto">
              {selected.messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <span className="h-fit rounded-lg bg-blue-500/15 p-2 text-blue-200">{message.role === "assistant" ? <Bot size={16} /> : <User size={16} />}</span>
                  <p className={`max-w-[85%] whitespace-pre-wrap rounded-xl p-3 text-sm leading-6 ${message.role === "assistant" ? "bg-white/5 text-slate-200" : "bg-blue-600 text-white"}`}>{message.content}</p>
                </div>
              ))}
            </div>
          </>}
          <Link href="/" className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500">Back to assistant</Link>
        </div>
      </section>
    </div>
  );
}
