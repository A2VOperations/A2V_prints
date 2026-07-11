'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  getCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  addToWishlist,
} from '../lib/cartWishlist'

export default function CartPage() {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [cart, setCart] = useState([])
  const [promoCode, setPromoCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState('')
  const [shippingType, setShippingType] = useState('standard') // 'standard' | 'express'
  const [orderSuccessModal, setOrderSuccessModal] = useState(false)
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
          setCart(getCart(data.user.id))
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
    const updateCart = () => setCart(getCart(user.id))
    window.addEventListener('cart-wishlist-change', updateCart)
    return () => window.removeEventListener('cart-wishlist-change', updateCart)
  }, [user])

  const parsePrice = (priceStr) => {
    if (!priceStr) return 299
    const clean = String(priceStr).replace(/[^0-9.]/g, '')
    const num = parseFloat(clean)
    return isNaN(num) ? 299 : num
  }

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const p = parsePrice(item.price)
      return acc + p * (item.quantity || 1)
    }, 0)
  }, [cart])

  const discountAmount = useMemo(() => {
    return Math.round((subtotal * appliedDiscount) / 100)
  }, [subtotal, appliedDiscount])

  const shippingCost = shippingType === 'express' ? 149 : 0

  const gstCost = useMemo(() => {
    const afterDiscount = Math.max(0, subtotal - discountAmount)
    return Math.round(afterDiscount * 0.18)
  }, [subtotal, discountAmount])

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount) + shippingCost + gstCost
  }, [subtotal, discountAmount, shippingCost, gstCost])

  const handleApplyPromo = (e) => {
    e.preventDefault()
    const code = promoCode.trim().toUpperCase()
    if (code === 'A2V10' || code === 'WELCOME10') {
      setAppliedDiscount(10)
      setPromoMessage('🎉 10% discount applied!')
      showToast('Promo code applied successfully!')
    } else if (code === 'PRINT20') {
      setAppliedDiscount(20)
      setPromoMessage('🎉 20% discount applied!')
      showToast('Promo code applied successfully!')
    } else {
      setAppliedDiscount(0)
      setPromoMessage('Invalid code. Try A2V10 or PRINT20')
    }
  }

  const handleQtyChange = (id, delta) => {
    if (!user) return
    const item = cart.find((i) => i.id === id)
    if (!item) return
    const newQty = Math.max(1, (item.quantity || 1) + delta)
    const updated = updateCartQty(user.id, id, newQty)
    setCart(updated)
  }

  const handleRemove = (id) => {
    if (!user) return
    const updated = removeFromCart(user.id, id)
    setCart(updated)
    showToast('Item removed from cart')
  }

  const handleSaveForLater = (item) => {
    if (!user) return
    addToWishlist(user.id, item)
    const updated = removeFromCart(user.id, item.id)
    setCart(updated)
    showToast('Saved to your wishlist!')
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    setOrderSuccessModal(true)
    clearCart(user.id)
    setCart([])
  }

  if (loadingAuth) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-purple-50/50 via-white to-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F06800] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading your Cart...</p>
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

          <div className="w-20 h-20 bg-gradient-to-tr from-[#F06800] to-[#f54278] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/25">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign In to Access Your Cart
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-3 leading-relaxed">
            Please log in to review your cart items, select custom shipping options, and complete checkout.
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
    <div className="min-h-screen bg-[#f8fafc] pb-24 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Order Success Modal */}
      {orderSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl relative border border-gray-100">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Order Placed Successfully!</h2>
            <p className="text-gray-500 text-sm mt-2">
              Thank you for ordering with A2V Prints. We have received your order details and our production team will start printing shortly.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/dashboard"
                onClick={() => setOrderSuccessModal(false)}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#F06800] to-[#f54278] text-white font-bold text-sm shadow-md"
              >
                Go to Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setOrderSuccessModal(false)}
                className="w-full py-2.5 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-md">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-3">
              <span>Shopping Cart</span>
              <span className="bg-[#F06800] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                {cart.length}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              My Shopping Cart
            </h1>
          </div>
          <Link
            href="/visiting-cards"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-bold transition-all"
          >
            + Continue Shopping
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-12 sm:p-16 text-center max-w-2xl mx-auto my-6">
            <div className="w-20 h-20 bg-orange-50 text-[#F06800] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Shopping Cart is Empty</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm sm:text-base">
              Add products from our extensive printing catalog to get started with your order.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/visiting-cards"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F06800] to-[#f54278] text-white font-bold text-sm shadow-md transition-all"
              >
                Browse Visiting Cards
              </Link>
              <Link
                href="/banner-poster"
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all"
              >
                Banners & Posters
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const itemUnit = parsePrice(item.price)
                const itemTotal = itemUnit * (item.quantity || 1)

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 shadow-xs p-5 sm:p-6 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                        <img
                          src={item.image || '/home/visiting-cards/card-stack.png'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.qtyOption ? `${item.qtyOption} • ` : ''}
                          {item.quality || 'Standard Quality'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.style || 'Regular Cut'}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => handleSaveForLater(item)}
                            className="text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
                          >
                            ♥ Save to Wishlist
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right side controls */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-3">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-bold transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-gray-800">
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-bold transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-extrabold text-gray-900">
                          ₹{itemTotal.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{itemUnit} each
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-extrabold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="mb-6">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Try A2V10 or PRINT20"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-500 uppercase font-semibold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs cursor-pointer transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`text-xs mt-2 font-medium ${
                        appliedDiscount > 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {promoMessage}
                    </p>
                  )}
                </form>

                {/* Shipping Selection */}
                <div className="mb-6 space-y-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Shipping Speed
                  </label>
                  <div
                    onClick={() => setShippingType('standard')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-sm transition-all ${
                      shippingType === 'standard'
                        ? 'border-[#F06800] bg-orange-50/50 font-bold text-gray-900'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Standard Production (2-3 days)</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div
                    onClick={() => setShippingType('express')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-sm transition-all ${
                      shippingType === 'express'
                        ? 'border-[#F06800] bg-orange-50/50 font-bold text-gray-900'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Express Priority Dispatch</span>
                    <span>₹149</span>
                  </div>
                </div>

                <hr className="border-gray-100 my-4" />

                {/* Cost Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({appliedDiscount}%)</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Estimated GST (18%)</span>
                    <span className="font-semibold text-gray-900">₹{gstCost.toLocaleString()}</span>
                  </div>

                  <hr className="border-gray-100 my-3" />

                  <div className="flex justify-between text-lg font-extrabold text-gray-900">
                    <span>Grand Total</span>
                    <span className="text-[#F06800]">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F06800] via-[#f54278] to-[#9842dc] text-white font-extrabold text-sm shadow-lg shadow-purple-500/20 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  Proceed to Checkout →
                </button>

                {/* Guarantee Badges */}
                <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-gray-700 uppercase">100% Quality</p>
                    <p className="text-[10px] text-gray-400">Reprint Guarantee</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-700 uppercase">Secure SSL</p>
                    <p className="text-[10px] text-gray-400">Encrypted Pay</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-700 uppercase">Fast Dispatch</p>
                    <p className="text-[10px] text-gray-400">All India Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
