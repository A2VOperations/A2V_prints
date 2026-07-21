'use client';

import React from 'react';

export default function StudioEditorLoading() {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none animate-pulse">
      
      {/* Top Navbar Skeleton */}
      <header className="h-14 border-b border-slate-800/80 bg-slate-900/90 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/40 flex items-center justify-center font-bold text-xs">
              A2V
            </div>
            <div className="h-4 w-28 bg-slate-700 rounded" />
          </div>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="h-4 w-48 bg-slate-800 rounded hidden sm:block" />
        </div>

        {/* Top Actions Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-20 bg-slate-800 rounded-lg" />
          <div className="h-8 w-24 bg-blue-600/40 rounded-lg" />
          <div className="h-8 w-8 bg-slate-800 rounded-full" />
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Leftmost Tool Icons Bar Skeleton */}
        <aside className="w-16 border-r border-slate-800/80 bg-slate-900/60 flex flex-col items-center py-4 gap-6 shrink-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center" />
              <div className="h-2 w-7 bg-slate-800 rounded" />
            </div>
          ))}
        </aside>

        {/* Left Side Drawer Skeleton (Templates/Elements) */}
        <aside className="w-72 border-r border-slate-800/80 bg-slate-900/40 flex flex-col hidden md:flex shrink-0 p-4 space-y-4">
          <div className="h-9 w-full bg-slate-800/80 rounded-xl" />
          <div className="flex items-center gap-2">
            <div className="h-7 flex-1 bg-slate-800/60 rounded-lg" />
            <div className="h-7 flex-1 bg-slate-800/60 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-1.75/1 rounded-lg bg-slate-800/50 border border-slate-800" />
            ))}
          </div>
        </aside>

        {/* Center Canvas Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-950">
          
          {/* Ambient Studio Canvas Glow */}
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-x-20 translate-y-10" />

          {/* Canvas Placeholder */}
          <div className="w-full max-w-4xl aspect-1.75/1 bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl relative flex flex-col items-center justify-center gap-4 z-10 p-8">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin" />
              <span className="material-symbols-outlined text-2xl text-blue-400">design_services</span>
            </div>
            
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-slate-300">Loading Studio Workspace</p>
              <p className="text-xs text-slate-500">Preparing canvas layers, fonts, and tools...</p>
            </div>
          </div>

          {/* Bottom Zoom / Page Bar Skeleton */}
          <div className="absolute bottom-6 flex items-center gap-4 bg-slate-900/90 border border-slate-800/80 px-4 py-2 rounded-full shadow-lg">
            <div className="h-6 w-16 bg-slate-800 rounded-full" />
            <div className="h-6 w-24 bg-slate-800 rounded-full" />
            <div className="h-6 w-16 bg-slate-800 rounded-full" />
          </div>
        </main>

        {/* Right Properties Panel Skeleton */}
        <aside className="w-64 border-l border-slate-800/80 bg-slate-900/40 p-4 space-y-6 hidden lg:flex flex-col shrink-0">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-slate-800 rounded" />
            <div className="h-4 w-12 bg-slate-800 rounded" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 bg-slate-800 rounded" />
                <div className="h-9 w-full bg-slate-800/60 rounded-lg" />
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
