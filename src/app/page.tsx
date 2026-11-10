"use client";

import { FormEvent, useState } from "react";
import { Bot, Mic, Send, Sparkles, User, Volume2, VolumeX } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type SpeechResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const greeting = "Hello! I am Custom AI, your personal intelligent assistant. How can I help you today?";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function speak(text: string) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(event?: FormEvent, voiceText?: string) {
    event?.preventDefault();
    const message = (voiceText ?? input).trim();
    if (!message || loading) return;

    setInput("");
    setError(null);
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: message }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The request failed.");

      setConversationId(data.conversationId);
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
      speak(data.answer);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function startListening() {
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) {
      setError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) void sendMessage(undefined, transcript);
    };
    recognition.onerror = () => {
      setListening(false);
      setError("Microphone speech recognition failed. Check browser microphone permission and try again.");
    };
    recognition.onend = () => setListening(false);

    setError(null);
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
      setError("Could not start speech recognition. Please try again.");
    }
  }

  return (
    <main className="min-h-screen px-4 pb-10 text-slate-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-white/10 px-1 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/15 p-3 text-blue-300"><Bot size={23} /></div>
          <div>
            <h1 className="font-bold tracking-[0.18em]">CUSTOM AI</h1>
            <p className="text-xs text-blue-300">Personal Intelligence System</p>
          </div>
        </div>
        <span className="flex items-center gap-2 text-xs text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" />LOCAL PROTOTYPE</span>
      </header>

      <div className="mx-auto max-w-4xl">
        <section className="flex flex-col items-center py-9 text-center">
          <div className="relative mb-5 flex h-32 w-32 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 shadow-[0_0_70px_rgba(59,130,246,0.16)]">
            <div className="absolute inset-3 animate-pulse rounded-full border border-blue-300/20" />
            <Sparkles size={48} className="text-blue-200" />
          </div>
          <h2 className="text-2xl font-semibold">Your personal AI assistant</h2>
          <p className="mt-2 text-sm text-slate-400">Milestone 1 · Chat and button-activated voice</p>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={startListening} disabled={loading || listening} className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
              <Mic size={18} />{listening ? "Listening…" : "Speak"}
            </button>
            <button onClick={() => { setVoiceEnabled((enabled) => !enabled); window.speechSynthesis?.cancel(); }} className="rounded-full border border-white/15 p-3 transition hover:bg-white/10" aria-label={voiceEnabled ? "Turn spoken responses off" : "Turn spoken responses on"}>
              {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0d1423] p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-semibold">Conversation</h3>
            <button type="button" className="text-xs text-slate-400 hover:text-white" onClick={() => { setMessages([{ role: "assistant", content: greeting }]); setConversationId(null); setInput(""); setError(null); window.speechSynthesis?.cancel(); }}>New chat</button>
          </div>

          <div className="max-h-[50vh] min-h-56 space-y-4 overflow-y-auto" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className="h-fit rounded-lg bg-blue-500/15 p-2 text-blue-200">{message.role === "assistant" ? <Bot size={18} /> : <User size={18} />}</div>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-xl p-4 text-sm leading-7 ${message.role === "assistant" ? "bg-white/5 text-slate-200" : "bg-blue-600 text-white"}`}>{message.content}</div>
              </div>
            ))}
            {loading && <p className="animate-pulse text-sm text-blue-300">Custom AI is thinking…</p>}
          </div>

          {error && <p role="alert" className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}
          <form onSubmit={(event) => void sendMessage(event)} className="mt-5 flex gap-2">
            <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={4000} placeholder="Ask Custom AI anything…" aria-label="Your message" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm outline-none transition focus:border-blue-400" />
            <button type="submit" disabled={loading || !input.trim()} className="rounded-xl bg-blue-600 p-3 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message"><Send size={19} /></button>
          </form>
        </section>

        <p className="mt-5 text-center text-xs text-slate-500">Custom AI · Wake-word milestone planned: “Hey Mak Patens”</p>
      </div>
    </main>
  );
}
