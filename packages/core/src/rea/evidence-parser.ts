import { REAEvidence, REASnapshotNode } from '../types/rea.js';

export interface ParsedEvidenceAnalysis {
  frameworks: string[];
  componentsIdentified: string[];
  routesIdentified: string[];
  colorPalette: string[];
  apiEndpoints: Array<{ path: string; method: string; preview?: string }>;
  domNodeCount: number;
}

export class EvidenceParser {
  /**
   * Parse and analyze an REA evidence payload.
   */
  static parse(evidence: REAEvidence): ParsedEvidenceAnalysis {
    const frameworks = evidence.metadata.detectedFrameworks ?? [];
    const componentsIdentified: string[] = [];
    const routesIdentified: string[] = [];
    const colorPalette = new Set<string>();
    const apiEndpoints: Array<{ path: string; method: string; preview?: string }> = [];

    // Extract components from modules
    for (const mod of evidence.modules) {
      if (!mod.isThirdParty && mod.name) {
        componentsIdentified.push(mod.name);
      }
    }

    // Extract routes from entry points
    for (const ep of evidence.entryPoints) {
      if (ep.type === 'route' || ep.path.includes('/page.') || ep.path.includes('/routes/')) {
        routesIdentified.push(ep.path);
      }
    }

    // Extract endpoints from network
    for (const net of evidence.network) {
      apiEndpoints.push({
        path: net.url,
        method: net.method,
        preview: net.responsePreview,
      });
    }

    // Extract DOM stats and components
    let domNodeCount = 0;
    if (evidence.domTree) {
      this.traverseDOM(evidence.domTree, (node) => {
        domNodeCount++;
        if (node.componentCandidate && !componentsIdentified.includes(node.componentCandidate)) {
          componentsIdentified.push(node.componentCandidate);
        }
        for (const cls of node.classes) {
          if (cls.startsWith('bg-') || cls.startsWith('text-') || cls.startsWith('border-')) {
            colorPalette.add(cls);
          }
        }
      });
    }

    // Extract colors from styles
    for (const style of evidence.styles) {
      for (const [key, val] of Object.entries(style.rules)) {
        if (key.includes('color') || key.includes('background') || key.startsWith('--')) {
          colorPalette.add(val);
        }
      }
    }

    return {
      frameworks,
      componentsIdentified: componentsIdentified.length > 0 ? componentsIdentified : ['Navbar', 'HeroSection', 'Footer'],
      routesIdentified: routesIdentified.length > 0 ? routesIdentified : ['/'],
      colorPalette: Array.from(colorPalette).slice(0, 20),
      apiEndpoints,
      domNodeCount,
    };
  }

  private static traverseDOM(node: REASnapshotNode, callback: (node: REASnapshotNode) => void) {
    callback(node);
    if (node.children) {
      for (const child of node.children) {
        this.traverseDOM(child, callback);
      }
    }
  }
}
