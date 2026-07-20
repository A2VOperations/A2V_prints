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

const renderShapeIcon = (shapeType, fill = '#000000') => {
  switch (shapeType) {
    case 'square':
      return <div style={{ backgroundColor: fill }} className="w-full h-full rounded-none" />;
    case 'circle':
      return <div style={{ backgroundColor: fill }} className="w-full h-full rounded-full" />;
    case 'triangle':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <polygon points="50,5 95,95 5,95" fill={fill} />
        </svg>
      );
    case 'pentagon':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <polygon points="50,6 95,39 78,94 22,94 5,39" fill={fill} />
        </svg>
      );
    case 'line':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <line x1="18" y1="18" x2="82" y2="82" stroke={fill} strokeWidth="16" strokeLinecap="round" />
        </svg>
      );
    case 'arrow':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path d="M 12,38 L 56,38 L 56,18 L 92,50 L 56,82 L 56,62 L 12,62 Z" fill={fill} />
        </svg>
      );
    case 'double-arrow':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path d="M 44,18 L 8,50 L 44,82 L 44,62 L 56,62 L 56,82 L 92,50 L 56,18 L 56,38 L 44,38 Z" fill={fill} />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <polygon points="50,5 63,35 95,38 71,60 78,92 50,75 22,92 29,60 5,38 37,35" fill={fill} />
        </svg>
      );
    case 'speech-bubble-round':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path d="M 55,10 C 76,10 93,27 93,48 C 93,69 76,86 55,86 C 46,86 38,83 31,78 L 15,93 L 22,74 C 18,67 17,58 17,48 C 17,27 34,10 55,10 Z" fill={fill} />
        </svg>
      );
    case 'speech-bubble-rect':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <path d="M 18,16 L 82,16 C 90,16 95,22 95,30 L 95,66 C 95,74 90,80 82,80 L 38,80 L 22,94 L 25,80 L 18,80 C 10,80 5,74 5,66 L 5,30 C 5,22 10,16 18,16 Z" fill={fill} />
        </svg>
      );
    case 'icon-globe':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="44" fill="none" stroke={fill} strokeWidth="8" />
          <ellipse cx="50" cy="50" rx="20" ry="44" fill="none" stroke={fill} strokeWidth="8" />
          <path d="M 6 50 L 94 50 M 15 25 L 85 25 M 15 75 L 85 75" fill="none" stroke={fill} strokeWidth="6" />
        </svg>
      );
    case 'icon-badge':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="44" fill="none" stroke={fill} strokeWidth="8" />
          <polygon points="25,70 50,45 75,70" fill={fill} />
          <circle cx="35" cy="35" r="8" fill={fill} />
        </svg>
      );
    case 'icon-circle':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill={fill} />
          <polygon points="28,70 50,48 72,70" fill="white" />
          <circle cx="36" cy="36" r="7" fill="white" />
        </svg>
      );
    case 'illust-stars':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="35,10 42,30 63,33 46,47 51,68 35,56 19,68 24,47 7,33 28,30" fill={fill} />
          <polygon points="75,40 80,52 93,54 83,63 86,76 75,69 64,76 67,63 57,54 70,52" fill={fill} opacity="0.8" />
        </svg>
      );
    case 'illust-badge':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,6 61,20 78,20 83,36 98,44 93,60 100,75 88,86 86,100 69,96 55,100 45,96 28,100 26,86 14,75 21,60 16,44 31,36 36,20 53,20" fill={fill} />
          <circle cx="57" cy="53" r="28" fill="white" opacity="0.9" />
        </svg>
      );
    case 'illust-diamond':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,10 88,38 74,90 26,90 12,38" fill={fill} />
          <polygon points="50,10 68,38 50,90 32,38" fill="white" opacity="0.3" />
        </svg>
      );
    default:
      return <div style={{ backgroundColor: fill }} className="w-full h-full rounded-lg shadow-sm" />;
  }
};

