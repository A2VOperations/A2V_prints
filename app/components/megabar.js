'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

const categoriesData = [
    {
        id: 'visiting-cards',
        name: 'Visiting Cards',
        menuType: 'single',
        columns: [
            {
                title: null,
                items: [
                    'Classic Visiting Cards',
                    'Non Tearable Visiting Cards',
                    'PVC Visiting Cards',
                    'Rounded Corner Visiting Cards',
                    'Square Visiting Cards',
                    'Standard Visiting Cards',
                    'Textured Paper Visiting Cards',
                ],
            },
        ],
    },
    {
        id: 'notebooks-diaries',
        name: 'Note Book & Diaries',
        menuType: 'multi',
        columns: [
            {
                title: null,
                items: [
                    'Business Diary with Card Pocket',
                    'Classic Diary',
                    'Cork Cover Diary',
                    'Corporate Diary',
                    'Custom Leather Diary',
                    'Custom Leather Journal',
                    'Customizable Personal Diary',
                    'Diary with Magnetic Lock',
                    'Diary with Wooden Cover',
                    'Elite Work Planner',
                ],
            },
            {
                title: null,
                items: [
                    'Executive Diary',
                    'Hardcover Diary',
                    'Magnetic Strap Diary',
                    'Notepad',
                    'Pearl White Planner Pro',
                    'Personalized Journal',
                    'Premium Corporate Diary',
                    'Premium Office Diary',
                    'Prestige Journal',
                    'Project Planner diary',
                ],
            },
            {
                title: null,
                items: [
                    'Signature Diary',
                    'Spiral Binding Notebook',
                    'Staple Binding Notebook',
                    'Travel Journal',
                    'Urban Cork Pro Diary',
                    'Wooden Finish Diary',
                ],
            },
        ],
    },
    {
        id: 'office-stationery',
        name: 'Office Stationary',
        menuType: 'mega',
        columns: [
            {
                title: 'Office Stationary',
                items: [
                    'Acrylic Medals',
                    'Bookmarks',
                    'Button Badges',
                    'Certificate',
                    'Door Hangers',
                    'Door Name Plates',
                    'Envelope',
                    'Greeting Cards',
                    'Invitation Card',
                    'Keychains',
                    'Letterhead Printing',
                    'Menu Card',
                    'Mouse Pad',
                    'Name Badge Magnet',
                    'Pendrives',
                    'Presentation Folders',
                    'Rubber Stamps',
                    'Self Ink Stamp',
                    'Tent Card',
                    'Thank You card',
                ],
            },
            {
                title: 'Desk Organizers',
                items: [
                    'Gold Plated Mobile & Stationary Holder with Clock & Calendar',
                    'Wooden Mobile & Stationary Holder with Analog clock & Calendar',
                    'Wooden Pen Stand with Clock',
                    'Wooden Phone & Card Holder with Pen Stand & Clock',
                    'Wooden Phone & Pen Holder With Calendar & Clock',
                    'Wooden Phone & Pen Holder with Calendar Blocks',
                ],
            },
            {
                title: 'ID cards & Accessories',
                items: [
                    'ID Card Holders',
                    'Lanyards',
                    'PVC Id Card Printing',
                    'Retractable Card Holder',
                ],
            },
            {
                title: 'Pens',
                items: [
                    'AeroWhite Pen',
                    'Arrow Signature Pen',
                    'BizNote Pen',
                    'BlackEdge Pen',
                    'BlackFusion Executive Pen',
                    'Blackmist Pen',
                    'BlueNova Pen',
                    'CedarTouch Executive Pen',
                    'CorkCraft Pen',
                    'Corporate Heritage Ballpoint pen',
                    'Creamline Classic Pen',
                    'Darkedge Glossy Pen',
                    'Show all',
                ],
            },
            {
                title: 'Printed Bags',
                items: [
                    'CarryLite Bag',
                    'Custom Backpack',
                    'Custom Paper Bags',
                    'FleXplore Backpack',
                    'Gridlock Backpack',
                    'Laptop Bags',
                    'Odyssey Backpack',
                    'ShieldPro Anti-Theft Laptop Bag',
                    'TinyTrove Pouch Bag',
                    'Tote bags',
                    'Wayfarer Backpack',
                    'Zenith Backpack',
                ],
            },
            {
                title: 'Welcome Kit',
                items: [
                    '3 in 1 Drinkware Combo',
                    '5 in 1 Premium Corporate Gift Set',
                    'Corporate Welcome Box',
                    'Diary Pen Combo',
                    'Executive Combo Box',
                    'Fusion Combo',
                    'Luxury Diary and Pen Set',
                    'New Hire Starter Kit',
                    'New Hire Swag Box',
                    'New Joinee Kit',
                    'Office Welcome Kit',
                    'Signature Series Combo',
                    'Summit Selection Combo',
                    'Superior Combo Box',
                ],
            },
        ],
    },
    {
        id: 'mugs-bottles',
        name: 'Mugs, Water bottles & Tumblers',
        menuType: 'mega',
        columns: [
            {
                title: 'Custom Mugs',
                items: [
                    'Bamboo Mug',
                    'Black Coffee Mugs',
                    'Cork Base Mug',
                    'Crystal Flip Coffee Mug',
                    'Double Colour Mugs',
                    'Edge Grip Stainless Steel Mug',
                    'Insulated Coffee Mug',
                    'Magic Mugs',
                    'Nature Sip Rice Husk Mug',
                    'Photo Cup',
                ],
            },
            {
                title: null,
                items: [
                    'Silicone Coffee mug',
                    'SmartTemp LED Coffee Mug',
                    'Stainless Steel Coffee mug',
                    'Travel Mug',
                    'Urban Sip Handleless Mug',
                    'Urban Steel Mug',
                ],
            },
            {
                title: 'Custom Tumblers',
                items: [
                    'CoolSphere water tumbler',
                    'DualTone steel insulated tumbler',
                    'Hot and Cold Water Tumbler',
                    'PrimeGrip Water Tumbler',
                    'ThermoNova Water Tumbler',
                    'UrbanCore water Tumbler',
                ],
            },
            {
                title: 'Custom Water Bottles',
                items: [
                    'Aero Steel water bottle',
                    'Aqua Luxe Water Bottle',
                    'Bamboo Flask Water Bottle',
                    'BlackEdge Steel Water Bottle',
                    'BlackFit Hydration water Bottle',
                    'Boho Hot & Cold Sports Bottle',
                    'Cap Based Lid Water Bottles',
                    'Carabiner Water Bottles',
                    'Cola Curve Flask',
                    'DualTemp thermal Bottle',
                    'Earthy Cool Sports Water Bottle',
                    'Echo Stainless Steel Sports Bottle',
                    'Finix Stainless Steel Sports Bottle',
                    'FlowCore Straight Water Bottle',
                    'Grip Flow Water Bottle',
                    'H2Oasis Custom Vacuum Water Bottle',
                    'Heat Lock Signature Flask',
                    'Show all',
                ],
            },
        ],
    },
    {
        id: 'tshirts-hoodies',
        name: 'T-shirts, Caps & Hoodies',
        menuType: 'mega',
        columns: [
            {
                title: 'Caps',
                items: [
                    'Custom Caps',
                    'Panama Hats',
                    'Paper Birthday caps',
                    'Paper Caps',
                ],
            },
            {
                title: 'Custom-T Shirts',
                items: [
                    'Base Polo T-Shirt',
                    'Drift Polo T-Shirt',
                    'Duo Stripe Polo T-Shirt',
                    'Luxe Polo T-Shirt',
                    'Mono Crew Tee',
                    'Neo Polo T-Shirt',
                    'Polo T-Shirts',
                    'Premium Polo T-Shirts',
                ],
            },
            {
                title: null,
                items: [
                    'Round Neck T-Shirts',
                    'Sports T-Shirts',
                    'Twin Edge Polo T-Shirt',
                ],
            },
            {
                title: 'Winter Wear',
                items: [
                    'Custom Hoodies',
                    'Custom Jackets',
                    'I Dry Jacket',
                    'JSLV-Jacket',
                ],
            },
        ],
    },
    {
        id: 'signs-posters',
        name: 'Signs, Posters & Marketing Materials',

        menuType: 'single',
        columns: [
            {
                title: null,
                items: [
                    'Banners',
                    'Booklet',
                    'Custom Posters',
                    'Dangler',
                    'Flyers',
                    'Standee',
                ],
            },
        ],
    },
    {
        id: 'labels-stickers',
        name: 'Labels, Stickers & Packaging',
        menuType: 'single',
        columns: [
            {
                title: null,
                items: [
                    'Glass Sticker',
                    'Labels',
                    'Name Stickers',
                ],
            },
        ],
    },
    {
        id: 'all-custom',
        name: 'All Custom Products',
        menuType: 'mega',
        columns: [
            {
                title: null,
                items: [
                    '3 in 1 Drinkware Combo',
                    '5 in 1 Premium Corporate Gift Set',
                    'Acrylic Clocks',
                    'Acrylic Medals',
                    'Acrylic Photo Frames',
                    'Aero Steel water bottle',
                    'AeroWhite Pen',
                    'Aqua Luxe Water Bottle',
                    'Arrow Signature Pen',
                    'Bamboo Flask Water Bottle',
                    'Bamboo Mug',
                ],
            },
            {
                title: null,
                items: [
                    'Banners',
                    'Base Polo T-Shirt',
                    'BizNote Pen',
                    'Black Coffee Mugs',
                    'BlackEdge Pen',
                    'BlackEdge Steel Water Bottle',
                    'BlackFit Hydration water Bottle',
                    'BlackFusion Executive Pen',
                    'Blackmist Pen',
                    'BlueNova Pen',
                    'Boho Hot & Cold Sports Bottle',
                ],
            },
            {
                title: null,
                items: [
                    'Booklet',
                    'Bookmarks',
                    'Business Diary with Card Pocket',
                    'Button Badges',
                    'Canvas Photo Frame',
                    'Cap Based Lid Water Bottles',
                    'Carabiner Water Bottles',
                    'CarryLite Bag',
                    'CedarTouch Executive Pen',
                    'Certificate',
                    'Classic Diary',
                ],
            },
            {
                title: null,
                items: [
                    'Classic Visiting Cards',
                    'Coasters',
                    'Cola Curve Flask',
                    'CoolSphere water tumbler',
                    'Cork Base Mug',
                    'Cork Cover Diary',
                    'CorkCraft Pen',
                    'Corporate Diary',
                    'Corporate Heritage Ballpoint pen',
                    'Corporate Welcome Box',
                    'Creamline Classic Pen',
                ],
            },
            {
                title: null,
                items: [
                    'Crystal Flip Coffee Mug',
                    'Custom Backpack',
                    'Custom Caps',
                    'Custom Fridge Magnets',
                    'Custom Hoodies',
                    'Custom Jackets',
                    'Custom Leather Diary',
                    'Custom Leather Journal',
                    'Custom Paper Bags',
                    'Custom Posters',
                    'Show all',
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

        let width = 280
        if (count === 2) width = 460
        else if (count === 3) width = 680
        else if (count === 4) width = 880
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

    const handleCategoryInteraction = (catId, isClick = false, e = null) => {
        // On touch devices/mobile (< 1024px), ignore hover events so click manages toggle reliably
        if (!isClick && !isDesktop) {
            return
        }
        if (isClick && activeCategory === catId) {
            setActiveCategory(null)
            return
        }
        if (isClick && e && e.currentTarget && scrollContainerRef.current) {
            e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
        setActiveCategory(catId)
        updateDropdownPosition(catId, isDesktop)
    }

    // Helper to determine dropdown grid columns dynamically based on screen size
    const getGridClasses = (columnsCount) => {
        if (columnsCount === 1) return 'grid-cols-1'
        if (columnsCount === 2) return 'grid-cols-1 sm:grid-cols-2'
        if (columnsCount === 3) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
        if (columnsCount === 4) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        if (columnsCount === 5) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
        if (columnsCount === 6) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
        if (columnsCount === 7) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7'
        if (columnsCount === 8) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8'
    }

    return (
        <div
            ref={navRef}
            className="w-full bg-white border-b border-gray-200 shadow-xs relative z-30 select-none font-sans"
            onMouseLeave={() => isDesktop && setActiveCategory(null)}
        >
            {/* Categories Horizontal Bar */}
            <div className="w-full  mx-auto  relative group/bar">
                {/* Left Scroll Arrow */}
                {canScrollLeft && (
                    <div className="absolute left-0 top-0 bottom-0 flex items-center pl-1 pr-4 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-auto">
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
                                onMouseEnter={(e) => handleCategoryInteraction(cat.id, false, e)}
                                onClick={(e) => handleCategoryInteraction(cat.id, true, e)}
                                className={`flex flex-col items-center justify-between px-2 sm:px-2 py-2 rounded-t-xl transition-all cursor-pointer shrink-0 min-w-max group relative border-b-2 ${isActive
                                        ? 'border-[#e53e3e] text-gray-950 font-bold bg-gradient-to-b from-red-50/60 to-red-50/20 shadow-xs'
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
                    <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-1 pl-4 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-auto">
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
                    className="absolute top-full left-0 right-0 lg:left-auto lg:right-auto bg-white/98 backdrop-blur-md shadow-2xl border-t border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 border-b border-gray-200/80 rounded-b-2xl max-h-[75vh] lg:max-h-[80vh] overflow-y-auto lg:overflow-visible no-scrollbar"
                >
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
                        {/* Mobile / Tablet Header inside Dropdown */}
                        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-gray-100 lg:hidden">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-[#e53e3e] rounded-full inline-block"></span>
                                <h3 className="font-bold text-gray-900 text-sm sm:text-base tracking-tight">
                                    {activeData.name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveCategory(null)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-950 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
                                aria-label="Close menu"
                            >
                                <span>Close</span>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Grid of Columns/Sections */}
                        <div className={`grid gap-5 sm:gap-7 ${getGridClasses(processedColumns.length)}`}>
                            {processedColumns.map((col, idx) => (
                                <div key={idx} className="flex flex-col">
                                    {col.title ? (
                                        <h4 className="font-bold text-[#1a1f36] text-xs sm:text-[13px] uppercase tracking-wider mb-2.5 sm:mb-3 pb-1.5 border-b border-gray-100 line-clamp-1 flex items-center justify-between">
                                            <span>{col.title}</span>
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-normal lg:hidden">
                                                {col.items.length}
                                            </span>
                                        </h4>
                                    ) : col.isSplitContinuation ? (
                                        <h4 className="font-bold text-transparent text-xs sm:text-[13px] tracking-normal mb-2.5 sm:mb-3 pb-1.5 border-b border-transparent select-none pointer-events-none line-clamp-1 hidden lg:block" aria-hidden="true">
                                            &nbsp;
                                        </h4>
                                    ) : null}
                                    <ul className="space-y-1 sm:space-y-1.5">
                                        {col.items.map((item, itemIdx) => {
                                            const isShowAll = item.toLowerCase() === 'show all'
                                            return (
                                                <li key={itemIdx}>
                                                    <a
                                                        href="#"
                                                        onClick={() => setActiveCategory(null)}
                                                        className={`block text-xs sm:text-[13px] transition-all duration-150 py-1 sm:py-0.5 px-1.5 -mx-1.5 rounded-lg ${isShowAll
                                                                ? 'text-[#1976d2] font-semibold hover:underline pt-1.5 flex items-center gap-1'
                                                                : 'text-[#4a5568] hover:text-[#e53e3e] hover:bg-red-50/40 hover:translate-x-1 font-normal'
                                                            }`}
                                                    >
                                                        <span>{item}</span>
                                                        {isShowAll && (
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        )}
                                                    </a>
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
