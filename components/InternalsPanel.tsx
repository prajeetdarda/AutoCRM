'use client';

import { useRef, useEffect } from 'react';

interface LogEntry {
  step: number;
  agent: string;
  action: string;
  details: string;
  type: 'routing' | 'tool' | 'guardrail' | 'approval' | 'complete';
  timestamp: Date;
}

interface InternalsPanelProps {
  logs: LogEntry[];
  currentStep?: number;
}

export default function InternalsPanel({ logs, currentStep }: InternalsPanelProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);
  const getIcon = (type: string) => {
    switch (type) {
      case 'routing':
        return '🔵';
      case 'tool':
        return '🟢';
      case 'guardrail':
        return '🔴';
      case 'approval':
        return '🟡';
      case 'complete':
        return '✅';
      default:
        return '⚪';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'routing':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-400/30';
      case 'tool':
        return 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-400/30';
      case 'guardrail':
        return 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-400/30';
      case 'approval':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-400/30';
      case 'complete':
        return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-400/30';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-slate-500/10 dark:border-slate-400/30';
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-600 dark:border-white/10">
        <h2 className="text-lg font-bold text-white">🔍 Behind the Scenes</h2>
        <p className="text-xs text-indigo-100 mt-1">⚡ Real-Time Agent Orchestration & LLM Execution</p>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4">
        {logs.length === 0 ? (
          <div className="text-center text-slate-400 dark:text-slate-500 mt-8">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-sm">Waiting for demo to start...</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Agent activity will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div
                key={`${log.step}-${log.timestamp.getTime()}`}
                className={`border-2 rounded-lg p-4 transition-all ${getBgColor(log.type)} ${
                  idx === currentStep ? 'ring-2 ring-offset-2 ring-indigo-400 dark:ring-offset-slate-950 scale-105' : ''
                }`}
              >
                {/* Step Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getIcon(log.type)}</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        Step {log.step}: {log.agent}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="ml-9">
                  <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                    {log.action}
                  </div>
                  <div className="text-sm text-slate-700 dark:text-slate-200 font-mono bg-white/60 p-2 rounded border border-slate-200 dark:bg-slate-900/60 dark:border-white/10">
                    {log.details}
                  </div>
                </div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/40">
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">LEGEND:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>🔵</span>
            <span className="text-slate-700 dark:text-slate-300">Agent Routing</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🟢</span>
            <span className="text-slate-700 dark:text-slate-300">Tool Execution</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔴</span>
            <span className="text-slate-700 dark:text-slate-300">Security Block</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🟡</span>
            <span className="text-slate-700 dark:text-slate-300">Human Approval</span>
          </div>
        </div>
      </div>
    </div>
  );
}
