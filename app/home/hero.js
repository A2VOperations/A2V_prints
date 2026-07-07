'use client'

import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

export default function Hero() {
  const cardRef = useRef(null)
  const blueShapeRef = useRef(null)
  const parpaleShapeRef = useRef(null)
  const redDotRef = useRef(null)
  const smallRedRef = useRef(null)
  const card2Ref = useRef(null)
  const targetY = useRef(0)
  const currentY = useRef(0)
  const typeRef = useRef(null)
  const cursorRef = useRef(null)
  const badgeRef = useRef(null)
  const headingRef = useRef(null)
  const underlineRef = useRef(null)
  const avatarsPillRef = useRef(null)
  const circlesRef = useRef(null)
  const arrowRef = useRef(null)
  const descRef = useRef(null)
  const ctaRef = useRef(null)
  const checksRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      targetY.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    let animationFrameId
    const animate = () => {
      // Smooth linear interpolation (lerp) for buttery inertia and momentum
      currentY.current += (targetY.current - currentY.current) * 0.08
      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${-currentY.current * 0.3}px, 0, 0)`
      }
      if (blueShapeRef.current) {
        blueShapeRef.current.style.transform = `translate3d(0, ${-currentY.current * 0.25}px, 0)`
      }
      if (parpaleShapeRef.current) {
        parpaleShapeRef.current.style.transform = `translate3d(0, ${-currentY.current * 0.3}px, 0)`
      }
      if (redDotRef.current) {
        redDotRef.current.style.transform = `translate3d(0, ${-currentY.current * 0.4}px, 0)`
      }
      if (smallRedRef.current) {
        smallRedRef.current.style.transform = `translate3d(0, ${-currentY.current * 0.2}px, 0)`
      }
      if (card2Ref.current) {
        card2Ref.current.style.transform = `translate3d(0, ${-currentY.current * 0.35}px, 0)`
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(TextPlugin)
    }

    let ctx = gsap.context(() => {
      // 1. Entrance Staggered Reveal Timeline for the Left Section
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (badgeRef.current) {
        entranceTl.from(badgeRef.current, {
          y: -25,
          opacity: 0,
          duration: 0.7,
          ease: 'back.out(1.7)',
        })
      }

      if (headingRef.current) {
        entranceTl.from(
          headingRef.current.children,
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
          },
          '-=0.4'
        )
      }

      if (underlineRef.current) {
        entranceTl.fromTo(
          underlineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power3.out', transformOrigin: 'left center' },
          '-=0.4'
        )
      }

      if (avatarsPillRef.current && circlesRef.current && arrowRef.current) {
        entranceTl.from(
          [avatarsPillRef.current, circlesRef.current, arrowRef.current],
          {
            scale: 0.5,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(2)',
          },
          '-=0.5'
        )
      }

      const bottomElements = [descRef.current, ctaRef.current, checksRef.current].filter(Boolean)
      if (bottomElements.length > 0) {
        entranceTl.from(
          bottomElements,
          {
            y: 25,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
          },
          '-=0.4'
        )
      }

      // 2. Continuous Dynamic Micro-Animations for Interactive Elements
      if (arrowRef.current) {
        gsap.to(arrowRef.current, {
          rotation: '+=10',
          x: 4,
          y: -4,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      if (avatarsPillRef.current) {
        gsap.to(avatarsPillRef.current, {
          y: -5,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      if (circlesRef.current) {
        gsap.to(circlesRef.current, {
          scale: 1.08,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      if (underlineRef.current) {
        gsap.to(underlineRef.current, {
          opacity: 0.55,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // 3. Typing Word Animation & Blinking Cursor
      const words = ['Modern', 'Creative', 'Trending']
      let typeTl = gsap.timeline({ repeat: -1 })

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          opacity: 0,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
          duration: 0.45,
        })
      }

      if (typeRef.current) {
        typeRef.current.innerText = ''
        words.forEach((word) => {
          typeTl
            .to(typeRef.current, {
              duration: word.length * 0.12,
              text: word,
              ease: 'none',
            })
            .to({}, { duration: 1.5 })
            .to(typeRef.current, {
              duration: word.length * 0.06,
              text: '',
              ease: 'none',
            })
            .to({}, { duration: 0.3 })
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative w-full bg-gradient-to-br from-[#fef5ef] via-[#fcf0ea] to-[#fbebe3] overflow-hidden py-5 sm:py-6 md:py-8 lg:py-15 min-h-[620px] flex items-center select-none font-sans">
      {/* Subtle Background Decorative Light Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#ffd1b3]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ffb3d9]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <h1 className='absolute text-9xl top-10 right-1/5 z-0 opacity-30 [-webkit-text-stroke:1px_#f6b48e] text-transparent uppercase font-black tracking-[0.2rem]'>A2V Prints</h1>

      {/* Floating Decorative Shapes from public/hero */}

      <img ref={blueShapeRef} src="/hero/blue-shape.svg" alt="" className="absolute bottom-60 right-20  w-70 h-70 pointer-events-none z-0 will-change-transform" />
      <img ref={parpaleShapeRef} src="/hero/parpale-shape.svg" alt="" className="absolute bottom-10 right-35 w-80 h-80 pointer-events-none z-0 will-change-transform" />
      <img ref={redDotRef} src="/hero/red-dot.svg" alt="" className="absolute bottom-70 right-28 w-6 h-6 pointer-events-none  z-0 will-change-transform" />
      <img width={8} height={8} src="/hero/blue-dot.svg" alt="" className="absolute top-55 right-45 w-5 h-5 pointer-events-none z-0" />

      <img ref={smallRedRef} src="/hero/small-red.svg" alt="" className="absolute bottom-30 right-130 w-6 h-6 pointer-events-none z-0 will-change-transform" />
      <img src="/hero/small-parpale.svg" alt="" className="absolute top-23 right-25 w-8 h-8 pointer-events-none z-0" />
      <img src="/hero/big-right-shape.png" alt="" className="absolute bottom-40 right-35 w-120 h-120 pointer-events-none z-0" />
      <img src="/hero/9612bb8477774c46a273a5da0ba3d3f6.png" alt="" className="absolute bottom-65 right-25 w-50 h-40 animate-zoom-in-out" />
      <img ref={card2Ref} src="/hero/Card2.png" alt="" className="absolute bottom-80 right-125 w-40 h-22 will-change-transform" />
      <img
        ref={cardRef}
        src="/hero/Card1.png"
        alt=""
        className="absolute bottom-55 right-140 w-40 h-22 will-change-transform"
      />


      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-6 sm:py-8">
          {/* Left Column: Modern Text & CTA */}
          <div className="lg:col-span-7 z-10 flex flex-col items-start text-left pt-4 sm:pt-0">
            {/* Top Pill / Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-white/90 border border-[#e5e7eb] shadow-sm mb-6 sm:mb-8 backdrop-blur-md transition-all hover:shadow-md">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] text-white text-xs font-bold shadow-2xs">✓</span>
              <span className="text-[#5348e2] font-bold text-xs sm:text-sm tracking-wide">Print Beyond Limits</span>
              <span className="h-3.5 w-[1px] bg-gray-300 mx-1" />
              <span className="text-gray-500 font-medium text-xs sm:text-sm">Trusted By 50K+ Clients</span>
            </div>

            {/* Main Heading */}
            <h1 ref={headingRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-extrabold text-[#111827] tracking-tight leading-[1.15] mb-6 font-sans">
              <div className="flex flex-wrap items-center justify-start gap-x-3 sm:gap-x-4 gap-y-2 mb-2 sm:mb-4">
                <span>Find</span>
                <span className="relative inline-flex items-center px-1">
                  <span
                    ref={typeRef}
                    className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] font-black inline-block"
                  >
                    Modern
                  </span>
                  <span
                    ref={cursorRef}
                    className="inline-block w-1 sm:w-1.5 h-[0.85em] bg-[linear-gradient(180deg,hsla(20,100%,52%,1)_0%,hsla(328,100%,51%,1)_100%)] ml-1 sm:ml-1.5 rounded-full"
                  />
                  <span ref={underlineRef} className="absolute left-0 -bottom-1 w-full h-2 sm:h-3 bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] rounded-full -z-10 opacity-80" />
                </span>
                <span>Printing</span>
              </div>

              <div className="flex flex-wrap items-center justify-start gap-x-3 sm:gap-x-4 gap-y-3">
                {/* Left Pill with + and avatars */}
                <span ref={avatarsPillRef} className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full border-2 border-[#ff387a]/40 bg-white/95 shadow-sm align-middle">
                  <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] leading-none">+</span>
                  <div className="flex -space-x-2.5 overflow-hidden">
                    <img className="inline-block h-6 w-6 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Client 1" />
                    <img className="inline-block h-6 w-6 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Client 2" />
                    <img className="inline-block h-6 w-6 sm:h-8 sm:w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Client 3" />
                  </div>
                </span>

                <span>For Your Brand</span>

                {/* Right Overlapping Circles */}
                <span ref={circlesRef} className="inline-flex items-center ml-1 align-middle">
                  <span className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] text-white shadow-md z-10">
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    </span>
                  </span>
                  <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#ffc107] to-[#ff8a00] text-white shadow-md -ml-3.5 z-0">
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white/70" />
                  </span>
                </span>

                {/* Curved Hand-Drawn Arrow */}
                <span ref={arrowRef} className="inline-block text-[#ff5722] ml-1 align-middle">
                  <svg className="w-10 h-8 sm:w-14 sm:h-10 transform rotate-6" viewBox="0 0 60 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20 Q 25 5, 50 18 M 40 10 L 50 18 L 41 27" stroke="url(#paint0_linear)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="paint0_linear" x1="0" y1="0" x2="60" y2="35" gradientUnits="userSpaceOnUse">
                        <stop stopColor="hsla(20,100%,52%,1)" />
                        <stop offset="1" stopColor="hsla(328,100%,51%,1)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </div>
            </h1>

            {/* Description Text */}
            <p ref={descRef} className="text-[#64748b] text-base sm:text-lg md:text-xl max-w-xl mb-8 sm:mb-10 leading-relaxed font-normal text-left">
              The smartest platform to discover authentic print designs, launch viral
              campaigns, and scale your brand&apos;s physical presence.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-wrap items-center justify-start gap-4 sm:gap-5">
              <a
                href="#services"
                className="inline-flex items-center gap-3 bg-[linear-gradient(90deg,_hsla(20,100%,52%,1)_0%,_hsla(328,100%,51%,1)_100%)] hover:opacity-95 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl shadow-[#ff5722]/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#ff5722] shadow-sm font-black">
                  →
                </span>
                <span>Get Started</span>
              </a>
              <a
                href="#discover"
                className="inline-flex items-center gap-3 bg-white/90 hover:bg-white text-[#5348e2] font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-[#5348e2]/30 shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[linear-gradient(90deg,_hsla(20,100%,52%,1)_0%,_hsla(328,100%,51%,1)_100%)] text-white shadow-sm font-black">
                  →
                </span>
                <span>Get In Touch</span>
              </a>
            </div>

            {/* Bottom Checkmarks Row */}
            <div ref={checksRef} className="flex flex-wrap items-center justify-start gap-4 sm:gap-8 mt-10 sm:mt-12 text-xs sm:text-sm md:text-base font-semibold text-[#334155]">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#6358ee]/15 text-[#6358ee] font-bold text-xs">✓</span>
                <span>10K+ Prints Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#6358ee]/15 text-[#6358ee] font-bold text-xs">✓</span>
                <span>24-48 Hour Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#6358ee]/15 text-[#6358ee] font-bold text-xs">✓</span>
                <span>99% Client Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end z-10">
            <div className="relative w-full max-w-[600px] flex items-center justify-center">
              <img
                src="/hero/Picture2.png"
                alt="Product Design & Printing Catalog - Bottles, Mugs, Business Cards"
                className="w-full h-auto max-h-[460px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
