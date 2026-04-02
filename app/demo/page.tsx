'use client';

import { useRouter } from 'next/navigation';
import { scenarios } from '@/config/scenarios';

export default function DemoHubPage() {
  const router = useRouter();

  const handleScenarioClick = (scenarioId: string) => {
    router.push(`/simulation?scenario=${scenarioId}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.12),transparent_45%),radial-gradient(circle_at_50%_90%,_rgba(192,132,252,0.14),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.22),transparent_45%),radial-gradient(circle_at_50%_90%,_rgba(192,132,252,0.18),transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10 rounded-2xl border border-slate-200 bg-white/70 p-8 text-center shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
          <p className="mb-3 inline-flex rounded-full border border-indigo-300/50 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700 dark:border-indigo-300/30 dark:text-indigo-200">
            Live Demo Hub
          </p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">Run AutoCRM Scenarios</h1>
          <p className="mx-auto max-w-3xl text-slate-600 dark:text-slate-300">
            Select a scenario to watch real-time multi-agent orchestration with routing, tool-calling, security guardrails, and human-in-the-loop decisions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10"
            >
              Back to Landing
            </a>
            <a
              href="https://github.com/prajeetdarda/AutoCRM"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-indigo-300/50 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-500/20 dark:border-indigo-300/30 dark:text-indigo-200"
            >
              View Source
            </a>
          </div>
        </header>

        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-semibold">Choose a Scenario</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleScenarioClick(scenario.id)}
                className="group rounded-2xl border border-slate-200 bg-white/70 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300/60 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10"
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-200">
                  {scenario.id === 'detective' && 'Order Intelligence'}
                  {scenario.id === 'guardian' && 'Security Guardrail'}
                  {scenario.id === 'manager' && 'Manager Approval'}
                </p>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{scenario.title}</h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{scenario.description}</p>
                <div className="rounded-lg border border-slate-200 bg-slate-100/80 p-3 dark:border-white/10 dark:bg-slate-900/70">
                  <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">User query</p>
                  <p className="font-mono text-sm text-slate-800 dark:text-slate-200">"{scenario.userMessage}"</p>
                </div>
                <div className="mt-4 text-sm font-semibold text-indigo-700 opacity-0 transition group-hover:opacity-100 dark:text-indigo-200">
                  Run scenario →
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-blue-300/50 bg-blue-500/10 p-4">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Triage Agent</p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-100/90">Analyzes intent and routes intelligently.</p>
          </div>
          <div className="rounded-xl border border-emerald-300/50 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Tool Calling</p>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-100/90">Executes specialized functions autonomously.</p>
          </div>
          <div className="rounded-xl border border-rose-300/50 bg-rose-500/10 p-4">
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-200">Guardrails</p>
            <p className="mt-1 text-xs text-rose-700 dark:text-rose-100/90">Enforces refund and security policy constraints.</p>
          </div>
          <div className="rounded-xl border border-amber-300/50 bg-amber-500/10 p-4">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Human-in-the-loop</p>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-100/90">Escalates sensitive cases for manual approval.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
