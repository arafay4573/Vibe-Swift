import { VibeBlueprint, VibeComponent, ThemeBlueprint, RouteBlueprint, APIEndpointBlueprint } from '../types/blueprint.js';
import { CloneOptions, GeneratedFile, GeneratedProject } from '../types/synthesis.js';
import { decodeHtmlEntities } from '../utils/html-decoder.js';

export class CodeGenerator {
  /**
   * Generates a complete Next.js 14+ App Router & Tailwind CSS project from a VibeBlueprint.
   */
  static generate(blueprint: VibeBlueprint, options: CloneOptions = {}): GeneratedProject {
    const rawProjectName = options.projectName || blueprint.name;
    const cleanProjectName = decodeHtmlEntities(rawProjectName)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const files: GeneratedFile[] = [];

    // 1. Root configuration files
    files.push(this.generatePackageJson(cleanProjectName));
    files.push(this.generateTsConfig());
    files.push(this.generateTailwindConfig(blueprint.theme));
    files.push(this.generatePostcssConfig());
    files.push(this.generateGlobalsCss(blueprint.theme));

    // 2. Next.js App Router: Layout and Pages
    files.push(this.generateRootLayout(blueprint));
    files.push(this.generateHomePage(blueprint));

    // 3. Additional route pages
    for (const route of blueprint.routes) {
      if (route.path !== '/') {
        files.push(this.generateRoutePage(route, blueprint));
      }
    }

    // 4. Extracted & Reconstructed UI Components
    for (const comp of blueprint.components) {
      files.push(this.generateComponentFile(comp, blueprint.theme));
    }

    // 5. API Routes
    if (options.includeMockApi !== false && blueprint.apiEndpoints.length > 0) {
      for (const ep of blueprint.apiEndpoints) {
        files.push(this.generateApiRoute(ep));
      }
    }

    // 6. Documentation & README
    const readme = this.generateReadme(blueprint, cleanProjectName);
    files.push({
      path: 'README.md',
      content: readme,
      type: 'doc',
      description: 'Project README and architecture documentation',
    });

    const stats = {
      totalFiles: files.length,
      componentsCount: blueprint.components.length,
      routesCount: blueprint.routes.length,
      apiRoutesCount: blueprint.apiEndpoints.length,
    };

    return {
      id: `proj-${Date.now()}`,
      name: cleanProjectName,
      targetFramework: options.targetFramework || 'nextjs-app-router',
      files,
      blueprint,
      stats,
      summary: `Synthesized ${files.length} production Next.js files with ${blueprint.components.length} Tailwind components from ${blueprint.sourceTarget}.`,
      readme,
    };
  }

  private static generatePackageJson(projectName: string): GeneratedFile {
    const content = `{
  "name": "${projectName}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.18",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@types/node": "^22.10.1",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.7.2"
  }
}
`;
    return { path: 'package.json', content, type: 'config' };
  }

  private static generateTsConfig(): GeneratedFile {
    const content = `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;
    return { path: 'tsconfig.json', content, type: 'config' };
  }

  private static generatePostcssConfig(): GeneratedFile {
    const content = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
    return { path: 'postcss.config.js', content, type: 'config' };
  }

  private static generateTailwindConfig(theme: ThemeBlueprint): GeneratedFile {
    const content = `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
`;
    return { path: 'tailwind.config.ts', content, type: 'config' };
  }

  private static generateGlobalsCss(theme: ThemeBlueprint): GeneratedFile {
    const content = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 5%;
    --card-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 12%;
    --muted-foreground: 240 5% 55%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --radius: ${theme.borderRadius || '0.375rem'};
  }
}

body {
  color: hsl(var(--foreground));
  background: hsl(var(--background));
  font-family: ${theme.typography.fontSans};
}
`;
    return { path: 'app/globals.css', content, type: 'style' };
  }

