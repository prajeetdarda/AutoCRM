'use client';

import { useRouter } from 'next/navigation';
import { scenarios } from '@/config/scenarios';

export default function Home() {
  const router = useRouter();

  const handleScenarioClick = (scenarioId: string) => {
    router.push(`/simulation?scenario=${scenarioId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Full Width */}
        <div className="mb-8">
          {/* Title & Description */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
              AutoCRM
            </h1>
            <p className="text-xl text-gray-700 mb-3 font-semibold">
              Multi-Agent Autonomous Support System
            </p>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-indigo-500 mb-4 mx-auto"></div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Advanced AI orchestration with <span className="font-semibold text-indigo-600">LangGraph</span>, <span className="font-semibold text-indigo-600">LangChain</span>, and <span className="font-semibold text-indigo-600">OpenAI GPT-4o</span>
            </p>
          </div>
        </div>

      {/* Scenario Selection */}
      <div className="w-full mb-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Select a Live Scenario</h2>
          <p className="text-gray-600">Watch real-time AI agent orchestration with actual LLM calls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioClick(scenario.id)}
              className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-4 border-transparent hover:border-blue-400 p-6 text-left"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Title with Icon */}
              <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {scenario.title}{' '}
                {scenario.id === 'detective' && '🔍'}
                {scenario.id === 'guardian' && '🛡️'}
                {scenario.id === 'manager' && '👔'}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {scenario.description}
              </p>

              {/* User Query Preview */}
              <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 font-semibold">User Query:</p>
                <p className="text-sm font-mono text-gray-700">"{scenario.userMessage}"</p>
              </div>

              {/* Click indicator */}
              <div className="mt-3 flex items-center justify-center text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Click to Run Demo</span>
                <span className="ml-2">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="w-full mb-6">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">What You'll See</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg shadow-md text-center border-2 border-gray-200">
            <div className="text-3xl mb-2">🔵</div>
            <h4 className="font-semibold text-gray-800 mb-1">Triage Agent</h4>
            <p className="text-xs text-gray-600">
              LLM analyzes intent and routes to specialist
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md text-center border-2 border-gray-200">
            <div className="text-3xl mb-2">🟢</div>
            <h4 className="font-semibold text-gray-800 mb-1">Tool Calling</h4>
            <p className="text-xs text-gray-600">
              Autonomous function selection and execution
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md text-center border-2 border-gray-200">
            <div className="text-3xl mb-2">🔴</div>
            <h4 className="font-semibold text-gray-800 mb-1">Guardrails</h4>
            <p className="text-xs text-gray-600">
              Security policies enforced automatically
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-md text-center border-2 border-gray-200">
            <div className="text-3xl mb-2">🟡</div>
            <h4 className="font-semibold text-gray-800 mb-1">Human-in-Loop</h4>
            <p className="text-xs text-gray-600">
              Manager approval for critical decisions
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="w-full mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-6 text-lg text-center">Technology Stack</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-x-6 gap-y-4 max-w-6xl mx-auto">
            <div className="text-center">
              <p className="font-semibold text-gray-900">LangGraph</p>
              <p className="text-sm text-gray-500">Orchestration</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">LangChain</p>
              <p className="text-sm text-gray-500">AI Framework</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">OpenAI GPT-4o</p>
              <p className="text-sm text-gray-500">LLM Engine</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Next.js 15</p>
              <p className="text-sm text-gray-500">React Framework</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">TypeScript</p>
              <p className="text-sm text-gray-500">Type Safety</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">SQLite</p>
              <p className="text-sm text-gray-500">Database</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Tailwind CSS</p>
              <p className="text-sm text-gray-500">Styling</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Zod</p>
              <p className="text-sm text-gray-500">Validation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p className="mb-2">Built to showcase Multi-Agent Systems, LangGraph, and Agentic AI</p>
        <a
          href="https://github.com"
          className="text-blue-500 hover:underline font-medium"
        >
          View Source Code →
        </a>
      </div>
      </div>
    </main>
  );
}
