"use client";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">Custom AI · Offline</div>
      <h1 className="mt-6 text-3xl font-semibold text-white">You’re offline</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">Reconnect to the internet to use AI chat and load saved conversations. Your assistant does not store chat responses for offline use.</p>
      <button onClick={() => window.location.reload()} className="mt-6 min-h-11 rounded-full bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-500">Try again</button>
    </main>
  );
}
