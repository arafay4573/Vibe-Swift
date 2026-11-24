import { REAEvidence, REASnapshotNode } from '../types/rea.js';
import {
  VibeBlueprint,
  VibeComponent,
  RouteBlueprint,
  APIEndpointBlueprint,
  ThemeBlueprint,
  ComponentCategory,
} from '../types/blueprint.js';
import { CssToTailwind } from './css-to-tailwind.js';
import { decodeHtmlEntities } from '../utils/html-decoder.js';

export class BlueprintSynthesizer {
  /**
   * Synthesize raw REA Evidence into a structured VibeBlueprint.
   */
  static synthesize(evidence: REAEvidence): VibeBlueprint {
    const id = `blueprint-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const sourceTarget = evidence.source.target;
    const name = decodeHtmlEntities(evidence.metadata.title || 'Vibe Swift Reengineered App');

    // 1. Synthesize theme (The Swifters Black & Grey Studio Theme)
    const theme = this.synthesizeTheme(evidence);

    // 2. Synthesize components
    const components = this.synthesizeComponents(evidence);

    // 3. Synthesize routes
    const routes = this.synthesizeRoutes(evidence, components);

    // 4. Synthesize API endpoints
    const apiEndpoints = this.synthesizeApiEndpoints(evidence);

    // 5. Total tailwind classes count
    let totalClasses = 0;
    for (const c of components) {
      totalClasses += c.tailwindClasses.length;
    }

    return {
      id,
      name,
      version: '1.0.0',
      timestamp,
      sourceTarget,
      frameworksDetected: evidence.metadata.detectedFrameworks,
      theme,
      routes,
      components,
      apiEndpoints,
      metadata: {
        title: name,
        description: decodeHtmlEntities(evidence.metadata.description || 'Reverse-engineered with Vibe Swift and morluto/rea.'),
      },
      summaryStats: {
        totalComponents: components.length,
        totalRoutes: routes.length,
        totalEndpoints: apiEndpoints.length,
        totalTailwindClasses: totalClasses,
      },
    };
  }

  private static synthesizeTheme(evidence: REAEvidence): ThemeBlueprint {
    // The Swifters Studio Black & Grey Theme
    return {
      darkMode: true,
      colors: {
        primary: '#f4f4f5', // Crisp silver / off-white
        primaryForeground: '#09090b', // Deep charcoal
        secondary: '#27272a', // Subtle zinc border/surface
        secondaryForeground: '#f4f4f5',
        background: '#09090b', // Deep obsidian black
        foreground: '#f4f4f5', // Crisp silver text
        muted: '#18181b', // Dark charcoal fill
        mutedForeground: '#71717a', // Muted ash text
        accent: '#27272a',
        accentForeground: '#f4f4f5',
        border: '#27272a', // Hairline 1px border
        card: '#121214', // Pitch charcoal panel
        cardForeground: '#f4f4f5',
      },
      typography: {
        fontSans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontHeading: 'Inter, -apple-system, sans-serif',
        baseSize: '15px',
        headingScale: '1.2',
      },
      borderRadius: '0.375rem', // Restrained, sharp, utilitarian
    };
  }

  private static synthesizeComponents(evidence: REAEvidence): VibeComponent[] {
    const list: VibeComponent[] = [];
    const addedNames = new Set<string>();

    // Strategy 1: Extract from DOM tree candidates
    if (evidence.domTree && evidence.domTree.children) {
      for (const child of evidence.domTree.children) {
        if (child.componentCandidate && !addedNames.has(child.componentCandidate)) {
          addedNames.add(child.componentCandidate);
          list.push(this.createComponentFromNode(child.componentCandidate, child));
        }
      }
    }

    // Strategy 2: If modules exist, ensure standard components exist
    const standardSpecs = [
      { name: 'Navbar', category: 'navigation' as ComponentCategory, desc: 'Precision navigation bar with brand mark, route links, and action trigger.' },
      { name: 'HeroSection', category: 'hero' as ComponentCategory, desc: 'Sharp headline display with architectural specs, technical badge, and primary action.' },
      { name: 'FeatureGrid', category: 'feature' as ComponentCategory, desc: 'Utilitarian multi-column layout detailing system specifications and pipeline modules.' },
      { name: 'MetricsGrid', category: 'metric' as ComponentCategory, desc: 'Monochrome telemetry readouts displaying latency, throughput, and system quotas.' },
      { name: 'PricingMatrix', category: 'card' as ComponentCategory, desc: 'Tiered subscription modules with technical checklists and deploy actions.' },
      { name: 'CallToAction', category: 'cta' as ComponentCategory, desc: 'Understated deployment banner for project initialization.' },
      { name: 'Footer', category: 'footer' as ComponentCategory, desc: 'Studio footer with technical manifest, status readouts, and repository links.' },
    ];

    for (const spec of standardSpecs) {
      if (!addedNames.has(spec.name)) {
        addedNames.add(spec.name);
        list.push(this.createStandardComponent(spec.name, spec.category, spec.desc));
      }
    }

    return list;
  }

  private static createComponentFromNode(name: string, node: REASnapshotNode): VibeComponent {
    const category = this.inferCategoryFromName(name);
    const convertedClasses = node.styles ? CssToTailwind.convertRules(node.styles) : [];
    const classes = Array.from(new Set([...node.classes, ...convertedClasses]));

    return {
      id: `comp-${name.toLowerCase()}`,
      name,
      category,
      description: `Reverse-engineered ${category} component synthesized from ${node.tag} element.`,
      props: [
        { name: 'className', type: 'string', required: false, defaultValue: '""', description: 'Custom CSS classes' },
      ],
      state: [],
      jsxTree: {
        tag: node.tag,
        className: classes.join(' '),
        text: decodeHtmlEntities(node.text),
      },
      tailwindClasses: classes,
      lucideIcons: this.inferIconsForCategory(category),
      isClientComponent: category === 'navigation' || category === 'form' || category === 'modal',
    };
  }

  private static createStandardComponent(
    name: string,
    category: ComponentCategory,
    description: string
  ): VibeComponent {
    let classes: string[] = [];
    const icons = this.inferIconsForCategory(category);
    let isClient = false;

    // Utilitarian studio classes (monochrome zinc & black)
    switch (category) {
      case 'navigation':
        classes = ['sticky', 'top-0', 'z-50', 'w-full', 'border-b', 'border-zinc-800', 'bg-zinc-950/95', 'backdrop-blur'];
        isClient = true;
        break;
      case 'hero':
        classes = ['relative', 'py-20', 'md:py-28', 'border-b', 'border-zinc-800/80', 'bg-zinc-950'];
        break;
      case 'feature':
        classes = ['py-20', 'container', 'mx-auto', 'px-6', 'border-b', 'border-zinc-800/60'];
        break;
      case 'metric':
        classes = ['py-12', 'bg-zinc-900/40', 'border-b', 'border-zinc-800/60'];
        break;
      case 'card':
        classes = ['py-20', 'container', 'mx-auto', 'px-6'];
        break;
      case 'cta':
        classes = ['py-16', 'bg-zinc-900/50', 'border-y', 'border-zinc-800'];
        break;
      case 'footer':
        classes = ['border-t', 'border-zinc-800', 'bg-zinc-950', 'py-10', 'text-zinc-500'];
        break;
      default:
        classes = ['py-12', 'container', 'mx-auto', 'px-4'];
    }

    return {
      id: `comp-${name.toLowerCase()}`,
      name,
      category,
      description,
      props: [
        { name: 'className', type: 'string', required: false, defaultValue: '""', description: 'Additional classes' },
      ],
      state: isClient ? [{ name: 'isOpen', type: 'boolean', initialValue: 'false' }] : [],
      jsxTree: {
        tag: 'section',
        className: classes.join(' '),
      },
      tailwindClasses: classes,
      lucideIcons: icons,
      isClientComponent: isClient,
    };
  }

  private static inferCategoryFromName(name: string): ComponentCategory {
    const l = name.toLowerCase();
    if (l.includes('nav') || l.includes('header')) return 'navigation';
    if (l.includes('hero')) return 'hero';
    if (l.includes('feature')) return 'feature';
    if (l.includes('metric') || l.includes('stat')) return 'metric';
    if (l.includes('price') || l.includes('pricing')) return 'card';
    if (l.includes('cta') || l.includes('action')) return 'cta';
    if (l.includes('footer')) return 'footer';
    if (l.includes('form')) return 'form';
    return 'custom';
  }

  private static inferIconsForCategory(category: ComponentCategory): string[] {
    switch (category) {
      case 'navigation':
        return ['Menu', 'X', 'ChevronRight', 'Terminal'];
      case 'hero':
        return ['ArrowRight', 'Terminal', 'Activity', 'Shield'];
      case 'feature':
        return ['Cpu', 'Layers', 'GitBranch', 'Lock', 'Check'];
      case 'metric':
        return ['TrendingUp', 'Activity', 'Users', 'Clock'];
      case 'card':
        return ['Check', 'ArrowUpRight'];
      case 'cta':
        return ['Terminal', 'ArrowRight'];
      case 'footer':
        return ['Github', 'Terminal', 'Globe'];
      default:
        return ['Check'];
    }
  }

  private static synthesizeRoutes(evidence: REAEvidence, components: VibeComponent[]): RouteBlueprint[] {
    const compIds = components.map((c) => c.id);
    const title = decodeHtmlEntities(evidence.metadata.title || 'Studio Architecture');

    return [
      {
        path: '/',
        name: 'Overview',
        title,
        description: 'Primary landing interface composing reconstructed components.',
        componentIds: compIds,
        isDynamic: false,
      },
      {
        path: '/pricing',
        name: 'Tiers & Specs',
        title: 'Pricing & Capacity',
        description: 'Infrastructure and subscription matrix.',
        componentIds: ['comp-navbar', 'comp-pricingmatrix', 'comp-footer'],
        isDynamic: false,
      },
      {
        path: '/dashboard',
        name: 'Telemetry',
        title: 'System Telemetry',
        description: 'Runtime telemetry and observed network traces.',
        componentIds: ['comp-navbar', 'comp-metricsgrid', 'comp-footer'],
        isDynamic: false,
      },
    ];
  }

  private static synthesizeApiEndpoints(evidence: REAEvidence): APIEndpointBlueprint[] {
    if (evidence.network && evidence.network.length > 0) {
      return evidence.network.map((n) => {
        let mockResponse: Record<string, unknown> = { status: 'healthy' };
        if (n.responsePreview) {
          try {
            mockResponse = JSON.parse(n.responsePreview);
          } catch {
            mockResponse = { raw: decodeHtmlEntities(n.responsePreview) };
          }
        }
        return {
          path: n.url.startsWith('/') ? n.url : `/api/${n.url.split('/').pop() || 'data'}`,
          method: (n.method as any) || 'GET',
          description: `Captured REA trace from ${n.initiator || 'client'}`,
          mockResponse,
        };
      });
    }

    return [
      {
        path: '/api/v1/telemetry',
        method: 'GET',
        description: 'System telemetry mock endpoint',
        mockResponse: {
          target: evidence.source.target,
          status: 'operational',
          frameworks: evidence.metadata.detectedFrameworks,
          viewport: evidence.metadata.viewport,
        },
      },
    ];
  }
}
