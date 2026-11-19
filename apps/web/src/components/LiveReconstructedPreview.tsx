"use client";

import React, { useState } from 'react';
import type { VibeBlueprint } from '@vibe-swift/core';
import { decodeHtmlEntities } from '@/lib/utils';
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowRight,
  Check,
  Cpu,
  Layers,
  Gauge,
  Menu,
  X,
  Terminal,
} from 'lucide-react';

interface LiveReconstructedPreviewProps {
  blueprint: VibeBlueprint;
  brandOverrides?: {
    brandName?: string;
    headline?: string;
    description?: string;
    ctaText?: string;
    themePreset?: 'obsidian' | 'graphite' | 'titanium' | 'zinc';
  };
}

export function LiveReconstructedPreview({ blueprint, brandOverrides }: LiveReconstructedPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const containerWidth =
    device === 'desktop' ? 'w-full' : device === 'tablet' ? 'max-w-[768px]' : 'max-w-[390px]';

  const brandName = decodeHtmlEntities(brandOverrides?.brandName || blueprint.name.split('—')[0].trim() || 'VIBE SWIFT');
  const headline = decodeHtmlEntities(brandOverrides?.headline || blueprint.metadata.title || 'Deconstruct web architectures.');
  const description = decodeHtmlEntities(brandOverrides?.description || blueprint.metadata.description || 'Reverse-engineered with Vibe Swift and morluto/rea.');
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
    },
    graphite: {
      bg: 'bg-[#121214]',
      panel: 'bg-[#18181b]',
      border: 'border-[#2e2e33]',
      subtleBorder: 'border-[#242428]',
      pill: 'bg-[#202024] border-[#2e2e33] text-zinc-300',
      btn: 'bg-[#e4e4e7] hover:bg-white text-[#121214] border-[#d4d4d8]',
    },
    titanium: {
      bg: 'bg-[#0b0f19]',
      panel: 'bg-[#111827]',
      border: 'border-[#1f2937]',
      subtleBorder: 'border-[#192231]',
      pill: 'bg-[#1e293b] border-[#1f2937] text-slate-300',
      btn: 'bg-[#e2e8f0] hover:bg-white text-[#0b0f19] border-[#cbd5e1]',
    },
    zinc: {
      bg: 'bg-[#18181b]',
      panel: 'bg-[#27272a]',
      border: 'border-[#3f3f46]',
      subtleBorder: 'border-[#333338]',
      pill: 'bg-[#27272a] border-[#3f3f46] text-zinc-200',
      btn: 'bg-white hover:bg-zinc-100 text-[#18181b] border-white',
    },
  }[preset];

  return (
    <div className="flex flex-col gap-3">
      {/* Viewport Control Bar */}
      <div className="flex items-center justify-between p-2.5 rounded border border-zinc-800 bg-zinc-900/40">
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-800/80">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
              device === 'desktop' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Monitor className="h-3 w-3" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
              device === 'tablet' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Tablet className="h-3 w-3" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
              device === 'mobile' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Smartphone className="h-3 w-3" />
            <span>Mobile</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>LIVE WORKSPACE SIMULATION // THE SWIFTERS AESTHETIC</span>
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
            <div className="text-[10px] text-zinc-600 font-mono">60 FPS</div>
          </div>

          {/* Reconstructed Page Layout */}
          <div className={`flex-1 overflow-y-auto max-h-[640px] divide-y ${themeStyles.subtleBorder}`}>
            {/* 1. Reconstructed Header */}
            <header className={`sticky top-0 z-40 ${themeStyles.bg}/95 backdrop-blur border-b ${themeStyles.border} px-6 py-3.5 flex items-center justify-between`}>
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
                <a href="#features" className="hover:text-white transition-colors">SPECIFICATIONS</a>
                <a href="#metrics" className="hover:text-white transition-colors">TELEMETRY</a>
                <a href="#pricing" className="hover:text-white transition-colors">TIERS</a>
              </div>

              <div className="hidden md:flex items-center gap-2.5">
                <button className={`px-3 py-1.5 rounded border text-xs font-mono font-medium transition-colors ${themeStyles.btn}`}>
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
              <div className={`md:hidden ${themeStyles.panel} px-6 py-3 space-y-2 border-b ${themeStyles.border} text-xs font-mono`}>
                <p className="text-zinc-300">SPECIFICATIONS</p>
                <p className="text-zinc-300">TELEMETRY</p>
                <p className="text-zinc-300">TIERS</p>
              </div>
            )}

            {/* 2. Reconstructed Hero */}
            <section className={`py-16 md:py-24 px-6 text-left border-b ${themeStyles.border} ${themeStyles.bg}`}>
              <div className="max-w-3xl">
                <div className={`inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-[10px] font-mono mb-6 ${themeStyles.pill}`}>
                  <Terminal className="h-3 w-3" />
                  <span>SYNTHESIZED BLUEPRINT // REA PROTOCOL</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4 leading-tight font-sans">
                  {headline}
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 max-w-xl mb-8 leading-relaxed font-sans">
                  {description}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button className={`inline-flex items-center gap-2 rounded border px-4 py-2 text-xs font-mono font-medium transition-colors ${themeStyles.btn}`}>
                    <span>{ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button className={`inline-flex items-center gap-2 rounded border ${themeStyles.border} ${themeStyles.panel} px-4 py-2 text-xs font-mono font-medium text-zinc-300 hover:border-zinc-500 transition-colors`}>
                    Inspect AST Hierarchy
                  </button>
                </div>
              </div>
            </section>

            {/* 3. Reconstructed Telemetry */}
            <section id="metrics" className={`py-10 px-6 border-b ${themeStyles.border} bg-black/20`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl font-mono">
                <div className={`border-l ${themeStyles.border} pl-3`}>
                  <div className="text-2xl font-semibold text-white tracking-tight">14ms</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">P99 Telemetry</div>
                </div>
                <div className={`border-l ${themeStyles.border} pl-3`}>
                  <div className="text-2xl font-semibold text-white tracking-tight">99.99%</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Uptime Target</div>
                </div>
                <div className={`border-l ${themeStyles.border} pl-3`}>
                  <div className="text-2xl font-semibold text-white tracking-tight">3.4M</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Throughput / s</div>
                </div>
                <div className={`border-l ${themeStyles.border} pl-3`}>
                  <div className="text-2xl font-semibold text-white tracking-tight">0.00%</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">AST Drift</div>
                </div>
              </div>
            </section>

            {/* 4. Reconstructed Technical Modules */}
            <section id="features" className="py-16 px-6 max-w-5xl">
              <div className="mb-10">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Architecture</div>
                <h2 className="text-xl font-semibold text-white tracking-tight">System Specification</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className={`p-5 rounded border ${themeStyles.border} ${themeStyles.panel}`}>
                  <div className="text-[10px] font-mono text-zinc-500 mb-2">MODULE // 01</div>
                  <Cpu className="h-5 w-5 text-zinc-300 mb-3" />
                  <h3 className="font-semibold text-white text-xs mb-1">AST Module Parser</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Identifies React component hierarchies and props signatures.
                  </p>
                </div>
                <div className={`p-5 rounded border ${themeStyles.border} ${themeStyles.panel}`}>
                  <div className="text-[10px] font-mono text-zinc-500 mb-2">MODULE // 02</div>
                  <Layers className="h-5 w-5 text-zinc-300 mb-3" />
                  <h3 className="font-semibold text-white text-xs mb-1">Tailwind Mapper</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Converts computed styles and CSS variables into standard classes.
                  </p>
                </div>
                <div className={`p-5 rounded border ${themeStyles.border} ${themeStyles.panel}`}>
                  <div className="text-[10px] font-mono text-zinc-500 mb-2">MODULE // 03</div>
                  <Gauge className="h-5 w-5 text-zinc-300 mb-3" />
                  <h3 className="font-semibold text-white text-xs mb-1">Network Trace Collector</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Passive HAR network inspection transforms endpoints into Next.js routes.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Reconstructed Footer */}
            <footer className={`py-8 px-6 border-t ${themeStyles.border} text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4`}>
              <div className="flex items-center gap-2 text-zinc-300">
                <span>{brandName}</span>
                <span className="text-zinc-600">//</span>
                <span>ENGINEERING WORKSPACE</span>
              </div>
              <p>Reconstructed with Vibe Swift &bull; morluto/rea</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
