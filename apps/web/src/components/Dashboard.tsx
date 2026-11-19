"use client";

import React, { useState } from 'react';
import type { FullCloneResult, VibeBlueprint } from '@vibe-swift/core';
import { decodeHtmlEntities } from '@/lib/utils';
import { PipelineVisualizer, PipelineStep } from '@/components/PipelineVisualizer';
import { BlueprintExplorer } from '@/components/BlueprintExplorer';
import { LiveReconstructedPreview } from '@/components/LiveReconstructedPreview';
import { CodeViewer } from '@/components/CodeViewer';
import { EvidenceViewer } from '@/components/EvidenceViewer';
import {
  Globe,
  Layers,
  Code2,
  FileJson,
  Eye,
  Sliders,
  AlertCircle,
  ArrowRight,
  Terminal,
  Palette,
  Check,
  RotateCcw,
} from 'lucide-react';

interface DashboardProps {
  initialData: FullCloneResult;
}

interface BrandCustomization {
  brandName: string;
  headline: string;
  description: string;
  ctaText: string;
  themePreset: 'obsidian' | 'graphite' | 'titanium' | 'zinc';
}

export function Dashboard({ initialData }: DashboardProps) {
  const [targetUrl, setTargetUrl] = useState('https://vibe-analytics.app');
  const [analysisMode, setAnalysisMode] = useState<'auto' | 'web-session' | 'javascript-app' | 'network-capture'>('auto');
  const [aiRefinement, setAiRefinement] = useState(true);
  const [includeMockApi, setIncludeMockApi] = useState(true);

  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('completed');
  const [durationMs, setDurationMs] = useState<number>(initialData.durationMs || 850);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'preview' | 'blueprint' | 'code' | 'evidence'>('preview');

  // Clone result state initialized from server prop
  const [cloneResult, setCloneResult] = useState<FullCloneResult>(initialData);

  // Brand customization state
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState(false);

  const [brandParams, setBrandParams] = useState<BrandCustomization>({
    brandName: decodeHtmlEntities(initialData.blueprint.name.split('—')[0].trim() || 'VIBE SWIFT'),
    headline: decodeHtmlEntities(initialData.blueprint.metadata.title || 'Deconstruct web architectures.'),
    description: decodeHtmlEntities(initialData.blueprint.metadata.description || 'Reverse-engineered with Vibe Swift and morluto/rea.'),
    ctaText: 'Initialize Workspace',
    themePreset: 'obsidian',
  });

  const handleStartCloning = async (overrideTarget?: string) => {
    const targetToUse = overrideTarget || targetUrl.trim();
    if (!targetToUse) return;

    setErrorMsg(null);
    setPipelineStep('ingestion');

    const startTime = Date.now();

    try {
      setTimeout(() => setPipelineStep('rea-analysis'), 200);
      setTimeout(() => setPipelineStep('evidence'), 500);
      setTimeout(() => setPipelineStep('blueprint'), 850);
      setTimeout(() => setPipelineStep('code-gen'), 1150);

      const res = await fetch('/api/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: targetToUse,
          mode: analysisMode,
          enableAiRefinement: aiRefinement,
          includeMockApi,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Reverse-engineering pipeline execution failed');
      }

      const totalTime = Date.now() - startTime;
      setDurationMs(totalTime);
      setPipelineStep('completed');
      setCloneResult(json.data);

      // Keep user's custom brand parameters if already edited, otherwise update with extracted data
      setBrandParams((prev) => ({
        brandName: prev.brandName || decodeHtmlEntities(json.data.blueprint.name.split('—')[0].trim()),
        headline: prev.headline || decodeHtmlEntities(json.data.blueprint.metadata.title),
        description: prev.description || decodeHtmlEntities(json.data.blueprint.metadata.description),
        ctaText: prev.ctaText || 'Initialize Workspace',
        themePreset: prev.themePreset || 'obsidian',
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
      setPipelineStep('idle');
    }
  };

  const handlePresetSelect = (presetTarget: string) => {
    setTargetUrl(presetTarget);
    handleStartCloning(presetTarget);
  };

  const handleApplyCustomParams = async () => {
    if (!cloneResult) return;
    setIsApplying(true);

    try {
      // Map theme preset colors
      const themeColors = {
        obsidian: {
          primary: '#f4f4f5',
          primaryForeground: '#09090b',
          secondary: '#27272a',
          secondaryForeground: '#f4f4f5',
          background: '#09090b',
          foreground: '#f4f4f5',
          muted: '#18181b',
          mutedForeground: '#71717a',
          accent: '#27272a',
          accentForeground: '#f4f4f5',
          border: '#27272a',
          card: '#111113',
          cardForeground: '#f4f4f5',
        },
        graphite: {
          primary: '#e4e4e7',
          primaryForeground: '#121214',
          secondary: '#2e2e33',
          secondaryForeground: '#e4e4e7',
          background: '#121214',
          foreground: '#e4e4e7',
          muted: '#202024',
          mutedForeground: '#8e8e93',
          accent: '#2e2e33',
          accentForeground: '#e4e4e7',
          border: '#2e2e33',
          card: '#18181b',
          cardForeground: '#e4e4e7',
        },
        titanium: {
          primary: '#e2e8f0',
          primaryForeground: '#0b0f19',
          secondary: '#1f2937',
          secondaryForeground: '#e2e8f0',
          background: '#0b0f19',
          foreground: '#e2e8f0',
          muted: '#1e293b',
          mutedForeground: '#94a3b8',
          accent: '#1f2937',
          accentForeground: '#e2e8f0',
          border: '#1f2937',
          card: '#111827',
          cardForeground: '#e2e8f0',
        },
        zinc: {
          primary: '#ffffff',
          primaryForeground: '#18181b',
          secondary: '#3f3f46',
          secondaryForeground: '#ffffff',
          background: '#18181b',
          foreground: '#f4f4f5',
          muted: '#27272a',
          mutedForeground: '#a1a1aa',
          accent: '#3f3f46',
          accentForeground: '#ffffff',
          border: '#3f3f46',
          card: '#27272a',
          cardForeground: '#ffffff',
        },
      }[brandParams.themePreset];

      // 1. Construct updated blueprint with custom parameters applied
      const updatedBlueprint: VibeBlueprint = {
        ...cloneResult.blueprint,
        name: brandParams.brandName,
        metadata: {
          ...cloneResult.blueprint.metadata,
          title: brandParams.headline,
          description: brandParams.description,
        },
        theme: {
          ...cloneResult.blueprint.theme,
          colors: themeColors,
        },
      };

      // 2. Re-synthesize Next.js project files through the backend API
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint: updatedBlueprint,
          options: {
            projectName: brandParams.brandName.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
            includeMockApi,
          },
        }),
      });

      const json = await res.json();

      if (json.success && json.project) {
        setCloneResult({
          ...cloneResult,
          blueprint: updatedBlueprint,
          project: json.project,
        });
      } else {
        setCloneResult({
          ...cloneResult,
          blueprint: updatedBlueprint,
        });
      }

      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 3000);
    } catch (err: unknown) {
      console.error('Failed to apply custom parameters:', err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleResetToExtracted = () => {
    if (!cloneResult) return;
    setBrandParams({
      brandName: decodeHtmlEntities(cloneResult.blueprint.name.split('—')[0].trim()),
      headline: decodeHtmlEntities(cloneResult.blueprint.metadata.title),
      description: decodeHtmlEntities(cloneResult.blueprint.metadata.description),
      ctaText: 'Initialize Workspace',
      themePreset: 'obsidian',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
      {/* 3. Header / Center Hero Statement */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/60 font-mono text-[10px] text-zinc-400 tracking-wider">
          <Terminal className="h-3 w-3 text-zinc-400" />
          <span>AUTONOMOUS ENGINE // THE SWIFTERS STUDIO HARNESS</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase font-mono leading-tight">
          REVERSE-ENGINEERING &amp; CLONING STUDIO
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto font-sans">
          Reverse-engineers any target website or web application, extracts its structural blueprints, components, and design systems, and reconstructs a clean, production-ready Next.js &amp; Tailwind clone tailored precisely to your preferences, brand data, and UI/color choices.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={() => setShowCustomizer(!showCustomizer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-mono text-xs transition-colors ${
              showCustomizer
                ? 'border-zinc-600 bg-zinc-800 text-white'
                : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="h-3 w-3" />
            <span>{showCustomizer ? 'HIDE STUDIO CUSTOMIZER' : 'OPEN STUDIO CUSTOMIZER'}</span>
          </button>
        </div>
      </div>

      {/* Target Ingestion Console */}
      <div className="rounded border border-zinc-800 bg-zinc-900/40 p-4 space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Globe className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Target URL (e.g. https://news.ycombinator.com) or local bundle path..."
              className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-mono transition-colors"
            />
          </div>

          <button
            onClick={() => handleStartCloning()}
            disabled={pipelineStep !== 'idle' && pipelineStep !== 'completed'}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded border border-zinc-200 bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-semibold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <span>REVERSE ENGINEER TARGET</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Demo Presets Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80 font-mono text-xs">
          <span className="text-[11px] text-zinc-500">DEMO PRESETS:</span>
          <button
            onClick={() => handlePresetSelect('sample:saas')}
            className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-[11px] transition-colors"
          >
            Studio SaaS Blueprint
          </button>
          <button
            onClick={() => handlePresetSelect('https://news.ycombinator.com')}
            className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-[11px] transition-colors"
          >
            Hacker News Live Web
          </button>
          <button
            onClick={() => handlePresetSelect('sample:developer-docs')}
            className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-[11px] transition-colors"
          >
            Technical Docs Engine
          </button>
        </div>

        {/* Protocol Options Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={aiRefinement}
                onChange={(e) => setAiRefinement(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-zinc-200 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-zinc-300 text-[11px]">AI Refinement Pass</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeMockApi}
                onChange={(e) => setIncludeMockApi(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-zinc-200 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-zinc-300 text-[11px]">Mock API Handler Generation</span>
            </label>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span>Mode:</span>
            <select
              value={analysisMode}
              onChange={(e) => setAnalysisMode(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-zinc-200 text-[11px] font-mono focus:outline-none focus:border-zinc-600"
            >
              <option value="auto">Auto-Detect</option>
              <option value="web-session">Live Web Session (CDP)</option>
              <option value="javascript-app">JS Application / ASAR</option>
              <option value="network-capture">HAR Network Trace</option>
            </select>
          </div>
        </div>
      </div>

      {/* Studio & Brand Customizer Drawer */}
      {showCustomizer && (
        <div className="rounded border border-zinc-800 bg-zinc-900/70 p-4 space-y-4 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <Palette className="h-3.5 w-3.5 text-zinc-400" />
              <span>CUSTOM BRAND &amp; UI PARAMETERS</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToExtracted}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Reset fields to extracted target blueprint"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset to Extracted</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Brand / Project Name Override</label>
              <input
                type="text"
                value={brandParams.brandName}
                onChange={(e) => setBrandParams({ ...brandParams, brandName: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 focus:border-zinc-600 focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Primary CTA Button Text</label>
              <input
                type="text"
                value={brandParams.ctaText}
                onChange={(e) => setBrandParams({ ...brandParams, ctaText: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 focus:border-zinc-600 focus:outline-none text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] text-zinc-400 mb-1">Headline / Primary Statement Override</label>
              <input
                type="text"
                value={brandParams.headline}
                onChange={(e) => setBrandParams({ ...brandParams, headline: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 focus:border-zinc-600 focus:outline-none text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] text-zinc-400 mb-1">Technical Overview / Description Override</label>
              <input
                type="text"
                value={brandParams.description}
                onChange={(e) => setBrandParams({ ...brandParams, description: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 focus:border-zinc-600 focus:outline-none text-xs"
              />
            </div>

            {/* Theme Preset Selector */}
            <div className="md:col-span-2 pt-1">
              <label className="block text-[11px] text-zinc-400 mb-1.5">Color / UI Theme Palette Preference</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'obsidian', label: 'Obsidian Mono', desc: 'Pitch black & silver' },
                  { id: 'graphite', label: 'Graphite Steel', desc: 'Deep charcoal & metallic' },
                  { id: 'titanium', label: 'Titanium Slate', desc: 'Cold slate & polished steel' },
                  { id: 'zinc', label: 'Matte Zinc', desc: 'Dark neutral & pure white' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBrandParams({ ...brandParams, themePreset: t.id as any })}
                    className={`p-2 rounded border text-left transition-colors ${
                      brandParams.themePreset === t.id
                        ? 'border-zinc-500 bg-zinc-800 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="font-semibold text-xs leading-tight">{t.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500">
                Updates active Blueprint, Live Reconstructed Preview, and Next.js Code Viewer simultaneously.
              </span>
              {appliedNotification && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <Check className="h-3 w-3" /> Parameters Applied
                </span>
              )}
            </div>

            <button
              onClick={handleApplyCustomParams}
              disabled={isApplying}
              className="px-4 py-1.5 rounded border border-zinc-700 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isApplying ? 'APPLYING...' : 'APPLY PARAMETERS'}
            </button>
          </div>
        </div>
      )}

      {/* Error banner if any */}
      {errorMsg && (
        <div className="p-3 rounded border border-red-900/60 bg-red-950/20 text-red-300 flex items-center gap-2 font-mono text-xs">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <div>
            <span className="font-bold">EXECUTION ERROR: </span>
            {errorMsg}
          </div>
        </div>
      )}

      {/* Pipeline Stepper Visualizer */}
      <PipelineVisualizer currentStep={pipelineStep} durationMs={durationMs} />

      {/* Main Results Workspace */}
      {cloneResult && (
        <div className="space-y-4">
          {/* Main Workspace Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded border border-zinc-800 font-mono text-xs">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>WORKSPACE PREVIEW</span>
              </button>

              <button
                onClick={() => setActiveTab('blueprint')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  activeTab === 'blueprint'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>BLUEPRINT SPEC</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  activeTab === 'code'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>NEXT.JS REPOSITORY</span>
              </button>

              <button
                onClick={() => setActiveTab('evidence')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  activeTab === 'evidence'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileJson className="h-3.5 w-3.5" />
                <span>REA EVIDENCE JSON</span>
              </button>
            </div>

            <div className="text-xs text-zinc-500 font-mono truncate max-w-[320px]">
              TARGET: <span className="text-zinc-300">{decodeHtmlEntities(cloneResult.target)}</span>
            </div>
          </div>

          {/* Tab Viewport */}
          <div>
            {activeTab === 'preview' && (
              <LiveReconstructedPreview
                blueprint={cloneResult.blueprint}
                brandOverrides={brandParams}
              />
            )}

            {activeTab === 'blueprint' && (
              <BlueprintExplorer blueprint={cloneResult.blueprint} />
            )}

            {activeTab === 'code' && (
              <CodeViewer project={cloneResult.project} />
            )}

            {activeTab === 'evidence' && (
              <EvidenceViewer evidence={cloneResult.evidence} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
