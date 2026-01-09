import { seedDatabase } from '../lib/db/seed';
import { runWorkflow } from '../lib/workflow';

console.log('🌱 Seeding database...\n');
seedDatabase();

async function runTests() {
  console.log('🤖 Testing LangGraph Multi-Agent Workflow\n');
  console.log('Architecture: START → Triage → [Order|Security|Refund] → END/WAIT\n');

  console.log('═══════════════════════════════════════');
  console.log('📋 Scenario A: "The Detective"');
  console.log('User: "Where is my order #101?"');
  console.log('═══════════════════════════════════════');

  const scenarioA = await runWorkflow({
    userMessage: 'Where is my order #101?',
    userId: 1
  });

  console.log('Route:', scenarioA.route);
  console.log('Response:', scenarioA.response);
  console.log('Success:', scenarioA.success, '\n');

  console.log('═══════════════════════════════════════');
  console.log('📋 Test: Show all my orders (tool selection)');
  console.log('═══════════════════════════════════════');

  const allOrders = await runWorkflow({
    userMessage: 'Show me all my orders',
    userId: 1
  });

  console.log('Route:', allOrders.route);
  console.log('Response:', allOrders.response, '\n');

  console.log('═══════════════════════════════════════');
  console.log('🛡️  Scenario B: "The Guardian"');
  console.log('User: "Refund order #102 to different card"');
  console.log('═══════════════════════════════════════');

  const scenarioB = await runWorkflow({
    userMessage: 'I want to refund order 102 to a different card',
    userId: 2,
    orderId: 102,
    cardLast4: '9999', // Wrong card!
    amount: 89.50
  });

  console.log('Route:', scenarioB.route);
  console.log('GuardRail:', scenarioB.guardRail);
  console.log('Response:', scenarioB.response);
  console.log('Success:', scenarioB.success, '\n');

  console.log('═══════════════════════════════════════');
  console.log('👔 Scenario C: "The Manager"');
  console.log('User: "I want a $599 refund"');
  console.log('═══════════════════════════════════════');

  const scenarioC = await runWorkflow({
    userMessage: 'I want a refund of $599 for order 103',
    userId: 3,
    orderId: 103,
    cardLast4: '7890',
    amount: 599.99
  });

  console.log('Route:', scenarioC.route);
  console.log('GuardRail:', scenarioC.guardRail);
  console.log('Requires Approval:', scenarioC.requiresHumanApproval);
  console.log('Response:', scenarioC.response, '\n');

  console.log('═══════════════════════════════════════');
  console.log('✅ Successful Refund (under $50)');
  console.log('═══════════════════════════════════════');

  const successRefund = await runWorkflow({
    userMessage: 'Please refund $45 for order 104',
    userId: 1,
    orderId: 104,
    cardLast4: '4242',
    amount: 45.00
  });

  console.log('Route:', successRefund.route);
  console.log('Response:', successRefund.response);
  console.log('Success:', successRefund.success, '\n');

  console.log('═══════════════════════════════════════');
  console.log('🔒 Security Agent Test');
  console.log('User: "I want to cancel my order"');
  console.log('═══════════════════════════════════════');

  const securityTest = await runWorkflow({
    userMessage: 'I want to cancel my order',
    userId: 1
  });

  console.log('Route:', securityTest.route);
  console.log('GuardRail:', securityTest.guardRail);
  console.log('Requires Approval:', securityTest.requiresHumanApproval);
  console.log('Response:', securityTest.response, '\n');

  console.log('✅ All LangGraph workflow tests complete!\n');
  console.log('📊 LangGraph showcased:');
  console.log('   - StateGraph orchestration');
  console.log('   - Conditional routing (triage → specialists)');
  console.log('   - Human-in-the-loop (WAIT state for approvals)');
  console.log('   - Multi-agent coordination');
  console.log('   - Tool use (LLM function calling)');
}

runTests().catch(console.error);
