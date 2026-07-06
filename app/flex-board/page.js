'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const products = [
  {
    id: 1,
    title: 'Standard Shop Frontlit Flex',
    price: 'From ₹899',
    badge: 'Popular',
    description: 'Weather-resistant 340gsm frontlit flex printing mounted on a sturdy iron pipe frame for retail store banners.',
    type: 'frontlit',
    frame: 'iron',
    thickness: 'gsm340',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'LED Backlit Glow Sign Board',
    price: 'From ₹3,499',
    badge: 'Best Seller',
    description: '440gsm premium star flex backlit sheet with internal branded LED tube modules for high nighttime visibility.',
    type: 'backlit',
    frame: 'aluminum',
    thickness: 'gsm440',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Heavy Iron Box Frame Hoarding',
    price: 'From ₹2,499',
    description: 'Reinforced 3-inch square iron box structure designed for large highway billboards and roof-top advertisements.',
    type: 'frontlit',
    frame: 'iron',
    thickness: 'gsm440',
    image: 'https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: '3D Acrylic Letter LED Board',
    price: 'From ₹5,999',
    badge: 'Premium',
    description: 'Laser-cut embossed 3D acrylic letters with waterproof LED illumination mounted on aluminum composite panel.',
    type: 'acrylic',
    frame: 'aluminum',
    thickness: 'gsm440',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: 'Vinyl Printed Sunboard Sign',
    price: 'From ₹499',
    badge: 'New',
    description: 'High-definition solvent vinyl print laminated on 5mm foam sunboard sheet for indoor branding and menus.',
    type: 'sunboard',
    frame: 'wall',
    thickness: 'gsm280',
    image: 'https://images.unsplash.com/photo-1572945281869-9fb178824b74?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1572945281869-9fb178824b74?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Reflective Night-Glow Highway',
    price: 'From ₹1,799',
    description: 'Retro-reflective radium sheeting that shines brightly when hit by vehicle headlights. Ideal for road signage.',
    type: 'frontlit',
    frame: 'pole',
    thickness: 'gsm340',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    title: 'Double-Sided Pole Mount Flex',
    price: 'From ₹1,299',
    description: 'Twin-sided flex board with center mounting brackets engineered for street light poles and boulevard marketing.',
    type: 'frontlit',
    frame: 'pole',
    thickness: 'gsm340',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    title: 'Wooden Framed Exhibition Panel',
    price: 'From ₹999',
    description: 'Lightweight pine wood frame stretched with matte star flex for indoor stall backdrops and corporate events.',
    type: 'sunboard',
    frame: 'wall',
    thickness: 'gsm280',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80'
  }
]

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
    <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
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

      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-slate-500 font-medium">
          <li><Link href="/" className="hover:text-[#ff520a] transition-colors">Home</Link></li>
          <li className="text-slate-400">/</li>
          <li aria-current="page" className="text-[#a93100] font-bold">Flex Board</li>
        </ol>
      </nav>

      <section className="mb-12 relative overflow-hidden rounded-2xl bg-[#f8f9fa] p-6 sm:p-10 md:p-12 border border-slate-200/80 ambient-shadow flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 opacity-10 brand-gradient-bg pointer-events-none" />
        
        <div className="z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Durable <span className="brand-gradient-text">Flex Board & Signage</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
            High-impact outdoor shop hoardings, LED backlit boards, and heavy-duty iron frame flex boards engineered to withstand heavy rain, wind, and harsh sunlight. High-definition solvent printing ensures your brand stays visible day and night.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary font-bold text-sm px-6 py-3 rounded-xl shadow-md">
              Calculate Price
            </button>
            <button className="bg-white border border-slate-300 text-slate-800 hover:border-[#ff520a] hover:text-[#ff520a] font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-xs">
              Request Installation
            </button>
          </div>
        </div>

        <div className="z-10 hidden md:block w-full max-w-md shrink-0">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden ambient-shadow border border-white/60">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80"
              alt="Flex board and shop signage"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80') {
                  e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
                }
              }}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 bg-[#f8f9fa] rounded-2xl border border-slate-200/80 p-6 ambient-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button onClick={clearAll} className="text-slate-500 hover:text-[#a93100] text-sm font-semibold transition-colors">
                Clear All
              </button>
            </div>

            <div className="mb-6 pb-6 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Board Type</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.frontlit} onChange={() => toggleFilter('frontlit')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Frontlit Normal Flex</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('type', 'frontlit')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.backlit} onChange={() => toggleFilter('backlit')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">LED Backlit Star Flex</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('type', 'backlit')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.sunboard} onChange={() => toggleFilter('sunboard')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Sunboard / Foam Sheet</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('type', 'sunboard')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.acrylic} onChange={() => toggleFilter('acrylic')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">3D Acrylic Letters</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('type', 'acrylic')}</span>
                </label>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Frame & Mounting</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.iron} onChange={() => toggleFilter('iron')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Iron Box Frame</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('frame', 'iron')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.aluminum} onChange={() => toggleFilter('aluminum')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Aluminum Border</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('frame', 'aluminum')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.wall} onChange={() => toggleFilter('wall')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Wall Mount Flat</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('frame', 'wall')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.pole} onChange={() => toggleFilter('pole')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Pole / Kiosk Mount</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('frame', 'pole')}</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Thickness</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.gsm280} onChange={() => toggleFilter('gsm280')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">280 GSM Standard</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('thickness', 'gsm280')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.gsm340} onChange={() => toggleFilter('gsm340')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">340 GSM Heavy Duty</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('thickness', 'gsm340')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.gsm440} onChange={() => toggleFilter('gsm440')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">440 GSM Star Flex</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('thickness', 'gsm440')}</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

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
                    <span>Order Size & Frame</span>
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
