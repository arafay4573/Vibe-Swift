import { REARunner } from '../rea/rea-runner.js';
import { EvidenceParser, ParsedEvidenceAnalysis } from '../rea/evidence-parser.js';
import { BlueprintSynthesizer } from './blueprint-synthesizer.js';
import { CodeGenerator } from './code-generator.js';
import { AIEnhancer } from './ai-enhancer.js';
import {
  REAEvidence,
  REAExecutionOptions,
} from '../types/rea.js';
import {
  VibeBlueprint,
  VibeComponent,
} from '../types/blueprint.js';
import {
  CloneOptions,
  GeneratedProject,
  FullCloneResult,
} from '../types/synthesis.js';
import { createLogger, Logger } from '../utils/logger.js';

export interface VibeEngineConfig {
  logger?: Logger;
  customReaCliPath?: string;
  defaultTimeoutMs?: number;
}

export class VibeEngine {
  private reaRunner: REARunner;
  private logger: Logger;
  private defaultTimeoutMs: number;

  constructor(config: VibeEngineConfig = {}) {
    this.logger = config.logger ?? createLogger('VibeEngine');
    this.reaRunner = new REARunner(this.logger);
    this.defaultTimeoutMs = config.defaultTimeoutMs ?? 30000;
  }

  /**
   * Phase 1: Ingest & analyze target using morluto/rea.
   */
  async analyze(options: REAExecutionOptions): Promise<REAEvidence> {
    const start = Date.now();
    this.logger.info(`Starting target analysis for: ${options.target}`);
    const evidence = await this.reaRunner.runAnalysis({
      timeoutMs: this.defaultTimeoutMs,
      ...options,
    });
    this.logger.info(`REA analysis completed in ${Date.now() - start}ms`);
    return evidence;
  }

  /**
   * Parse and extract high-level metrics from REA Evidence.
   */
  inspectEvidence(evidence: REAEvidence): ParsedEvidenceAnalysis {
    return EvidenceParser.parse(evidence);
  }

  /**
   * Phase 2: Synthesize REA Evidence into a Vibe Blueprint.
   */
  synthesizeBlueprint(evidence: REAEvidence): VibeBlueprint {
    this.logger.info(`Synthesizing blueprint for target: ${evidence.source.target}`);
    return BlueprintSynthesizer.synthesize(evidence);
  }

  /**
   * Phase 3: Generate Next.js & Tailwind project code from Vibe Blueprint.
   */
  generateProject(blueprint: VibeBlueprint, options: CloneOptions = {}): GeneratedProject {
    this.logger.info(`Generating Next.js & Tailwind project for blueprint: ${blueprint.id}`);
    return CodeGenerator.generate(blueprint, options);
  }

  /**
   * End-to-end Reverse Engineering Pipeline:
   * 1. Run REA on target
   * 2. Synthesize Blueprint
   * 3. Generate Next.js & Tailwind Code
   */
  async clone(target: string, options: CloneOptions & REAExecutionOptions = { target }): Promise<FullCloneResult> {
    const startTime = Date.now();
    this.logger.info(`=== Starting Vibe Swift Full Reverse-Engineering for: ${target} ===`);

    // 1. REA Ingestion & Analysis
    const evidence = await this.analyze(options);

    // 2. Blueprint Synthesis
    const blueprint = this.synthesizeBlueprint(evidence);

    // Apply theme overrides if any
    if (options.themeOverrides) {
      blueprint.theme = { ...blueprint.theme, ...options.themeOverrides };
    }

    // 3. AI Refinement (optional)
    if (options.enableAiRefinement) {
      this.logger.info('Running AI enhancement pass on synthesized components...');
      blueprint.components = blueprint.components.map((c) => AIEnhancer.refineComponent(c));
    }

    // 4. Code Generation
    const project = this.generateProject(blueprint, options);

    const durationMs = Date.now() - startTime;
    this.logger.info(`=== Full Reverse-Engineering Completed in ${durationMs}ms ===`);

    return {
      id: `clone-${Date.now()}`,
      target,
      durationMs,
      evidence,
      blueprint,
      project,
    };
  }

  /**
   * Refine an individual component with AI.
   */
  refineComponent(component: VibeComponent, prompt?: string): VibeComponent {
    return AIEnhancer.refineComponent(component, prompt);
  }
}

// Export singleton engine instance for quick use
export const defaultEngine = new VibeEngine();
