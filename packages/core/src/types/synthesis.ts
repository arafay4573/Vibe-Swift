import { VibeBlueprint, ThemeBlueprint } from './blueprint.js';
import { REAEvidence } from './rea.js';

export interface CloneOptions {
  projectName?: string;
  targetFramework?: 'nextjs-app-router' | 'nextjs-pages' | 'vite-react';
  styling?: 'tailwind' | 'tailwind-shadcn';
  typescript?: boolean;
  enableAiRefinement?: boolean;
  includeMockApi?: boolean;
  themeOverrides?: Partial<ThemeBlueprint>;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'layout' | 'config' | 'style' | 'api' | 'asset' | 'doc';
  description?: string;
}

export interface GeneratedProject {
  id: string;
  name: string;
  targetFramework: string;
  files: GeneratedFile[];
  blueprint: VibeBlueprint;
  stats: {
    totalFiles: number;
    componentsCount: number;
    routesCount: number;
    apiRoutesCount: number;
  };
  summary: string;
  readme: string;
}

export interface FullCloneResult {
  id: string;
  target: string;
  durationMs: number;
  evidence: REAEvidence;
  blueprint: VibeBlueprint;
  project: GeneratedProject;
}
