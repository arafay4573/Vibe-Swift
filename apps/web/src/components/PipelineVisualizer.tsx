"use client";

import React from 'react';
import { Globe, Binary, FileSearch, Layers, Code2, Check, Loader2 } from 'lucide-react';

export type PipelineStep = 'idle' | 'ingestion' | 'rea-analysis' | 'evidence' | 'blueprint' | 'code-gen' | 'completed';

interface PipelineVisualizerProps {
  currentStep: PipelineStep;
  durationMs?: number;
}

export function PipelineVisualizer({ currentStep, durationMs }: PipelineVisualizerProps) {
  const steps = [
    { id: 'ingestion', label: '01 // INGEST', desc: 'Target ingest & fetch', icon: Globe },
    { id: 'rea-analysis', label: '02 // REA PROTOCOL', desc: 'CLI observation & AST', icon: Binary },
    { id: 'evidence', label: '03 // EVIDENCE', desc: 'Normalized payloads', icon: FileSearch },
    { id: 'blueprint', label: '04 // BLUEPRINT', desc: 'Component architecture', icon: Layers },
    { id: 'code-gen', label: '05 // SYNTHESIS', desc: 'Next.js & Tailwind build', icon: Code2 },
  ];

  const getStepStatus = (stepId: string) => {
    const order = ['idle', 'ingestion', 'rea-analysis', 'evidence', 'blueprint', 'code-gen', 'completed'];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(stepId);

    if (currentStep === 'completed' || stepIndex < currentIndex) {
      return 'done';
    }
    if (stepIndex === currentIndex) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <div className="w-full rounded border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center justify-between mb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Pipeline Protocol
          </span>
          {currentStep !== 'idle' && currentStep !== 'completed' && (
            <span className="inline-flex items-center gap-1.5 text-[10px] text-zinc-300">
              <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
              <span>executing</span>
            </span>
          )}
        </div>
        {durationMs !== undefined && durationMs > 0 && (
          <span className="text-[11px] text-zinc-500 font-mono">
            t={(durationMs / 1000).toFixed(2)}s
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono">
        {steps.map((s) => {
          const status = getStepStatus(s.id);
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              className={`rounded border p-2.5 flex flex-col gap-1.5 transition-colors ${
                status === 'done'
                  ? 'border-zinc-700 bg-zinc-900/70 text-zinc-200'
                  : status === 'active'
                  ? 'border-zinc-500 bg-zinc-800/80 text-white shadow-sm'
                  : 'border-zinc-800/80 bg-zinc-950/40 text-zinc-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-5 w-5 rounded flex items-center justify-center text-[10px] font-bold ${
                    status === 'done'
                      ? 'bg-zinc-800 text-zinc-300'
                      : status === 'active'
                      ? 'bg-zinc-200 text-zinc-950 font-bold'
                      : 'bg-zinc-900 text-zinc-600'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                </div>
                {status === 'done' ? (
                  <Check className="h-3.5 w-3.5 text-zinc-400" />
                ) : status === 'active' ? (
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold leading-tight tracking-wider">{s.label}</p>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
