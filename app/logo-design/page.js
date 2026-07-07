'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import productsData from "./products.json"
const products = productsData.products

export default function LogoDesignPage() {
  const [filters, setFilters] = useState({
    minimalist: false,
    mascot: false,
    typography: false,
    vintage: false,
    tech: false,
    food: false,
    fashion: false,
    health: false,
    express: false,
    standard: false,
    premium: false
  })

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const clearAll = () => {
    setFilters({
      minimalist: false,
      mascot: false,
      typography: false,
      vintage: false,
      tech: false,
      food: false,
      fashion: false,
      health: false,
      express: false,
      standard: false,
      premium: false
    })
  }

  const getCount = (key, val) => products.filter(p => p[key] === val).length

  const filteredProducts = products.filter((item) => {
    const isStyleFiltered = filters.minimalist || filters.mascot || filters.typography || filters.vintage
    const matchStyle = !isStyleFiltered || filters[item.style]

    const isIndustryFiltered = filters.tech || filters.food || filters.fashion || filters.health
    const matchIndustry = !isIndustryFiltered || filters[item.industry]

    const isDeliveryFiltered = filters.express || filters.standard || filters.premium
    const matchDelivery = !isDeliveryFiltered || filters[item.delivery]

    return matchStyle && matchIndustry && matchDelivery
  })

  return (
    <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white min-h-screen">
      {/* Custom Styles replicating exact user design specifications */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .brand-gradient-bg {
          background: linear-gradient(90deg, #ff520a 0%, #ff0585 100%);
        }
        .brand-gradient-text {
          background: linear-gradient(90deg, #ff520a 0%, #ff0585 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        .btn-primary {
          background: linear-gradient(90deg, #ff520a 0%, #ff0585 100%);
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          filter: hue-rotate(-10deg) brightness(1.1);
          transform: scale(1.02);
          box-shadow: 0 10px 20px rgba(255, 82, 10, 0.2);
        }
        .btn-secondary {
          background-color: #001c37;
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background-color: #002d5a;
          transform: scale(1.02);
        }
        .ambient-shadow {
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
      ` }} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
          <li><Link href="/" className="hover:text-[#ff520a] transition-colors">Home</Link></li>
          <li className="text-slate-400">/</li>
          <li aria-current="page" className="text-[#a93100] font-bold">Logo Design</li>
        </ol>
      </nav>

      {/* Category Header */}
      <section className="mb-12 relative overflow-hidden rounded-2xl bg-[#f8f9fa] p-6 sm:p-10 md:p-12 border border-slate-200/80 ambient-shadow flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 opacity-10 brand-gradient-bg pointer-events-none" />

        <div className="z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Craft Your Brand <span className="brand-gradient-text">Identity</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
            Professional, memorable, and unique logo design services tailored to elevate your business. Whether you need a sleek minimalist mark or a custom illustration, our expert designers bring your vision to life.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary font-bold text-sm px-6 py-3 rounded-xl shadow-md">
              Explore Logo Styles
            </button>
            <button className="bg-white border border-slate-300 text-slate-800 hover:border-[#ff520a] hover:text-[#ff520a] font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-xs">
              Custom Design Brief
            </button>
          </div>
        </div>

        <div className="z-10 hidden md:block w-full max-w-md shrink-0">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden ambient-shadow border border-white/60">
            <img
              src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80"
              alt="Professional logo design samples"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80') {
                  e.target.src = 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Main Content: Filter Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 bg-[#f8f9fa] rounded-2xl border border-slate-200/80 p-6 ambient-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button
                onClick={clearAll}
                className="text-slate-500 hover:text-[#a93100] text-sm font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Filter Group: Logo Style */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Logo Style</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.minimalist}
                      onChange={() => toggleFilter('minimalist')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      Minimalist & Modern
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('style', 'minimalist')}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.mascot}
                      onChange={() => toggleFilter('mascot')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      Mascot & 3D
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('style', 'mascot')}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.typography}
                      onChange={() => toggleFilter('typography')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      Typography / Lettermark
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('style', 'typography')}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.vintage}
                      onChange={() => toggleFilter('vintage')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      Vintage & Emblem
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('style', 'vintage')}
                  </span>
                </label>
              </div>
            </div>

            {/* Filter Group: Industry */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Industry</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.tech}
                      onChange={() => toggleFilter('tech')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      Tech & Startup
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('industry', 'tech')}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.food}
                      onChange={() => toggleFilter('food')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      Food & Cafe
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('industry', 'food')}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.fashion}
                      onChange={() => toggleFilter('fashion')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      Fashion & Retail
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('industry', 'fashion')}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.health}
                      onChange={() => toggleFilter('health')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      Health & Wellness
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('industry', 'health')}
                  </span>
                </label>
              </div>
            </div>

            {/* Filter Group: Delivery Time */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Delivery Time</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.express}
                      onChange={() => toggleFilter('express')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      24 Hours Express
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('delivery', 'express')}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.standard}
                      onChange={() => toggleFilter('standard')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      2-3 Days Standard
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('delivery', 'standard')}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={filters.premium}
                      onChange={() => toggleFilter('premium')}
                      className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">
                      5+ Days Premium Pack
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {getCount('delivery', 'premium')}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-sm text-slate-600 font-medium">Showing {filteredProducts.length} results</p>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort by:</span>
              <select className="bg-white border border-slate-300 rounded-xl text-sm py-2 pl-3 pr-8 font-semibold text-slate-700 focus:ring-2 focus:ring-[#ff520a] focus:border-[#ff520a] outline-none shadow-xs">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden ambient-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] bg-[#f8f9fa] p-4 flex items-center justify-center overflow-hidden">
                  {item.badge && (
                    <div className="absolute top-3 left-3 bg-white text-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-slate-200 z-10">
                      {item.badge}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-[#a93100] shadow-sm z-10">
                    {item.price}
                  </div>

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain mix-blend-darken transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      if (e.target.src !== item.fallback) {
                        e.target.src = item.fallback
                      }
                    }}
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#a93100] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6 flex-grow leading-relaxed">
                    {item.description}
                  </p>
                  <button className="w-full btn-secondary text-sm font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-sm">
                    <span>Order Design</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
