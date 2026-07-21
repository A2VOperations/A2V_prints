'use client';

import React from 'react';

export default function DynamicTemplateCategoryLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-[1550px] mx-auto space-y-8">
        
        {/* Breadcrumb & Header Skeleton */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-3 bg-slate-300 rounded-full" />
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-3 bg-slate-300 rounded-full" />
            <div className="h-4 w-36 bg-blue-200 rounded" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="h-9 w-72 sm:w-96 bg-slate-300/80 rounded-xl" />
              <div className="h-4 w-64 sm:w-80 bg-slate-200 rounded-lg" />
            </div>
            
            {/* Search input skeleton */}
            <div className="h-11 w-full md:w-72 bg-white border border-slate-200 rounded-xl" />
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar Skeleton (Filters) */}
          <div className="w-full lg:w-64 flex-shrink-0 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-6 shadow-sm hidden lg:block">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="h-5 w-28 bg-slate-300 rounded-md" />
              <div className="h-4 w-12 bg-slate-200 rounded-md" />
            </div>

            {/* Filter Group 1 */}
            <div className="space-y-3">
              <div className="h-4 w-24 bg-slate-300 rounded" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-4 w-4 rounded bg-slate-200" />
                  <div className="h-4 flex-1 bg-slate-100 rounded" />
                </div>
              ))}
            </div>

            {/* Filter Group 2 */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="h-4 w-20 bg-slate-300 rounded" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-7 w-16 bg-slate-100 rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Area: Top Pills & Grid */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Active Pills & Sort Bar */}
            <div className="flex items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-24 bg-slate-100 rounded-lg flex-shrink-0" />
                ))}
              </div>
              <div className="h-9 w-40 bg-slate-100 rounded-lg flex-shrink-0" />
            </div>

            {/* Templates Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  {/* Template Card Preview Skeleton */}
                  <div className="p-4 space-y-3">
                    <div className="aspect-[1.75/1] w-full rounded-xl bg-gradient-to-br from-slate-100 via-slate-200/70 to-slate-100 relative flex items-center justify-center border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-slate-400">palette</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="h-3.5 w-20 bg-blue-100 rounded-full" />
                        <div className="h-3.5 w-12 bg-slate-100 rounded-full" />
                      </div>
                      <div className="h-5 w-4/5 bg-slate-300/80 rounded-md" />
                      <div className="h-4 w-3/5 bg-slate-200/70 rounded-md" />
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-4 pb-4 pt-2 border-t border-slate-50 flex items-center gap-2.5">
                    <div className="h-10 flex-1 bg-blue-600/20 rounded-xl" />
                    <div className="h-10 w-24 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
