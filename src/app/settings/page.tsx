import { DEFAULT_ASSISTANT_NAME, DEFAULT_WAKE_PHRASE } from "@/lib/config";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#0d1423] p-6">
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">Control the local assistant profile and device behavior.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#0d1423] p-6">
          <div className="mb-5 text-xs uppercase tracking-[0.22em] text-slate-400">Assistant identity</div>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-slate-400">Assistant name</div>
              <div className="mt-2 text-lg font-medium text-white">{DEFAULT_ASSISTANT_NAME}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-slate-400">Wake phrase</div>
              <div className="mt-2 text-lg font-medium text-white">{DEFAULT_WAKE_PHRASE}</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0d1423] p-6">
          <div className="mb-5 text-xs uppercase tracking-[0.22em] text-slate-400">Security posture</div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="rounded-xl bg-white/5 p-3">Single-user local prototype with production guardrails.</li>
            <li className="rounded-xl bg-white/5 p-3">Admin-only automation access should be confirmed before execution.</li>
            <li className="rounded-xl bg-white/5 p-3">OpenAI API key remains server-side only.</li>
            <li className="rounded-xl bg-white/5 p-3">Realtime and wake-word features are planned after secure auth.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
