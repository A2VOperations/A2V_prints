'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="flex-grow min-h-[70vh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/40 p-6 select-none">
      {/* Ambient glowing background decorations */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-blue-500/15 to-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center Animated Loader */}
      <div className="relative flex flex-col items-center z-10">
        {/* Orbital rings around logo */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          {/* Outer glowing spinning ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-600 border-r-indigo-500 animate-spin" style={{ animationDuration: '1.2s' }} />
          
          {/* Reverse inner spinning ring */}
          <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-purple-600 border-l-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.8s' }} />
          
          {/* Subtle pulse ring */}
          <div className="absolute inset-4 rounded-full bg-blue-500/5 border border-blue-200/50 animate-pulse" />

          {/* Center Logo Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-blue-500/10 border border-slate-100">
            <span className="font-extrabold text-2xl tracking-tighter bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              A2V
            </span>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-800">
            A2V <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Prints</span>
          </h2>
          
          <p className="text-sm font-medium text-slate-500 animate-pulse tracking-wide">
            Loading your design experience...
          </p>
        </div>

        {/* Shimmer Progress Bar */}
        <div className="mt-8 w-56 h-1.5 bg-slate-200/80 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-blue-600 to-indigo-600 rounded-full animate-[marquee-right_1.2s_ease-in-out_infinite]" style={{ width: '60%', animation: 'marquee-right 1.4s infinite alternate ease-in-out' }} />
        </div>

        {/* Feature badges floating below */}
        <div className="mt-10 flex items-center gap-6 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            <span>Premium Printing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Custom Templates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>Studio Editor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
