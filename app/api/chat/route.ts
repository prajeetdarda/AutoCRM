import { NextRequest, NextResponse } from 'next/server';
import { runWorkflow } from '@/lib/workflow';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userMessage,
      userId,
      orderId,
      cardLast4,
      amount
    } = body;

    if (!userMessage || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: userMessage, userId' },
        { status: 400 }
      );
    }

    // Run the LangGraph workflow
    const result = await runWorkflow({
      userMessage,
      userId,
      orderId,
      cardLast4,
      amount,
      route: undefined,
      response: undefined,
      requiresHumanApproval: undefined,
      guardRail: undefined,
      success: undefined
    });

    // Return the full state
    return NextResponse.json({
      success: true,
      data: {
        route: result.route,
        response: result.response,
        guardRail: result.guardRail,
        requiresHumanApproval: result.requiresHumanApproval,
        agentSuccess: result.success
      }
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
