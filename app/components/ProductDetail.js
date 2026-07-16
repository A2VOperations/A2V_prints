'use client'

import React, { useState, useEffect, Suspense, useMemo } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDatabaseData } from '../lib/useDatabaseData'
import { addToCart, addToWishlist } from '../lib/cartWishlist'

const defaultGeneralFaqs = [
  { question: 'How do I submit my custom design or artwork?', answer: 'You can either upload your ready-to-print file (PDF, AI, PSD, PNG, JPG) using the "Upload Design" button or create a design from scratch using our online template studio.' },
  { question: 'What is the standard turnaround and shipping time?', answer: 'Standard production takes 2 to 3 business days after digital proof approval. Express dispatch is also available at checkout for 1–2 day priority delivery.' },
  { question: 'Can I request a custom sample before placing a bulk order?', answer: 'Yes! We offer single-unit sample orders and print sample kits so you can inspect the paper quality, fabric GSM, and color accuracy before ordering in bulk.' },
  { question: 'What is your refund and reprint guarantee policy?', answer: 'We stand by a 100% satisfaction guarantee. If there is any print defect or damage during transit, we will reprint and ship your order immediately at zero extra cost.' }
]

const defaultCategoryConfig = {
  name: 'Standard Printing Service',
  link: '/',
  products: [],
  qualityLabel: 'Quality / Material',
  styleLabel: 'Style / Finish',
  defaultQtyOptions: ['100 Units', '250 Units', '500 Units'],
  defaultQualityOptions: [
    { id: 'standard', title: 'Standard Quality', subtitle: 'High-grade commercial finish' },
    { id: 'premium', title: 'Premium Finish', subtitle: 'Enhanced durability & sheen' }
  ],
  defaultStyleOptions: [
    { id: 'regular', title: 'Regular Cut', subtitle: 'Standard professional trim' },
    { id: 'custom', title: 'Custom Finish', subtitle: 'Specialized finishing touches' }
  ],
  defaultSpecs: [
    { label: 'Quality Standards', value: 'Commercial Grade Printing & Finishing' },
    { label: 'Turnaround Time', value: 'Standard 2–3 Business Days' },
    { label: 'Print Resolution', value: 'High-definition color fidelity' }
  ]
}


const singleProductCache = new Map()
const inFlightSingleProduct = new Map()

