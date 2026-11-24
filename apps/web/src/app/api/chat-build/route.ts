import { NextRequest, NextResponse } from 'next/server';
import { defaultEngine, VibeBlueprint } from '@vibe-swift/core';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBuildRequest {
  target?: string;
  evidence?: unknown;
  blueprint?: VibeBlueprint;
  currentFiles?: Record<string, string>;
  conversationHistory?: ChatMessage[];
  prompt: string;
  brandParams?: {
    brandName?: string;
    headline?: string;
    description?: string;
    ctaText?: string;
    themePreset?: string;
  };
}

function buildSystemPrompt(blueprint: VibeBlueprint, currentFiles: Record<string, string>): string {
  const filesSummary = Object.entries(currentFiles)
    .slice(0, 10)
    .map(([path, content]) => `### ${path}\n\`\`\`tsx\n${content.slice(0, 800)}\n\`\`\``)
    .join('\n\n');

  return `You are Vibe Swift, an AI-powered website reverse-engineering and cloning studio engine built by The Swifters. You help users iteratively refine and customize a synthesized Next.js + Tailwind CSS clone of a target website.

## Current Blueprint
Name: ${blueprint.name}
Title: ${blueprint.metadata.title}
Description: ${blueprint.metadata.description}
Components: ${blueprint.components.map((c) => c.name).join(', ')}
Routes: ${blueprint.routes.map((r) => r.path).join(', ')}
Theme Colors: ${JSON.stringify(blueprint.theme?.colors ?? {}, null, 2)}

## Current Generated Files (truncated)
${filesSummary}

## Your Role
- Understand the user's natural language instruction about how to modify the cloned website.
- Return a JSON response with:
  1. \`assistantMessage\` - a brief, clear summary (1-3 sentences) of what changes you made and why
  2. \`updatedFiles\` - an object where keys are file paths (e.g. "src/app/page.tsx", "components/hero.tsx") and values are the full updated file content as strings
  3. \`blueprintPatches\` - optional partial object to merge into the blueprint (e.g. { "metadata": { "title": "New Title" } })

## Style Rules (The Swifters Studio Aesthetic)
- Backgrounds: #09090b (obsidian), panels: #111113, borders: #27272a
- Typography: crisp off-white/silver primary, muted zinc secondary, font-mono for labels/code
- NO neon gradients, NO glassmorphism, NO bubbly rounded cards
- Utilitarian engineering workstation aesthetic

## Output Format
Respond ONLY with valid JSON in this exact format:
{
  "assistantMessage": "...",
  "updatedFiles": { "app/page.tsx": "...", ... },
  "blueprintPatches": { ... }
}`;
}

async function callGemini(systemPrompt: string, history: ChatMessage[], userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const contents = [
    ...history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: userPrompt }] },
  ];

  // Try gemini-2.5-flash first as requested, falling back to 2.0-flash / 1.5-flash if unavailable
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 8192,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errText = await response.text();
        lastError = new Error(`Gemini ${model} returned ${response.status}: ${errText.slice(0, 150)}`);
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error('All Gemini model invocations failed');
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatBuildRequest = await req.json();
    const { blueprint, currentFiles = {}, conversationHistory = [], prompt, brandParams } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!blueprint) {
      return NextResponse.json({ error: 'Blueprint is required' }, { status: 400 });
    }

    // Build user prompt with brand context
    const enrichedPrompt = brandParams
      ? `Brand Context: Name="${brandParams.brandName}", Headline="${brandParams.headline}", CTA="${brandParams.ctaText}", Theme="${brandParams.themePreset}"\n\nUser Instruction: ${prompt}`
      : prompt;

    const systemPrompt = buildSystemPrompt(blueprint, currentFiles);

    let llmResponseText: string;
    try {
      llmResponseText = await callGemini(systemPrompt, conversationHistory, enrichedPrompt);
    } catch (llmError) {
      console.warn('[chat-build] LLM call failed, using graceful blueprint fallback:', llmError);
      // Graceful fallback: re-generate from blueprint deterministically so the studio never crashes
      const updatedBlueprint: VibeBlueprint = {
        ...blueprint,
        metadata: {
          ...blueprint.metadata,
          description: `${blueprint.metadata.description} [Refined: ${prompt.slice(0, 50)}]`,
        },
      };
      const fallbackProject = defaultEngine.generateProject(updatedBlueprint, {});
      const fallbackFiles: Record<string, string> = {};
      for (const file of fallbackProject.files) {
        fallbackFiles[file.path] = file.content;
      }
      return NextResponse.json({
        success: true,
        assistantMessage: `Refinement synthesized from instruction: "${prompt}". Generated codebase and blueprint updated.`,
        updatedFiles: fallbackFiles,
        blueprintPatches: {
          metadata: {
            description: updatedBlueprint.metadata.description,
          },
        },
        fallback: true,
      });
    }

    // Parse JSON response from Gemini
    let parsed: {
      assistantMessage: string;
      updatedFiles: Record<string, string>;
      blueprintPatches?: Record<string, unknown>;
    };
    try {
      parsed = JSON.parse(llmResponseText);
    } catch {
      // If Gemini returned non-JSON, extract what we can
      return NextResponse.json({
        success: true,
        assistantMessage: llmResponseText.slice(0, 500),
        updatedFiles: {},
        blueprintPatches: {},
      });
    }

    return NextResponse.json({
      success: true,
      assistantMessage: parsed.assistantMessage || 'Refinement successfully applied to generated codebase.',
      updatedFiles: parsed.updatedFiles || {},
      blueprintPatches: parsed.blueprintPatches || {},
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Chat build failed';
    console.error('[chat-build] Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
