# API Testing Guide

## Prerequisites

1. Start the dev server:
```bash
npm run dev
```

2. Ensure database is seeded:
```bash
npm run test:db
```

3. Set `OPENAI_API_KEY` in `.env`

---

## API Endpoints

### 1. `/api/chat` - Execute LangGraph Workflow

**Method:** POST

**Request Body:**
```json
{
  "userMessage": "Where is my order #101?",
  "userId": 1,
  "orderId": 101,        // optional
  "cardLast4": "4242",   // optional
  "amount": 45.00        // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "route": "order",
    "response": "Order #101 is currently shipped...",
    "guardRail": null,
    "requiresHumanApproval": false,
    "agentSuccess": true
  }
}
```

**Test with curl:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "Where is my order #101?",
    "userId": 1
  }'
```

---

### 2. `/api/chat/stream` - Streaming Agent Events

**Method:** POST

**Request Body:** Same as `/api/chat`

**Response:** Server-Sent Events (SSE)

Streams each LangGraph node execution in real-time:
```
data: {"triage": {"route": "order"}}

data: {"order": {"response": "..."}}

data: [DONE]
```

**Test with curl:**
```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "Show me all my orders",
    "userId": 1
  }' \
  --no-buffer
```

---

### 3. `/api/reset` - Reset Database

**Method:** POST

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Database reset to initial state"
}
```

**Test with curl:**
```bash
curl -X POST http://localhost:3000/api/reset
```

---

## Test Scenarios

### Scenario A: "The Detective"
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "Where is my order #101?",
    "userId": 1
  }'
```

Expected: Routes to `order` agent, returns order details.

---

### Scenario B: "The Guardian" (Card Mismatch)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "Refund to different card",
    "userId": 2,
    "orderId": 102,
    "cardLast4": "9999",
    "amount": 89.50
  }'
```

Expected: Routes to `refund` agent, returns `CARD_MISMATCH` guardrail.

---

### Scenario C: "The Manager" (High Value)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userMessage": "I want a $599 refund",
    "userId": 3,
    "orderId": 103,
    "cardLast4": "7890",
    "amount": 599.99
  }'
```

Expected: Routes to `refund` agent, returns `REQUIRES_APPROVAL`, `requiresHumanApproval: true`.

---

## Using Postman/Insomnia

1. Import the collection or manually create requests
2. Set base URL: `http://localhost:3000`
3. Add header: `Content-Type: application/json`
4. Use request bodies from examples above

---

## Debugging

Check terminal output for:
- LangGraph workflow logs
- Agent routing decisions
- Tool executions
- Errors
