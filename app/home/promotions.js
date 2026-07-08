'use client'

import React from 'react'

const promotions = [
  {
    id: 1,
    subtitle: 'LATEST DESIGN',
    title: 'Book Cover\nDesign',
    buttonText: 'SHOP NOW',
    link: '#book-cover',
    bgColor: 'bg-[linear-gradient(135deg,_#6600f5_0%,_#7e18ff_100%)]',
    hoverText: 'group-hover:text-[#6600f5]',
    image: '/categories/categories (4).jpg',
    imageClassName: 'w-[85%] sm:w-[90%] h-auto max-h-[220px] sm:max-h-[280px] md:max-h-[320px] object-contain transform translate-x-2 sm:translate-x-4 group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500 drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]'
  },
  {
    id: 2,
    subtitle: 'LATEST DESIGN',
    title: 'T-Shirt\nDesign',
    buttonText: 'SHOP NOW',
    link: '#tshirt-design',
    bgColor: 'bg-[linear-gradient(135deg,_#2878ff_0%,_#458aff_100%)]',
    hoverText: 'group-hover:text-[#2878ff]',
    image: '/categories/categories (5).webp',
    imageClassName: 'w-[85%] sm:w-[90%] h-auto max-h-[220px] sm:max-h-[280px] md:max-h-[320px] object-contain transform translate-x-2 sm:translate-x-4 group-hover:scale-105 group-hover:rotate-2 transition-all duration-500 drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)]'
  }
]

export default function Promotions() {
  return (
    <section className="py-10 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {promotions.map((promo) => (
            <a
              key={promo.id}
              href={promo.link}
              className={`group relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-between min-h-[240px] sm:min-h-[300px] md:min-h-[340px] p-6 sm:p-10 md:p-12 ${promo.bgColor} select-none`}
            >
              {/* Decorative Background Shapes (replicating the organic graphics in the screenshot) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {promo.id === 1 ? (
                  <>
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-black/15 blur-2xl" />
                    <div className="absolute right-1/3 -top-10 w-48 h-48 rounded-full bg-white/10 blur-xl" />
                    <svg className="absolute right-0 bottom-0 w-72 h-72 text-black/15 transform translate-x-12 translate-y-12" fill="currentColor" viewBox="0 0 200 200">
                      <path d="M45,-78C58,-70,68,-57,76,-43C84,-29,90,-14,89,1C88,16,80,32,71,46C62,60,52,73,38,81C24,89,8,92,-8,92C-24,92,-40,89,-54,81C-68,73,-80,60,-87,46C-94,32,-96,16,-94,2C-92,-12,-86,-26,-77,-39C-68,-52,-56,-64,-42,-72C-28,-80,-14,-84,1,-86C16,-88,32,-86,45,-78Z" transform="translate(100 100)" />
                    </svg>
                  </>
                ) : (
                  <>
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-black/15 blur-2xl" />
                    <div className="absolute left-1/4 -top-10 w-48 h-48 rounded-full bg-white/15 blur-xl" />
                    <svg className="absolute right-0 top-0 w-full h-full text-white/10" fill="none" viewBox="0 0 400 300">
                      <path d="M 0,50 Q 200,-50 400,100 L 400,300 L 0,300 Z" fill="currentColor" />
                      <path d="M 0,150 Q 200,50 400,200 L 400,300 L 0,300 Z" fill="currentColor" opacity="0.4" />
                    </svg>
                  </>
                )}
              </div>

              {/* Left Column: Text & CTA Button */}
              <div className="relative z-10 flex flex-col items-start max-w-[55%] sm:max-w-[50%]">
                {/* Subtitle */}
                <span className="text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.18em] text-white/90 uppercase mb-2 sm:mb-3 drop-shadow-xs">
                  {promo.subtitle}
                </span>

                {/* Main Heading */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-white tracking-tight leading-[1.1] mb-6 sm:mb-8 whitespace-pre-line drop-shadow-sm">
                  {promo.title}
                </h3>

                {/* Shop Now Button */}
                <span className={`inline-flex items-center justify-center border border-white/80 group-hover:bg-white text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-sm transition-all duration-300 tracking-widest uppercase shadow-sm ${promo.hoverText} group-active:scale-95`}>
                  {promo.buttonText}
                </span>
              </div>

              {/* Right Column: Product Graphic Mockup */}
              <div className="absolute right-0 bottom-0 top-0 w-[48%] sm:w-[50%] flex items-center justify-end overflow-hidden z-10 pointer-events-none">
                <img
                  src={promo.image}
                  alt={promo.title.replace('\n', ' ')}
                  className={promo.imageClassName}
                  loading="lazy"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
