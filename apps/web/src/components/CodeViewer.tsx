"use client";

import React, { useState } from 'react';
import type { GeneratedProject, GeneratedFile } from '@vibe-swift/core';
import { Copy, Check, FileCode, Folder, Download, Terminal } from 'lucide-react';

interface CodeViewerProps {
  project: GeneratedProject;
}

export function CodeViewer({ project }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState<GeneratedFile>(
    project.files.find((f) => f.path === 'app/page.tsx') || project.files[0]
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadAll = () => {
    const bundleText = project.files
      .map((f) => `// ===================== FILE: ${f.path} =====================\n${f.content}\n\n`)
      .join('\n');
    const blob = new Blob([bundleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}-scaffolding.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Group files by directory
  const categorizedFiles = {
    'Next.js App Router': project.files.filter((f) => f.path.startsWith('app/')),
    'Reconstructed Components': project.files.filter((f) => f.path.startsWith('components/')),
    'Configuration & Styles': project.files.filter(
      (f) => !f.path.startsWith('app/') && !f.path.startsWith('components/')
    ),
  };

  return (
    <div className="flex flex-col gap-3 font-mono">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded border border-zinc-800 bg-zinc-900/40 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-200">PROJECT REPOSITORY MANIFEST</span>
          <span className="text-[10px] text-zinc-400 px-1.5 py-0.2 rounded border border-zinc-800 bg-zinc-900">
            {project.files.length} files
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-xs transition-colors"
          >
            {copied ? <Check className="h-3 w-3 text-zinc-200" /> : <Copy className="h-3 w-3 text-zinc-400" />}
            <span>{copied ? 'COPIED' : 'COPY FILE'}</span>
          </button>

          <button
            onClick={handleDownloadAll}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-zinc-700 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors"
          >
            <Download className="h-3 w-3" />
            <span>EXPORT BUNDLE</span>
          </button>
        </div>
      </div>

      {/* Code Editor Window */}
      <div className="grid grid-cols-1 md:grid-cols-12 rounded border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
        {/* File Tree Explorer (4 cols) */}
        <div className="md:col-span-4 border-r border-zinc-800/80 bg-zinc-950 p-3 max-h-[580px] overflow-y-auto text-xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 flex items-center justify-between">
            <span>REPOSITORY TREE</span>
            <span className="text-[9px] text-zinc-600">{project.name}</span>
          </div>

          <div className="space-y-3">
            {Object.entries(categorizedFiles).map(([category, files]) => {
              if (files.length === 0) return null;
              return (
                <div key={category}>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 mb-1">
                    <Folder className="h-3 w-3 text-zinc-500" />
                    <span>{category}</span>
                  </div>
                  <div className="space-y-0.5 pl-1.5">
                    {files.map((file) => {
                      const isSelected = selectedFile?.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center gap-2 transition-colors ${
                            isSelected
                              ? 'bg-zinc-800 text-white font-semibold'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                          }`}
                        >
                          <FileCode className={`h-3 w-3 flex-shrink-0 ${isSelected ? 'text-zinc-200' : 'text-zinc-600'}`} />
                          <span className="truncate">{file.path}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Content Viewer (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-zinc-950 max-h-[580px] overflow-hidden">
          {/* File bar */}
          <div className="h-8 bg-zinc-900/70 border-b border-zinc-800 px-3 flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <FileCode className="h-3.5 w-3.5 text-zinc-400" />
              <span className="font-semibold text-zinc-200">{selectedFile?.path}</span>
            </div>
            {selectedFile?.description && (
              <span className="text-[10px] text-zinc-500 truncate max-w-[280px]">
                {selectedFile.description}
              </span>
            )}
          </div>

          {/* Preformatted Code Content */}
          <div className="flex-1 p-3.5 overflow-auto text-xs leading-relaxed text-zinc-300 bg-black/60">
            <pre className="whitespace-pre">
              <code>{selectedFile?.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
