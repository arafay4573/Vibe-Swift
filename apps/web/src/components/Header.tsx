"use client";

import React, { useState, useEffect } from 'react';
import { Terminal, Github, ExternalLink, Cpu } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand: The Swifters Anchor Mark + Larger, Bold VIBE SWIFT Wordmark */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 flex items-center justify-center rounded border border-zinc-800/80 bg-zinc-950/60 p-1 group-hover:border-zinc-700 transition-colors">
              <img
                src="/swifters-logo-mark.png"
                alt="The Swifters"
                className="h-7 w-auto object-contain brightness-110 contrast-125"
              />
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-zinc-100 uppercase">
                VIBE SWIFT
              </span>
              <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-400">
                STUDIO
              </span>
            </div>
          </a>
        </div>

        {/* Engine Status & Minimalist Utilitarian Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded border border-zinc-800/80 bg-zinc-950/60 text-xs font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <Cpu className="h-3 w-3 text-zinc-400" />
            <span className="text-[11px] text-zinc-300">morluto/rea attached</span>
          </div>

          <a
            href="https://github.com/morluto/rea"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
          >
            <Terminal className="h-3 w-3 text-zinc-400" />
            <span className="text-[11px]">rea docs</span>
            <ExternalLink className="h-2.5 w-2.5 text-zinc-500" />
          </a>

          <a
            href="https://github.com/vibe-swift/vibe-swift"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
