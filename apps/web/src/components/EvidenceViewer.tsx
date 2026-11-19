"use client";

import React, { useState } from 'react';
import type { REAEvidence } from '@vibe-swift/core';
import { Copy, Check, Terminal, Info } from 'lucide-react';

interface EvidenceViewerProps {
  evidence: REAEvidence;
}

export function EvidenceViewer({ evidence }: EvidenceViewerProps) {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'all' | 'metadata' | 'modules' | 'network' | 'domTree'>('all');

  const getFilteredPayload = () => {
    switch (filter) {
      case 'metadata':
        return {
          schemaVersion: evidence.schemaVersion,
          source: evidence.source,
          metadata: evidence.metadata,
        };
      case 'modules':
        return {
          entryPoints: evidence.entryPoints,
          modules: evidence.modules,
        };
      case 'network':
        return {
          network: evidence.network,
        };
      case 'domTree':
        return {
          domTree: evidence.domTree,
          styles: evidence.styles,
          assets: evidence.assets,
        };
      default:
        return evidence;
    }
  };

  const payloadString = JSON.stringify(getFilteredPayload(), null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 font-mono">
      {/* Action / Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded border border-zinc-800 bg-zinc-900/40 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-200">morluto/rea EVIDENCE STREAM</span>
          <span className="text-[10px] text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-800 bg-zinc-900">
            SCHEMA v{evidence.schemaVersion}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-800 text-[11px]">
            {(['all', 'metadata', 'modules', 'network', 'domTree'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2 py-0.5 rounded uppercase transition-colors ${
                  filter === key ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-xs transition-colors"
          >
            {copied ? <Check className="h-3 w-3 text-zinc-200" /> : <Copy className="h-3 w-3 text-zinc-400" />}
            <span>{copied ? 'COPIED' : 'COPY JSON'}</span>
          </button>
        </div>
      </div>

      {/* Diagnostics Banner if any */}
      {evidence.diagnostics && evidence.diagnostics.length > 0 && (
        <div className="rounded border border-zinc-800 bg-zinc-900/30 p-2.5 space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Info className="h-3 w-3 text-zinc-400" />
            <span>REA Diagnostics Log</span>
          </div>
          {evidence.diagnostics.map((diag, i) => (
            <div key={i} className="text-xs text-zinc-400 flex items-center gap-2">
              <span className="text-[10px] text-zinc-600">{new Date(diag.timestamp).toLocaleTimeString()}</span>
              <span className={`px-1 rounded text-[9px] font-bold ${diag.level === 'warn' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'bg-zinc-800 text-zinc-300'}`}>
                {diag.level.toUpperCase()}
              </span>
              <span className="text-zinc-300">{diag.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* JSON Viewer */}
      <div className="rounded border border-zinc-800 bg-black/60 p-3.5 text-xs text-zinc-300 max-h-[580px] overflow-auto">
        <pre className="whitespace-pre">
          <code>{payloadString}</code>
        </pre>
      </div>
    </div>
  );
}
