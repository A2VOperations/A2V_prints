'use client'

import Image from 'next/image'
import React from 'react'

const logos = [
    { id: 1, src: '/logos/logo (1).avif', alt: 'Brand Partner 1' },
    { id: 2, src: '/logos/logo (2).avif', alt: 'Brand Partner 2' },
    { id: 3, src: '/logos/logo (3).avif', alt: 'Brand Partner 3' },
    { id: 4, src: '/logos/logo (4).avif', alt: 'Brand Partner 4' },
    { id: 5, src: '/logos/logo (5).avif', alt: 'Brand Partner 5' },
    { id: 6, src: '/logos/logo (6).avif', alt: 'Brand Partner 6' },
    { id: 7, src: '/logos/logo (7).avif', alt: 'Brand Partner 7' },
    { id: 8, src: '/logos/logo (8).avif', alt: 'Brand Partner 8' },
    { id: 9, src: '/logos/logo (9).avif', alt: 'Brand Partner 9' },
    { id: 10, src: '/logos/logo (10).avif', alt: 'Brand Partner 10' },
    { id: 11, src: '/logos/logo (11).avif', alt: 'Brand Partner 11' },
    { id: 12, src: '/logos/logo (12).avif', alt: 'Brand Partner 12' },
    { id: 13, src: '/logos/logo (13).avif', alt: 'Brand Partner 13' },
]

export default function Slider() {
    // Duplicate logos 4 times to ensure seamless infinite scrolling even on ultra-wide screens
    const row1Logos = [...logos, ...logos, ...logos, ...logos]
    const row2Logos = [...logos].reverse()
    const row2LogosDuplicated = [...row2Logos, ...row2Logos, ...row2Logos, ...row2Logos]

    return (
        <section className="py-2 sm:py-2 bg-linear-to-b from-white via-slate-50/60 to-white relative overflow-hidden border-y border-slate-100">
            {/* Vanilla CSS Keyframes & Animation styles for hardware-accelerated smooth scrolling */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes marqueeLeft {
          0% { transform: translate3d(0%, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marqueeRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0%, 0, 0); }
        }
        .slider-track-left {
          display: flex;
          width: max-content;
          animation: marqueeLeft 40s linear infinite;
          will-change: transform;
        }
        .slider-track-right {
          display: flex;
          width: max-content;
          animation: marqueeRight 45s linear infinite;
          will-change: transform;
        }
        .slider-track-left:hover,
        .slider-track-right:hover {
          animation-play-state: paused;
        }
      `}} />

            {/* Sliders Container */}
            <div className="relative w-full overflow-hidden flex flex-col gap-6 sm:gap-8">
                {/* Left & Right Gradient Fade Masks for smooth edge transitions */}
                <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                {/* Row 1: Scrolling Left */}
                <div className="relative w-full overflow-hidden">
                    <div className="slider-track-left gap-4 sm:gap-6 px-3">
                        {row1Logos.map((logo, idx) => (
                            <div
                                key={`row1-${logo.id}-${idx}`}
                                className="group relative flex items-center justify-center px-5 sm:px-7 py-3 sm:py-4 rounded-xl bg-white/90 hover:bg-white border border-slate-100 hover:border-[#5348e2]/30 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(83,72,226,0.15)] transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer select-none"
                            >
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-10 sm:h-12 md:h-14 w-auto object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                    loading="lazy"
                                    width={240}
                                    height={100}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 2: Scrolling Right */}
                {/* <div className="relative w-full overflow-hidden">
                    <div className="slider-track-right gap-4 sm:gap-6 px-3">
                        {row2LogosDuplicated.map((logo, idx) => (
                            <div
                                key={`row2-${logo.id}-${idx}`}
                                className="group relative flex items-center justify-center px-5 sm:px-7 py-3 sm:py-4 rounded-xl bg-white/90 hover:bg-white border border-slate-100 hover:border-[#ff5722]/30 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_-5px_rgba(255,87,34,0.15)] transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:scale-105 cursor-pointer select-none"
                            >
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-10 sm:h-12 md:h-14 w-auto object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                    loading="lazy"
                                    width={240}
                                    height={100}
                                />
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </section>
    )
}
