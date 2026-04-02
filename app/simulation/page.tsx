'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import InternalsPanel from '@/components/InternalsPanel';
import HumanApprovalModal from '@/components/HumanApprovalModal';
import { scenarios } from '@/config/scenarios';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface LogEntry {
  step: number;
  agent: string;
  action: string;
  details: string;
  type: 'routing' | 'tool' | 'guardrail' | 'approval' | 'complete';
  timestamp: Date;
}

function SimulationContent() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get('scenario');
  const scenario = scenarios.find(s => s.id === scenarioId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalData, setApprovalData] = useState<any>(null);
  const hasRunRef = useRef(false);

  // Auto-run scenario on load (only once, even with React Strict Mode)
  useEffect(() => {
    if (scenario && !hasRunRef.current) {
      hasRunRef.current = true;
      setTimeout(() => {
        runScenario();
      }, 1000);
    }
  }, [scenario]);

  const addLog = (log: Omit<LogEntry, 'step' | 'timestamp'>) => {
    setLogs(prev => [
      ...prev,
      {
        ...log,
        step: prev.length + 1,
        timestamp: new Date()
      }
    ]);
    setCurrentStep(prev => prev + 1);
  };

  const runScenario = async () => {
    if (!scenario) return;

    // Step 1: Show user message
    const userMessage: Message = {
      role: 'user',
      content: scenario.userMessage,
      timestamp: new Date()
    };
    setMessages([userMessage]);

    addLog({
      agent: 'User Query',
      action: 'Customer submitted request',
      details: `"${scenario.userMessage}"`,
      type: 'routing'
    });

    await sleep(800);

    // Step 2: Triage analyzing
    addLog({
      agent: 'Triage Agent (LLM)',
      action: 'Analyzing user intent with OpenAI GPT-4o-mini',
      details: 'Parsing natural language to determine routing: [order, security, refund]',
      type: 'routing'
    });

    setIsLoading(true);
    await sleep(1200);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scenario)
      });

      const data = await response.json();

      if (data.success) {
        await sleep(500);

        // Step 3: Triage decision
        addLog({
          agent: 'Triage Agent Decision',
          action: `Routing to: ${data.data.route.toUpperCase()}_AGENT`,
          details: `LangGraph conditional edge → ${data.data.route}_agent node`,
          type: 'routing'
        });

        await sleep(800);

        // Step 4: Specialist agent activated
        const agentName = data.data.route.charAt(0).toUpperCase() + data.data.route.slice(1);
        addLog({
          agent: `${agentName} Agent Activated`,
          action: `Processing request with specialized logic`,
          details: `Agent: lib/agents/${data.data.route}.ts | LLM: gpt-4o-mini`,
          type: 'tool'
        });

        await sleep(1000);

        // Step 5: Tool usage (if order agent)
        if (data.data.route === 'order') {
          const toolName = scenario.orderId ? 'getOrderById' : 'getUserOrders';
          const toolArg = scenario.orderId || scenario.userId;
          addLog({
            agent: `${agentName} Agent - Tool Call`,
            action: `LLM chose to execute: ${toolName}()`,
            details: `Function calling → ${toolName}(${toolArg}) | Query: SELECT * FROM orders WHERE id = ${toolArg}`,
            type: 'tool'
          });
          await sleep(800);
        }

        // Step 6: Guardrails (if present)
        if (data.data.guardRail) {
          addLog({
            agent: 'Security GuardRail Triggered',
            action: `${data.data.guardRail} - Policy enforcement`,
            details: getGuardrailDetails(data.data.guardRail),
            type: 'guardrail'
          });
          await sleep(1000);
        }

        // Step 7: Human approval (if needed)
        if (data.data.requiresHumanApproval) {
          addLog({
            agent: 'Human-in-the-Loop Required',
            action: 'Pausing workflow for manager approval',
            details: `LangGraph WAIT state → human_approval node | Amount: $${scenario.amount} > $50 threshold`,
            type: 'approval'
          });
          await sleep(800);

          setApprovalData({
            orderId: scenario.orderId,
            amount: scenario.amount
          });
          setShowApprovalModal(true);
          setIsLoading(false);
          return; // Wait for approval
        }

        // Step 8: Final response
        addLog({
          agent: 'Resolution Complete',
          action: 'Agent generated final response',
          details: 'LangGraph workflow → END node',
          type: 'complete'
        });

        setIsLoading(false);
        await sleep(500);

        const agentMessage: Message = {
          role: 'agent',
          content: data.data.response || 'No response',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMessage]);

      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage: Message = {
        role: 'agent',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleApprove = async () => {
    setShowApprovalModal(false);

    addLog({
      agent: 'Manager Decision',
      action: '✅ APPROVED by human manager',
      details: 'Human approved the high-value refund request',
      type: 'complete'
    });

    await sleep(500);

    const agentMessage: Message = {
      role: 'agent',
      content: `✅ Refund of $${approvalData.amount} has been approved and processed successfully for order #${approvalData.orderId}.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, agentMessage]);
  };

  const handleDeny = async () => {
    setShowApprovalModal(false);

    addLog({
      agent: 'Manager Decision',
      action: '❌ DENIED by human manager',
      details: 'Human denied the high-value refund request',
      type: 'guardrail'
    });

    await sleep(500);

    const agentMessage: Message = {
      role: 'agent',
      content: `❌ Refund request has been denied by manager. The customer will be notified.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, agentMessage]);
  };

  const handleReset = async () => {
    await fetch('/api/reset', { method: 'POST' });
    setMessages([]);
    setLogs([]);
    setCurrentStep(0);
    hasRunRef.current = false;
    // Trigger re-run
    setTimeout(() => {
      if (!hasRunRef.current) {
        hasRunRef.current = true;
        runScenario();
      }
    }, 500);
  };

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">No Scenario Selected</h1>
          <a href="/demo" className="text-indigo-600 dark:text-indigo-300 hover:underline">
            Go back to select a scenario
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.12),transparent_45%),radial-gradient(circle_at_50%_90%,_rgba(192,132,252,0.14),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.22),transparent_45%),radial-gradient(circle_at_50%_90%,_rgba(192,132,252,0.18),transparent_45%)]" />
      <div className="relative max-w-7xl mx-auto">
        {/* Demo Banner */}
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
          <div className="text-slate-900 dark:text-white">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="text-center">
                <h1 className="text-xl font-bold">Real-Time Multi-Agent System Execution</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">{scenario.title}</p>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg font-medium transition-colors border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-white/20 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
              >
                🔄 Reset
              </button>
              <a
                href="/demo"
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-gradient-to-r from-indigo-500 to-sky-500 text-white hover:brightness-110"
              >
                🏠 Scenarios
              </a>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Chat Window */}
          <div className="h-[600px]">
            <ChatWindow messages={messages} isLoading={isLoading} />
          </div>

          {/* Internals Panel */}
          <div className="h-[600px]">
            <InternalsPanel logs={logs} currentStep={currentStep - 1} />
          </div>
        </div>

        {/* LangGraph Flow Visualization */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white/75 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <span>🔄</span>
            <span>LangGraph Workflow</span>
          </h3>
          <div className="flex items-center justify-center gap-3 text-sm flex-wrap text-slate-700 dark:text-slate-200">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium dark:bg-blue-500/20 dark:text-blue-200">START</span>
            <span>→</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium dark:bg-purple-500/20 dark:text-purple-200">Triage</span>
            <span>→</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium dark:bg-green-500/20 dark:text-green-200">
              {logs.find(l => l.action.includes('Routing to'))?.action.split(':')[1]?.trim() || 'Specialist Agent'}
            </span>
            <span>→</span>
            {logs.some(l => l.type === 'approval') ? (
              <>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium dark:bg-yellow-500/20 dark:text-yellow-200">WAIT (Human Approval)</span>
                <span>→</span>
              </>
            ) : null}
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium dark:bg-emerald-500/20 dark:text-emerald-200">
              {logs.some(l => l.type === 'complete') ? 'END ✓' : 'END'}
            </span>
          </div>
        </div>
      </div>

      {/* Human Approval Modal */}
      <HumanApprovalModal
        isOpen={showApprovalModal}
        orderId={approvalData?.orderId || 0}
        amount={approvalData?.amount || 0}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    </div>
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getGuardrailDetails(guardRail: string): string {
  switch (guardRail) {
    case 'CARD_MISMATCH':
      return 'Security check failed: Card number does not match original payment method. Policy: Refunds must go to original card.';
    case 'REQUIRES_APPROVAL':
      return 'Amount exceeds $50 automatic approval threshold. Escalating to human manager for review.';
    case 'USER_MISMATCH':
      return 'Security check failed: Order does not belong to requesting user.';
    case 'AMOUNT_EXCEEDED':
      return 'Refund amount exceeds original order amount.';
    default:
      return guardRail;
  }
}

export default function SimulationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-600 dark:text-slate-300">Loading simulation...</p>
        </div>
      </div>
    }>
      <SimulationContent />
    </Suspense>
  );
}
