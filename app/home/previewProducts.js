'use client'

import React, { useRef } from 'react'
import visitingCardsData from '../visiting-cards/products.json'
import logoDesignData from '../logo-design/products.json'
import bannerPosterData from '../banner-poster/products.json'
import customTshirtsData from '../custom-tshirts/products.json'
import flexBoardData from '../flex-board/products.json'
import packagingLabelingData from '../packaging-labeling/products.json'
import mugsDrinkwareData from '../mugs-drinkware/products.json'
import hoodiesJacketsData from '../hoodies-jackets/products.json'

const productDataMap = {
  'visiting-cards': {
    title: 'Featured Visiting Cards',
    subtitle: 'Professional, custom-designed business cards for every industry',
    link: '/visiting-cards',
    linkText: 'View All Visiting Cards',
    products: visitingCardsData?.products || [],
  },
  'logo-design': {
    title: 'Custom Logo Design Packages',
    subtitle: 'Unique, brand-defining logos crafted by professional designers',
    link: '/logo-design',
    linkText: 'Explore Logo Packages',
    products: logoDesignData?.products || [],
  },
  'banner-poster': {
    title: 'Banners & Posters',
    subtitle: 'High-impact marketing displays and promotional print materials',
    link: '/banner-poster',
    linkText: 'View All Banners',
    products: bannerPosterData?.products || [],
  },
  'custom-tshirts': {
    title: 'Custom T-Shirts & Apparel',
    subtitle: 'Premium personalized t-shirts for businesses, events, and everyday wear',
    link: '/custom-tshirts',
    linkText: 'View All T-Shirts',
    products: customTshirtsData?.products || [],
  },
  'flex-board': {
    title: 'Flex Boards & Signages',
    subtitle: 'Durable, weather-resistant outdoor and indoor advertising boards',
    link: '/flex-board',
    linkText: 'View Flex Boards',
    products: flexBoardData?.products || [],
  },
  'packaging-labeling': {
    title: 'Packaging & Labeling Solutions',
    subtitle: 'Custom boxes, stickers, labels, and packaging to elevate your brand',
    link: '/packaging-labeling',
    linkText: 'Explore Packaging',
    products: packagingLabelingData?.products || [],
  },
  'mugs-drinkware': {
    title: 'Custom Mugs & Drinkware',
    subtitle: 'Personalized ceramic mugs, bottles, and drinkware for gifting and branding',
    link: '/mugs-drinkware',
    linkText: 'View All Drinkware',
    products: mugsDrinkwareData?.products || [],
  },
  'hoodies-jackets': {
    title: 'Custom Hoodies & Winterwear',
    subtitle: 'Cozy, high-quality custom hoodies, sweatshirts, and corporate jackets',
    link: '/hoodies-jackets',
    linkText: 'Explore Winterwear',
    products: hoodiesJacketsData?.products || [],
  },
}

export default function PreviewProducts({
  slug = 'visiting-cards',
  title: propTitle,
  subtitle: propSubtitle,
  products: propProducts,
  link: propLink,
  linkText: propLinkText,
  bgClassName = 'bg-slate-50/60',
}) {
  const scrollRef = useRef(null)

  const defaultData = productDataMap[slug] || productDataMap['visiting-cards']
  const title = propTitle || defaultData.title
  const subtitle = propSubtitle || defaultData.subtitle
  const products = propProducts || defaultData.products || []
  const link = propLink || defaultData.link || '#'
  const linkText = propLinkText || defaultData.linkText || 'View All Catalog'

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount =
        direction === 'left' ? -(scrollRef.current.clientWidth * 0.75) : scrollRef.current.clientWidth * 0.75
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className={`pt-12 sm:pt-16 pb-12 sm:pb-16 ${bgClassName} relative overflow-hidden border-b border-slate-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/section relative">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-slate-500 text-sm sm:text-base mt-1.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>

          {link && (
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <a
                href={link}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5348e2] hover:text-[#ff5722] transition-colors mr-2 shrink-0"
              >
                <span>{linkText}</span>
                <span className="font-black">→</span>
              </a>
            </div>
          )}
        </div>

        {/* Products Carousel */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Floating Right & Left Arrows */}
          <button
            onClick={() => scroll('right')}
            aria-label="Next product slide"
            className="hidden lg:flex absolute -right-12 top-[44%] -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-white/95 hover:bg-white border border-slate-200 shadow-lg hover:shadow-xl text-slate-700 hover:text-[#5348e2] items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('left')}
            aria-label="Previous product slide"
            className="hidden lg:flex absolute -left-12 top-[44%] -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-white/95 hover:bg-white border border-slate-200 shadow-lg hover:shadow-xl text-slate-700 hover:text-[#5348e2] items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto scroll-smooth pb-6 pt-2 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((item) => (
              <a
                key={item.id}
                href={`${link}/${item.id}`}
                className="group flex flex-col justify-between shrink-0 w-[260px] sm:w-[290px] md:w-[320px] bg-white rounded-2xl border border-slate-200/80 hover:border-[#5348e2]/40 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1.5 select-none"
              >
                {/* Top Image Section */}
                <div className="relative aspect-[3/2] w-full bg-[#f8f9fa] group-hover:bg-slate-100/60 transition-colors flex items-center justify-center overflow-hidden">
                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] text-white text-[10px] sm:text-xs font-extrabold tracking-wider uppercase shadow-xs">
                      {item.badge}
                    </span>
                  )}

                  {/* Price Tag */}
                  {item.price && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-sm font-bold text-[#F06800] shadow-sm z-20 border border-slate-100">
                      {item.price}
                    </div>
                  )}

                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain mix-blend-darken transform group-hover:scale-108 transition-transform duration-500 drop-shadow-sm group-hover:drop-shadow-md relative z-10"
                    loading="lazy"
                  />
                </div>

                {/* Info Section */}
                <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#5348e2] transition-colors duration-200 leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* CTA Footer inside Card */}
                  <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                      Customizable
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#5348e2] group-hover:text-[#ff5722] group-hover:translate-x-1 transition-all">
                      <span>Customize</span>
                      <span className="font-black">→</span>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