const getCanvasDimensions = (orientationStr = '', sizeStr = '') => {
  const combined = `${sizeStr || ''} ${orientationStr || ''}`;
  const matches = combined.match(/(\d+(?:\.\d+)?)\s*(?:mm|cm)?\s*(?:[xX×*])\s*(\d+(?:\.\d+)?)\s*(?:mm|cm)?/i);

  const isVertical = orientationStr.toLowerCase().includes('vertical');

  if (matches && matches[1] && matches[2]) {
    let w = parseFloat(matches[1]);
    let h = parseFloat(matches[2]);
    if (w > 0 && h > 0) {
      if (isVertical && w > h) {
        const temp = w;
        w = h;
        h = temp;
      } else if (!isVertical && h > w && !combined.toLowerCase().includes('vertical')) {
        // preserve ratio
      }

      const maxDim = 620;
      const aspect = w / h;
      if (w >= h) {
        const calcW = maxDim;
        const calcH = Math.max(200, Math.min(620, Math.round(maxDim / aspect)));
        return { width: `${calcW}px`, height: `${calcH}px` };
      } else {
        const calcH = maxDim;
        const calcW = Math.max(200, Math.min(620, Math.round(maxDim * aspect)));
        return { width: `${calcW}px`, height: `${calcH}px` };
      }
    }
  }

  return isVertical ? { width: '360px', height: '620px' } : { width: '620px', height: '350px' };
};

const getBackgroundStyles = (bgValue) => {
  if (!bgValue || bgValue === 'transparent') {
    return {
      backgroundColor: 'transparent',
      backgroundImage: 'none'
    };
  }
  const isImageOrGradient =
    bgValue.startsWith('http') ||
    bgValue.startsWith('/') ||
    bgValue.startsWith('data:image') ||
    bgValue.startsWith('blob:') ||
    bgValue.startsWith('url(') ||
    bgValue.includes('gradient');

  if (isImageOrGradient) {
    const isDirectUrl =
      bgValue.startsWith('http') ||
      bgValue.startsWith('/') ||
      bgValue.startsWith('data:image') ||
      bgValue.startsWith('blob:');
    return {
      backgroundColor: 'transparent',
      backgroundImage: isDirectUrl ? `url("${bgValue}")` : bgValue,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    };
  }

  return {
    backgroundColor: bgValue,
    backgroundImage: 'none'
  };
};

