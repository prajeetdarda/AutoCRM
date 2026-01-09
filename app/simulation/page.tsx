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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Scenario Selected</h1>
          <a href="/" className="text-blue-500 hover:underline">
            Go back to select a scenario
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Demo Banner */}
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg">
          <div className="text-white">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="text-center">
                <h1 className="text-xl font-bold">Real-Time Multi-Agent System Execution</h1>
                <p className="text-sm text-purple-100">{scenario.title}</p>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
              >
                🔄 Reset
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                🏠 Home
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
        <div className="p-4 bg-white rounded-lg shadow-lg border-2 border-gray-300">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🔄</span>
            <span>LangGraph Workflow</span>
          </h3>
          <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">START</span>
            <span>→</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">Triage</span>
            <span>→</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
              {logs.find(l => l.action.includes('Routing to'))?.action.split(':')[1]?.trim() || 'Specialist Agent'}
            </span>
            <span>→</span>
            {logs.some(l => l.type === 'approval') ? (
              <>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">WAIT (Human Approval)</span>
                <span>→</span>
              </>
            ) : null}
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading simulation...</p>
        </div>
      </div>
    }>
      <SimulationContent />
    </Suspense>
  );
}
