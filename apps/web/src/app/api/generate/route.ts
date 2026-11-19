import { NextRequest, NextResponse } from 'next/server';
import { defaultEngine, VibeBlueprint } from '@vibe-swift/core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blueprint, options = {} } = body;

    if (!blueprint) {
      return NextResponse.json({ error: 'Blueprint object is required' }, { status: 400 });
    }

    const project = defaultEngine.generateProject(blueprint as VibeBlueprint, options);

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Code generation failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
