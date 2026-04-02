'use client';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.12),transparent_45%),radial-gradient(circle_at_50%_90%,_rgba(192,132,252,0.14),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.22),transparent_45%),radial-gradient(circle_at_50%_90%,_rgba(192,132,252,0.18),transparent_45%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-4 inline-flex rounded-full border border-indigo-300/50 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-300/35 dark:text-indigo-200">
            Multi-Agent Autonomous Support System
          </p>

          <h1 className="bg-gradient-to-r from-slate-900 via-indigo-700 to-sky-700 bg-clip-text text-6xl font-black tracking-tight text-transparent dark:from-white dark:via-indigo-100 dark:to-sky-200 md:text-8xl">
            AutoCRM
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
            A clean, modern AI support demo. Start from scenarios, then experience the full live simulation flow.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/demo"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
            >
              Enter Demo
            </a>
            <a
              href="/simulation?scenario=detective"
              className="rounded-xl border border-slate-300 bg-white/70 px-7 py-3 text-sm font-semibold text-slate-800 transition hover:bg-white dark:border-white/25 dark:bg-transparent dark:text-slate-100 dark:hover:bg-white/10"
            >
              Quick Start
            </a>
          </div>
        </div>

        <footer className="pb-2 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built by <span className="font-semibold text-slate-700 dark:text-slate-200">Prajeet Darda</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <a
              href="https://www.linkedin.com/in/prajeet-darda"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/prajeetdarda"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              GitHub
            </a>
            <a
              href="mailto:prajeetdarda@gmail.com"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Contact
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