function ProductDetailInner({ category: propCategory, id: propId, initialCategory = null, initialProduct = null, initialRecommendations = [] }) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { graphicServicesList, printingServicesList, printingCategories, graphicCategories } = useDatabaseData()

  const categoryKey = propCategory || params?.category || 'visiting-cards'
  const productId = propId || params?.id || searchParams?.get('product') || categoryKey || '1'
  const cacheKey = `${categoryKey}:${productId}`

  const [dbProduct, setDbProduct] = useState(() => initialProduct || singleProductCache.get(cacheKey) || null)

  useEffect(() => {
    if (!productId || initialProduct || singleProductCache.has(cacheKey)) return

    let promise = inFlightSingleProduct.get(cacheKey)
    if (!promise) {
      promise = fetch(`/api/products/${encodeURIComponent(productId)}?category=${encodeURIComponent(categoryKey)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json?.success && json?.data) {
            singleProductCache.set(cacheKey, json.data)
            return json.data
          }
          return null
        })
        .finally(() => {
          inFlightSingleProduct.delete(cacheKey)
        })
      inFlightSingleProduct.set(cacheKey, promise)
    }

    let isMounted = true
    promise
      .then((data) => {
        if (isMounted && data) {
          setDbProduct(data)
        }
      })
      .catch((err) => console.warn('Failed to fetch single product from database:', err))

    return () => {
      isMounted = false
    }
  }, [productId, categoryKey, cacheKey, initialProduct])

  const allList = [...graphicServicesList, ...printingServicesList]
  const matchedService =
    allList.find(
      (s) =>
        String(s.categorySlug || '').toLowerCase() === String(categoryKey).toLowerCase() &&
        (String(s.id).toLowerCase() === String(productId).toLowerCase() ||
          String(s.numericId) === String(productId) ||
          String(s.slug || '').toLowerCase() === String(productId).toLowerCase())
    ) ||
    (!categoryKey ? allList.find(
      (s) =>
        String(s.id).toLowerCase() === String(productId).toLowerCase() ||
        String(s._id) === String(productId)
    ) : null)

  const matchedGraphicService = matchedService && matchedService.serviceType === 'graphic' ? matchedService : null

  const dynamicCatInfo = matchedGraphicService
    ? {
      name: matchedGraphicService.categoryName,
      link: `/${matchedGraphicService.categorySlug}`,
      qualityLabel: 'Package Tier',
      styleLabel: 'Delivery Speed',
      defaultQtyOptions: ['1 Custom Concept', '2 Concepts Bundle', 'Complete Suite'],
      defaultQualityOptions: [
        { id: 'standard', title: 'Standard Package', subtitle: 'High-Res PNG, JPG & PDF files' },
        { id: 'premium', title: 'Premium + Vector Files', subtitle: 'AI, EPS, SVG source files included' }
      ],
      defaultStyleOptions: [
        { id: 'normal', title: 'Standard Delivery', subtitle: matchedGraphicService.turnaround },
        { id: 'express', title: 'Express 24 Hr Rush', subtitle: 'VIP Priority Delivery' }
      ],
      defaultSpecs: [
        { label: 'Service Category', value: matchedGraphicService.categoryName },
        { label: 'Included Deliverables', value: matchedGraphicService.deliverables ? matchedGraphicService.deliverables.join(', ') : 'Vector AI, EPS, PDF & High-Res PNG' },
        { label: 'Turnaround Time', value: matchedGraphicService.turnaround },
        { label: 'Customer Reviews', value: `${matchedGraphicService.rating} ★ (${matchedGraphicService.reviews} Verified Reviews)` },
        { label: 'Revisions', value: 'Unlimited Revisions on Standard & Premium Tiers' },
        { label: 'Copyright Ownership', value: '100% Commercial Copyright Ownership Transferred' }
      ]
    }
    : null

  const allCategories = [...(printingCategories || []), ...(graphicCategories || [])]
  const dbCategory = initialCategory || allCategories.find(
    (c) => String(c.slug || '').toLowerCase() === String(categoryKey).toLowerCase() ||
      String(c.id || '').toLowerCase() === String(categoryKey).toLowerCase()
  )

  const catInfo = dynamicCatInfo || (dbCategory && dbCategory.defaultQualityOptions && dbCategory.defaultQualityOptions.length > 0 ? {
    name: dbCategory.name,
    link: `/${dbCategory.slug}`,
    products: [],
    qualityLabel: dbCategory.qualityLabel || 'Paper Quality',
    styleLabel: dbCategory.styleLabel || 'Corner Style',
    defaultQtyOptions: dbCategory.defaultQtyOptions && dbCategory.defaultQtyOptions.length ? dbCategory.defaultQtyOptions : defaultCategoryConfig.defaultQtyOptions,
    defaultQualityOptions: dbCategory.defaultQualityOptions && dbCategory.defaultQualityOptions.length ? dbCategory.defaultQualityOptions : defaultCategoryConfig.defaultQualityOptions,
    defaultStyleOptions: dbCategory.defaultStyleOptions && dbCategory.defaultStyleOptions.length ? dbCategory.defaultStyleOptions : defaultCategoryConfig.defaultStyleOptions,
    defaultSpecs: dbCategory.defaultSpecs && dbCategory.defaultSpecs.length ? dbCategory.defaultSpecs : defaultCategoryConfig.defaultSpecs,
  } : defaultCategoryConfig)

  const activeFaqs = (dbCategory && dbCategory.faqs && dbCategory.faqs.length > 0) ? dbCategory.faqs : defaultGeneralFaqs
  const productList = catInfo.products || []
  const staticProduct = matchedService
    ? {
      ...matchedService,
      id: matchedService.id,
      title: matchedService.title || matchedService.name,
      price: matchedService.price,
      description: matchedService.description || matchedService.desc,
      image: matchedService.image,
      images: matchedService.images,
      badge: matchedService.badge || 'Popular'
    }
    : productList.find((p) => String(p.id) === String(productId) || String(p.numericId) === String(productId)) || productList[0] || {
      id: productId || 1,
      title: `${catInfo.name || 'Custom Print'} Item #${productId || '1'}`,
      price: 'From ₹249',
      description: `Premium high-resolution printing for your custom ${catInfo.name || 'print'} project. Crafted with top-tier materials.`,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    }

  const product = dbProduct
    ? {
      ...staticProduct,
      ...dbProduct,
      title: dbProduct.title || dbProduct.name || staticProduct.title,
      description: dbProduct.description || dbProduct.desc || staticProduct.description,
    }
    : staticProduct

  const [selectedQty, setSelectedQty] = useState(catInfo.defaultQtyOptions[0])
  const [selectedQuality, setSelectedQuality] = useState(catInfo.defaultQualityOptions[0].id)
  const [selectedStyle, setSelectedStyle] = useState(catInfo.defaultStyleOptions[0].id)
  const [activeTab, setActiveTab] = useState('Description')
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [isMounted] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const currentProductId = String(product?.id || '')
  const sameCategoryRecommendations = useMemo(() => {
    if (initialRecommendations && initialRecommendations.length > 0) {
      return initialRecommendations
    }
    const allKnown = [...(graphicServicesList || []), ...(printingServicesList || [])]
    const list = allKnown.filter(
      (item) =>
        String(item.categorySlug || '').toLowerCase() === String(categoryKey).toLowerCase() &&
        String(item.id) !== String(currentProductId) &&
        String(item.numericId) !== String(currentProductId)
    )
    if (list.length > 0) return list.slice(0, 4)
    return allKnown.filter((item) => String(item.id) !== String(currentProductId)).slice(0, 4)
  }, [initialRecommendations, graphicServicesList, printingServicesList, categoryKey, currentProductId])

  const getProductGallery = (prod) => {
    if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
      return prod.images
    }
    const mainImg = prod.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
    return [mainImg]
  }

  const galleryImages = getProductGallery(product)
  const currentImage = galleryImages[activeImageIndex] || product.image

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const displayPrice = product.price
    ? product.price.replace(/^(From|from)\s*/i, 'Starting at ')
    : 'Starting at ₹249'

  const [currentUser, setCurrentUser] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setCurrentUser(d.user || null))
      .catch(() => setCurrentUser(null))
  }, [])

  const showProductToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2500)
  }

  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Please log in to add items to your Shopping Cart.')
      return
    }
    const qualityObj = catInfo.defaultQualityOptions.find((q) => q.id === selectedQuality)
    const styleObj = catInfo.defaultStyleOptions.find((s) => s.id === selectedStyle)
    addToCart(currentUser.id, {
      productId: product.id || product.numericId || '1',
      title: product.title,
      price: product.price,
      image: product.image,
      category: categoryKey,
      qtyOption: selectedQty,
      quality: qualityObj ? qualityObj.title : selectedQuality,
      style: styleObj ? styleObj.title : selectedStyle,
      quantity: 1,
    })
    showProductToast('Added to Cart!')
  }

  const handleAddToWishlistAction = () => {
    if (!currentUser) {
      alert('Please log in to save items to your Wishlist.')
      return
    }
    const qualityObj = catInfo.defaultQualityOptions.find((q) => q.id === selectedQuality)
    const styleObj = catInfo.defaultStyleOptions.find((s) => s.id === selectedStyle)
    addToWishlist(currentUser.id, {
      productId: product.id || product.numericId || '1',
      title: product.title,
      price: product.price,
      image: product.image,
      category: categoryKey,
      qtyOption: selectedQty,
      quality: qualityObj ? qualityObj.title : selectedQuality,
      style: styleObj ? styleObj.title : selectedStyle,
    })
    setIsWishlisted(true)
    showProductToast('Saved to Wishlist!')
  }

  const handleUpload = () => {
    alert(`Opening File Uploader for "${product.title}"...\nSelected Quantity: ${selectedQty}\nQuality ID: ${selectedQuality}\nStyle ID: ${selectedStyle}`)
  }

  const handleOnlineEditor = () => {
    router.push(`/template/${categoryKey || 'visiting-cards'}`)
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F06800] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-semibold text-sm">Loading product details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href={catInfo.link}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#F06800] transition-colors mb-8 sm:mb-12 group"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to {catInfo.name} Catalog</span>
        </Link>

        {/* Top Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-16">
          {/* Left Column: Image Gallery Carousel */}
          <div className="lg:col-span-6 w-full flex flex-col select-none">
            {/* Main Display Box */}
            <div className="relative aspect-4/3 w-full rounded-2xl sm:rounded-3xl bg-[#f8f9fa] border border-slate-200/80 flex items-center justify-center overflow-hidden shadow-sm group">
              {/* Optional Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-lg bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] text-white text-xs font-extrabold tracking-wider uppercase shadow-xs">
                  {product.badge}
                </span>
              )}

              {/* Wishlist / Heart Button */}
              <button
                type="button"
                onClick={handleAddToWishlistAction}
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-gray-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-colors" viewBox="0 0 24 24" fill={isWishlisted ? '#e53e3e' : 'none'} stroke={isWishlisted ? '#e53e3e' : 'currentColor'} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Left Navigation Arrow */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-xl shadow-md hover:shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-950 hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-90 hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Product Image */}
              <img
                key={currentImage}
                src={currentImage}
                alt={`${product.title} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-cover sm:object-contain mix-blend-darken transform transition-all duration-300 drop-shadow-md relative z-10 animate-in fade-in zoom-in-95"
                loading="lazy"
              />

              {/* Right Navigation Arrow */}
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-xl shadow-md hover:shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-950 hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-90 hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Thumbnail Navigation Row */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 sm:gap-3 mt-3.5 sm:mt-4 overflow-x-auto no-scrollbar py-1">
                {galleryImages.map((imgUrl, idx) => {
                  const isActiveImg = activeImageIndex === idx
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer shrink-0 transition-all p-0.5 bg-gray-100 flex items-center justify-center relative ${isActiveImg
                        ? 'border-2 border-[#1976d2] shadow-sm ring-2 ring-[#1976d2]/20 scale-[1.02]'
                        : 'border border-gray-200 hover:border-gray-400 opacity-75 hover:opacity-100'
                        }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.title} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover rounded-md mix-blend-darken"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Column: Title, Subtitle, Price & Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {product.description || 'Make a lasting impression with premium quality prints and custom branding.'}
            </p>

            <div className="mt-4 mb-6">
              <span className="text-xl sm:text-2xl font-extrabold text-[#c84b00] tracking-tight">
                {displayPrice}
              </span>
            </div>

            <hr className="border-slate-200/80 mb-6" />

            {/* Quantity Dropdown */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quantity
              </label>
              <select
                value={selectedQty}
                onChange={(e) => setSelectedQty(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F06800] focus:border-[#F06800] transition-all shadow-xs cursor-pointer"
              >
                {catInfo.defaultQtyOptions.map((qty, idx) => (
                  <option key={idx} value={qty}>
                    {qty}
                  </option>
                ))}
              </select>
            </div>

            {/* Paper / Material Quality */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {catInfo.qualityLabel || 'Paper Quality'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catInfo.defaultQualityOptions.map((opt) => {
                  const isSelected = selectedQuality === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedQuality(opt.id)}
                      className={`p-3.5 rounded-xl text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center border-2 select-none ${isSelected
                        ? 'bg-[#fff3ec] border-[#F06800] text-[#c84b00] shadow-xs font-bold'
                        : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                        }`}
                    >
                      <span className="text-sm block mb-0.5">{opt.title}</span>
                      <span className={`text-[11px] block font-normal ${isSelected ? 'text-[#c84b00]/80' : 'text-slate-500'}`}>
                        {opt.subtitle}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Corner Style / Shape */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {catInfo.styleLabel || 'Corner Style'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catInfo.defaultStyleOptions.map((opt) => {
                  const isSelected = selectedStyle === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedStyle(opt.id)}
                      className={`p-3.5 rounded-xl text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center border-2 select-none ${isSelected
                        ? 'bg-[#fff3ec] border-[#F06800] text-[#c84b00] shadow-xs font-bold'
                        : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                        }`}
                    >
                      <span className="text-sm block mb-0.5">{opt.title}</span>
                      <span className={`text-[11px] block font-normal ${isSelected ? 'text-[#c84b00]/80' : 'text-slate-500'}`}>
                        {opt.subtitle}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-linear-to-r from-[#F06800] via-[#f54278] to-[#9842dc] hover:opacity-95 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 text-sm cursor-pointer w-full sm:flex-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleUpload}
                className="bg-[linear-gradient(90deg,#ff520a_0%,#ff0a6c_100%)] hover:opacity-95 text-white font-extrabold  py-3.5 px-6 rounded-2xl shadow-md transition-all transform hover:scale-[1.01] active:scale-95 text-sm cursor-pointer w-full sm:flex-1"
              >
                Upload Custom Design
              </button>
              <button
                type="button"
                onClick={handleOnlineEditor}
                className="bg-[#221712] hover:bg-black text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition-all transform hover:scale-[1.01] active:scale-95 text-sm cursor-pointer w-full sm:flex-1"
              >
                Browse Studio Templates
              </button>
            </div>

            {/* Product Toast */}
            {toastMessage && (
              <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-sm font-semibold">{toastMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Tabs (Description, Paper & Specs, Shipping Info) */}
        <div className="mt-16 pt-8 border-t border-slate-200/80 max-w-5xl">
          {/* Tab Headers */}
          <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {['Description', 'Paper & Specs', 'Shipping Info'].map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm sm:text-base pb-3 -mb-px transition-all whitespace-nowrap cursor-pointer select-none ${isActive
                    ? 'font-extrabold text-[#c84b00] border-b-2 border-[#F06800]'
                    : 'font-bold text-slate-600 hover:text-slate-900 border-b-2 border-transparent'
                    }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>

          {/* Tab Contents */}
          <div className="py-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            {activeTab === 'Description' && (
              <div className="space-y-4 animate-fadeIn">
                {product.description && (
                  <p className="leading-relaxed text-slate-700 font-medium">
                    {product.description}
                  </p>
                )}
                <p className="leading-relaxed text-slate-600 font-normal">
                  Our custom prints are the perfect networking and branding tool. Printed on high-quality, durable materials, they offer a professional look and feel that leaves a lasting impression. Choose between matte or glossy finishes to perfectly match your brand&apos;s aesthetic. The crisp printing ensures your text is legible and your colors pop, making every connection count.
                </p>
                <ul className="mt-4 space-y-2.5 text-slate-700 font-medium list-disc pl-5">
                  <li>Standard Size: {catInfo.defaultSpecs[2]?.value || '3.5" x 2.0"'}</li>
                  <li>Full-color high resolution printing on front (back optional)</li>
                  <li>Premium base material designed for durability and executive feel</li>
                </ul>
              </div>
            )}

            {activeTab === 'Paper & Specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/60 p-6 sm:p-8 rounded-2xl border border-slate-200/60 animate-fadeIn">
                {catInfo.defaultSpecs.map((spec, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {spec.label}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-800">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Shipping Info' && (
              <div className="bg-slate-50/60 p-6 sm:p-8 rounded-2xl border border-slate-200/60 space-y-4 text-slate-600 leading-relaxed animate-fadeIn">
                <p>
                  <strong className="text-slate-800 font-bold">Standard Production:</strong> 2-3 business days after design approval.
                </p>
                <p>
                  <strong className="text-slate-800 font-bold">Express Delivery:</strong> Priority dispatch and shipping available at checkout (1-2 business days across major metro cities).
                </p>
                <p>
                  <strong className="text-slate-800 font-bold">Secure Packaging:</strong> All orders are carefully packed in moisture-resistant, reinforced protective boxes to ensure zero edge damage during transit.
                </p>
                <p>
                  <strong className="text-slate-800 font-bold">Order Tracking:</strong> Real-time SMS and email tracking links are sent automatically as soon as your package is dispatched.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Same Category Recommendations Section */}
        <div className="mt-20 pt-16 border-t border-slate-200/80 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Recommended {catInfo.name || 'Products'}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal max-w-2xl">
                Explore popular styles, finishes, and options in our {catInfo.name || 'collection'}.
              </p>
            </div>

            <Link
              href={`/${matchedGraphicService ? matchedGraphicService.categorySlug : categoryKey}`}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#F06800] text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-xs self-start md:self-auto flex items-center gap-2"
            >
              <span>View All {catInfo.name || 'Products'}</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sameCategoryRecommendations.map((item, idx) => {
              const targetHref = `/${matchedGraphicService ? matchedGraphicService.categorySlug : categoryKey}/${item.numericId ?? item.id}`
              const itemImg = item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="group bg-white rounded-3xl p-4 border border-slate-200/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div>
                    <Link
                      href={targetHref}
                      className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-slate-100 block mb-4"
                    >
                      <img
                        src={itemImg}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {(item.badge || 'Popular') && (
                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-white/95 text-slate-800 font-extrabold text-[10px] shadow-sm">
                          {item.badge || 'Popular'}
                        </span>
                      )}
                      {item.price && (
                        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-[#031A30]/90 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
                          {item.price.startsWith('From') ? item.price : `From ${item.price}`}
                        </span>
                      )}
                    </Link>

                    <Link href={targetHref}>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#c84b00] transition-colors leading-snug mb-1.5">
                        {item.title || item.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-5 font-normal">
                      {item.description || item.desc || `Explore premium ${item.title || item.name}.`}
                    </p>
                  </div>

                  <Link
                    href={targetHref}
                    className="w-full bg-slate-100 hover:bg-[#F06800] text-slate-800 hover:text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200"
                  >
                    <span>Customize & Order</span>
                    <span>→</span>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-20 pt-16 border-t border-slate-200/80 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#F06800]/10 border border-[#F06800]/30 text-[#c84b00] text-xs font-extrabold tracking-wider uppercase mb-3 shadow-xs">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
              Everything you need to know about ordering custom {catInfo.name || 'prints'} with us.
            </p>
          </div>

          <div className="space-y-4">
            {(activeFaqs || defaultGeneralFaqs).map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-100/60 transition-colors"
                  >
                    <span className="text-base font-bold text-slate-900">
                      {faq.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-300 ${isOpen
                        ? 'bg-[#F06800] text-white rotate-180 shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 shadow-xs'
                        }`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-200/40 bg-white/60 animate-fadeIn font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail(props) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-semibold">Loading product details...</div>}>
      <ProductDetailInner {...props} />
    </Suspense>
  )
}
