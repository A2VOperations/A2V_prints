'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getWishlist, removeFromWishlist, moveToCart } from '../lib/cartWishlist'

export default function WishlistPage() {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [wishlist, setWishlist] = useState([])
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2800)
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        setUser(data?.user || null)
        if (data?.user) {
          setWishlist(getWishlist(data.user.id))
        }
      } catch (err) {
        setUser(null)
      } finally {
        setLoadingAuth(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!user) return
    const updateList = () => setWishlist(getWishlist(user.id))
    window.addEventListener('cart-wishlist-change', updateList)
    return () => window.removeEventListener('cart-wishlist-change', updateList)
  }, [user])

  const handleRemove = (id) => {
    if (!user) return
    const updated = removeFromWishlist(user.id, id)
    setWishlist(updated)
    showToast('Item removed from wishlist')
  }

  const handleMoveToCart = (item) => {
    if (!user) return
    moveToCart(user.id, item)
    setWishlist(getWishlist(user.id))
    showToast('Moved to cart!')
  }

  const handleClearAll = () => {
    if (!user) return
    wishlist.forEach((item) => removeFromWishlist(user.id, item.id))
    setWishlist([])
    showToast('Wishlist cleared')
  }

  if (loadingAuth) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-purple-50/50 via-white to-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading your Wishlist...</p>
        </div>
      </div>
    )
  }

  // Logged-out state
  if (!user) {
    return (
      <div className="min-h-[80vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/60 via-white to-gray-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl border border-purple-100 shadow-2xl p-8 sm:p-10 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-20 h-20 bg-gradient-to-tr from-[#f54278] to-[#9842dc] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign In to Access Your Wishlist
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-3 leading-relaxed">
            Save custom prints, track your favorite artwork configurations, and come back whenever you are ready to order.
          </p>

          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="block w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F06800] via-[#f54278] to-[#9842dc] text-white font-bold text-sm shadow-md shadow-purple-500/20 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Log In to My Account
            </Link>
            <Link
              href="/signup"
              className="block w-full py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-all"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 relative">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1e1b4b] via-[#311062] to-[#4a044e] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-3">
              <span>Saved Items</span>
              <span className="bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                {wishlist.length}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              My Wishlist
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleClearAll}
              className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 border border-white/20 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              Clear All Wishlist
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {wishlist.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-12 sm:p-16 text-center max-w-2xl mx-auto my-6">
            <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your wishlist is currently empty</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm sm:text-base">
              Explore our printing products and save items you love to review or purchase later.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/visiting-cards"
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition-all"
              >
                Browse Visiting Cards
              </Link>
              <Link
                href="/custom-tshirts"
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all"
              >
                Custom Apparel
              </Link>
            </div>
          </div>
        ) : (
          /* Grid of Wishlist Items */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-200/80 hover:border-purple-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image || '/home/visiting-cards/card-stack.png'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleRemove(item.id)}
                      title="Remove from wishlist"
                      className="w-9 h-9 rounded-full bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 shadow-md flex items-center justify-center transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {item.category && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold capitalize">
                        {item.category.replace('-', ' ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm font-extrabold text-[#F06800] mt-1">
                      {item.price || '₹299'}
                    </p>

                    {/* Options summary */}
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                      {item.qtyOption && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Qty:</span>
                          <span className="font-semibold text-gray-700">{item.qtyOption}</span>
                        </div>
                      )}
                      {item.quality && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Quality:</span>
                          <span className="font-semibold text-gray-700">{item.quality}</span>
                        </div>
                      )}
                      {item.style && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Style:</span>
                          <span className="font-semibold text-gray-700">{item.style}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F06800] via-[#f54278] to-[#9842dc] text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Move to Cart
                    </button>
                    <Link
                      href={`/${item.category || 'visiting-cards'}/${item.productId}`}
                      className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
