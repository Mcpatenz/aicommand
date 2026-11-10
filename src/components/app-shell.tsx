import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Mic, Settings, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Assistant", icon: Bot },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-2xl border border-white/10 bg-[#0d1423]/90 p-5 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/15 p-2 text-blue-300">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-lg font-bold tracking-[0.2em]">CUSTOM AI</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-blue-300">Local AI</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-blue-500/15 text-blue-200 ring-1 ring-blue-400/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-300">
              <Mic size={14} />
              Wake phrase
            </div>
            <div className="text-sm font-medium text-emerald-200">Hey Mak Patens</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
