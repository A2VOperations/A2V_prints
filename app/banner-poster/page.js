'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const products = [
  {
    id: 1,
    title: 'Heavy-Duty Vinyl Banner',
    price: 'From ₹499',
    badge: 'Popular',
    description: 'Weatherproof 330gsm vinyl banner with reinforced welded hems and brass grommets for outdoor display.',
    material: 'vinyl',
    size: '3x6',
    mounting: 'eyelets',
    image: 'https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Retractable Roll-Up Stand',
    price: 'From ₹1,899',
    badge: 'Best Seller',
    description: 'Portable luxury aluminum base stand with pre-installed high-res star flex banner. Erects in seconds.',
    material: 'starflex',
    size: '2x3',
    mounting: 'stand',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'High-Gloss Promo Poster A1',
    price: 'From ₹199',
    description: 'Vibrant 240gsm photo paper poster with UV protective gloss finish. Ideal for retail window promotions.',
    material: 'paper',
    size: 'a1a2',
    mounting: 'frame',
    image: 'https://images.unsplash.com/photo-1572945281869-9fb178824b74?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1572945281869-9fb178824b74?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Backlit Star Flex Banner',
    price: 'From ₹899',
    description: 'Translucent 400gsm seamless flex engineered specifically for LED light boxes and glowing shop signboards.',
    material: 'starflex',
    size: '4x8',
    mounting: 'frame',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: 'Fabric Satin Event Banner',
    price: 'From ₹699',
    badge: 'Premium',
    description: 'Wrinkle-resistant polyester satin cloth with rich dye-sublimation printing for indoor exhibitions and seminars.',
    material: 'satin',
    size: '3x6',
    mounting: 'eyelets',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Matte Finish Poster A2',
    price: 'From ₹149',
    description: 'Non-reflective matte archival paper perfect for indoor art prints, office branding, and academic displays.',
    material: 'paper',
    size: 'a1a2',
    mounting: 'frame',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    title: 'Windproof Mesh Banner',
    price: 'From ₹799',
    description: 'Perforated vinyl mesh banner allows wind to pass through without tearing. Designed for construction fences.',
    material: 'vinyl',
    size: '4x8',
    mounting: 'eyelets',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    title: 'Step & Repeat Photo Backdrop',
    price: 'From ₹2,499',
    badge: 'Event',
    description: 'Large 8x8 ft non-glare matte backdrop banner with telescopic metal frame stand for red carpet media events.',
    material: 'satin',
    size: '4x8',
    mounting: 'stand',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80'
  }
]

export default function BannerPosterPage() {
  const [filters, setFilters] = useState({
    vinyl: false,
    starflex: false,
    paper: false,
    satin: false,
    size2x3: false,
    size3x6: false,
    size4x8: false,
    sizeA1A2: false,
    eyelets: false,
    stand: false,
    frame: false
  })

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const clearAll = () => {
    setFilters({
      vinyl: false,
      starflex: false,
      paper: false,
      satin: false,
      size2x3: false,
      size3x6: false,
      size4x8: false,
      sizeA1A2: false,
      eyelets: false,
      stand: false,
      frame: false
    })
  }

  const getCount = (key, val) => products.filter(p => p[key] === val).length

  const filteredProducts = products.filter((item) => {
    const isMaterialFiltered = filters.vinyl || filters.starflex || filters.paper || filters.satin
    const matchMaterial = !isMaterialFiltered || filters[item.material]

    const isSizeFiltered = filters.size2x3 || filters.size3x6 || filters.size4x8 || filters.sizeA1A2
    const sizeKeyMap = { '2x3': 'size2x3', '3x6': 'size3x6', '4x8': 'size4x8', 'a1a2': 'sizeA1A2' }
    const matchSize = !isSizeFiltered || filters[sizeKeyMap[item.size]]

    const isMountingFiltered = filters.eyelets || filters.stand || filters.frame
    const matchMounting = !isMountingFiltered || filters[item.mounting]

    return matchMaterial && matchSize && matchMounting
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
          <li aria-current="page" className="text-[#a93100] font-bold">Banner and Poster</li>
        </ol>
      </nav>

      <section className="mb-12 relative overflow-hidden rounded-2xl bg-[#f8f9fa] p-6 sm:p-10 md:p-12 border border-slate-200/80 ambient-shadow flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 opacity-10 brand-gradient-bg pointer-events-none" />
        
        <div className="z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Eye-Catching <span className="brand-gradient-text">Banners & Posters</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
            Make a massive impact at events, trade shows, and storefronts. High-resolution outdoor vinyl banners, indoor display posters, and retractable pull-up stands designed to command attention.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary font-bold text-sm px-6 py-3 rounded-xl shadow-md">
              Explore Sizes
            </button>
            <button className="bg-white border border-slate-300 text-slate-800 hover:border-[#ff520a] hover:text-[#ff520a] font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-xs">
              Upload Artwork
            </button>
          </div>
        </div>

        <div className="z-10 hidden md:block w-full max-w-md shrink-0">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden ambient-shadow border border-white/60">
            <img
              src="https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=800&q=80"
              alt="Outdoor banner and poster prints"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== 'https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=800&q=80') {
                  e.target.src = 'https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=800&q=80'
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Material</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.vinyl} onChange={() => toggleFilter('vinyl')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Vinyl (330gsm)</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('material', 'vinyl')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.starflex} onChange={() => toggleFilter('starflex')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Star Flex (400gsm)</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('material', 'starflex')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.paper} onChange={() => toggleFilter('paper')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Photo Paper (240gsm)</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('material', 'paper')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.satin} onChange={() => toggleFilter('satin')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Fabric Satin Cloth</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('material', 'satin')}</span>
                </label>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Size</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.size2x3} onChange={() => toggleFilter('size2x3')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">2 x 3 ft</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('size', '2x3')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.size3x6} onChange={() => toggleFilter('size3x6')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">3 x 6 ft</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('size', '3x6')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.size4x8} onChange={() => toggleFilter('size4x8')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">4 x 8 ft</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('size', '4x8')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.sizeA1A2} onChange={() => toggleFilter('sizeA1A2')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">A1 / A2 Posters</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('size', 'a1a2')}</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Mounting</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.eyelets} onChange={() => toggleFilter('eyelets')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Eyelets & Grommets</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('mounting', 'eyelets')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.stand} onChange={() => toggleFilter('stand')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Retractable Stand</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('mounting', 'stand')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.frame} onChange={() => toggleFilter('frame')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Wall Mount / Frame</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('mounting', 'frame')}</span>
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
                    <span>Customize Banner</span>
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
