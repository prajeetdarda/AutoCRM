'use client';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full border-2 border-gray-300 rounded-lg bg-white shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-gray-300 bg-gradient-to-r from-blue-500 to-cyan-600">
        <h2 className="text-lg font-bold text-white">💬 Customer Support Chat</h2>
        <p className="text-xs text-blue-100 mt-1">⚡ Live Execution - Real AI Responses</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="text-4xl mb-4">💭</div>
            <p className="text-sm">Waiting for user query...</p>
            <p className="text-xs text-gray-400 mt-2">Messages will appear here when demo starts</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-lg shadow-md ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border-2 border-gray-200 rounded-bl-none'
                }`}
              >
                {/* Role Label */}
                <div className={`text-xs font-semibold mb-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {msg.role === 'user' ? '👤 Customer' : '🤖 AI Agent'}
                </div>

                {/* Message Content */}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                {/* Timestamp */}
                <span className={`text-xs mt-2 block ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-lg shadow-md border-2 border-gray-200 rounded-bl-none">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm text-gray-500">Agent processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Execution Notice */}
      <div className="px-4 py-3 border-t-2 border-gray-200 bg-green-50">
        <div className="flex items-center gap-2">
          <span className="text-green-600">⚡</span>
          <p className="text-xs text-green-800 font-medium">
            <strong>Live Execution:</strong> Real LLM calls to OpenAI happening in real-time. Pre-configured scenarios with live AI responses.
          </p>
        </div>
      </div>
    </div>
  );
}
