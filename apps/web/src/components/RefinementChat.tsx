"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { FullCloneResult, VibeBlueprint } from '@vibe-swift/core';
import { MessageSquare, Send, RotateCcw, ChevronDown, Loader2, Terminal, Zap } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
  isFallback?: boolean;
}

interface BrandCustomization {
  brandName?: string;
  headline?: string;
  description?: string;
  ctaText?: string;
  themePreset?: string;
}

interface RefinementChatProps {
  cloneResult: FullCloneResult;
  brandParams: BrandCustomization;
  onRefinement: (updatedFiles: Record<string, string>, blueprintPatches: Record<string, unknown>, assistantMessage: string) => void;
}

export function RefinementChat({ cloneResult, brandParams, onRefinement }: RefinementChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Studio AI ready. Describe how you want to refine the cloned website — change colors, copy, layout, sections, components, or anything else. I\'ll update the generated code and preview in real time.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && isExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const prompt = input.trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: prompt, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Collect current files from project
      const currentFiles: Record<string, string> = {};
      if (cloneResult.project?.files) {
        for (const file of cloneResult.project.files) {
          currentFiles[file.path] = file.content;
        }
      }

      // Build conversation history (exclude initial system message)
      const history = messages
        .slice(1)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint: cloneResult.blueprint,
          currentFiles,
          conversationHistory: history,
          prompt,
          brandParams,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Refinement request failed');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.assistantMessage || 'Changes applied.',
        timestamp: new Date(),
        isFallback: data.fallback === true,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Notify parent with updated files and blueprint patches
      onRefinement(data.updatedFiles || {}, data.blueprintPatches || {}, data.assistantMessage || '');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${msg}`, timestamp: new Date(), isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation cleared. Ready for new refinement instructions.',
        timestamp: new Date(),
      },
    ]);
  };

  const examplePrompts = [
    'Change the hero headline to be more technical and engineering-focused',
    'Add a dark code snippet section showing API usage',
    'Make the color palette warmer — use amber/golden accents instead',
    'Add a pricing table with 3 tiers: Free, Pro, and Enterprise',
  ];

  return (
    <div className="rounded border border-zinc-800 bg-zinc-900/40 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 font-mono text-xs">
          <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-zinc-200 font-semibold">STUDIO BUILD &amp; REFINEMENT PROMPT</span>
          <span className="text-zinc-600">// ITERATIVE AI CHAT</span>
          {messages.length > 1 && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px]">
              {messages.length - 1} msg{messages.length !== 2 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleClearHistory(); }}
              className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Clear conversation history"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear</span>
            </button>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col">
          {/* Messages */}
          <div className="max-h-[380px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 h-6 w-6 rounded flex items-center justify-center font-mono text-[10px] border mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-zinc-700 border-zinc-600 text-zinc-200'
                      : msg.isError
                      ? 'bg-red-950 border-red-800 text-red-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
                >
                  {msg.role === 'user' ? 'U' : <Terminal className="h-3 w-3" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded px-3 py-2 text-xs leading-relaxed font-sans border ${
                    msg.role === 'user'
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 text-right'
                      : msg.isError
                      ? 'bg-red-950/30 border-red-900/50 text-red-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {msg.content}
                  {msg.isFallback && (
                    <div className="mt-1 text-[10px] text-zinc-500 font-mono">
                      ↳ Fallback synthesizer (LLM unavailable)
                    </div>
                  )}
                  <div className="mt-1 text-[10px] text-zinc-600 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded flex items-center justify-center bg-zinc-800 border border-zinc-700 mt-0.5">
                  <Loader2 className="h-3 w-3 text-zinc-400 animate-spin" />
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-500 font-mono flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse delay-100" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse delay-200" />
                  <span className="ml-1">Synthesizing refinement...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {examplePrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="px-2 py-1 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-[11px] font-mono transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 px-4 pb-4 pt-2 border-t border-zinc-800/80"
          >
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Describe a refinement... (Enter to send, Shift+Enter for newline)"
                rows={1}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-sans resize-none transition-colors disabled:opacity-50"
                style={{ minHeight: '36px' }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded border border-zinc-700 bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Send (Enter)"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </button>
          </form>

          {/* Footer hint */}
          <div className="flex items-center justify-between px-4 pb-3 text-[10px] font-mono text-zinc-600">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3" />
              <span>Powered by Gemini 2.0 Flash · Vibe Swift Studio Engine</span>
            </div>
            <span>Shift+Enter = newline</span>
          </div>
        </div>
      )}
    </div>
  );
}
