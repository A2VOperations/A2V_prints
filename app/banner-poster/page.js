'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import productsData from "./products.json"
const products = productsData.products

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
