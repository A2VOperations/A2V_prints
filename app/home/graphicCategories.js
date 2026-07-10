'use client'

import Link from 'next/link'
import React, { useRef } from 'react'

const categories = [
    {
        id: 1,
        name: 'Logo & Identity',
        image: 'https://cdn.dribbble.com/userupload/43836191/file/original-b8a0689eac221e7251b6d3003b9b8d4c.png?resize=1504x1127&vertical=center',
        badge: 'Popular',
        link: '/logo-identity-design'
    },
    {
        id: 2,
        name: 'Graphic Design',
        image: 'https://cdn.dribbble.com/userupload/42531516/file/original-c1d3716043e3a426e1e1471197fb08c5.jpg?resize=1504x1177&vertical=center',
        badge: 'Trending',
        link: '/graphic-design'
    },
    {
        id: 3,
        name: 'Web Design',
        image: 'https://cdn.dribbble.com/userupload/41515672/file/original-d7b0d58ba561acc5f345b261493db68b.png?resize=1504x1128&vertical=center',
        badge: 'High ROI',
        link: '/web-design'
    },
    {
        id: 4,
        name: 'Digital Marketing',
        image: 'https://cdn.dribbble.com/userupload/27119923/file/original-c3c1a4ce8d1792261d73e97127530ec6.png?resize=1504x1128&vertical=center',
        badge: 'New',
        link: '/digital-marketing'
    },
    {
        id: 5,
        name: 'Outdoor & Signage',
        image: 'https://cdn.dribbble.com/userupload/46584152/file/4d07c465cf0084c269ac9af4f8cf234d.jpg?resize=1504x1203&vertical=center',
        badge: 'High Impact',
        link: '/outdoor-signage'
    },
    {
        id: 6,
        name: 'Print Design',
        image: 'https://cdn.dribbble.com/userupload/46584152/file/4d07c465cf0084c269ac9af4f8cf234d.jpg?resize=1504x1203&vertical=center',
        badge: 'Best Seller',
        link: '/print-design'
    },
    {
        id: 7,
        name: 'Product & Merchandize',
        image: 'https://cdn.dribbble.com/userupload/46205579/file/2f3e2f7e3469ad598ba64c4bacc0133a.jpg?resize=1504x1128&vertical=center',
        link: '/Product-Merchandize'
    },
    {
        id: 8,
        name: 'Art & Illustration',
        image: 'https://cdn.dribbble.com/userupload/45324630/file/d3979b62cfcf4cf3e4bae37f8e67e578.png?resize=1504x1128&vertical=center',
        link: '/Art-Illustration'
    },
]

export default function Categories() {
    const scrollRef = useRef(null)

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
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Graphic Design Categories
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base mt-1.5 font-normal">
                            Discover customized design services tailored for your business and personal needs
                        </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <Link
                            href="/graphics-categories"
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
                        {categories.map((cat) => (
                            <a
                                key={cat.id}
                                href={cat.link}
                                className="group flex flex-col items-start shrink-0 w-[200px] sm:w-[230px] md:w-[280px] h-[240px] text-left transition-transform duration-300 select-none"
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
                                        className="w-full h-full object-cover sm:object-cover rounded-lg relative z-10 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-md"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Category Title */}
                                <h3 className="mt-3 sm:mt-3.5 text-xs sm:text-sm md:text-[15px] font-bold text-slate-800 group-hover:text-[#5348e2] transition-colors duration-200 leading-snug line-clamp-2 px-0.5 pb-1">
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
