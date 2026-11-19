import { REAEvidence } from '../types/rea.js';

export const SAMPLE_SAAS_EVIDENCE: REAEvidence = {
  schemaVersion: '1.2.0',
  source: {
    kind: 'url',
    target: 'https://vibe-analytics.app',
    timestamp: '2026-11-19T02:00:00.000Z',
  },
  metadata: {
    title: 'Vibe Analytics — Real-Time Telemetry & Insights',
    description: 'Autonomous analytics and intelligent performance monitoring for modern web scale.',
    detectedFrameworks: ['Next.js', 'React', 'Tailwind CSS', 'Radix UI'],
    viewport: { width: 1440, height: 900 },
  },
  entryPoints: [
    { id: 'ep-root', name: 'Root Layout', path: 'app/layout.tsx', type: 'entry' },
    { id: 'ep-landing', name: 'Marketing Index', path: 'app/page.tsx', type: 'route' },
    { id: 'ep-dashboard', name: 'Metrics Overview', path: 'app/dashboard/page.tsx', type: 'route' },
    { id: 'ep-pricing', name: 'Plans & Pricing', path: 'app/pricing/page.tsx', type: 'route' },
  ],
  modules: [
    { id: 'mod-1', name: 'NavigationBar', path: 'components/navigation/navbar.tsx', exports: ['Navbar'], isThirdParty: false },
    { id: 'mod-2', name: 'HeroSection', path: 'components/hero/hero-section.tsx', exports: ['HeroSection'], isThirdParty: false },
    { id: 'mod-3', name: 'MetricsGrid', path: 'components/analytics/metrics-grid.tsx', exports: ['MetricsGrid'], isThirdParty: false },
    { id: 'mod-4', name: 'FeatureShowcase', path: 'components/features/feature-showcase.tsx', exports: ['FeatureShowcase'], isThirdParty: false },
    { id: 'mod-5', name: 'PricingMatrix', path: 'components/pricing/pricing-matrix.tsx', exports: ['PricingMatrix'], isThirdParty: false },
    { id: 'mod-6', name: 'Footer', path: 'components/layout/footer.tsx', exports: ['Footer'], isThirdParty: false },
    { id: 'mod-lucide', name: 'lucide-react', path: 'node_modules/lucide-react', isThirdParty: true },
  ],
  network: [
    {
      url: '/api/v1/telemetry/stats',
      method: 'GET',
      status: 200,
      contentType: 'application/json',
      responsePreview: JSON.stringify({
        activeUsers: '142,890',
        latencyP99: '18ms',
        uptime: '99.99%',
        throughput: '3.4M req/s',
      }),
      initiator: 'components/analytics/metrics-grid.tsx',
    },
    {
      url: '/api/v1/plans',
      method: 'GET',
      status: 200,
      contentType: 'application/json',
      responsePreview: JSON.stringify([
        { id: 'starter', name: 'Starter', price: '$29', features: ['10k events/mo', 'Realtime charts', 'Email support'] },
        { id: 'pro', name: 'Pro', price: '$89', popular: true, features: ['Unlimited events', 'Custom webhooks', '24/7 SLA'] },
        { id: 'enterprise', name: 'Enterprise', price: 'Custom', features: ['Dedicated cluster', 'On-premise hybrid', 'SOC2 Compliance'] },
      ]),
      initiator: 'components/pricing/pricing-matrix.tsx',
    },
  ],
  domTree: {
    tag: 'body',
    classes: ['min-h-screen', 'bg-slate-950', 'text-slate-100', 'antialiased', 'selection:bg-cyan-500/30'],
    attributes: { 'data-theme': 'dark' },
    children: [
      {
        tag: 'header',
        classes: ['sticky', 'top-0', 'z-50', 'w-full', 'border-b', 'border-slate-800/80', 'bg-slate-950/80', 'backdrop-blur-md'],
        attributes: {},
        componentCandidate: 'Navbar',
        children: [
          {
            tag: 'div',
            classes: ['container', 'mx-auto', 'flex', 'h-16', 'items-center', 'justify-between', 'px-6'],
            attributes: {},
            children: [],
          },
        ],
      },
      {
        tag: 'section',
        classes: ['relative', 'overflow-hidden', 'py-24', 'md:py-32'],
        attributes: { id: 'hero' },
        componentCandidate: 'HeroSection',
        children: [
          {
            tag: 'div',
            classes: ['container', 'mx-auto', 'px-6', 'text-center'],
            attributes: {},
            text: 'Autonomous telemetry for hyperscale applications.',
          },
        ],
      },
      {
        tag: 'section',
        classes: ['py-20', 'bg-slate-900/40', 'border-y', 'border-slate-800/60'],
        attributes: { id: 'metrics' },
        componentCandidate: 'MetricsGrid',
        children: [],
      },
      {
        tag: 'section',
        classes: ['py-24'],
        attributes: { id: 'features' },
        componentCandidate: 'FeatureShowcase',
        children: [],
      },
      {
        tag: 'section',
        classes: ['py-24', 'bg-slate-900/50'],
        attributes: { id: 'pricing' },
        componentCandidate: 'PricingMatrix',
        children: [],
      },
      {
        tag: 'footer',
        classes: ['border-t', 'border-slate-800', 'bg-slate-950', 'py-12', 'text-slate-400'],
        attributes: {},
        componentCandidate: 'Footer',
        children: [],
      },
    ],
  },
  styles: [
    { selector: ':root', rules: { '--primary': '#06b6d4', '--bg': '#020617', '--card': '#0f172a' } },
    { selector: '.hero-gradient', rules: { 'background-image': 'linear-gradient(to right, #06b6d4, #3b82f6)' } },
  ],
  assets: [
    { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', type: 'image', alt: 'Analytics Dashboard Preview' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', type: 'image', alt: 'Data Visualization Metrics' },
  ],
  diagnostics: [
    { level: 'info', message: 'REA static analysis completed: 6 components indexed, 2 network endpoints mapped.', timestamp: '2026-11-19T02:00:01.000Z' },
  ],
};
