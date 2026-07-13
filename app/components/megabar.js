'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

const categoriesData = [
    {
        id: 'visiting-cards',
        name: 'Visiting Cards',
        href: '/visiting-cards',
        menuType: 'mega',
        columns: [
            {
                title: 'Standard & Classic Cards',
                href: '/visiting-cards',
                items: [
                    { name: 'Standard Visiting Cards', href: '/visiting-cards/1' },
                    { name: 'Rounded Corner Cards', href: '/visiting-cards/2' },
                    { name: 'Square Cards', href: '/visiting-cards/3' },
                    { name: 'Gloss Coated Cards', href: '/visiting-cards/7' },
                ],
            },
            {
                title: 'Premium & Luxury Cards',
                href: '/visiting-cards',
                items: [
                    { name: 'Spot UV Cards', href: '/visiting-cards/4' },
                    { name: 'Metallic Foil Cards', href: '/visiting-cards/5' },
                    { name: 'Ultra-Thick Painted Edge', href: '/visiting-cards/6' },
                ],
            },
        ],
    },
    {
        id: 'banner-poster',
        name: 'Banner & Poster',
        href: '/banner-poster',
        menuType: 'mega',
        columns: [
            {
                title: 'Outdoor & Flex Banners',
                href: '/banner-poster',
                items: [
                    { name: 'Heavy-Duty Vinyl Banner', href: '/banner-poster/1' },
                    { name: 'Backlit Star Flex Banner', href: '/banner-poster/4' },
                    { name: 'Windproof Mesh Banner', href: '/banner-poster/7' },
                ],
            },
            {
                title: 'Stands & Backdrops',
                href: '/banner-poster',
                items: [
                    { name: 'Retractable Roll-Up Stand', href: '/banner-poster/2' },
                    { name: 'Fabric Satin Event Banner', href: '/banner-poster/5' },
                    { name: 'Step & Repeat Photo Backdrop', href: '/banner-poster/8' },
                ],
            },
            {
                title: 'Posters & Art Prints',
                href: '/banner-poster',
                items: [
                    { name: 'High-Gloss Promo Poster A1', href: '/banner-poster/3' },
                    { name: 'Matte Finish Poster A2', href: '/banner-poster/6' },
                ],
            },
        ],
    },
    {
        id: 'flex-board',
        name: 'Flex Board & Signage',
        href: '/flex-board',
        menuType: 'mega',
        columns: [
            {
                title: 'Glow Signs & Storefronts',
                href: '/flex-board',
                items: [
                    { name: 'Standard Shop Frontlit Flex', href: '/flex-board/1' },
                    { name: 'LED Backlit Glow Sign Board', href: '/flex-board/2' },
                    { name: 'Heavy Iron Box Frame Hoarding', href: '/flex-board/3' },
                    { name: '3D Acrylic Letter LED Board', href: '/flex-board/4' },
                ],
            },
            {
                title: 'Boards & Panels',
                href: '/flex-board',
                items: [
                    { name: 'Vinyl Printed Sunboard Sign', href: '/flex-board/5' },
                    { name: 'Reflective Night-Glow Highway', href: '/flex-board/6' },
                    { name: 'Double-Sided Pole Mount Flex', href: '/flex-board/7' },
                    { name: 'Wooden Framed Exhibition Panel', href: '/flex-board/8' },
                ],
            },
        ],
    },
    {
        id: 'packaging-labeling',
        name: 'Packaging & Labeling',
        href: '/packaging-labeling',
        menuType: 'mega',
        columns: [
            {
                title: 'Custom Boxes & Pouches',
                href: '/packaging-labeling',
                items: [
                    { name: 'Corrugated Shipping Box', href: '/packaging-labeling/1' },
                    { name: 'Luxury Rigid Gift Box', href: '/packaging-labeling/4' },
                    { name: 'Standup Zip-Lock Food Pouch', href: '/packaging-labeling/6' },
                    { name: 'Heavy Industrial Carton Box', href: '/packaging-labeling/8' },
                ],
            },
            {
                title: 'Bags, Labels & Stickers',
                href: '/packaging-labeling',
                items: [
                    { name: 'Waterproof Vinyl Bottle Labels', href: '/packaging-labeling/2' },
                    { name: 'Kraft Paper Shopping Bags', href: '/packaging-labeling/3' },
                    { name: 'Holographic Foil Stickers', href: '/packaging-labeling/5' },
                    { name: 'Custom Printed Wrapping Tissue', href: '/packaging-labeling/7' },
                ],
            },
        ],
    },
    {
        id: 'logo-identity-design',
        name: 'Logo & Identity',
        href: '/logo-identity-design',
        menuType: 'mega',
        columns: [
            {
                title: 'Brand Identity & Logos',
                href: '/logo-identity-design',
                items: [
                    { name: 'Logo Design Suite', href: '/logo-identity-design' },
                    { name: 'Brand Identity & Strategy', href: '/logo-identity-design' },
                    { name: 'Brand Guidelines & Stylebook', href: '/logo-identity-design' },
                    { name: 'Rebranding & Logo Upgrade', href: '/logo-identity-design' },
                ],
            },
            {
                title: 'Corporate Stationery',
                href: '/logo-identity-design',
                items: [
                    { name: 'Professional Business Cards', href: '/logo-identity-design' },
                    { name: 'Official Corporate Letterhead', href: '/logo-identity-design' },
                    { name: 'Envelopes & Presentation Folders', href: '/logo-identity-design' },
                    { name: 'Corporate ID Cards & Badges', href: '/logo-identity-design' },
                ],
            },
        ],
    },
    {
        id: 'graphic-design',
        name: 'Graphic Design',
        href: '/graphic-design',
        menuType: 'mega',
        columns: [
            {
                title: 'Vector & Digital Artwork',
                href: '/graphic-design',
                items: [
                    { name: 'Vector Tracing & Redraw', href: '/graphic-design' },
                    { name: 'Custom Infographics Layout', href: '/graphic-design' },
                    { name: 'Custom Icon Packs', href: '/graphic-design' },
                    { name: 'Social Media Branding Kit', href: '/graphic-design' },
                ],
            },
            {
                title: 'Visual & 3D Design',
                href: '/graphic-design',
                items: [
                    { name: 'Presentation & Pitch Deck', href: '/graphic-design' },
                    { name: 'Podcast Cover Artwork', href: '/graphic-design' },
                    { name: '3D Product Modeling & Rendering', href: '/graphic-design' },
                    { name: 'Photo Manipulation & Editing', href: '/graphic-design' },
                ],
            },
        ],
    },
    {
        id: 'web-design',
        name: 'Web Design',
        href: '/web-design',
        menuType: 'mega',
        columns: [
            {
                title: 'UI/UX & Web Interfaces',
                href: '/web-design',
                items: [
                    { name: 'Custom Website UI/UX Design', href: '/web-design' },
                    { name: 'Mobile App UI/UX Layout', href: '/web-design' },
                    { name: 'High-Converting Landing Pages', href: '/web-design' },
                    { name: 'E-Commerce Storefront Design', href: '/web-design' },
                ],
            },
            {
                title: 'Digital Templates',
                href: '/web-design',
                items: [
                    { name: 'Responsive Email Newsletter UI', href: '/web-design' },
                    { name: 'Admin Dashboard & Web App UI', href: '/web-design' },
                    { name: 'Interactive Wireframing & Prototyping', href: '/web-design' },
                ],
            },
        ],
    },
    {
        id: 'print-design',
        name: 'Print Design',
        href: '/print-design',
        menuType: 'mega',
        columns: [
            {
                title: 'Marketing Collateral',
                href: '/print-design',
                items: [
                    { name: 'Flyers & Promotional Leaflets', href: '/print-design' },
                    { name: 'Bi-Fold & Tri-Fold Brochures', href: '/print-design' },
                    { name: 'Restaurant Menu & Table Cards', href: '/print-design' },
                ],
            },
            {
                title: 'Corporate & Editorial',
                href: '/print-design',
                items: [
                    { name: 'Multi-Page Product Catalogs', href: '/print-design' },
                    { name: 'Corporate Annual Reports', href: '/print-design' },
                    { name: 'Custom Invitations & Greeting Cards', href: '/print-design' },
                ],
            },
        ],
    },

    {
        id: 'Art-Illustration',
        name: 'Art & Illustration',
        href: '/Art-Illustration',
        menuType: 'mega',
        columns: [
            {
                title: 'Custom Illustrations',
                href: '/Art-Illustration',
                items: [
                    { name: 'Bespoke Vector Illustration', href: '/Art-Illustration' },
                    { name: 'Brand Mascot & Characters', href: '/Art-Illustration' },
                    { name: 'Custom Digital Concept Art', href: '/Art-Illustration' },
                ],
            },
            {
                title: 'Editorial & Artistic Artwork',
                href: '/Art-Illustration',
                items: [
                    { name: 'Book & Magazine Cover Art', href: '/Art-Illustration' },
                    { name: 'Custom Tattoo & Creative Artwork', href: '/Art-Illustration' },
                    { name: 'Storyboard & Comic Illustrations', href: '/Art-Illustration' },
                ],
            },
        ],
    },
    {
        id: 'graphics-categories',
        name: 'All Categories',
        href: '/graphics-categories',
        menuType: 'mega',
        columns: [
            {
                title: 'Print Product Catalog',
                href: '/graphics-categories',
                items: [
                    { name: 'Visiting Cards Catalog', href: '/visiting-cards' },
                    { name: 'Banner & Poster Printing', href: '/banner-poster' },
                    { name: 'Custom T-shirts & Apparel', href: '/custom-tshirts' },
                    { name: 'Flex Boards & Glow Signage', href: '/flex-board' },
                    { name: 'Packaging, Boxes & Labels', href: '/packaging-labeling' },
                    { name: 'Custom Mugs & Drinkware', href: '/mugs-drinkware' },
                    { name: 'Hoodies & Winter Jackets', href: '/hoodies-jackets' },
                ],
            },
            {
                title: 'Creative & Graphic Services',
                href: '/graphics-categories',
                items: [
                    { name: 'Logo & Brand Identity', href: '/logo-identity-design' },
                    { name: 'Graphic Design Artwork', href: '/graphic-design' },
                    { name: 'Web & UI/UX Design', href: '/web-design' },
                    { name: 'Digital Marketing Creatives', href: '/digital-marketing' },
                    { name: 'Outdoor & Retail Signage', href: '/outdoor-signage' },
                    { name: 'Print Layout & Brochures', href: '/print-design' },
                    { name: 'Product Merchandize Design', href: '/Product-Merchandize' },
                    { name: 'Art & Custom Illustration', href: '/Art-Illustration' },
                ],
            },
        ],
    },
]

