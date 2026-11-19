import { z } from 'zod';

export type REAAnalysisMode =
  | 'javascript-app'
  | 'web-session'
  | 'network-capture'
  | 'binary'
  | 'auto';

export interface REAExecutionOptions {
  target: string;
  mode?: REAAnalysisMode;
  timeoutMs?: number;
  customCliPath?: string;
  inlineEvidence?: REAEvidence;
  env?: Record<string, string>;
  debug?: boolean;
}

export interface REAEntryPoint {
  id: string;
  name: string;
  path: string;
  type: 'html' | 'entry' | 'module' | 'route' | 'worker';
}

export interface REAModuleInfo {
  id: string;
  path: string;
  name: string;
  size?: number;
  imports?: string[];
  exports?: string[];
  isThirdParty?: boolean;
  frameworkHint?: string;
}

export interface REANetworkCall {
  url: string;
  method: string;
  status?: number;
  contentType?: string;
  payloadSummary?: string;
  responsePreview?: string;
  initiator?: string;
}

export interface REASnapshotNode {
  tag: string;
  id?: string;
  classes: string[];
  attributes: Record<string, string>;
  text?: string;
  styles?: Record<string, string>;
  children?: REASnapshotNode[];
  componentCandidate?: string;
}

export interface REAAsset {
  url: string;
  type: 'image' | 'svg' | 'font' | 'stylesheet' | 'script' | 'media';
  width?: number;
  height?: number;
  alt?: string;
  mimeType?: string;
}

export interface REAEvidence {
  schemaVersion: string;
  source: {
    kind: 'url' | 'directory' | 'archive' | 'har' | 'binary' | 'mock';
    target: string;
    timestamp: string;
  };
  metadata: {
    title?: string;
    description?: string;
    detectedFrameworks: string[];
    viewport?: { width: number; height: number };
  };
  entryPoints: REAEntryPoint[];
  modules: REAModuleInfo[];
  network: REANetworkCall[];
  domTree?: REASnapshotNode;
  styles: Array<{ selector: string; rules: Record<string, string> }>;
  assets: REAAsset[];
  views?: {
    summary?: Record<string, unknown>;
    components?: Record<string, unknown>;
  };
  diagnostics: Array<{
    level: 'info' | 'warn' | 'error';
    message: string;
    timestamp: string;
  }>;
}

export const REAExecutionOptionsSchema = z.object({
  target: z.string().min(1, 'Target path or URL is required'),
  mode: z.enum(['javascript-app', 'web-session', 'network-capture', 'binary', 'auto']).default('auto'),
  timeoutMs: z.number().positive().default(30000),
  customCliPath: z.string().optional(),
  debug: z.boolean().default(false),
});
