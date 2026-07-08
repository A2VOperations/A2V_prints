'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import productsData from "./products.json"
const products = productsData.products



export default function VisitingCardsPage() {
  const [filters, setFilters] = useState({
    standard: false,
    premium: false,
    luxury: false,
    matte: false,
    glossy: false,
    spotUv: false,
    foil: false,
    rectangle: false,
    rounded: false,
    square: false
  })

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const clearAll = () => {
    setFilters({
      standard: false,
      premium: false,
      luxury: false,
      matte: false,
      glossy: false,
      spotUv: false,
      foil: false,
      rectangle: false,
      rounded: false,
      square: false
    })
  }

  const getCount = (key, val) => products.filter(p => p[key] === val).length

  const filteredProducts = products.filter((item) => {
    const isPaperFiltered = filters.standard || filters.premium || filters.luxury
    const matchPaper = !isPaperFiltered || filters[item.paper]

    const isFinishFiltered = filters.matte || filters.glossy || filters.spotUv || filters.foil
    const matchFinish = !isFinishFiltered || filters[item.finish]

    const isShapeFiltered = filters.rectangle || filters.rounded || filters.square
    const matchShape = !isShapeFiltered || filters[item.shape]

    return matchPaper && matchFinish && matchShape
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
          <span className="text-[#CC3B10] font-extrabold">Visiting Cards</span>
        </nav>
      </div>

      {/* Pastel Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#FEEFEF] via-[#FCECEE] to-[#F8E7F5] p-6 sm:p-10 lg:p-12 border border-pink-100/60 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
                Make a Lasting <br />
                <span className="text-[#FF4A17]">Impression.</span>
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                Premium business cards that speak volumes before you even say a word. Choose from luxurious papers, unique shapes, and striking finishes to craft a card that is unmistakably yours.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalog-grid"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF551D] to-[#FF0055] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
                >
                  Explore Templates
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
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWUWcSqxM7-o_7HwmzyJvMmAP26xVFWjrJfpziy7Ztd_ca8zzTefOz6Kkjkyx1GUwoxbChn9eK4rG7ZrZ_uSeTmvqZD3nFKrDwWNk_Y7fI8JXz3D2ZqUjXaGYXqfskgNLw86BrbD9-JPFgKwCBZ8sukn-4YyVhO0E1fph_cEVaSj1TlDJVeYChVA-SFD2VE5_e_VbPI70hc7O6ru3Ik81597fgmGBvNXZDdEzu4V18l4VTRdykOydT"
                  alt="Visiting Cards Sample"
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

              {/* Paper Type Filter */}
              <div className="py-5 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Paper Type</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.standard}
                        onChange={() => toggleFilter('standard')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Standard (300 gsm)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('paper', 'standard')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.premium}
                        onChange={() => toggleFilter('premium')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Premium (350 gsm)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('paper', 'premium')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.luxury}
                        onChange={() => toggleFilter('luxury')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Luxury (400+ gsm)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('paper', 'luxury')})</span>
                  </label>
                </div>
              </div>

              {/* Finish Filter */}
              <div className="py-5 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Finish</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.matte}
                        onChange={() => toggleFilter('matte')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Matte Finish</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('finish', 'matte')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.glossy}
                        onChange={() => toggleFilter('glossy')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Glossy Finish</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('finish', 'glossy')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.spotUv}
                        onChange={() => toggleFilter('spotUv')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Spot UV</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('finish', 'spotUv')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.foil}
                        onChange={() => toggleFilter('foil')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Metallic Foil</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('finish', 'foil')})</span>
                  </label>
                </div>
              </div>

              {/* Shape Filter */}
              <div className="pt-5">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Card Shape</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.rectangle}
                        onChange={() => toggleFilter('rectangle')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Standard Rectangle</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('shape', 'rectangle')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.rounded}
                        onChange={() => toggleFilter('rounded')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Rounded Corners</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('shape', 'rounded')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.square}
                        onChange={() => toggleFilter('square')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Square Shape</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('shape', 'square')})</span>
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
                      href={`/visiting-cards/${item.id}`}
                      className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 block mb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white text-[#CC3B10] font-extrabold text-[11px] shadow-sm">
                        From ₹499
                      </span>
                    </Link>

                    <Link href={`/visiting-cards/${item.id}`}>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#CC3B10] transition-colors leading-snug mb-1.5">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-5">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    href={`/visiting-cards/${item.id}`}
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
