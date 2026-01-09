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
        return 'bg-blue-50 border-blue-200';
      case 'tool':
        return 'bg-green-50 border-green-200';
      case 'guardrail':
        return 'bg-red-50 border-red-200';
      case 'approval':
        return 'bg-yellow-50 border-yellow-200';
      case 'complete':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full border-2 border-gray-300 rounded-lg bg-white shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-gray-300 bg-gradient-to-r from-indigo-500 to-purple-600">
        <h2 className="text-lg font-bold text-white">🔍 Behind the Scenes</h2>
        <p className="text-xs text-indigo-100 mt-1">⚡ Real-Time Agent Orchestration & LLM Execution</p>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4">
        {logs.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-sm">Waiting for demo to start...</p>
            <p className="text-xs text-gray-400 mt-2">Agent activity will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div
                key={`${log.step}-${log.timestamp.getTime()}`}
                className={`border-2 rounded-lg p-4 transition-all ${getBgColor(log.type)} ${
                  idx === currentStep ? 'ring-2 ring-offset-2 ring-indigo-400 scale-105' : ''
                }`}
              >
                {/* Step Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getIcon(log.type)}</span>
                    <div>
                      <div className="font-bold text-gray-900">
                        Step {log.step}: {log.agent}
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="ml-9">
                  <div className="font-semibold text-gray-800 mb-1">
                    {log.action}
                  </div>
                  <div className="text-sm text-gray-700 font-mono bg-white/50 p-2 rounded border">
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
      <div className="px-4 py-3 border-t-2 border-gray-200 bg-gray-50">
        <div className="text-xs font-semibold text-gray-600 mb-2">LEGEND:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>🔵</span>
            <span className="text-gray-700">Agent Routing</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🟢</span>
            <span className="text-gray-700">Tool Execution</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔴</span>
            <span className="text-gray-700">Security Block</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🟡</span>
            <span className="text-gray-700">Human Approval</span>
          </div>
        </div>
      </div>
    </div>
  );
}
