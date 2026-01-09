import { StateGraph, END, Annotation } from '@langchain/langgraph';
import { triageAgent } from './agents/triage';
import { orderAgent } from './agents/order';
import { securityAgent } from './agents/security';
import { refundAgent } from './agents/refund';

// Define state using Annotation
const AgentStateAnnotation = Annotation.Root({
  userMessage: Annotation<string>,
  userId: Annotation<number>,
  orderId: Annotation<number | undefined>,
  cardLast4: Annotation<string | undefined>,
  amount: Annotation<number | undefined>,
  route: Annotation<string | undefined>,
  response: Annotation<string | undefined>,
  requiresHumanApproval: Annotation<boolean | undefined>,
  guardRail: Annotation<string | undefined>,
  success: Annotation<boolean | undefined>
});

export type AgentState = typeof AgentStateAnnotation.State;

// Node functions
async function triageNode(state: AgentState): Promise<Partial<AgentState>> {
  const route = await triageAgent(state.userMessage);
  return { route };
}

async function orderNode(state: AgentState): Promise<Partial<AgentState>> {
  const response = await orderAgent(state.userMessage, state.userId);
  return {
    response,
    success: true
  };
}

async function securityNode(state: AgentState): Promise<Partial<AgentState>> {
  const result = await securityAgent(state.userMessage, state.userId);
  return {
    response: result.response,
    guardRail: result.guardRail,
    requiresHumanApproval: result.requiresHumanApproval,
    success: !result.blocked
  };
}

async function refundNode(state: AgentState): Promise<Partial<AgentState>> {
  if (!state.orderId || !state.cardLast4 || state.amount === undefined) {
    return {
      response: 'Missing required information for refund (orderId, cardLast4, amount)',
      success: false
    };
  }

  const result = await refundAgent(
    state.userMessage,
    state.orderId,
    state.userId,
    state.cardLast4,
    state.amount
  );

  return {
    response: result.response,
    success: result.success,
    guardRail: result.guardRail,
    requiresHumanApproval: result.requiresHumanApproval
  };
}

// Routing function - determines which specialist to go to after triage
function routeAfterTriage(state: AgentState): string {
  if (state.route === 'order') return 'order';
  if (state.route === 'security') return 'security';
  if (state.route === 'refund') return 'refund';
  return 'order'; // default
}

// Check if we need human approval (for WAIT state)
function checkHumanApproval(state: AgentState): string {
  if (state.requiresHumanApproval) {
    return 'human_approval';
  }
  return END;
}

// Build the graph
const workflow = new StateGraph(AgentStateAnnotation);

// Add nodes
workflow.addNode('triage', triageNode);
workflow.addNode('order', orderNode);
workflow.addNode('security', securityNode);
workflow.addNode('refund', refundNode);
workflow.addNode('human_approval', async (state: AgentState) => {
  // This node just marks that we're waiting for human approval
  return {
    response: state.response + '\n\n[WAITING FOR HUMAN APPROVAL]'
  };
});

// Set entry point
workflow.setEntryPoint('triage' as any);

// Add edges
workflow.addConditionalEdges('triage' as any, routeAfterTriage, {
  order: 'order',
  security: 'security',
  refund: 'refund'
} as any);

// All specialists can either end or go to human approval
workflow.addConditionalEdges('order' as any, checkHumanApproval, {
  human_approval: 'human_approval',
  [END]: END
} as any);

workflow.addConditionalEdges('security' as any, checkHumanApproval, {
  human_approval: 'human_approval',
  [END]: END
} as any);

workflow.addConditionalEdges('refund' as any, checkHumanApproval, {
  human_approval: 'human_approval',
  [END]: END
} as any);

// Human approval always ends (in real system, would wait for approval then continue)
workflow.addEdge('human_approval' as any, END);

// Compile the graph
export const app = workflow.compile();

// Helper function to run the workflow
export async function runWorkflow(input: AgentState): Promise<AgentState> {
  const result = await app.invoke(input);
  return result;
}
