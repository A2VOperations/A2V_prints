'use client'

import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'

const categories = [
    'Category',
    'All Products',
    'T-Shirts & Apparel',
    'Mugs & Drinkware',
    'Business Cards',
    'Banners & Signs',
    'Stickers & Labels',
    'Promotional Items',
]

export default function Navbar() {
    const [selectedCategory, setSelectedCategory] = useState(categories[0])
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [wishlistCount, setWishlistCount] = useState(0)
    const [cartCount, setCartCount] = useState(0)
    const categoryRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        // Optional: handle search trigger
    }

    return (
        <nav className="w-full bg-[#f5f6fb] border-b border-gray-200/60 py-4 px-4 sm:px-6 lg:px-8 select-none sticky top-0 z-40 shadow-xs">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 md:gap-8">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 cursor-pointer shrink-0 group">
                    <div className="w-10 h-10 rounded-full bg-[linear-gradient(90deg,hsla(20,100%,52%,1)_0%,hsla(328,100%,51%,1)_100%)] flex items-center justify-center shadow-md shadow-purple-500/20 text-white font-extrabold text-xl tracking-tighter group-hover:scale-105 transition-transform duration-200">
                        <span className="translate-y-[-1px]">P</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#111827]">
                        Printop
                    </span>
                </Link>

                {/* Search Bar (Desktop / Tablet) */}
                <form
                    onSubmit={handleSearch}
                    className="flex-1 max-w-2xl hidden md:block"
                >
                    <div className="flex items-center bg-white rounded-full border border-gray-200/80 shadow-sm p-1 pl-4 hover:border-gray-300 focus-within:border-[#9842dc] focus-within:ring-2 focus-within:ring-[#9842dc]/20 transition-all">
                        {/* Category Dropdown */}
                        <div className="relative shrink-0" ref={categoryRef}>
                            <button
                                type="button"
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 py-1.5 focus:outline-none cursor-pointer"
                            >
                                <span>{selectedCategory}</span>
                                <svg
                                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Category Dropdown Menu */}
                            {isCategoryOpen && (
                                <div className="absolute left-0 mt-3 w-52 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50 text-gray-700 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategory(cat)
                                                setIsCategoryOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer flex items-center justify-between ${selectedCategory === cat
                                                    ? 'bg-purple-50 text-[#9842dc] font-semibold'
                                                    : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            <span>{cat}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vertical Divider */}
                        <div className="h-5 w-[1px] bg-gray-200 mx-3 shrink-0" />

                        {/* Input */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search here..."
                            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none pr-3"
                        />

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="bg-[linear-gradient(90deg,hsla(20,100%,52%,1)_0%,hsla(328,100%,51%,1)_100%)] hover:opacity-95 text-white text-sm font-medium px-7 py-2 rounded-full shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Right Section: Hotline & Action Icons */}
                <div className="flex items-center gap-4 sm:gap-6 ml-auto md:ml-0 shrink-0">
                    {/* Hotline Info */}
                    <div className="flex items-center gap-3 shrink-0">
                        <a
                            href="tel:196475"
                            className="w-11 h-11 rounded-full bg-white border border-gray-200/80 shadow-sm flex items-center justify-center text-gray-700 shrink-0 hover:border-[#9842dc] hover:text-[#9842dc] hover:scale-105 transition-all duration-200 cursor-pointer"
                            aria-label="Call Hotline"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                        </a>
                        <div className="hidden lg:block">
                            <div className="text-sm font-bold text-[#1a1f36] leading-tight">
                                Hotline: 196475
                            </div>
                            <div className="text-xs text-gray-500 font-normal mt-0.5">
                                Call us for free
                            </div>
                        </div>
                    </div>

                    {/* Action Icons: Wishlist, Cart, User Account */}
                    <div className="flex items-center gap-4 sm:gap-6 pl-2 sm:pl-4 border-l border-gray-200/80">
                        {/* Wishlist */}
                        <button
                            type="button"
                            onClick={() => setWishlistCount((prev) => prev + 1)}
                            aria-label="Wishlist"
                            className="relative p-1 text-gray-700 hover:text-[#f54278] transition-colors cursor-pointer focus:outline-none group"
                        >
                            <svg
                                className="w-6 h-6 transition-transform group-hover:scale-110 duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span className="absolute -top-1.5 -right-2 bg-[#6366f1] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                                {wishlistCount}
                            </span>
                        </button>

                        {/* Shopping Cart */}
                        <button
                            type="button"
                            onClick={() => setCartCount((prev) => prev + 1)}
                            aria-label="Shopping Cart"
                            className="relative p-1 text-gray-700 hover:text-[#f54278] transition-colors cursor-pointer focus:outline-none group"
                        >
                            <svg
                                className="w-6 h-6 transition-transform group-hover:scale-110 duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <span className="absolute -top-1.5 -right-2 bg-[#6366f1] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                                {cartCount}
                            </span>
                        </button>

                        {/* User Account */}
                        <button
                            type="button"
                            aria-label="User Account"
                            className="p-1 text-gray-700 hover:text-[#f54278] transition-colors cursor-pointer focus:outline-none group"
                        >
                            <svg
                                className="w-6 h-6 transition-transform group-hover:scale-110 duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.8}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar (visible only on small screens) */}
            <div className="mt-3.5 md:hidden">
                <form onSubmit={handleSearch} className="w-full">
                    <div className="flex items-center bg-white rounded-full border border-gray-200/80 shadow-sm p-1 pl-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search here..."
                            className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none pr-3"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-[#f54278] via-[#a838cf] to-[#6b42dc] text-white text-sm font-medium px-5 py-1.5 rounded-full shadow-sm"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </nav>
    )
}
