'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import productsData from "./products.json"
const products = productsData.products

export default function FlexBoardPage() {
  const [filters, setFilters] = useState({
    frontlit: false,
    backlit: false,
    sunboard: false,
    acrylic: false,
    iron: false,
    aluminum: false,
    wall: false,
    pole: false,
    gsm280: false,
    gsm340: false,
    gsm440: false
  })

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const clearAll = () => {
    setFilters({
      frontlit: false,
      backlit: false,
      sunboard: false,
      acrylic: false,
      iron: false,
      aluminum: false,
      wall: false,
      pole: false,
      gsm280: false,
      gsm340: false,
      gsm440: false
    })
  }

  const getCount = (key, val) => products.filter(p => p[key] === val).length

  const filteredProducts = products.filter((item) => {
    const isTypeFiltered = filters.frontlit || filters.backlit || filters.sunboard || filters.acrylic
    const matchType = !isTypeFiltered || filters[item.type]

    const isFrameFiltered = filters.iron || filters.aluminum || filters.wall || filters.pole
    const matchFrame = !isFrameFiltered || filters[item.frame]

    const isThicknessFiltered = filters.gsm280 || filters.gsm340 || filters.gsm440
    const matchThickness = !isThicknessFiltered || filters[item.thickness]

    return matchType && matchFrame && matchThickness
  })

  return (
    <div className="min-h-screen bg-[#FFFBF8] text-slate-800">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#CC3B10] transition-colors">
            Home
          </Link>
          <span className="text-slate-400">›</span>
          <span className="text-[#CC3B10] font-extrabold">Flex Board</span>
        </nav>
      </div>

      {/* Pastel Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#FEEFEF] via-[#FCECEE] to-[#F8E7F5] p-6 sm:p-10 lg:p-12 border border-pink-100/60 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
                Durable <br />
                <span className="text-[#FF4A17]">Flex Board & Signage.</span>
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                High-impact outdoor shop hoardings, LED backlit boards, and heavy-duty iron frame flex boards engineered to withstand heavy rain, wind, and harsh sunlight. High-definition solvent printing ensures your brand stays visible day and night.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalog-grid"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF551D] to-[#FF0055] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
                >
                  Calculate Price
                </a>
                <button
                  onClick={clearAll}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm shadow-sm border border-slate-200/80 transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-lg bg-white border border-white/60">
                <img
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
                  alt="Flex board and shop signage"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <main id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Filter Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs h-fit sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">Filters</h2>
                <button
                  onClick={clearAll}
                  className="text-xs font-bold text-slate-400 hover:text-[#CC3B10] transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Board Type Filter */}
              <div className="py-5 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Board Type</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.frontlit}
                        onChange={() => toggleFilter('frontlit')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Normal Frontlit Flex</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('type', 'frontlit')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.backlit}
                        onChange={() => toggleFilter('backlit')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>LED Backlit Glow Flex</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('type', 'backlit')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.starflex}
                        onChange={() => toggleFilter('starflex')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Star Flex Premium HD</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('type', 'starflex')})</span>
                  </label>
                </div>
              </div>

              {/* Frame Material Filter */}
              <div className="py-5 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Frame Option</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.none}
                        onChange={() => toggleFilter('none')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Flex Roll Only (No Frame)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('frame', 'none')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.wooden}
                        onChange={() => toggleFilter('wooden')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Treated Wooden Frame</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('frame', 'wooden')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.iron}
                        onChange={() => toggleFilter('iron')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Heavy Duty Iron Frame</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('frame', 'iron')})</span>
                  </label>
                </div>
              </div>

              {/* GSM Thickness Filter */}
              <div className="pt-5">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">GSM Thickness</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.gsm280}
                        onChange={() => toggleFilter('gsm280')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>280 GSM (Standard)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('thickness', '280')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.gsm340}
                        onChange={() => toggleFilter('gsm340')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>340 GSM (Heavy)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('thickness', '340')})</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Results Grid */}
          <div className="lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> products
              </span>
              <button
                onClick={clearAll}
                className="text-xs font-bold text-[#CC3B10] hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <Link
                      href={`/flex-board/${item.id}`}
                      className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 block mb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white text-[#CC3B10] font-extrabold text-[11px] shadow-sm">
                        From ₹699
                      </span>
                    </Link>

                    <Link href={`/flex-board/${item.id}`}>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#CC3B10] transition-colors leading-snug mb-1.5">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-5">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    href={`/flex-board/${item.id}`}
                    className="w-full bg-[#031A30] hover:bg-[#0A2D4E] text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Start Designing</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
