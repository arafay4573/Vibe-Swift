import { NextRequest, NextResponse } from 'next/server';
import { defaultEngine } from '@vibe-swift/core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target, mode = 'auto', timeoutMs } = body;

    if (!target || typeof target !== 'string') {
      return NextResponse.json({ error: 'Target URL or file path is required' }, { status: 400 });
    }

    const evidence = await defaultEngine.analyze({
      target,
      mode,
      timeoutMs: timeoutMs ? Number(timeoutMs) : undefined,
    });

    const metrics = defaultEngine.inspectEvidence(evidence);

    return NextResponse.json({
      success: true,
      evidence,
      metrics,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
