import { NextRequest, NextResponse } from 'next/server';
import { defaultEngine, REAEvidence } from '@vibe-swift/core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { evidence } = body;

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence object is required' }, { status: 400 });
    }

    const blueprint = defaultEngine.synthesizeBlueprint(evidence as REAEvidence);

    return NextResponse.json({
      success: true,
      blueprint,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Blueprint synthesis failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
