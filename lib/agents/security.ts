import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const llm = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.5
});

const SYSTEM_PROMPT = `You are a security specialist agent. Handle sensitive customer requests with appropriate security guardrails.

SECURITY POLICIES (YOU MUST FOLLOW):
1. Order Cancellations: Require manual verification. Tell the user a support agent will contact them within 24 hours.
2. Address Updates: Allowed, but require email verification. Tell user they'll receive a verification email.
3. Card Updates: BLOCKED for security reasons. User must contact support directly.
4. PII Requests: Require identity verification via email. Tell user a verification link has been sent.

Be professional, security-conscious, and empathetic. Explain policies clearly.`;

export interface SecurityResult {
  response: string;
  guardRail?: string;
  requiresHumanApproval?: boolean;
  blocked?: boolean;
}

export async function securityAgent(userMessage: string, userId: number): Promise<SecurityResult> {
  const messages = [
    new SystemMessage(SYSTEM_PROMPT + `\n\nUser ID: ${userId}`),
    new HumanMessage(userMessage)
  ];

  const response = await llm.invoke(messages);
  const responseText = response.content.toString();

  // Analyze for guardrails
  const messageLower = userMessage.toLowerCase();
  let guardRail: string | undefined;
  let requiresApproval = false;
  let blocked = false;

  if (messageLower.includes('cancel')) {
    guardRail = 'MANUAL_VERIFICATION';
    requiresApproval = true;
  } else if (messageLower.includes('card')) {
    guardRail = 'CARD_UPDATE_BLOCKED';
    blocked = true;
  } else if (messageLower.includes('pii') || messageLower.includes('personal information')) {
    guardRail = 'PII_VERIFICATION';
    requiresApproval = true;
  } else if (messageLower.includes('address')) {
    guardRail = 'ADDRESS_VERIFICATION';
  }

  return {
    response: responseText,
    guardRail,
    requiresHumanApproval: requiresApproval,
    blocked
  };
}
