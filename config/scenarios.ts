import { Scenario } from '@/components/ScenarioSelector';

export const scenarios: Scenario[] = [
  {
    id: 'detective',
    title: 'Scenario A: The Detective',
    description: 'Order tracking - Agent queries database and returns order status',
    userMessage: 'Where is my order #101?',
    userId: 1,
    orderId: 101
  },
  {
    id: 'guardian',
    title: 'Scenario B: The Guardian',
    description: 'Security guardrail - Agent detects card mismatch and blocks refund',
    userMessage: 'I want to refund order #102 to a different card',
    userId: 2,
    orderId: 102,
    cardLast4: '9999', // Wrong card - will trigger CARD_MISMATCH
    amount: 89.50
  },
  {
    id: 'manager',
    title: 'Scenario C: The Manager',
    description: 'Human-in-the-loop - High-value refund requires manager approval',
    userMessage: 'I want a $599 refund for order #103',
    userId: 3,
    orderId: 103,
    cardLast4: '7890',
    amount: 599.99
  }
];
