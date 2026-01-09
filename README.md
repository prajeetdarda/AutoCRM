# AutoCRM

**Multi-Agent Autonomous Support System** showcasing LangGraph orchestration and OpenAI function calling.

## Architecture

### LangGraph Workflow
```
START → Triage Agent (LLM Router)
          ↓
    [Conditional Edges]
          ↓
    ┌─────┼─────┐
    ↓     ↓     ↓
  Order Security Refund (Specialist Agents)
    ↓     ↓     ↓
    └─────┼─────┘
          ↓
   [Check Approval]
          ↓
     END / WAIT
```

### 4 Autonomous Agents

Each agent is **self-contained** with inline tools and prompts:

1. **`lib/agents/triage.ts`** - LLM-powered intent router
   - No tools needed
   - Routes to: order, security, or refund

2. **`lib/agents/order.ts`** - Order specialist with tools
   - `getOrderById` - fetch specific order
   - `getUserOrders` - fetch all user orders
   - LLM autonomously decides which tool to use

3. **`lib/agents/security.ts`** - Security specialist
   - Handles: address changes, card updates, cancellations, PII
   - Enforces security guardrails

4. **`lib/agents/refund.ts`** - Refund specialist
   - Card verification (Scenario B: Guardian)
   - Amount threshold approval (Scenario C: Manager)
   - Database updates

### LangGraph Workflow (`lib/workflow.ts`)
- **StateGraph** manages agent coordination
- **Conditional routing** based on triage
- **Human-in-the-loop** for approvals (WAIT state)
- State maintained throughout flow

### API Routes

**`/api/chat`** - Execute workflow and return final result
- POST request with userMessage, userId, and optional parameters
- Returns complete workflow result with routing and response

**`/api/chat/stream`** - Stream agent events in real-time (SSE)
- Same input as `/api/chat`
- Streams each LangGraph node execution
- Useful for showing internal agent activity

**`/api/reset`** - Reset database to initial state
- POST request, no body required
- Re-seeds database with demo data

See [API_TESTING.md](./API_TESTING.md) for detailed testing guide.

### UI Components

**`components/ChatWindow.tsx`** - Chat interface
- Displays user and agent messages
- Input form for new messages
- Real-time loading states

**`components/InternalsPanel.tsx`** - Agent activity sidebar
- Shows routing decisions
- Displays tool calls
- Highlights guardrails and approval requests
- Color-coded by activity type

**`components/ScenarioSelector.tsx`** - Scenario picker
- 3 pre-configured scenarios
- Shows description before running
- Links to simulation page

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add OpenAI API key:
```bash
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=sk-...
```

3. Run the application:
```bash
npm run dev
```

4. Open browser:
```
http://localhost:3000
```

5. Select a scenario and watch the agents work!

### Testing (Optional)

```bash
npm run test:workflow  # Test LangGraph workflow CLI
npm run test:db        # Test database setup
```

## 3 Demo Scenarios

**Scenario A: "The Detective"** - Order tracking
- User: "Where is my order #101?"
- Flow: Triage → Order Agent → getOrderById → END

**Scenario B: "The Guardian"** - Security guardrail
- User: "Refund to different card"
- Flow: Triage → Refund Agent → CARD_MISMATCH → END

**Scenario C: "The Manager"** - Human approval
- User: "Refund $599"
- Flow: Triage → Refund Agent → REQUIRES_APPROVAL → WAIT

## Technology Stack

- **LangGraph** - Multi-agent orchestration
- **LangChain** - Agent framework
- **OpenAI GPT-4o-mini** - LLM brain for each agent
- **Function Calling** - LLM autonomously selects tools
- **SQLite** - Zero-config database
- **Next.js 15** - Framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Key Features

✅ **Autonomous agents** - Each agent makes independent decisions
✅ **LangGraph orchestration** - StateGraph manages workflow
✅ **Function calling** - LLMs choose tools dynamically
✅ **Guardrails** - Security policies as code
✅ **Human-in-the-loop** - WAIT state for approvals
✅ **Conditional routing** - Dynamic flow based on context

---

Built to showcase Multi-Agent Systems and LangGraph for portfolio.
