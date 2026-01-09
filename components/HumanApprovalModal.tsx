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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border-4 border-yellow-400">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🟡</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Human-in-the-Loop</h2>
              <p className="text-sm text-gray-700">Manager Approval Required</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Role Explanation */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-2xl">👤</span>
              <div>
                <p className="font-semibold text-blue-900 mb-1">You are simulating the Manager/Admin role</p>
                <p className="text-sm text-blue-800">
                  This demonstrates <strong>Human-in-the-Loop</strong> - where autonomous agents
                  pause and request human approval for critical decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">Refund Request Details:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono font-semibold">#{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Refund Amount:</span>
                <span className="font-mono font-semibold text-red-600">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Threshold:</span>
                <span className="font-mono">$50.00</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-500">⚠️</span>
                  <span className="text-xs text-gray-700">
                    Amount exceeds automatic approval limit. Manager review required.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-4">
            <p className="font-bold text-gray-900 text-lg">
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
        <div className="px-6 py-3 bg-gray-50 rounded-b-lg border-t">
          <p className="text-xs text-gray-600 text-center">
            💡 In production, this would notify a real manager via email/Slack
          </p>
        </div>
      </div>
    </div>
  );
}
