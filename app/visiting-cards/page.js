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
          <li aria-current="page" className="text-[#a93100] font-bold">Business Cards</li>
        </ol>
      </nav>

      {/* Category Header */}
      <section className="mb-12 relative overflow-hidden rounded-2xl bg-[#f8f9fa] p-6 sm:p-10 md:p-12 border border-slate-200/80 ambient-shadow flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 opacity-10 brand-gradient-bg pointer-events-none" />

        <div className="z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
            Make a Lasting <span className="brand-gradient-text">Impression</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
            Premium business cards that speak volumes before you even say a word. Choose from a variety of luxurious papers, unique shapes, and striking finishes to craft a card that is unmistakably yours.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary font-bold text-sm px-6 py-3 rounded-xl shadow-md">
              Explore Templates
            </button>
            <button className="bg-white border border-slate-300 text-slate-800 hover:border-[#ff520a] hover:text-[#ff520a] font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-xs">
              Upload Design
            </button>
          </div>
        </div>

        <div className="z-10 hidden md:block w-full max-w-md shrink-0">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden ambient-shadow border border-white/60">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWUWcSqxM7-o_7HwmzyJvMmAP26xVFWjrJfpziy7Ztd_ca8zzTefOz6Kkjkyx1GUwoxbChn9eK4rG7ZrZ_uSeTmvqZD3nFKrDwWNk_Y7fI8JXz3D2ZqUjXaGYXqfskgNLw86BrbD9-JPFgKwCBZ8sukn-4YyVhO0E1fph_cEVaSj1TlDJVeYChVA-SFD2VE5_e_VbPI70hc7O6ru3Ik81597fgmGBvNXZDdEzu4V18l4VTRdykOydT"
              alt="Premium business card sample"
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
                  <span className="w-full btn-secondary text-sm font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-sm">
                    <span>Start Designing</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
