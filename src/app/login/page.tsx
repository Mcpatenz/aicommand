"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Bot, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign in failed.");

      const next = searchParams.get("next");
      router.replace(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[85vh] items-center justify-center px-4 py-10">
      <section className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d1423] p-7 shadow-[0_0_50px_rgba(59,130,246,0.08)]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-200"><Bot size={26} /></div>
          <h1 className="text-2xl font-semibold text-white">Custom AI</h1>
          <p className="mt-2 text-sm text-slate-400">Private single-user preview</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm text-slate-300" htmlFor="app-password">App password</label>
          <div className="relative">
            <LockKeyhole size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="app-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-[#070b14] pl-10 pr-3 text-base text-white outline-none focus:border-blue-400" />
          </div>
          {error && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
          <button type="submit" disabled={loading || !password} className="min-h-12 w-full rounded-full bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Signing in…" : "Sign in"}</button>
          <p className="text-center text-xs leading-5 text-slate-500">This temporary access gate is for a private personal preview, not multi-user production authentication.</p>
        </form>
      </section>
    </main>
  );
}
