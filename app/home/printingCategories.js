'use client'

import Link from 'next/link'
import React, { useRef, useState } from 'react'

const categories = [
    {
        id: 1,
        name: 'Visiting Cards',
        image: '/categories/categories (3).webp',
        badge: 'Popular',
        group: 'corporate',
        link: '/visiting-cards'
    },
    {
        id: 3,
        name: 'Banner and Poster',
        image: '/categories/categories (8).jpg',
        group: 'marketing',
        link: '/banner-poster'
    },
    {
        id: 4,
        name: 'Custom T-shirts',
        image: '/categories/categories (6).jpg',
        badge: 'New',
        group: 'apparel',
        link: '/custom-tshirts'
    },
    {
        id: 5,
        name: 'Flex Board',
        image: '/categories/categories (2).png',
        group: 'marketing',
        link: '/flex-board'
    },
    {
        id: 6,
        name: 'Packaging & labeling',
        image: '/categories/categories (9).webp',
        group: 'packaging',
        link: '/packaging-labeling'
    },
    {
        id: 7,
        name: 'Custom Mugs & Drinkware',
        image: '/categories/categories (7).webp',
        group: 'packaging',
        link: '/mugs-drinkware'
    },
    {
        id: 8,
        name: 'Custom Hoodies & Jackets',
        image: '/categories/categories (10).png',
        group: 'apparel',
        link: '/hoodies-jackets'
    },
]



export default function Categories() {
    const scrollRef = useRef(null)
    const [activeFilter, setActiveFilter] = useState('all')

    const filteredCategories = categories.filter(cat => activeFilter === 'all' || cat.group === activeFilter)

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    return (
        <section className="pt-12 sm:pt-16 bg-white relative overflow-hidden border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/section relative">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Printing Service Categories
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base mt-1.5 font-normal">
                            Discover customized print products tailored for your business and personal needs
                        </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <Link
                            href="/printing-categories"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5348e2] hover:text-[#ff5722] transition-colors mr-2"
                        >
                            <span>View All Catalog</span>
                            <span className="font-black">→</span>
                        </Link>
                    </div>
                </div>

                {/* Categories Carousel */}
                <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
                    {/* Floating Right Arrow inside Carousel (matching the screenshot exactly) */}
                    <button
                        onClick={() => scroll('right')}
                        aria-label="Next category slide"
                        className="hidden lg:flex absolute -right-12 top-[38%] -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-white/95 hover:bg-white border border-slate-200 shadow-lg hover:shadow-xl text-slate-700 hover:text-[#5348e2] items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('left')}
                        aria-label="Next category slide"
                        className="hidden lg:flex absolute -left-12 top-[38%] -translate-y-1/2 z-20 w-11 h-11 rounded-xl bg-white/95 hover:bg-white border border-slate-200 shadow-lg hover:shadow-xl text-slate-700 hover:text-[#5348e2] items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Scrollable Track */}
                    <div
                        ref={scrollRef}
                        className="flex items-start gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-6 pt-2 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {filteredCategories.map((cat) => (
                            <a
                                key={cat.id}
                                href={cat.link}
                                className="group flex flex-col items-start shrink-0 w-[140px] sm:w-[170px] md:w-[190px] text-left transition-transform duration-300 select-none"
                            >
                                {/* Square Rounded Image Card */}
                                <div className="w-full aspect-square rounded-2xl border border-slate-200/80 group-hover:border-[#5348e2]/40 bg-white shadow-xs group-hover:shadow-xl transition-all duration-300 relative flex items-center justify-center overflow-hidden transform group-hover:-translate-y-1">
                                    {/* Optional Badge */}
                                    {cat.badge && (
                                        <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-md bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] text-white text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                                            {cat.badge}
                                        </span>
                                    )}

                                    {/* Product Cutout Image */}
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-[100%] h-[100%] object-cover sm:object-contain rounded-lg relative z-10 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-md"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Category Title */}
                                <h3 className="mt-3 sm:mt-3.5 text-xs sm:text-sm md:text-[15px] font-bold text-slate-800 group-hover:text-[#5348e2] transition-colors duration-200 leading-snug line-clamp-2 px-0.5">
                                    {cat.name}
                                </h3>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
