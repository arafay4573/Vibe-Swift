import React from 'react';
import { defaultEngine, SAMPLE_SAAS_EVIDENCE } from '@vibe-swift/core';
import { Dashboard } from '@/components/Dashboard';

export default async function Page() {
  // Synthesize initial demo clone on the server using The Swifters studio theme
  const blueprint = defaultEngine.synthesizeBlueprint(SAMPLE_SAAS_EVIDENCE);
  const project = defaultEngine.generateProject(blueprint, {
    projectName: 'swifters-saas-studio',
    enableAiRefinement: true,
  });

  const initialData = {
    id: 'initial-sample',
    target: 'https://vibe-analytics.app',
    durationMs: 780,
    evidence: SAMPLE_SAAS_EVIDENCE,
    blueprint,
    project,
  };

  return <Dashboard initialData={initialData} />;
}
