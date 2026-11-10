"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return <button type="button" onClick={() => void logout()} className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"><LogOut size={16} />Sign out</button>;
}
