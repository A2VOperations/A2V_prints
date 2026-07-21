'use client';

import React from 'react';

export default function TemplateHubLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-center shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="h-4 w-36 bg-blue-500/30 rounded-full mx-auto" />
            <div className="h-10 w-3/4 bg-white/10 rounded-xl mx-auto" />
            <div className="h-5 w-5/6 bg-white/10 rounded-lg mx-auto" />
            
            {/* Search Bar Skeleton */}
            <div className="pt-4 max-w-lg mx-auto">
              <div className="h-14 w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Industry Filter Pills Skeleton */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={`h-10 rounded-xl flex-shrink-0 ${
                i === 1 ? 'w-24 bg-blue-600/30' : 'w-36 bg-slate-200/80'
              }`}
            />
          ))}
        </div>

        {/* Categories Grid Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-7 w-64 bg-slate-200 rounded-lg" />
            <div className="h-5 w-32 bg-slate-200 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm"
              >
                {/* Image Placeholder */}
                <div className="aspect-[1.75/1] w-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/80 relative overflow-hidden flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-slate-300/60 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400">image</span>
                  </div>
                </div>

                {/* Content Placeholder */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-blue-100 rounded-full" />
                    <div className="h-4 w-16 bg-slate-100 rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
                  <div className="h-4 w-full bg-slate-100 rounded-md" />
                </div>

                {/* Button Placeholders */}
                <div className="pt-2 flex items-center gap-3">
                  <div className="h-10 flex-1 bg-slate-200/80 rounded-xl" />
                  <div className="h-10 w-10 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
