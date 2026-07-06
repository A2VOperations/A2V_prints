'use client'

import React from 'react'

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#fef5ef] via-[#fcf0ea] to-[#fbebe3] overflow-hidden py-12 sm:py-16 md:py-24 lg:py-28 min-h-[620px] flex items-center select-none font-sans">
      {/* Subtle Background Decorative Light Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#ffd1b3]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ffb3d9]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Decorative Shapes from public/hero */}
      <img src="/hero/banner-shape-2.svg" alt="" className="absolute top-16 right-1/2 w-8 h-8 animate-pulse opacity-80 pointer-events-none z-0" />
      <img src="/hero/blue-shape.svg" alt="" className="absolute bottom-16 left-10 w-12 h-12 opacity-60 pointer-events-none z-0" />
      <img src="/hero/parpale-shape.svg" alt="" className="absolute top-24 left-12 w-10 h-10 opacity-60 pointer-events-none z-0" />
      <img src="/hero/red-dot.svg" alt="" className="absolute top-1/3 right-12 w-6 h-6 opacity-80 pointer-events-none animate-bounce z-0" />
      <img src="/hero/blue-dot.svg" alt="" className="absolute bottom-24 right-1/4 w-5 h-5 opacity-70 pointer-events-none z-0" />
      <img src="/hero/small-blue.svg" alt="" className="absolute top-1/4 left-1/3 w-6 h-6 opacity-70 pointer-events-none z-0" />
      <img src="/hero/small-red.svg" alt="" className="absolute bottom-1/3 left-1/4 w-6 h-6 opacity-70 pointer-events-none z-0" />
      <img src="/hero/small-parpale.svg" alt="" className="absolute top-10 right-10 w-8 h-8 opacity-70 pointer-events-none z-0" />

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-6 z-10 flex flex-col items-start text-left pt-4 sm:pt-0">
            
            {/* Floating Starburst & Script Subtitle */}
            <div className="relative inline-flex items-center gap-3 mb-4">
              <span className="font-serif italic text-[#ff5722] text-lg sm:text-xl md:text-2xl font-semibold tracking-wide drop-shadow-xs">
                Welcome To Printfix
              </span>
              {/* Animated Floating Starburst from public/hero */}
              <div className="absolute -top-7 sm:-top-8 left-48 sm:left-56 animate-bounce duration-1000">
                <img
                  src="/hero/banner-shape-1.svg"
                  alt="starburst"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm transform rotate-12"
                />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-[#051c14] tracking-tight leading-[1.08] mb-6 font-sans">
              Product Design &amp; <br className="hidden sm:block" />
              <span className="text-[#051c14]">Printing</span>
            </h1>

            {/* Description */}
            <p className="text-[#55605d] text-sm sm:text-base md:text-lg max-w-xl mb-8 sm:mb-10 leading-relaxed font-normal">
              There are many variations of passages orem psum available but the
              majority have suffered alteration in some form by injected humour
              or randomised words which don&apos;t look even.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <a
                href="#services"
                className="inline-flex items-center justify-center bg-[#ff4d00] hover:bg-[#e04300] text-white font-bold text-sm sm:text-base px-7 sm:px-8 py-3.5 sm:py-4 rounded-md shadow-lg shadow-[#ff4d00]/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Our Service
              </a>
              <a
                href="#discover"
                className="inline-flex items-center justify-center bg-[#f7ebe2]/80 hover:bg-[#ebdccf] text-[#222222] font-semibold text-sm sm:text-base px-7 sm:px-8 py-3.5 sm:py-4 rounded-md border border-gray-300/60 shadow-xs transition-all duration-200"
              >
                Discover More
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic from public/hero */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end z-10">
            <div className="relative w-full max-w-[640px] flex items-center justify-center">
              <img
                src="/hero/Picture2.png"
                alt="Product Design & Printing Catalog - Bottles, Mugs, Business Cards"
                className="w-full h-auto max-h-[560px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
