import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import db from '../db/client';

const llm = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7
});

const SYSTEM_PROMPT = `You are an order specialist agent. Help users with order inquiries.

You have access to these tools:
- getOrderById(orderId): Get details of a specific order
- getUserOrders(userId): Get all orders for a user

Decide which tool to use based on the user's question. If they mention a specific order number, use getOrderById. If they ask for "all orders" or order history, use getUserOrders.

Respond in a helpful, friendly manner with the order information.`;

// Direct tool functions
async function getOrderById(orderId: number) {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;

  if (!order) {
    return { error: `Order #${orderId} not found` };
  }

  return {
    orderId: order.id,
    userId: order.user_id,
    status: order.status,
    amount: order.amount,
    items: JSON.parse(order.items),
    createdAt: order.created_at
  };
}

async function getUserOrders(userId: number) {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ?').all(userId) as any[];

  if (orders.length === 0) {
    return { error: `No orders found for user #${userId}` };
  }

  return orders.map(order => ({
    orderId: order.id,
    status: order.status,
    amount: order.amount,
    items: JSON.parse(order.items),
    createdAt: order.created_at
  }));
}

export async function orderAgent(userMessage: string, userId: number): Promise<string> {
  // First, ask LLM to decide which tool to use
  const decisionMessages = [
    new SystemMessage(`You are an order specialist. Based on the user's message, decide which tool to use:
- If they mention a specific order number (like #101, #102), respond with: TOOL:getOrderById:ORDER_NUMBER
- If they ask for "all orders", "my orders", or order history, respond with: TOOL:getUserOrders:${userId}
- Otherwise, respond normally

User message: "${userMessage}"

Respond with either TOOL:functionName:argument or a normal message.`),
    new HumanMessage(userMessage)
  ];

  const decision = await llm.invoke(decisionMessages);
  const decisionText = decision.content.toString();

  // Parse tool decision
  if (decisionText.startsWith('TOOL:')) {
    const [, toolName, arg] = decisionText.split(':');

    let toolResult;
    if (toolName === 'getOrderById') {
      const orderId = parseInt(arg);
      toolResult = await getOrderById(orderId);
    } else if (toolName === 'getUserOrders') {
      toolResult = await getUserOrders(userId);
    } else {
      return 'I encountered an error processing your request.';
    }

    // Format response with LLM
    const responseMessages = [
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(userMessage),
      new SystemMessage(`Tool result: ${JSON.stringify(toolResult)}. Use this data to respond to the user in a friendly way.`)
    ];

    const finalResponse = await llm.invoke(responseMessages);
    return finalResponse.content.toString();
  }

  // No tool needed, direct response
  return decisionText;
}