  private static generateRootLayout(blueprint: VibeBlueprint): GeneratedFile {
    const cleanTitle = decodeHtmlEntities(blueprint.metadata.title);
    const cleanDesc = decodeHtmlEntities(blueprint.metadata.description);

    const content = `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "${cleanTitle}",
  description: "${cleanDesc}",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={\`\${inter.className} min-h-screen flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800 selection:text-white\`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
`;
    return { path: 'app/layout.tsx', content, type: 'layout' };
  }

  private static generateHomePage(blueprint: VibeBlueprint): GeneratedFile {
    const comps = blueprint.components.filter(
      (c) => c.name !== 'Navbar' && c.name !== 'Footer'
    );

    const imports = comps
      .map((c) => `import { ${c.name} } from "@/components/${this.toKebabCase(c.name)}";`)
      .join('\n');

    const jsxElements = comps.map((c) => `      <${c.name} />`).join('\n');

    const content = `import React from "react";
${imports}

export default function HomePage() {
  return (
    <div className="flex flex-col">
${jsxElements}
    </div>
  );
}
`;
    return { path: 'app/page.tsx', content, type: 'page' };
  }

  private static generateRoutePage(route: RouteBlueprint, blueprint: VibeBlueprint): GeneratedFile {
    const segment = route.path.replace(/^\//, '');
    const path = `app/${segment}/page.tsx`;

    const relevantComps = blueprint.components.filter((c) =>
      route.componentIds.includes(c.id) && c.name !== 'Navbar' && c.name !== 'Footer'
    );

    const imports = relevantComps
      .map((c) => `import { ${c.name} } from "@/components/${this.toKebabCase(c.name)}";`)
      .join('\n');

    const elements = relevantComps.map((c) => `      <${c.name} />`).join('\n');
    const cleanTitle = decodeHtmlEntities(route.title);
    const cleanDesc = decodeHtmlEntities(route.description);

    const content = `import React from "react";
import type { Metadata } from "next";
${imports}

export const metadata: Metadata = {
  title: "${cleanTitle}",
  description: "${cleanDesc}",
};

export default function ${this.toPascalCase(route.name)}Page() {
  return (
    <div className="container mx-auto px-6 py-16 flex flex-col gap-10">
      <div className="border-b border-zinc-800 pb-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">${cleanTitle}</h1>
        <p className="text-sm text-zinc-400">${cleanDesc}</p>
      </div>
${elements}
    </div>
  );
}
`;
    return { path, content, type: 'page' };
  }

  private static generateComponentFile(comp: VibeComponent, theme: ThemeBlueprint): GeneratedFile {
    const fileName = `components/${this.toKebabCase(comp.name)}.tsx`;
    const iconImports = comp.lucideIcons.length > 0
      ? `import { ${comp.lucideIcons.join(', ')} } from "lucide-react";\n`
      : '';

    const clientDirective = comp.isClientComponent ? '"use client";\n\n' : '';
    const body = this.renderComponentTemplate(comp);

    const content = `${clientDirective}import React${comp.isClientComponent ? ', { useState }' : ''} from "react";
${iconImports}
export interface ${comp.name}Props {
  className?: string;
}

export function ${comp.name}({ className = "" }: ${comp.name}Props) {
${body}
}
`;
    return { path: fileName, content, type: 'component', description: decodeHtmlEntities(comp.description) };
  }

  private static renderComponentTemplate(comp: VibeComponent): string {
    switch (comp.category) {
      case 'navigation':
        return `  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/90 bg-zinc-950/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 text-sm font-semibold text-white tracking-wider uppercase font-mono">
            <span>VIBE SWIFT</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
          <a href="#features" className="hover:text-white transition-colors">Specifications</a>
          <a href="/pricing" className="hover:text-white transition-colors">Tiers</a>
          <a href="/dashboard" className="hover:text-white transition-colors">Telemetry</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
            Sign In
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center rounded border border-zinc-700 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-950 hover:bg-white transition-colors"
          >
            Launch System
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1.5 text-zinc-400 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-6 py-4 space-y-2 text-xs">
          <a href="#features" className="block text-zinc-300 hover:text-white">Specifications</a>
          <a href="/pricing" className="block text-zinc-300 hover:text-white">Tiers</a>
          <a href="/dashboard" className="block text-zinc-300 hover:text-white">Telemetry</a>
        </div>
      )}
    </header>
  );`;

      case 'hero':
        return `  return (
    <section className="relative py-24 md:py-32 border-b border-zinc-800/80 bg-zinc-950">
      <div className="container mx-auto px-6 max-w-4xl text-left">
        <div className="inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs font-mono text-zinc-300 mb-6">
          <Terminal className="h-3.5 w-3.5 text-zinc-400" />
          <span>morluto/rea reverse-engineering engine</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight">
          Deconstruct web architectures. <br />
          <span className="text-zinc-400">Rebuilt with precision engineering.</span>
        </h1>

        <p className="text-base text-zinc-400 mb-8 max-w-2xl leading-relaxed">
          Ingest target web applications, static bundles, or live sessions. Extract clean component trees, styles, and API contracts into production Next.js & Tailwind repositories.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-white transition-colors"
          >
            <span>Launch Engine</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-700 transition-colors"
          >
            Review Blueprint
          </a>
        </div>
      </div>
    </section>
  );`;

      case 'metric':
        return `  const stats = [
    { label: "P99 Telemetry", value: "14ms", status: "Nominal" },
    { label: "Components Mapped", value: "250K+", status: "Verified" },
    { label: "AST Fidelity", value: "99.8%", status: "Zero Drift" },
    { label: "Pipeline Speed", value: "1.2s", status: "Optimized" },
  ];

  return (
    <section className="py-12 border-b border-zinc-800/80 bg-zinc-900/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="border-l border-zinc-800 pl-4">
              <div className="text-2xl font-semibold text-white tracking-tight font-mono">{stat.value}</div>
              <div className="text-xs text-zinc-400 mt-1">{stat.label}</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{stat.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );`;

      case 'feature':
        return `  const features = [
    {
      title: "morluto/rea Core Protocol",
      description: "Direct harness to the REA CLI and MCP server, analyzing native modules, JS bundles, and network pipelines.",
    },
    {
      title: "Blueprint Synthesis",
      description: "Converts raw ASTs and DOM snapshots into high-level React components with clean props and state isolation.",
    },
    {
      title: "Tailwind Utility Mapping",
      description: "Translates complex computed styles and css variables into modern, responsive Tailwind utility classes.",
    },
  ];

  return (
    <section id="features" className="py-20 border-b border-zinc-800/80 container mx-auto px-6">
      <div className="max-w-2xl mb-12">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
          Technical Specifications
        </h2>
        <p className="text-xs text-zinc-400">
          Deconstruct web apps into maintainable components without losing visual fidelity or architectural intent.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-zinc-500 mb-3">MODULE // 0{i + 1}</div>
              <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );`;

      case 'card':
        return `  const tiers = [
    { name: "Starter", price: "$29", desc: "For single-target reverse engineering prototypes.", feats: ["10 extractions/mo", "Next.js App Router output", "Standard synthesis"] },
    { name: "Pro", price: "$89", popular: true, desc: "For engineering teams cloning complex full-stack apps.", feats: ["Unlimited extractions", "Full AST & DOM synthesis", "AI refinement pass", "API contract generation"] },
    { name: "Enterprise", price: "Custom", desc: "Self-hosted REA instances and on-premise binary parsing.", feats: ["Dedicated instance", "Custom MCP agents", "SOC2 Compliance", "SLA guarantees"] },
  ];

  return (
    <section id="pricing" className="py-20 border-b border-zinc-800/80 container mx-auto px-6">
      <div className="max-w-2xl mb-12">
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
          Infrastructure Tiers
        </h2>
        <p className="text-xs text-zinc-400">
          Deploy reverse-engineered workloads to your specific scale requirements.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className={\`rounded border p-6 flex flex-col justify-between \${
              tier.popular ? "border-zinc-700 bg-zinc-900/70" : "border-zinc-800 bg-zinc-900/30"
            }\`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">{tier.name}</h3>
                {tier.popular && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mb-6">{tier.desc}</p>
              <div className="text-3xl font-semibold text-white font-mono mb-6">
                {tier.price} <span className="text-xs font-normal text-zinc-500">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-8 text-xs text-zinc-300">
                {tier.feats.map((feat, fi) => (
                  <li key={fi} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={\`w-full py-2 rounded text-xs font-medium transition-colors \${
                tier.popular
                  ? "bg-zinc-100 text-zinc-950 hover:bg-white"
                  : "border border-zinc-800 text-zinc-300 hover:border-zinc-700 bg-zinc-900/80"
              }\`}
            >
              Select Tier
            </button>
          </div>
        ))}
      </div>
    </section>
  );`;

      case 'cta':
        return `  return (
    <section className="py-20 border-b border-zinc-800 bg-zinc-950">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Initialize Reverse-Engineering Target
        </h2>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Provide any target URL or application bundle to generate your Next.js & Tailwind repository.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-white transition-colors"
        >
          <span>Open Engineering Dashboard</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );`;

      case 'footer':
        return `  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-10 text-xs text-zinc-500">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-2 text-zinc-300">
          <span>VIBE SWIFT // STUDIO</span>
        </div>
        <p className="text-zinc-500">
          Powered by morluto/rea &bull; Synthesized Next.js & Tailwind
        </p>
        <div className="flex items-center gap-4 text-zinc-400">
          <a href="https://github.com/morluto/rea" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">morluto/rea</a>
        </div>
      </div>
    </footer>
  );`;

      default:
        return `  return (
    <section className={\`py-10 container mx-auto px-6 \${className}\`}>
      <div className="rounded border border-zinc-800 bg-zinc-900/30 p-5">
        <h3 className="text-sm font-semibold text-white mb-1 font-mono">${comp.name}</h3>
        <p className="text-xs text-zinc-400">${comp.description}</p>
      </div>
    </section>
  );`;
    }
  }

  private static generateApiRoute(ep: APIEndpointBlueprint): GeneratedFile {
    const cleanPath = ep.path.replace(/^\/api\//, '').replace(/[^a-zA-Z0-9_/]/g, '');
    const filePath = `app/api/${cleanPath}/route.ts`;

    const content = `import { NextResponse } from "next/server";

export async function ${ep.method}() {
  const data = ${JSON.stringify(ep.mockResponse, null, 2)};
  return NextResponse.json(data);
}
`;
    return { path: filePath, content, type: 'api', description: decodeHtmlEntities(ep.description) };
  }

  private static generateReadme(blueprint: VibeBlueprint, projectName: string): string {
    const cleanTitle = decodeHtmlEntities(blueprint.metadata.title);
    const cleanSource = decodeHtmlEntities(blueprint.sourceTarget);

    return `# ${projectName}

> Reconstructed with **Vibe Swift** using **morluto/rea** reverse-engineering toolkit.

## Target Blueprint
- **Original Target**: \`${cleanSource}\`
- **Detected Frameworks**: ${blueprint.frameworksDetected.join(', ')}
- **Generated Components**: ${blueprint.components.length}
- **Synthesized Routes**: ${blueprint.routes.length}
- **Theme**: The Swifters Studio Black & Grey Theme

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the Next.js development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view your application.

## Components Breakdown
${blueprint.components.map((c) => `- \`${c.name}\` (${c.category}): ${decodeHtmlEntities(c.description)}`).join('\n')}
`;
  }

  private static toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  private static toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
      .replace(/[\s-_]+/g, '');
  }
}
