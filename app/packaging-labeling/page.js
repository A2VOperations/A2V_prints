'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const products = [
  {
    id: 1,
    title: 'Corrugated Shipping Box',
    price: 'From ₹19 / box',
    badge: 'Popular',
    description: '3-ply and 5-ply sturdy corrugated cardboard shipping boxes with inside and outside custom brand printing.',
    type: 'boxes',
    material: 'kraft',
    finish: 'matte',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Waterproof Vinyl Bottle Labels',
    price: 'From ₹149 / 100 pcs',
    badge: 'Best Seller',
    description: 'Oil and moisture resistant BOPP vinyl stickers with strong adhesive for beverages, jars, and cosmetics.',
    type: 'labels',
    material: 'vinyl',
    finish: 'glossy',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Kraft Paper Shopping Bags',
    price: 'From ₹24 / bag',
    badge: 'Eco Friendly',
    description: '100% biodegradable recycled brown kraft paper bags with twisted handles and elegant single-color screen print.',
    type: 'bags',
    material: 'kraft',
    finish: 'matte',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Luxury Rigid Gift Box',
    price: 'From ₹189 / box',
    badge: 'Premium',
    description: 'Thick premium rigid cardboard boxes with magnetic closure lids and satin ribbon inserts for luxury gifting.',
    type: 'boxes',
    material: 'sbs',
    finish: 'foil',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    title: 'Holographic Foil Stickers',
    price: 'From ₹299 / 100 pcs',
    badge: 'New',
    description: 'Iridescent rainbow holographic foil stickers cut to custom shapes. Eye-catching branding for tech and fashion.',
    type: 'labels',
    material: 'foilmat',
    finish: 'foil',
    image: 'https://images.unsplash.com/photo-1572945281869-9fb178824b74?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1572945281869-9fb178824b74?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    title: 'Standup Zip-Lock Food Pouch',
    price: 'From ₹15 / pouch',
    description: 'Food-grade laminated standup pouches with resealable zip lock and transparent window for snacks and spices.',
    type: 'food',
    material: 'foilmat',
    finish: 'matte',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    title: 'Custom Printed Wrapping Tissue',
    price: 'From ₹499 / roll',
    description: 'Delicate 18gsm translucent wrapping tissue paper with repeating logo patterns for unboxing experiences.',
    type: 'bags',
    material: 'sbs',
    finish: 'matte',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    title: 'Heavy Industrial Carton Box',
    price: 'From ₹65 / box',
    description: 'Heavy-duty 7-ply master shipper cartons engineered for export transportation and heavy industrial equipment.',
    type: 'boxes',
    material: 'kraft',
    finish: 'matte',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
  }
]

export default function PackagingLabelingPage() {
  const [filters, setFilters] = useState({
    boxes: false,
    bags: false,
    labels: false,
    food: false,
    kraft: false,
    sbs: false,
    vinyl: false,
    foilmat: false,
    matte: false,
    glossy: false,
    foil: false
  })

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const clearAll = () => {
    setFilters({
      boxes: false,
      bags: false,
      labels: false,
      food: false,
      kraft: false,
      sbs: false,
      vinyl: false,
      foilmat: false,
      matte: false,
      glossy: false,
      foil: false
    })
  }

  const getCount = (key, val) => products.filter(p => p[key] === val).length

  const filteredProducts = products.filter((item) => {
    const isTypeFiltered = filters.boxes || filters.bags || filters.labels || filters.food
    const matchType = !isTypeFiltered || filters[item.type]

    const isMaterialFiltered = filters.kraft || filters.sbs || filters.vinyl || filters.foilmat
    const matchMaterial = !isMaterialFiltered || filters[item.material]

    const isFinishFiltered = filters.matte || filters.glossy || filters.foil
    const matchFinish = !isFinishFiltered || filters[item.finish]

    return matchType && matchMaterial && matchFinish
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
          <li aria-current="page" className="text-[#a93100] font-bold">Packaging & Labeling</li>
        </ol>
      </nav>

      <section className="mb-12 relative overflow-hidden rounded-2xl bg-[#f8f9fa] p-6 sm:p-10 md:p-12 border border-slate-200/80 ambient-shadow flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 opacity-10 brand-gradient-bg pointer-events-none" />
        
        <div className="z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Custom <span className="brand-gradient-text">Packaging & Labels</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
            Elevate your product presentation with branded corrugated shipping boxes, custom paper bags, waterproof stickers, and food-grade packaging pouches. Premium materials that keep your products secure and your brand unforgettable.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary font-bold text-sm px-6 py-3 rounded-xl shadow-md">
              Explore Box Sizes
            </button>
            <button className="bg-white border border-slate-300 text-slate-800 hover:border-[#ff520a] hover:text-[#ff520a] font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-xs">
              Request Sample Kit
            </button>
          </div>
        </div>

        <div className="z-10 hidden md:block w-full max-w-md shrink-0">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden ambient-shadow border border-white/60">
            <img
              src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
              alt="Custom packaging boxes and labels"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80') {
                  e.target.src = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Product Type</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.boxes} onChange={() => toggleFilter('boxes')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Corrugated Boxes</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('type', 'boxes')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.bags} onChange={() => toggleFilter('bags')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Paper & Gift Bags</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('type', 'bags')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.labels} onChange={() => toggleFilter('labels')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Stickers & Labels</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('type', 'labels')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.food} onChange={() => toggleFilter('food')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Food Pouches</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('type', 'food')}</span>
                </label>
              </div>
            </div>

            <div className="mb-6 pb-6 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Material</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.kraft} onChange={() => toggleFilter('kraft')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Kraft Brown Eco</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('material', 'kraft')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.sbs} onChange={() => toggleFilter('sbs')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">SBS White Board</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('material', 'sbs')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.vinyl} onChange={() => toggleFilter('vinyl')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Waterproof Vinyl</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('material', 'vinyl')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.foilmat} onChange={() => toggleFilter('foilmat')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Metallized Foil</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('material', 'foilmat')}</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Finish</h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.matte} onChange={() => toggleFilter('matte')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Matte Lamination</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('finish', 'matte')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.glossy} onChange={() => toggleFilter('glossy')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Glossy UV Coating</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('finish', 'glossy')}</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={filters.foil} onChange={() => toggleFilter('foil')} className="w-4 h-4 text-[#ff520a] rounded border-slate-300 focus:ring-[#ff520a]" />
                    <span className="text-sm text-slate-700 group-hover:text-[#a93100] transition-colors font-medium">Foil Stamping</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">{getCount('finish', 'foil')}</span>
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
                    <span>Order Dimensions</span>
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