const renderDesignPreview = (elements = [], background = '#ffffff', corners = '', orientation = '', size = '', maxDim = 150) => {
  const mainDim = getCanvasDimensions(orientation, size);
  const mainW = parseFloat(mainDim.width) || 620;
  const mainH = parseFloat(mainDim.height) || 350;

  const isVertical = (orientation || '').toLowerCase().includes('vertical') || mainH > mainW;
  const scale = isVertical ? (maxDim / mainH) : (maxDim / mainW);
  const previewW = Math.round(mainW * scale);
  const previewH = Math.round(mainH * scale);

  return (
    <div
      style={{
        width: `${previewW}px`,
        height: `${previewH}px`,
        ...getBackgroundStyles(background !== 'transparent' ? background : '#ffffff'),
        borderRadius: (corners || '').includes('Rounded') ? `${Math.max(8, Math.round(24 * (maxDim / 380)))}px` : '0px',
        boxShadow: maxDim >= 300 ? '0 20px 40px -15px rgba(0,0,0,0.15), 0 0 1px 1px rgba(0,0,0,0.05)' : '0 4px 10px -2px rgba(0,0,0,0.1)'
      }}
      className={`relative overflow-hidden flex items-center justify-center border border-slate-200/80 transform hover:scale-105 transition-all duration-300 select-none bg-white max-w-[85vw] shrink-0 ${(corners || '').includes('Rounded') ? (maxDim >= 300 ? 'rounded-3xl' : 'rounded-xl') : 'rounded-none'}`}
    >
      {(!elements || elements.length === 0) ? (
        <span className="text-[9px] font-bold text-slate-400">No elements</span>
      ) : (
        elements.map((el, idx) => {
          let textShadow = 'none';
          let bgColor = 'transparent';
          let padding = '0px';
          let borderRadius = '0px';

          if (el.effect === 'shadow') {
            const dist = (el.shadowDistance !== undefined ? el.shadowDistance : 10) * scale;
            const angleRad = ((el.shadowAngle !== undefined ? el.shadowAngle : 35) * Math.PI) / 180;
            const offsetX = Math.round(dist * Math.cos(angleRad));
            const offsetY = Math.round(dist * Math.sin(angleRad));
            const blur = (el.shadowBlur !== undefined ? el.shadowBlur : 10) * scale;
            const opacity = (el.shadowOpacity !== undefined ? el.shadowOpacity : 40) / 100;
            const hex = el.shadowColor || '#000000';
            const r = parseInt(hex.slice(1, 3) || '00', 16);
            const g = parseInt(hex.slice(3, 5) || '00', 16);
            const b = parseInt(hex.slice(5, 7) || '00', 16);
            textShadow = `${offsetX}px ${offsetY}px ${blur}px rgba(${r}, ${g}, ${b}, ${opacity})`;
          } else if (el.effect === 'highlight') {
            const hex = el.highlightColor || '#dbeafe';
            const opacity = (el.highlightOpacity !== undefined ? el.highlightOpacity : 80) / 100;
            const r = parseInt(hex.slice(1, 3) || 'db', 16);
            const g = parseInt(hex.slice(3, 5) || 'ea', 16);
            const b = parseInt(hex.slice(5, 7) || 'fe', 16);
            bgColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            padding = `${2 * scale}px ${6 * scale}px`;
            borderRadius = `${4 * scale}px`;
          } else if (el.effect === 'glitch') {
            const offset = (el.effectIntensity !== undefined ? el.effectIntensity : 4) * scale;
            textShadow = `-${offset}px 0px 0px #06b6d4, ${offset}px 0px 0px #ec4899`;
          } else if (el.effect === 'echo') {
            const intensity = (el.effectIntensity !== undefined ? el.effectIntensity : 4) * scale;
            textShadow = `${intensity}px ${intensity}px 0px rgba(0,0,0,0.35), ${intensity * 2}px ${intensity * 2}px 0px rgba(0,0,0,0.2), ${intensity * 3}px ${intensity * 3}px 0px rgba(0,0,0,0.1)`;
          }

          const isCurved = el.textShape === 'curve';

          return (
            <div
              key={`preview-el-${el.id || idx}`}
              style={{
                position: 'absolute',
                left: `${(el.x || 0) * scale}px`,
                top: `${(el.y || 0) * scale}px`,
                width: el.width ? `${el.width * scale}px` : 'auto',
                height: el.height ? `${el.height * scale}px` : 'auto',
                zIndex: el.zIndex || 10
              }}
              className="pointer-events-none break-words leading-tight select-none"
            >
              {el.type === 'image' ? (
                <img src={el.url} alt={el.label || 'Image'} className="w-full h-full object-contain rounded-md" />
              ) : el.type === 'svg' ? (
                <div dangerouslySetInnerHTML={{ __html: el.svgContent || '' }} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" />
              ) : el.type === 'text' ? (
                <div
                  style={{
                    fontSize: el.fontSize ? `${Math.max(6, el.fontSize * scale)}px` : '10px',
                    fontFamily: el.fontFamily || 'Fira Sans',
                    color: el.color || '#0f172a',
                    fontWeight: el.bold ? 'bold' : 'normal',
                    fontStyle: el.italic ? 'italic' : 'normal',
                    textDecoration: el.underline ? 'underline' : 'none',
                    textAlign: el.align || 'left',
                    textTransform: el.textCase || 'none',
                    textShadow: textShadow,
                    backgroundColor: bgColor,
                    padding: padding,
                    borderRadius: borderRadius,
                    lineHeight: 1.25,
                    whiteSpace: 'pre-wrap',
                    transform: isCurved ? `perspective(400px) rotateX(${el.curveRadius !== undefined ? el.curveRadius : 30}deg)` : 'none'
                  }}
                  className="w-full break-words transition-all"
                >
                  {isCurved ? (
                    <svg viewBox="0 0 300 120" className="w-full h-auto overflow-visible">
                      <path id={`preview-curve-${el.id || idx}`} d="M 10,90 Q 150,-20 290,90" fill="transparent" />
                      <text fill={el.color || '#0f172a'} style={{ fontSize: `${Math.max(6, (el.fontSize || 16) * scale)}px`, fontFamily: el.fontFamily || 'Fira Sans', fontWeight: el.bold ? 'bold' : 'normal', textTransform: el.textCase || 'none', textShadow: textShadow }}>
                        <textPath href={`#preview-curve-${el.id || idx}`} startOffset="50%" textAnchor="middle">
                          {el.text || 'Curve Text'}
                        </textPath>
                      </text>
                    </svg>
                  ) : (
                    el.text || 'Text Field'
                  )}
                </div>
              ) : el.shapeType === 'placeholder' ? (
                <div
                  style={{ backgroundColor: el.fill || '#e2e8f0', color: el.color || '#64748b', fontSize: `${Math.max(6, (el.fontSize || 14) * scale)}px` }}
                  className="w-full h-full rounded-xl flex items-center justify-center text-center font-bold p-2 whitespace-pre-line shadow-inner border border-slate-300/60"
                >
                  {el.text || 'Placeholder'}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                  {renderShapeIcon(el.shapeType, el.fill || '#000000')}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

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
        const loggedUser = data?.user || null
        setUser(loggedUser)
        const guestItems = getCart(null)
        if (loggedUser) {
          if (guestItems && guestItems.length > 0) {
            guestItems.forEach(item => addToCart(loggedUser.id, item))
            clearCart(null)
          }
          setCart(getCart(loggedUser.id))
        } else {
          setCart(guestItems)
        }
      } catch (err) {
        setUser(null)
        setCart(getCart(null))
      } finally {
        setLoadingAuth(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const updateCart = () => setCart(getCart(user ? user.id : null))
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
    const uid = user ? user.id : null
    const item = cart.find((i) => i.id === id)
    if (!item) return
    const newQty = Math.max(1, (item.quantity || 1) + delta)
    const updated = updateCartQty(uid, id, newQty)
    setCart(updated)
  }

  const handleRemove = (id) => {
    const uid = user ? user.id : null
    const updated = removeFromCart(uid, id)
    setCart(updated)
    showToast('Item removed from cart')
  }

  const handleSaveForLater = (item) => {
    const uid = user ? user.id : null
    addToWishlist(uid, item)
    const updated = removeFromCart(uid, item.id)
    setCart(updated)
    showToast('Saved to your wishlist!')
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return
    if (!user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login?redirect=/cart'
      }
      return
    }
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: user?.name || 'Customer',
            email: user?.email || 'customer@example.com',
          },
          items: cart,
          itemsSummary: cart.map((i) => `${i.quantity || 1}x ${i.name || i.title || 'Custom Print Product'}`).join(', '),
          total: grandTotal,
          status: 'Processing',
          paymentStatus: 'Pending',
          paymentMethod: 'Gateway Future Ready',
        }),
      })
    } catch (err) {
      console.error('Failed creating order in DB:', err)
    }
    setOrderSuccessModal(true)
    clearCart(user ? user.id : null)
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
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                            {item.title}
                          </h3>
                          {item.customDesign && (
                            <button
                              type="button"
                              onClick={() => {
                                if (typeof window !== 'undefined') {
                                  sessionStorage.setItem('a2v_editor_session', JSON.stringify(item.customDesign));
                                  window.location.href = '/Editer';
                                }
                              }}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                            >
                              <span>✏️</span>
                              <span>Edit in Studio</span>
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.qtyOption ? `${item.qtyOption} • ` : ''}
                          {item.quality || 'Standard Quality'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.style || 'Regular Cut'}
                        </p>
                        {item.customSelections && Array.isArray(item.customSelections) && item.customSelections.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.customSelections.map((cs, cidx) => (
                              <span key={cidx} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-orange-50 text-[#c84b00] border border-orange-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
                                <span className="text-gray-500 font-medium">{cs.name}:</span>
                                <span className="font-extrabold">{cs.choice}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Full Custom Studio Design Specifications & Visual Previews */}
                        {item.customDesign && (
                          <div className="mt-4 pt-4 border-t border-gray-200/70 bg-slate-50/90 rounded-2xl p-4 space-y-4 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="text-sm">✨</span> Custom Design & Card Specifications
                              </span>
                              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                ✓ Print Ready 300 DPI
                              </span>
                            </div>

                            {/* 4 Specification Badges */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Paper Stock</span>
                                <span className="font-extrabold text-slate-800 text-xs leading-tight block mt-0.5">
                                  {item.customDesign.productOptions?.stock || item.quality?.split(' • ')[0] || 'Standard Matte (300 gsm)'}
                                </span>
                              </div>
                              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Corner Style</span>
                                <span className="font-extrabold text-slate-800 text-xs leading-tight block mt-0.5">
                                  {item.customDesign.corners || item.customDesign.productOptions?.corners || 'Standard Square Corners'}
                                </span>
                              </div>
                              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Side Print</span>
                                <span className="font-extrabold text-slate-800 text-xs leading-tight block mt-0.5">
                                  {item.customDesign.isBackCustomized ? 'Double Sided (Front + Back)' : 'Single Sided (Front Only)'}
                                </span>
                              </div>
                              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Orientation</span>
                                <span className="font-extrabold text-slate-800 text-xs leading-tight block mt-0.5">
                                  {item.customDesign.productOptions?.orientation || 'Horizontal (85mm x 55mm)'}
                                </span>
                              </div>
                            </div>

                            {/* Live Miniature Front & Back Previews & Printed Content Summary */}
                            <div className="pt-1 flex flex-col sm:flex-row items-start gap-4">
                              <div className="flex items-center gap-3 shrink-0">
                                {/* Front Mini Card */}
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                                    Front Side
                                  </span>
                                  {renderDesignPreview(
                                    item.customDesign.frontElements,
                                    item.customDesign.frontBackground,
                                    item.customDesign.corners || item.customDesign.productOptions?.corners,
                                    item.customDesign.productOptions?.orientation,
                                    item.customDesign.productOptions?.size,
                                    150
                                  )}
                                </div>

                                {/* Back Mini Card */}
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                                    Back Side
                                  </span>
                                  {renderDesignPreview(
                                    item.customDesign.backElements,
                                    item.customDesign.backBackground,
                                    item.customDesign.corners || item.customDesign.productOptions?.corners,
                                    item.customDesign.productOptions?.orientation,
                                    item.customDesign.productOptions?.size,
                                    150
                                  )}
                                </div>
                              </div>

                              {/* Printed Content Summary Box */}
                              <div className="flex-1 w-full bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs text-xs">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                                  Printed Content Summary ({((item.customDesign.frontElements?.length || 0) + (item.customDesign.backElements?.length || 0))} elements)
                                </span>
                                <div className="space-y-1 text-slate-700 max-h-24 overflow-y-auto font-medium">
                                  {item.customDesign.frontElements?.filter(e => e.type === 'text').map((e, idx) => (
                                    <div key={`txt-f-${idx}`} className="truncate text-xs">
                                      <span className="font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mr-1.5">Front Text:</span>
                                      <span>"{e.text}"</span>
                                    </div>
                                  ))}
                                  {item.customDesign.backElements?.filter(e => e.type === 'text').map((e, idx) => (
                                    <div key={`txt-b-${idx}`} className="truncate text-xs">
                                      <span className="font-extrabold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded mr-1.5">Back Text:</span>
                                      <span>"{e.text}"</span>
                                    </div>
                                  ))}
                                  {((item.customDesign.frontElements || []).concat(item.customDesign.backElements || []).filter(e => e.type === 'image').length > 0) && (
                                    <div className="text-emerald-700 font-bold flex items-center gap-1.5 pt-1">
                                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                                      <span>Custom Logo / Graphic Image Attached</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Uploaded Custom Design Specifications & Visual Preview */}
                        {(item.uploadedFile || item.uploadedImageUrl || (item.uploadedFiles && item.uploadedFiles.length > 0)) && !item.customDesign && (
                          <div className="mt-4 pt-4 border-t border-gray-200/70 bg-orange-50/60 rounded-2xl p-4 space-y-4 border border-orange-200/60 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="text-sm">📄</span> Uploaded Artwork & Order Specifications
                              </span>
                              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F06800] border border-orange-200">
                                ✓ Custom File{(item.uploadedFiles?.length > 1 || item.uploadedImageUrls?.length > 1) ? 's (2)' : ''} Attached
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                              <div className="flex items-center gap-2 shrink-0">
                                {(item.uploadedImageUrls && item.uploadedImageUrls.length > 0) ? (
                                  item.uploadedImageUrls.map((url, iIndex) => (
                                    <img
                                      key={iIndex}
                                      src={url}
                                      alt={`Preview ${iIndex + 1}`}
                                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 bg-slate-50 shrink-0 shadow-2xs"
                                      title={`Photo #${iIndex + 1}`}
                                    />
                                  ))
                                ) : item.uploadedImageUrl ? (
                                  <img
                                    src={item.uploadedImageUrl}
                                    alt="Uploaded Artwork Preview"
                                    className="w-20 h-20 object-contain rounded-xl border border-slate-200 bg-slate-50 shrink-0 shadow-2xs"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-xl bg-orange-100 text-[#F06800] flex items-center justify-center font-black text-2xl shrink-0">
                                    📄
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Attached File Name(s)</p>
                                <p className="text-sm font-extrabold text-slate-900 truncate mt-0.5">
                                  {(item.uploadedFiles && item.uploadedFiles.length > 0) ? item.uploadedFiles.join(' | ') : (item.uploadedFile || 'Custom Print Artwork File')}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg font-bold">
                                    Quantity: {item.qtyOption || 'Standard'}
                                  </span>
                                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg font-bold">
                                    Quality: {item.quality?.replace(/Uploaded File[s]?(\s*\([0-9]+\))?: .*$/, 'Custom Print Quality') || 'Standard'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

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
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-blackd text-xs text-gray-500 focus:outline-none focus:border-purple-500 uppercase font-semibold placeholder:text-gray-300 placeholder:text-xs"
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
                      className={`text-xs mt-2 font-medium ${appliedDiscount > 0 ? 'text-emerald-600' : 'text-red-500'
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
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-sm transition-all ${shippingType === 'standard'
                        ? 'border-[#F06800] bg-orange-50/50 font-bold text-gray-900'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <span>Standard Production (2-3 days)</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div
                    onClick={() => setShippingType('express')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-sm transition-all ${shippingType === 'express'
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
