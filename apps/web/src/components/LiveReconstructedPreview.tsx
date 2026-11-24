"use client";

import React, { useState, useMemo } from 'react';
import type { VibeBlueprint, GeneratedProject } from '@vibe-swift/core';
import { decodeHtmlEntities } from '@/lib/utils';
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowRight,
  Cpu,
  Layers,
  Gauge,
  Menu,
  X,
  Terminal,
  Code2,
  Eye,
} from 'lucide-react';

interface LiveReconstructedPreviewProps {
  blueprint: VibeBlueprint;
  project?: GeneratedProject;
  brandOverrides?: {
    brandName?: string;
    headline?: string;
    description?: string;
    ctaText?: string;
    themePreset?: 'obsidian' | 'graphite' | 'titanium' | 'zinc';
  };
}

export function LiveReconstructedPreview({
  blueprint,
  project,
  brandOverrides,
}: LiveReconstructedPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual' | 'sandbox'>('visual');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerWidth =
    device === 'desktop' ? 'w-full' : device === 'tablet' ? 'max-w-[768px]' : 'max-w-[390px]';

  const brandName = decodeHtmlEntities(
    brandOverrides?.brandName || blueprint.name.split('—')[0].trim() || 'VIBE SWIFT'
  );
  const headline = decodeHtmlEntities(
    brandOverrides?.headline || blueprint.metadata.title || 'Deconstruct web architectures.'
  );
  const description = decodeHtmlEntities(
    brandOverrides?.description ||
      blueprint.metadata.description ||
      'Reverse-engineered with Vibe Swift and morluto/rea.'
  );
  const ctaText = decodeHtmlEntities(brandOverrides?.ctaText || 'Initialize Workspace');
  const preset = brandOverrides?.themePreset || 'obsidian';

  // Dynamic theme classes based on chosen studio palette
  const themeStyles = {
    obsidian: {
      bg: 'bg-[#09090b]',
      panel: 'bg-[#111113]',
      border: 'border-[#27272a]',
      subtleBorder: 'border-[#1e1e22]',
      pill: 'bg-[#18181b] border-[#27272a] text-zinc-300',
      btn: 'bg-zinc-100 hover:bg-white text-zinc-950 border-zinc-200',
      hexBg: '#09090b',
      hexPanel: '#111113',
      hexBorder: '#27272a',
      hexText: '#f4f4f5',
    },
    graphite: {
      bg: 'bg-[#121214]',
      panel: 'bg-[#18181b]',
      border: 'border-[#2e2e33]',
      subtleBorder: 'border-[#242428]',
      pill: 'bg-[#202024] border-[#2e2e33] text-zinc-300',
      btn: 'bg-[#e4e4e7] hover:bg-white text-[#121214] border-[#d4d4d8]',
      hexBg: '#121214',
      hexPanel: '#18181b',
      hexBorder: '#2e2e33',
      hexText: '#e4e4e7',
    },
    titanium: {
      bg: 'bg-[#0b0f19]',
      panel: 'bg-[#111827]',
      border: 'border-[#1f2937]',
      subtleBorder: 'border-[#192231]',
      pill: 'bg-[#1e293b] border-[#1f2937] text-slate-300',
      btn: 'bg-[#e2e8f0] hover:bg-white text-[#0b0f19] border-[#cbd5e1]',
      hexBg: '#0b0f19',
      hexPanel: '#111827',
      hexBorder: '#1f2937',
      hexText: '#e2e8f0',
    },
    zinc: {
      bg: 'bg-[#18181b]',
      panel: 'bg-[#27272a]',
      border: 'border-[#3f3f46]',
      subtleBorder: 'border-[#333338]',
      pill: 'bg-[#27272a] border-[#3f3f46] text-zinc-200',
      btn: 'bg-white hover:bg-zinc-100 text-[#18181b] border-white',
      hexBg: '#18181b',
      hexPanel: '#27272a',
      hexBorder: '#3f3f46',
      hexText: '#ffffff',
    },
  }[preset];

  // Filter feature/architecture components dynamically from blueprint
  const featureComponents = useMemo(() => {
    const list = blueprint.components.filter(
      (c) =>
        c.category !== 'navigation' &&
        c.category !== 'footer' &&
        c.category !== 'hero' &&
        c.category !== 'metric'
    );
    if (list.length > 0) return list.slice(0, 6);
    return [
      {
        id: 'comp-ast',
        name: 'AST Architecture Synthesizer',
        category: 'feature' as const,
        description: `Synthesized from ${blueprint.sourceTarget || 'target'}. Reconstructs React hierarchy with strict typing.`,
        tailwindClasses: ['p-5', 'rounded', 'border'],
      },
      {
        id: 'comp-tailwind',
        name: 'Tailwind Design System',
        category: 'feature' as const,
        description: `Extracted ${blueprint.summaryStats.totalTailwindClasses} computed CSS utility classes into design tokens.`,
        tailwindClasses: ['p-5', 'rounded', 'border'],
      },
      {
        id: 'comp-api',
        name: 'Network Trace Handler',
        category: 'feature' as const,
        description: `Mapped ${blueprint.summaryStats.totalEndpoints} API endpoints from network telemetry and REA captures.`,
        tailwindClasses: ['p-5', 'rounded', 'border'],
      },
    ];
  }, [blueprint]);

  // Real target-derived metrics
  const telemetryStats = useMemo(() => {
    return [
      {
        label: 'Components Mapped',
        value: `${blueprint.summaryStats.totalComponents} Modules`,
        sub: `${blueprint.components.filter((c) => c.isClientComponent).length} Client / ${blueprint.components.filter((c) => !c.isClientComponent).length} Server`,
      },
      {
        label: 'Routes Extracted',
        value: `${blueprint.summaryStats.totalRoutes} Routes`,
        sub: blueprint.routes.map((r) => r.path).slice(0, 3).join(', '),
      },
      {
        label: 'Tailwind Classes',
        value: `${blueprint.summaryStats.totalTailwindClasses}`,
        sub: 'Deterministic classes',
      },
      {
        label: 'API Endpoints',
        value: `${blueprint.summaryStats.totalEndpoints} Handlers`,
        sub: blueprint.frameworksDetected.slice(0, 2).join(' + ') || 'REST API',
      },
    ];
  }, [blueprint]);

  // Build standalone sandbox HTML string for iframe preview
  const sandboxHtml = useMemo(() => {
    const routesHtml = blueprint.routes
      .slice(0, 4)
      .map(
        (r) =>
          `<a href="${r.path}" class="text-xs text-zinc-400 hover:text-white transition-colors">${decodeHtmlEntities(r.name || r.path)}</a>`
      )
      .join('');

    const cardsHtml = featureComponents
      .map(
        (c, idx) => `
      <div class="p-5 rounded border border-zinc-800 bg-[#111113] hover:border-zinc-700 transition-colors">
        <div class="text-[10px] font-mono text-zinc-500 mb-2">MODULE // 0${idx + 1}</div>
        <h3 class="font-semibold text-white text-sm mb-1.5 font-mono">${decodeHtmlEntities(c.name)}</h3>
        <p class="text-xs text-zinc-400 leading-relaxed font-sans">${decodeHtmlEntities(c.description || 'Synthesized component.')}</p>
      </div>`
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            studio: '${themeStyles.hexBg}',
            panel: '${themeStyles.hexPanel}',
            border: '${themeStyles.hexBorder}',
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: ${themeStyles.hexBg}; color: ${themeStyles.hexText}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; }
  </style>
</head>
<body class="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-zinc-800">
  <!-- Nav -->
  <header class="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="font-mono text-xs font-bold tracking-wider text-white uppercase">${brandName}</span>
      <span class="text-[9px] px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 font-mono">NEXT.JS 14</span>
    </div>
    <nav class="hidden md:flex items-center gap-6 font-mono text-xs">
      ${routesHtml}
    </nav>
    <button class="px-3 py-1.5 rounded border border-zinc-200 bg-zinc-100 text-zinc-950 font-mono text-xs font-semibold hover:bg-white transition-colors">
      ${ctaText}
    </button>
  </header>

  <!-- Hero -->
  <section class="py-16 md:py-24 px-6 max-w-4xl mx-auto border-b border-zinc-800/80">
    <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/60 font-mono text-[11px] text-zinc-400 mb-6">
      <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
      <span>${decodeHtmlEntities(blueprint.sourceTarget || 'Synthesized Architecture')}</span>
    </div>
    <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
      ${headline}
    </h1>
    <p class="text-sm text-zinc-400 max-w-2xl mb-8 leading-relaxed">
      ${description}
    </p>
    <div class="flex flex-wrap items-center gap-3">
      <button class="px-4 py-2 rounded border border-zinc-200 bg-zinc-100 text-zinc-950 font-mono text-xs font-semibold hover:bg-white transition-colors">
        ${ctaText} &rarr;
      </button>
      <button class="px-4 py-2 rounded border border-zinc-800 bg-[#111113] text-zinc-300 font-mono text-xs hover:border-zinc-700 transition-colors">
        Inspect Blueprint
      </button>
    </div>
  </section>

  <!-- Telemetry -->
  <section class="py-10 px-6 border-b border-zinc-800/80 bg-zinc-900/20">
    <div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
      <div class="border-l border-zinc-800 pl-4">
        <div class="text-2xl font-bold text-white tracking-tight">${blueprint.summaryStats.totalComponents} Modules</div>
        <div class="text-xs text-zinc-400 mt-1">Components Extracted</div>
      </div>
      <div class="border-l border-zinc-800 pl-4">
        <div class="text-2xl font-bold text-white tracking-tight">${blueprint.summaryStats.totalRoutes} Routes</div>
        <div class="text-xs text-zinc-400 mt-1">Synthesized Routes</div>
      </div>
      <div class="border-l border-zinc-800 pl-4">
        <div class="text-2xl font-bold text-white tracking-tight">${blueprint.summaryStats.totalTailwindClasses}</div>
        <div class="text-xs text-zinc-400 mt-1">Tailwind Rules</div>
      </div>
      <div class="border-l border-zinc-800 pl-4">
        <div class="text-2xl font-bold text-white tracking-tight">${blueprint.summaryStats.totalEndpoints} Endpoints</div>
        <div class="text-xs text-zinc-400 mt-1">Network Endpoints</div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="py-16 px-6 max-w-5xl mx-auto">
    <div class="mb-8">
      <div class="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Architecture</div>
      <h2 class="text-xl font-bold text-white tracking-tight font-mono">Synthesized Modules</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      ${cardsHtml}
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-8 px-6 border-t border-zinc-800 text-xs font-mono text-zinc-500 flex items-center justify-between">
    <span>${brandName} &bull; Generated by Vibe Swift</span>
    <span>morluto/rea engine</span>
  </footer>
</body>
</html>`;
  }, [blueprint, featureComponents, brandName, headline, description, ctaText, themeStyles]);

  return (
    <div className="flex flex-col gap-3">
      {/* Viewport & View Mode Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
        <div className="flex items-center gap-3">
          {/* Device viewport selector */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-800/80">
            <button
              onClick={() => setDevice('desktop')}
              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
                device === 'desktop'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Monitor className="h-3 w-3" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
                device === 'tablet'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Tablet className="h-3 w-3" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
                device === 'mobile'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Smartphone className="h-3 w-3" />
              <span>Mobile</span>
            </button>
          </div>

          {/* View mode toggle: Interactive Visual vs Sandbox Iframe */}
          <div className="hidden sm:flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-800/80 text-xs font-mono">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                viewMode === 'visual'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Eye className="h-3 w-3" />
              <span>STUDIO UI</span>
            </button>
            <button
              onClick={() => setViewMode('sandbox')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                viewMode === 'sandbox'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Code2 className="h-3 w-3" />
              <span>SANDBOX IFRAME</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>RECONSTRUCTED // {preset.toUpperCase()} PALETTE</span>
        </div>
      </div>

      {/* Simulated Hardware Frame */}
      <div className="flex justify-center bg-black/60 p-4 rounded border border-zinc-800/90 min-h-[580px] overflow-x-auto">
        <div
          className={`${containerWidth} transition-all duration-200 rounded border ${themeStyles.border} shadow-2xl ${themeStyles.bg} flex flex-col text-zinc-100 overflow-hidden`}
        >
          {/* Hardware Window Bar */}
          <div className="h-8 bg-zinc-950 border-b border-zinc-800/80 px-3 flex items-center justify-between text-xs text-zinc-500 select-none font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-700" />
              <span className="h-2 w-2 rounded-full bg-zinc-700" />
              <span className="h-2 w-2 rounded-full bg-zinc-700" />
            </div>
            <div className="bg-zinc-900/80 px-3 py-0.5 rounded border border-zinc-800 text-[10px] text-zinc-400 truncate max-w-[320px]">
              {decodeHtmlEntities(blueprint.sourceTarget) || 'https://studio.theswifters.com'}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Mode 1: Sandbox Iframe */}
          {viewMode === 'sandbox' ? (
            <div className="flex-1 min-h-[640px] bg-[#09090b]">
              <iframe
                title="Live Sandbox Preview"
                srcDoc={sandboxHtml}
                className="w-full h-[640px] border-0"
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            /* Mode 2: Interactive High-Precision Studio UI */
            <div className={`flex-1 overflow-y-auto max-h-[640px] divide-y ${themeStyles.subtleBorder}`}>
              {/* 1. Reconstructed Header */}
              <header
                className={`sticky top-0 z-40 ${themeStyles.bg}/95 backdrop-blur border-b ${themeStyles.border} px-6 py-3.5 flex items-center justify-between`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src="/swifters-logo-mark.png"
                    alt="Logo"
                    className="h-5 w-auto object-contain brightness-110"
                  />
                  <span className="font-mono text-xs font-bold tracking-wider text-zinc-100 uppercase">
                    {brandName}
                  </span>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-mono">
                  {blueprint.routes.slice(0, 4).map((r) => (
                    <a
                      key={r.path}
                      href={r.path}
                      className="hover:text-white transition-colors uppercase text-[11px]"
                    >
                      {decodeHtmlEntities(r.name || r.path.replace('/', ''))}
                    </a>
                  ))}
                </div>

                <div className="hidden md:flex items-center gap-2.5">
                  <button
                    className={`px-3 py-1.5 rounded border text-xs font-mono font-medium transition-colors ${themeStyles.btn}`}
                  >
                    {ctaText}
                  </button>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-1 text-zinc-400 hover:text-white"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              </header>

              {mobileMenuOpen && (
                <div
                  className={`md:hidden ${themeStyles.panel} px-6 py-3 space-y-2 border-b ${themeStyles.border} text-xs font-mono`}
                >
                  {blueprint.routes.slice(0, 4).map((r) => (
                    <p key={r.path} className="text-zinc-300">
                      {decodeHtmlEntities(r.name || r.path)}
                    </p>
                  ))}
                </div>
              )}

              {/* 2. Reconstructed Hero */}
              <section className={`py-16 md:py-24 px-6 text-left border-b ${themeStyles.border} ${themeStyles.bg}`}>
                <div className="max-w-3xl">
                  <div
                    className={`inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-[10px] font-mono mb-6 ${themeStyles.pill}`}
                  >
                    <Terminal className="h-3 w-3" />
                    <span>SYNTHESIZED BLUEPRINT // {decodeHtmlEntities(blueprint.sourceTarget || 'REA PROTOCOL')}</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4 leading-tight font-sans">
                    {headline}
                  </h1>
                  <p className="text-xs md:text-sm text-zinc-400 max-w-xl mb-8 leading-relaxed font-sans">
                    {description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className={`inline-flex items-center gap-2 rounded border px-4 py-2 text-xs font-mono font-medium transition-colors ${themeStyles.btn}`}
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('sandbox')}
                      className={`inline-flex items-center gap-2 rounded border ${themeStyles.border} ${themeStyles.panel} px-4 py-2 text-xs font-mono font-medium text-zinc-300 hover:border-zinc-500 transition-colors`}
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      <span>Inspect Sandbox Iframe</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* 3. Real Target-Derived Telemetry */}
              <section id="metrics" className={`py-10 px-6 border-b ${themeStyles.border} bg-black/20`}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl font-mono">
                  {telemetryStats.map((stat, i) => (
                    <div key={i} className={`border-l ${themeStyles.border} pl-3`}>
                      <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{stat.label}</div>
                      <div className="text-[9px] text-zinc-600 mt-0.5 truncate max-w-[140px]">
                        {stat.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. Synthesized Technical Modules */}
              <section id="features" className="py-16 px-6 max-w-5xl">
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                      Architecture Modules
                    </div>
                    <h2 className="text-xl font-semibold text-white tracking-tight font-mono">
                      System Specification
                    </h2>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    {blueprint.components.length} components synthesized
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {featureComponents.map((comp, idx) => (
                    <div
                      key={comp.id || idx}
                      className={`p-5 rounded border ${themeStyles.border} ${themeStyles.panel} hover:border-zinc-600 transition-colors`}
                    >
                      <div className="text-[10px] font-mono text-zinc-500 mb-2 flex items-center justify-between">
                        <span>MODULE // 0{idx + 1}</span>
                        <span className="uppercase text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          {comp.category}
                        </span>
                      </div>
                      <div className="text-zinc-300 mb-3">
                        {comp.category === 'feature' ? (
                          <Layers className="h-5 w-5 text-zinc-300" />
                        ) : comp.category === 'metric' ? (
                          <Gauge className="h-5 w-5 text-zinc-300" />
                        ) : (
                          <Cpu className="h-5 w-5 text-zinc-300" />
                        )}
                      </div>
                      <h3 className="font-semibold text-white text-xs mb-1 font-mono">
                        {decodeHtmlEntities(comp.name)}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-3">
                        {decodeHtmlEntities(comp.description || 'Synthesized architecture component.')}
                      </p>
                      {comp.tailwindClasses && comp.tailwindClasses.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-wrap gap-1">
                          {comp.tailwindClasses.slice(0, 3).map((cls, ci) => (
                            <span
                              key={ci}
                              className="text-[9px] font-mono px-1 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Reconstructed Footer */}
              <footer
                className={`py-8 px-6 border-t ${themeStyles.border} text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4`}
              >
                <div className="flex items-center gap-2 text-zinc-300">
                  <span>{brandName}</span>
                  <span className="text-zinc-600">//</span>
                  <span>THE SWIFTERS STUDIO HARNESS</span>
                </div>
                <p>Reverse-Engineered with Vibe Swift &bull; morluto/rea</p>
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
