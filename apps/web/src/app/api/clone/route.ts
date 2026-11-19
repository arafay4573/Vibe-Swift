import { NextRequest, NextResponse } from 'next/server';
import { defaultEngine } from '@vibe-swift/core';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      target,
      mode = 'auto',
      projectName,
      enableAiRefinement = true,
      includeMockApi = true,
      themeOverrides,
    } = body;

    if (!target || typeof target !== 'string') {
      return NextResponse.json({ error: 'Target URL or file path is required' }, { status: 400 });
    }

    const result = await defaultEngine.clone(target, {
      target,
      mode,
      projectName,
      enableAiRefinement,
      includeMockApi,
      themeOverrides,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Cloning failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
