import { NextResponse } from 'next/server';
import { defaultEngine } from '@vibe-swift/core';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    engine: 'Vibe Swift',
    version: '0.1.0',
    reaIntegration: 'morluto/rea',
    timestamp: new Date().toISOString(),
  });
}
