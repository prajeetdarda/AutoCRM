'use client';

interface HumanApprovalModalProps {
  isOpen: boolean;
  orderId: number;
  amount: number;
  onApprove: () => void;
  onDeny: () => void;
}

export default function HumanApprovalModal({
  isOpen,
  orderId,
  amount,
  onApprove,
  onDeny
}: HumanApprovalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border-2 border-yellow-400 bg-white shadow-2xl dark:border-yellow-300/60 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🟡</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Human-in-the-Loop</h2>
              <p className="text-sm text-gray-800">Manager Approval Required</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Role Explanation */}
          <div className="mb-4 rounded-lg border-2 border-blue-300 bg-blue-50 p-4 dark:border-blue-400/40 dark:bg-blue-500/10">
            <div className="flex items-start gap-2">
              <span className="text-2xl">👤</span>
              <div>
                <p className="mb-1 font-semibold text-blue-900 dark:text-blue-100">You are simulating the Manager/Admin role</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  This demonstrates <strong>Human-in-the-Loop</strong> - where autonomous agents
                  pause and request human approval for critical decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="mb-4 rounded-lg border-2 border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-800/60">
            <h3 className="mb-3 font-bold text-slate-900 dark:text-slate-100">Refund Request Details:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Order ID:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">#{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Refund Amount:</span>
                <span className="font-mono font-semibold text-red-600">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-300">Threshold:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">$50.00</span>
              </div>
              <div className="mt-3 border-t border-slate-300 pt-3 dark:border-white/10">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500">⚠️</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    Amount exceeds automatic approval limit. Manager review required.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-4">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Do you approve this refund?
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onDeny}
              className="px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>❌</span>
              <span>Deny</span>
            </button>
            <button
              onClick={onApprove}
              className="px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>✅</span>
              <span>Approve</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-b-lg border-t border-slate-200 bg-slate-50 px-6 py-3 dark:border-white/10 dark:bg-slate-900/80">
          <p className="text-center text-xs text-slate-600 dark:text-slate-300">
            💡 In production, this would notify a real manager via email/Slack
          </p>
        </div>
      </div>
    </div>
  );
}
