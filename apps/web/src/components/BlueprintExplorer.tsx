"use client";

import React, { useState } from 'react';
import type { VibeBlueprint, VibeComponent } from '@vibe-swift/core';
import { decodeHtmlEntities } from '@/lib/utils';
import { Layers, Route, Network, Palette, ChevronRight, Tag, Terminal } from 'lucide-react';

interface BlueprintExplorerProps {
  blueprint: VibeBlueprint;
}

export function BlueprintExplorer({ blueprint }: BlueprintExplorerProps) {
  const [selectedComp, setSelectedComp] = useState<VibeComponent>(blueprint.components[0] || null);
  const [activeTab, setActiveTab] = useState<'components' | 'routes' | 'theme' | 'api'>('components');

  return (
    <div className="flex flex-col gap-5">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between text-zinc-500 text-[11px] mb-1">
            <span>COMPONENTS</span>
            <Layers className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="text-xl font-semibold text-white tracking-tight">{blueprint.summaryStats.totalComponents}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">React TypeScript modules</div>
        </div>

        <div className="p-3.5 rounded border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between text-zinc-500 text-[11px] mb-1">
            <span>ROUTES</span>
            <Route className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="text-xl font-semibold text-white tracking-tight">{blueprint.summaryStats.totalRoutes}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Next.js App Router</div>
        </div>

        <div className="p-3.5 rounded border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between text-zinc-500 text-[11px] mb-1">
            <span>ENDPOINTS</span>
            <Network className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="text-xl font-semibold text-white tracking-tight">{blueprint.summaryStats.totalEndpoints}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Observed HAR routes</div>
        </div>

        <div className="p-3.5 rounded border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between text-zinc-500 text-[11px] mb-1">
            <span>TAILWIND UTILITIES</span>
            <Palette className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="text-xl font-semibold text-white tracking-tight">{blueprint.summaryStats.totalTailwindClasses}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">Synthesized classes</div>
        </div>
      </div>

      {/* Internal Subtabs */}
      <div className="flex items-center gap-1 border-b border-zinc-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('components')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'components'
              ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          COMPONENTS ({blueprint.components.length})
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'routes'
              ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          ROUTES ({blueprint.routes.length})
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'theme'
              ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          DESIGN TOKENS
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'api'
              ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          API CONTRACTS ({blueprint.apiEndpoints.length})
        </button>
      </div>

      {/* Tab: Components */}
      {activeTab === 'components' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* List */}
          <div className="flex flex-col gap-1.5 max-h-[460px] overflow-y-auto pr-1 font-mono">
            {blueprint.components.map((comp) => {
              const isSelected = selectedComp?.id === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`text-left p-2.5 rounded border transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'border-zinc-600 bg-zinc-800/80 text-white'
                      : 'border-zinc-800/80 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="overflow-hidden pr-2">
                    <div className="font-semibold text-xs flex items-center gap-2">
                      <span className="truncate">{comp.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded border border-zinc-700 bg-zinc-800 text-zinc-400 uppercase">
                        {comp.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                      {decodeHtmlEntities(comp.description)}
                    </div>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 flex-shrink-0 ${isSelected ? 'text-zinc-200' : 'text-zinc-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Details */}
          {selectedComp && (
            <div className="md:col-span-2 rounded border border-zinc-800 bg-zinc-900/50 p-4 flex flex-col gap-4 font-mono">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>{selectedComp.name}</span>
                    <span className="text-xs font-normal text-zinc-500">[{selectedComp.category}]</span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    {decodeHtmlEntities(selectedComp.description)}
                  </p>
                </div>
                {selectedComp.isClientComponent ? (
                  <span className="text-[10px] px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300">
                    Client Component ("use client")
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
                    Server Component (RSC)
                  </span>
                )}
              </div>

              {/* Props */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">TypeScript Props</h4>
                <div className="bg-zinc-950 rounded p-2.5 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                  {selectedComp.props.map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <span className="text-zinc-300">{p.name}</span>
                        {p.required ? <span className="text-red-400">*</span> : <span className="text-zinc-500">?</span>}:{' '}
                        <span className="text-zinc-400">{p.type}</span>
                      </div>
                      {p.defaultValue && <span className="text-zinc-600 text-[10px]">default: {p.defaultValue}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tailwind Classes */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Mapped Tailwind Classes ({selectedComp.tailwindClasses.length})
                </h4>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                  {selectedComp.tailwindClasses.map((cls, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Routes */}
      {activeTab === 'routes' && (
        <div className="space-y-2 font-mono">
          {blueprint.routes.map((r, i) => (
            <div key={i} className="p-3 rounded border border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{r.path}</span>
                  <span className="text-[11px] text-zinc-400 font-sans">({decodeHtmlEntities(r.title)})</span>
                </div>
                <p className="text-xs text-zinc-500 font-sans mt-0.5">{decodeHtmlEntities(r.description)}</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Tag className="h-3 w-3 text-zinc-500" />
                <span>{r.componentIds.length} components</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Theme */}
      {activeTab === 'theme' && (
        <div className="p-4 rounded border border-zinc-800 bg-zinc-900/30 space-y-5 font-mono">
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-3">Color Palette Specification</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(blueprint.theme.colors).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2.5 p-2 rounded bg-zinc-950 border border-zinc-800">
                  <div
                    className="h-6 w-6 rounded border border-zinc-700 flex-shrink-0"
                    style={{ backgroundColor: val }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-semibold text-zinc-300 capitalize truncate">{key}</p>
                    <p className="text-[10px] text-zinc-500">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-800 pt-3 text-xs">
            <div>
              <h5 className="text-[11px] text-zinc-400 mb-1">Typography</h5>
              <p className="text-zinc-300">Sans: {blueprint.theme.typography.fontSans}</p>
              <p className="text-zinc-300">Headings: {blueprint.theme.typography.fontHeading}</p>
            </div>
            <div>
              <h5 className="text-[11px] text-zinc-400 mb-1">Scale</h5>
              <p className="text-zinc-300">Radius: {blueprint.theme.borderRadius}</p>
              <p className="text-zinc-500">Theme: Studio Black & Grey</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: API Contracts */}
      {activeTab === 'api' && (
        <div className="space-y-2 font-mono">
          {blueprint.apiEndpoints.map((ep, i) => (
            <div key={i} className="p-3 rounded border border-zinc-800 bg-zinc-900/30 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded border border-zinc-700 bg-zinc-800 text-zinc-200 text-[10px] font-bold">
                    {ep.method}
                  </span>
                  <span className="text-xs text-white">{ep.path}</span>
                </div>
                <span className="text-[11px] text-zinc-500 font-sans">{decodeHtmlEntities(ep.description)}</span>
              </div>
              <div className="bg-zinc-950 p-2 rounded border border-zinc-800/80 text-[11px] text-zinc-400 max-h-24 overflow-y-auto">
                <pre>{JSON.stringify(ep.mockResponse, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
