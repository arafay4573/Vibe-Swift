export type ComponentCategory =
  | 'layout'
  | 'navigation'
  | 'hero'
  | 'feature'
  | 'cta'
  | 'card'
  | 'form'
  | 'table'
  | 'modal'
  | 'footer'
  | 'metric'
  | 'custom';

export interface ComponentProp {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'ReactNode';
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface ComponentState {
  name: string;
  type: string;
  initialValue: string;
}

export interface JSXNode {
  tag: string;
  className?: string;
  attributes?: Record<string, string>;
  text?: string;
  children?: JSXNode[];
  componentRef?: string;
  conditional?: string;
  loop?: {
    item: string;
    items: string;
  };
}

export interface VibeComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  props: ComponentProp[];
  state: ComponentState[];
  jsxTree: JSXNode;
  tailwindClasses: string[];
  lucideIcons: string[];
  rawSnippet?: string;
  isClientComponent: boolean;
}

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}

export interface ThemeTypography {
  fontSans: string;
  fontHeading: string;
  baseSize: string;
  headingScale: string;
}

export interface ThemeBlueprint {
  colors: ThemeColors;
  typography: ThemeTypography;
  borderRadius: string;
  darkMode: boolean;
}

export interface RouteBlueprint {
  path: string;
  name: string;
  title: string;
  description: string;
  componentIds: string[];
  isDynamic: boolean;
}

export interface APIEndpointBlueprint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  mockResponse: Record<string, unknown> | Array<unknown>;
}

export interface VibeBlueprint {
  id: string;
  name: string;
  version: string;
  timestamp: string;
  sourceTarget: string;
  frameworksDetected: string[];
  theme: ThemeBlueprint;
  routes: RouteBlueprint[];
  components: VibeComponent[];
  apiEndpoints: APIEndpointBlueprint[];
  metadata: {
    title: string;
    description: string;
    author?: string;
    ogImage?: string;
  };
  summaryStats: {
    totalComponents: number;
    totalRoutes: number;
    totalEndpoints: number;
    totalTailwindClasses: number;
  };
}
