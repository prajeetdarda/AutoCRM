import { NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/db/seed';

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Reset the database to initial state
    resetDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database reset to initial state'
    });

  } catch (error: any) {
    console.error('Reset API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reset database' },
      { status: 500 }
    );
  }
}
