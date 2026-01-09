import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const llm = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0
});

const SYSTEM_PROMPT = `You are a triage agent that routes customer support requests to specialist agents.

Analyze the user's message and determine which specialist should handle it:
- "order" - for order status inquiries, tracking, order details, "show my orders"
- "security" - for address changes, card updates, order cancellations, PII requests
- "refund" - for refund requests

Respond with ONLY ONE WORD: either "order", "security", or "refund". Nothing else.`;

export async function triageAgent(userMessage: string): Promise<string> {
  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(userMessage)
  ];

  const response = await llm.invoke(messages);
  const route = response.content.toString().trim().toLowerCase();

  // Validate route
  const validRoutes = ['order', 'security', 'refund'];
  if (!validRoutes.includes(route)) {
    return 'order'; // default fallback
  }

  return route;
}
