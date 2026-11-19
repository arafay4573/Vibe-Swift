import test from 'node:test';
import assert from 'node:assert/strict';
import { VibeEngine, SAMPLE_SAAS_EVIDENCE } from '../dist/index.js';

test('VibeEngine: analyzes target and extracts valid REA evidence', async () => {
  const engine = new VibeEngine();
  const evidence = await engine.analyze({
    target: 'sample:saas',
  });

  assert.ok(evidence);
  assert.equal(evidence.schemaVersion, '1.2.0');
  assert.ok(evidence.metadata.title);
  assert.ok(evidence.entryPoints.length > 0);
  assert.ok(evidence.modules.length > 0);
});

test('VibeEngine: synthesizes VibeBlueprint from REA evidence', () => {
  const engine = new VibeEngine();
  const blueprint = engine.synthesizeBlueprint(SAMPLE_SAAS_EVIDENCE);

  assert.ok(blueprint.id);
  assert.ok(blueprint.components.length >= 6);
  assert.ok(blueprint.theme.colors.primary);
  assert.ok(blueprint.routes.length >= 1);
  assert.ok(blueprint.summaryStats.totalTailwindClasses > 0);

  // Check component categories
  const categories = blueprint.components.map((c) => c.category);
  assert.ok(categories.includes('navigation'));
  assert.ok(categories.includes('hero'));
});

test('VibeEngine: generates Next.js App Router and Tailwind code', () => {
  const engine = new VibeEngine();
  const blueprint = engine.synthesizeBlueprint(SAMPLE_SAAS_EVIDENCE);
  const project = engine.generateProject(blueprint, {
    projectName: 'test-vibe-app',
    enableAiRefinement: true,
  });

  assert.ok(project.files.length >= 8);
  
  // Verify vital Next.js files exist
  const paths = project.files.map((f) => f.path);
  assert.ok(paths.includes('app/layout.tsx'), 'Should contain app/layout.tsx');
  assert.ok(paths.includes('app/page.tsx'), 'Should contain app/page.tsx');
  assert.ok(paths.includes('tailwind.config.ts'), 'Should contain tailwind.config.ts');
  assert.ok(paths.includes('package.json'), 'Should contain package.json');
  assert.ok(paths.includes('README.md'), 'Should contain README.md');

  // Verify component file content has Tailwind and TS
  const heroFile = project.files.find((f) => f.path.includes('hero'));
  assert.ok(heroFile, 'Should find hero component');
  assert.ok(heroFile.content.includes('className'), 'Should have className prop');
});

test('VibeEngine: end-to-end clone pipeline runs cleanly', async () => {
  const engine = new VibeEngine();
  const result = await engine.clone('sample:saas', {
    target: 'sample:saas',
    projectName: 'e2e-cloned-app',
    enableAiRefinement: true,
    includeMockApi: true,
  });

  assert.ok(result.id);
  assert.ok(result.durationMs >= 0);
  assert.ok(result.evidence);
  assert.ok(result.blueprint);
  assert.ok(result.project);
  assert.ok(result.project.files.length > 5);
});
