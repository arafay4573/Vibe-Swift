"use client";

import React, { useState } from 'react';
import type { GeneratedProject } from '@vibe-swift/core';
import {
  Github,
  X,
  Lock,
  GitBranch,
  FileCode,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  FolderGit2,
} from 'lucide-react';

interface GitHubPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: GeneratedProject;
}

export function GitHubPushModal({ isOpen, onClose, project }: GitHubPushModalProps) {
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState(
    project.name || 'vibe-swift-reconstructed-app'
  );
  const [branch, setBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState(
    'feat: Synthesized Next.js + Tailwind project via Vibe Swift Studio'
  );
  const [createNew, setCreateNew] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    repoUrl: string;
    commitSha: string;
    filesCount: number;
  } | null>(null);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !repoName.trim()) {
      setError('GitHub Personal Access Token and Repository Name are required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessResult(null);

    try {
      // Build file dictionary
      const files: Record<string, string> = {};
      for (const f of project.files) {
        files[f.path] = f.content;
      }

      const res = await fetch('/api/github-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          repoName: repoName.trim(),
          branch: branch.trim() || 'main',
          commitMessage: commitMessage.trim(),
          files,
          createNew,
          isPrivate,
          description: `Synthesized Next.js & Tailwind clone of ${project.blueprint.sourceTarget} via Vibe Swift Studio.`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to push repository to GitHub');
      }

      setSuccessResult({
        repoUrl: data.repoUrl,
        commitSha: data.commitSha?.slice(0, 7) || 'HEAD',
        filesCount: data.filesCount || Object.keys(files).length,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded border border-zinc-800 bg-[#09090b] shadow-2xl p-6 font-mono text-xs text-zinc-100 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
              <Github className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white tracking-wide">
                PUSH REPOSITORY TO GITHUB
              </div>
              <div className="text-[10px] text-zinc-500 font-sans">
                Commit &amp; initialize {project.files.length} project files directly via GitHub REST API
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success State */}
        {successResult ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded border border-emerald-900/60 bg-emerald-950/20 text-emerald-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Repository Successfully Pushed!</span>
              </div>
              <p className="text-[11px] text-emerald-400/80 font-sans">
                Committed {successResult.filesCount} files to branch <code className="bg-emerald-950/60 px-1 py-0.5 rounded">{branch}</code> (Commit {successResult.commitSha}).
              </p>
            </div>

            <div className="p-3 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <span className="text-zinc-400 truncate max-w-[280px]">{successResult.repoUrl}</span>
              <a
                href={successResult.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-700 bg-zinc-100 text-zinc-950 font-semibold text-xs hover:bg-white transition-colors"
              >
                <span>OPEN ON GITHUB</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handlePush} className="space-y-4">
            {error && (
              <div className="p-3 rounded border border-red-900/60 bg-red-950/30 text-red-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">{error}</div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-zinc-500" />
                  GitHub Personal Access Token (PAT)
                </span>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 underline"
                >
                  Generate Token (repo scope)
                </a>
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 text-xs placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <FolderGit2 className="h-3 w-3 text-zinc-500" />
                    Repository Name
                  </span>
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="my-cloned-app"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 text-xs placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <GitBranch className="h-3 w-3 text-zinc-500" />
                    Target Branch
                  </span>
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 text-xs placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] text-zinc-400">
                Commit Message
              </label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="feat: Initial commit from Vibe Swift"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-100 text-xs placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-zinc-300">
                <input
                  type="checkbox"
                  checked={createNew}
                  onChange={(e) => setCreateNew(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-zinc-200 focus:ring-0"
                />
                <span>Create new repo if not existing</span>
              </label>

              {createNew && (
                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-zinc-200 focus:ring-0"
                  />
                  <span>Private repository</span>
                </label>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
              <div className="text-[10px] text-zinc-500 font-sans">
                {project.files.length} files will be committed to <span className="font-mono text-zinc-400">{repoName}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-zinc-200 bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>PUSHING REPO...</span>
                    </>
                  ) : (
                    <>
                      <Github className="h-3.5 w-3.5" />
                      <span>PUSH TO GITHUB</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}