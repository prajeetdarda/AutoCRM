import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import db from '../db/client';

const llm = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7
});

const SYSTEM_PROMPT = `You are a refund specialist agent. Process refund requests with appropriate security checks and approval workflows.

Be empathetic, professional, and clear in your explanations. When security policies block a request or approval is needed, explain why in a friendly manner.`;

export interface RefundResult {
  response: string;
  success: boolean;
  guardRail?: string;
  requiresHumanApproval?: boolean;
  data?: any;
}

export async function refundAgent(
  userMessage: string,
  orderId: number,
  userId: number,
  cardLast4: string,
  amount: number
): Promise<RefundResult> {
  // Validation 1: Order exists
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;

  if (!order) {
    return {
      response: `Order #${orderId} not found in our system.`,
      success: false
    };
  }

  // Validation 2: User ownership
  if (order.user_id !== userId) {
    return {
      response: 'This order does not belong to your account.',
      success: false,
      guardRail: 'USER_MISMATCH'
    };
  }

  // Validation 3: User exists
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;

  if (!user) {
    return {
      response: 'User account not found.',
      success: false
    };
  }

  // Validation 4: Card match (SECURITY GUARDRAIL - Scenario B)
  if (user.card_last4 !== cardLast4) {
    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(
        `The customer tried to refund to card ending in ${cardLast4}, but their original payment was to card ending in ${user.card_last4}. This is blocked for security. Explain this policy empathetically.`
      )
    ];

    const response = await llm.invoke(messages);

    return {
      response: `🛡️ Security Alert: ${response.content.toString()}`,
      success: false,
      guardRail: 'CARD_MISMATCH'
    };
  }

  // Validation 5: Amount check
  if (amount > order.amount) {
    return {
      response: `Refund amount ($${amount}) cannot exceed the order amount ($${order.amount}).`,
      success: false,
      guardRail: 'AMOUNT_EXCEEDED'
    };
  }

  // Validation 6: Approval threshold (MANAGER APPROVAL - Scenario C)
  if (amount > 50) {
    const messages = [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(
        `Customer requested a refund of $${amount}, which exceeds our $50 automatic approval threshold. Explain that a manager will review this within 24 hours.`
      )
    ];

    const response = await llm.invoke(messages);

    return {
      response: `⏸️ ${response.content.toString()}`,
      success: false,
      guardRail: 'REQUIRES_APPROVAL',
      requiresHumanApproval: true,
      data: {
        orderId,
        amount,
        threshold: 50
      }
    };
  }

  // All checks passed - process refund
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('refunded', orderId);

  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(
      `Successfully processed a refund of $${amount} for order #${orderId} to card ending in ${cardLast4}. Confirm this to the customer in a friendly way.`
    )
  ];

  const response = await llm.invoke(messages);

  return {
    response: `✅ ${response.content.toString()}`,
    success: true,
    data: {
      orderId,
      refundAmount: amount,
      status: 'refunded'
    }
  };
}
