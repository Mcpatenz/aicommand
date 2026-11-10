import Link from "next/link";
import { Bot, MessageSquareText, Sparkles, Zap } from "lucide-react";
import { APP_TITLE, PLATFORM_GOAL } from "@/lib/config";

const stats = [
  {
    label: "AI mode",
    value: "Ready",
    hint: "OpenAI Responses API",
    icon: Bot,
  },
  {
    label: "Voice",
    value: "Browser mic",
    hint: "Speech recognition + synthesis",
    icon: MessageSquareText,
  },
  {
    label: "Automation",
    value: "Planned",
    hint: "Guarded execution layer",
    icon: Zap,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#0d1423] p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-blue-300">Project status</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{APP_TITLE} dashboard</h1>
            <p className="mt-2 text-sm text-slate-400">{PLATFORM_GOAL}</p>
          </div>
          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200">
            System ready
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-[#0d1423] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</div>
              <div className="rounded-lg bg-blue-500/15 p-2 text-blue-200">
                <Icon size={16} />
              </div>
            </div>
            <div className="text-2xl font-semibold text-white">{value}</div>
            <div className="mt-2 text-sm text-slate-400">{hint}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-white/10 bg-[#0d1423] p-6">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="text-blue-300" size={18} />
            <h2 className="text-xl font-semibold text-white">Milestone 2 foundation</h2>
          </div>

          <ul className="space-y-4 text-sm text-slate-300">
            <li className="rounded-xl border border-white/10 bg-white/5 p-3">Secure local-first project structure for a single user.</li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-3">Persistent conversation storage with Prisma and PostgreSQL.</li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-3">Browser-based mic input and voice output for testing in Chrome or Edge.</li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-3">Preparation for Realtime voice and wake-word activation.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0d1423] p-6">
          <div className="mb-4 text-xs uppercase tracking-[0.22em] text-slate-400">Next priority</div>
          <h3 className="text-xl font-semibold text-white">Real device architecture</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="rounded-xl bg-white/5 p-3">Authorised user account system</div>
            <div className="rounded-xl bg-white/5 p-3">Strong API and database permissions</div>
            <div className="rounded-xl bg-white/5 p-3">PWA shell for Windows + Android</div>
            <div className="rounded-xl bg-white/5 p-3">Realtime voice engine after secure foundation</div>
          </div>
        </div>
      </section>

      <div className="flex justify-start">
        <Link href="/" className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
          Open assistant
        </Link>
      </div>
    </div>
  );
}