export default function Megabar() {
    const [activeCategory, setActiveCategory] = useState(null)
    const [dropdownStyle, setDropdownStyle] = useState({ left: '0px', width: '100%' })
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const [isDesktop, setIsDesktop] = useState(true)

    const router = useRouter()
    const pathname = usePathname()
    const navRef = useRef(null)
    const scrollContainerRef = useRef(null)

    const activeData = categoriesData.find((cat) => cat.id === activeCategory)

    // Helper to automatically split columns exceeding threshold on desktop
    const getProcessedColumns = (columns, maxItems = 14) => {
        if (!columns) return []
        const processed = []
        columns.forEach((col) => {
            if (col.items && col.items.length > maxItems) {
                const numChunks = Math.ceil(col.items.length / maxItems)
                const itemsPerChunk = Math.ceil(col.items.length / numChunks)
                for (let i = 0; i < col.items.length; i += itemsPerChunk) {
                    processed.push({
                        title: i === 0 ? col.title : null,
                        href: col.href,
                        isSplitContinuation: i > 0,
                        items: col.items.slice(i, i + itemsPerChunk),
                    })
                }
            } else {
                processed.push({ ...col, isSplitContinuation: false })
            }
        })
        return processed
    }

    // Calculate position: full width on mobile/tablet, aligned dropdown on desktop
    const updateDropdownPosition = useCallback((catId, currentIsDesktop) => {
        if (!catId || !navRef.current) return

        if (!currentIsDesktop && typeof window !== 'undefined' && window.innerWidth < 1024) {
            setDropdownStyle({
                left: '0px',
                width: '100%',
            })
            return
        }

        const navRect = navRef.current.getBoundingClientRect()
        const btnElement = navRef.current.querySelector(`[data-category-id="${catId}"]`)
        if (!btnElement) return

        const btnRect = btnElement.getBoundingClientRect()
        const catObj = categoriesData.find((c) => c.id === catId)
        const cols = getProcessedColumns(catObj?.columns, 14)
        const count = cols.length

        let width = 320
        if (count === 2) width = 540
        else if (count === 3) width = 760
        else if (count === 4) width = 960
        else if (count >= 5) width = Math.min(1100, navRect.width - 32)

        let left = btnRect.left - navRect.left

        // If menu extends past right edge of the nav, shift it left so it aligns with right edge
        if (left + width > navRect.width - 16) {
            left = Math.max(16, navRect.width - width - 16)
        }

        setDropdownStyle({
            left: `${left}px`,
            width: `${width}px`,
        })
    }, [])

    // Check viewport width and update desktop status
    useEffect(() => {
        const checkViewport = () => {
            const desktop = window.innerWidth >= 1024
            setIsDesktop(desktop)
            if (activeCategory) {
                updateDropdownPosition(activeCategory, desktop)
            }
        }
        checkViewport()
        window.addEventListener('resize', checkViewport)
        return () => window.removeEventListener('resize', checkViewport)
    }, [activeCategory, updateDropdownPosition])

    // Check horizontal scroll possibilities
    const checkScroll = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setCanScrollLeft(scrollLeft > 10)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }, [])

    useEffect(() => {
        checkScroll()
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', checkScroll, { passive: true })
            window.addEventListener('resize', checkScroll)
            return () => {
                container.removeEventListener('scroll', checkScroll)
                window.removeEventListener('resize', checkScroll)
            }
        }
    }, [checkScroll])

    const scrollCategories = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -250 : 250
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    // Handle outside clicks/touches to close dropdown on mobile/tablet/desktop
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setActiveCategory(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [])

    // On mobile/tablet (< 1024px), use maxItems=100 so sections aren't artificially split
    const processedColumns = activeData
        ? getProcessedColumns(activeData.columns, isDesktop ? 14 : 100)
        : []

    const handleCategoryInteraction = (cat, isClick = false, e = null) => {
        // On touch devices/mobile (< 1024px), ignore hover events so click manages toggle reliably
        if (!isClick && !isDesktop) {
            return
        }
        if (isClick && activeCategory === cat.id) {
            // If already open or clicked on desktop, navigate directly to category page
            if (cat.href) {
                router.push(cat.href)
            }
            setActiveCategory(null)
            return
        }
        if (isClick && e && e.currentTarget && scrollContainerRef.current) {
            e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
        setActiveCategory(cat.id)
        updateDropdownPosition(cat.id, isDesktop)
    }

    // Helper to determine dropdown grid columns dynamically based on screen size
    const getGridClasses = (columnsCount) => {
        if (columnsCount === 1) return 'grid-cols-1'
        if (columnsCount === 2) return 'grid-cols-1 sm:grid-cols-2'
        if (columnsCount === 3) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
        if (columnsCount === 4) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        if (columnsCount >= 5) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
    }

    if (pathname && pathname.startsWith('/admin')) return null;

    return (
        <div
            ref={navRef}
            className="w-full bg-white border-b border-gray-200 shadow-xs relative z-30 select-none font-sans"
            onMouseLeave={() => isDesktop && setActiveCategory(null)}
        >
            {/* Categories Horizontal Bar */}
            <div className="w-full mx-auto relative group/bar">
                {/* Left Scroll Arrow */}
                {canScrollLeft && (
                    <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1 pr-4 bg-linear-to-r from-white via-white/90 to-transparent z-10 pointer-events-auto">
                        <button
                            type="button"
                            onClick={() => scrollCategories('left')}
                            aria-label="Scroll left"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-200 shadow-md hover:border-gray-300 hover:scale-105 flex items-center justify-center text-gray-700 hover:text-gray-950 transition-all cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Scrollable Categories List */}
                <div
                    ref={scrollContainerRef}
                    className="flex items-center justify-start lg:justify-center gap-1 sm:gap-2 md:gap-3 overflow-x-auto no-scrollbar py-2 scroll-smooth"
                >
                    {categoriesData.map((cat) => {
                        const isActive = activeCategory === cat.id
                        return (
                            <button
                                key={cat.id}
                                data-category-id={cat.id}
                                type="button"
                                onMouseEnter={(e) => handleCategoryInteraction(cat, false, e)}
                                onClick={(e) => handleCategoryInteraction(cat, true, e)}
                                className={`flex flex-col items-center justify-between px-2.5 sm:px-2 py-2 rounded-t-xl transition-all cursor-pointer shrink-0 min-w-max group relative border-b-2 ${isActive
                                        ? 'border-[#e53e3e] text-gray-950 font-bold bg-linear-to-b from-red-50/60 to-red-50/20 shadow-xs'
                                        : 'border-transparent text-gray-700 hover:text-gray-950 hover:border-gray-300 hover:bg-gray-50/60 font-medium'
                                    }`}
                            >
                                <span className="text-xs sm:text-[13px] text-center leading-tight whitespace-nowrap">
                                    {cat.name}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Right Scroll Arrow */}
                {canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-1 pl-4 bg-linear-to-l from-white via-white/90 to-transparent z-10 pointer-events-auto">
                        <button
                            type="button"
                            onClick={() => scrollCategories('right')}
                            aria-label="Scroll right"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-gray-200 shadow-md hover:border-gray-300 hover:scale-105 flex items-center justify-center text-gray-700 hover:text-gray-950 transition-all cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Mega Menu Dropdown Positioned Below Hovered/Clicked Category */}
            {activeData && (
                <div
                    style={dropdownStyle}
                    className="absolute top-full left-0 right-0 lg:left-auto lg:right-auto bg-white/98 backdrop-blur-md shadow-2xl border-t border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 border-b rounded-b-2xl max-h-[75vh] lg:max-h-[80vh] overflow-y-auto lg:overflow-visible no-scrollbar"
                >
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                        {/* Header bar inside Dropdown for all screen sizes */}
                        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-[#e53e3e] rounded-full inline-block"></span>
                                <h3 className="font-extrabold text-gray-900 text-sm sm:text-base tracking-tight">
                                    {activeData.name}
                                </h3>
                            </div>
                            <div className="flex items-center gap-3">
                                {activeData.href && (
                                    <Link
                                        href={activeData.href}
                                        onClick={() => setActiveCategory(null)}
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e53e3e] hover:text-[#c53030] bg-red-50 hover:bg-red-100/80 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
                                    >
                                        <span>Explore Full Category</span>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setActiveCategory(null)}
                                    className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-950 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95 lg:hidden"
                                    aria-label="Close menu"
                                >
                                    <span>Close</span>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Grid of Columns/Sections */}
                        <div className={`grid gap-5 sm:gap-7 ${getGridClasses(processedColumns.length)}`}>
                            {processedColumns.map((col, idx) => (
                                <div key={idx} className="flex flex-col">
                                    {col.title ? (
                                        <div className="mb-2.5 sm:mb-3 pb-1.5 border-b border-gray-100 flex items-center justify-between">
                                            {col.href ? (
                                                <Link
                                                    href={col.href}
                                                    onClick={() => setActiveCategory(null)}
                                                    className="font-bold text-[#1a1f36] hover:text-[#e53e3e] text-xs sm:text-[13px] uppercase tracking-wider line-clamp-1 transition-colors"
                                                >
                                                    {col.title}
                                                </Link>
                                            ) : (
                                                <h4 className="font-bold text-[#1a1f36] text-xs sm:text-[13px] uppercase tracking-wider line-clamp-1">
                                                    {col.title}
                                                </h4>
                                            )}
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-normal lg:hidden">
                                                {col.items.length}
                                            </span>
                                        </div>
                                    ) : col.isSplitContinuation ? (
                                        <h4 className="font-bold text-transparent text-xs sm:text-[13px] tracking-normal mb-2.5 sm:mb-3 pb-1.5 border-b border-transparent select-none pointer-events-none line-clamp-1 hidden lg:block" aria-hidden="true">
                                            &nbsp;
                                        </h4>
                                    ) : null}
                                    <ul className="space-y-1 sm:space-y-1.5">
                                        {col.items.map((item, itemIdx) => {
                                            const itemText = typeof item === 'object' ? item.name : item
                                            const itemHref = typeof item === 'object' ? item.href : '#'
                                            return (
                                                <li key={itemIdx}>
                                                    <Link
                                                        href={itemHref}
                                                        onClick={() => setActiveCategory(null)}
                                                        className="block text-xs sm:text-[13px] transition-all duration-150 py-1 sm:py-0.5 px-1.5 -mx-1.5 rounded-lg text-[#4a5568] hover:text-[#e53e3e] hover:bg-red-50/40 hover:translate-x-1 font-normal"
                                                    >
                                                        <span>{itemText}</span>
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

