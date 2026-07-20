'use client'

import React, { useState, useEffect, Suspense, useMemo, useRef } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDatabaseData } from '../lib/useDatabaseData'
import { addToCart, addToWishlist, compressImageForStorage } from '../lib/cartWishlist'

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
      qualityLabel: matchedGraphicService.qualityLabel || 'Quality / Package Tier',
      styleLabel: matchedGraphicService.styleLabel || 'Style / Delivery',
      defaultQtyOptions: Array.isArray(matchedGraphicService.defaultQtyOptions) ? matchedGraphicService.defaultQtyOptions : [],
      defaultQualityOptions: Array.isArray(matchedGraphicService.defaultQualityOptions) ? matchedGraphicService.defaultQualityOptions : [],
      defaultStyleOptions: Array.isArray(matchedGraphicService.defaultStyleOptions) ? matchedGraphicService.defaultStyleOptions : [],
      defaultSpecs: Array.isArray(matchedGraphicService.defaultSpecs) ? matchedGraphicService.defaultSpecs : []
    }
    : null

  const allCategories = [...(printingCategories || []), ...(graphicCategories || [])]
  const dbCategory = initialCategory || allCategories.find(
    (c) => String(c.slug || '').toLowerCase() === String(categoryKey).toLowerCase() ||
      String(c.id || '').toLowerCase() === String(categoryKey).toLowerCase()
  )

  const isGraphicCategory = Boolean(
    matchedGraphicService ||
    (dbCategory && dbCategory.serviceType === 'graphic') ||
    (graphicCategories && graphicCategories.some((c) => String(c.slug || c.id || '').toLowerCase() === String(categoryKey).toLowerCase()))
  )

  const catInfo = dynamicCatInfo || {
    name: dbCategory?.name || '',
    link: dbCategory?.slug ? `/${dbCategory.slug}` : '/',
    products: Array.isArray(dbCategory?.products) ? dbCategory.products : [],
    qualityLabel: dbCategory?.qualityLabel || '',
    styleLabel: dbCategory?.styleLabel || '',
    defaultQtyOptions: Array.isArray(dbCategory?.defaultQtyOptions) ? dbCategory.defaultQtyOptions : [],
    defaultQualityOptions: Array.isArray(dbCategory?.defaultQualityOptions) ? dbCategory.defaultQualityOptions : [],
    defaultStyleOptions: Array.isArray(dbCategory?.defaultStyleOptions) ? dbCategory.defaultStyleOptions : [],
    defaultSpecs: Array.isArray(dbCategory?.defaultSpecs) ? dbCategory.defaultSpecs : [],
  }

  const activeFaqs = Array.isArray(dbCategory?.faqs) ? dbCategory.faqs : []
  const productList = catInfo.products || []
  const staticProduct = matchedService
    ? {
      ...matchedService,
      id: matchedService.id,
      title: matchedService.title || matchedService.name || '',
      price: matchedService.price || '',
      description: matchedService.description || matchedService.desc || '',
      image: matchedService.image || '',
      images: Array.isArray(matchedService.images) ? matchedService.images : [],
      badge: matchedService.badge || ''
    }
    : productList.find((p) => String(p.id) === String(productId) || String(p.numericId) === String(productId)) || productList[0] || {}

  const product = dbProduct
    ? {
      ...staticProduct,
      ...dbProduct,
      title: dbProduct.title || dbProduct.name || staticProduct.title,
      description: dbProduct.description || dbProduct.desc || staticProduct.description,
    }
    : staticProduct

  const effectiveQtyOptions = useMemo(() => {
    if (product.quantityTiers && Array.isArray(product.quantityTiers) && product.quantityTiers.length > 0) {
      return product.quantityTiers
    }
    return (Array.isArray(catInfo.defaultQtyOptions) ? catInfo.defaultQtyOptions : []).map((q) =>
      typeof q === 'string' ? { label: q, priceModifier: 0 } : q
    )
  }, [product.quantityTiers, catInfo.defaultQtyOptions])

  const effectiveQualityOptions = useMemo(() => {
    if (product.qualityOptions && Array.isArray(product.qualityOptions) && product.qualityOptions.length > 0) {
      return product.qualityOptions
    }
    return catInfo.defaultQualityOptions || []
  }, [product.qualityOptions, catInfo.defaultQualityOptions])

  const effectiveStyleOptions = useMemo(() => {
    if (product.styleOptions && Array.isArray(product.styleOptions) && product.styleOptions.length > 0) {
      return product.styleOptions
    }
    return catInfo.defaultStyleOptions || []
  }, [product.styleOptions, catInfo.defaultStyleOptions])

  const effectiveSpecs = useMemo(() => {
    if (product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0) {
      return product.specifications
    }
    return catInfo.defaultSpecs || []
  }, [product.specifications, catInfo.defaultSpecs])

  const effectiveCustomOptions = useMemo(() => {
    return Array.isArray(product.customOptions) ? product.customOptions : []
  }, [product.customOptions])

  const [selectedQty, setSelectedQty] = useState(() => {
    const first = Array.isArray(catInfo.defaultQtyOptions) && catInfo.defaultQtyOptions[0]
    return typeof first === 'object' ? (first?.label || '') : (first || '')
  })
  const [selectedQuality, setSelectedQuality] = useState(() => (Array.isArray(catInfo.defaultQualityOptions) && catInfo.defaultQualityOptions[0]?.id) || '')
  const [selectedStyle, setSelectedStyle] = useState(() => (Array.isArray(catInfo.defaultStyleOptions) && catInfo.defaultStyleOptions[0]?.id) || '')
  const [selectedCustomOptions, setSelectedCustomOptions] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState([]) // Up to 2 File objects
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]) // Up to 2 preview data URLs
  const uploadedGraphicFile = uploadedFiles[0] || null
  const uploadedImageUrl = uploadedImageUrls[0] || null
  const [orderPathway, setOrderPathway] = useState('choose') // 'choose' | 'upload'
  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('Description')
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [isMounted] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (effectiveQtyOptions.length > 0 && !effectiveQtyOptions.some(q => (typeof q === 'object' ? q.label : q) === selectedQty)) {
      const first = effectiveQtyOptions[0]
      setSelectedQty(typeof first === 'object' ? first.label : first)
    }
    if (effectiveQualityOptions.length > 0 && !effectiveQualityOptions.some(q => q.id === selectedQuality)) {
      setSelectedQuality(effectiveQualityOptions[0].id)
    }
    if (effectiveStyleOptions.length > 0 && !effectiveStyleOptions.some(s => s.id === selectedStyle)) {
      setSelectedStyle(effectiveStyleOptions[0].id)
    }
    if (effectiveCustomOptions.length > 0) {
      setSelectedCustomOptions((prev) => {
        const next = { ...prev }
        let changed = false
        effectiveCustomOptions.forEach((opt, idx) => {
          if (!next[idx] && opt.choices && opt.choices.length > 0) {
            next[idx] = opt.choices[0].label
            changed = true
          }
        })
        return changed ? next : prev
      })
    }
  }, [effectiveQtyOptions, effectiveQualityOptions, effectiveStyleOptions, effectiveCustomOptions, selectedQty, selectedQuality, selectedStyle])

  const calculatedTotalPrice = useMemo(() => {
    let base = Number(product.numericPrice)
    if (!base && product.price) {
      const match = product.price.toString().replace(/[^0-9.]/g, '')
      base = match ? parseFloat(match) : 249
    }
    if (!base || isNaN(base)) base = 249

    const selectedQtyObj = effectiveQtyOptions.find(q => (typeof q === 'object' ? q.label : q) === selectedQty)
    const qtyMod = (selectedQtyObj && typeof selectedQtyObj === 'object' && selectedQtyObj.priceModifier) ? Number(selectedQtyObj.priceModifier) : 0

    const selectedQualityObj = effectiveQualityOptions.find(q => q.id === selectedQuality)
    const qualityMod = selectedQualityObj?.priceModifier ? Number(selectedQualityObj.priceModifier) : 0

    const selectedStyleObj = effectiveStyleOptions.find(s => s.id === selectedStyle)
    const styleMod = selectedStyleObj?.priceModifier ? Number(selectedStyleObj.priceModifier) : 0

    let customMod = 0
    effectiveCustomOptions.forEach((opt, idx) => {
      const choiceLabel = selectedCustomOptions[idx]
      const choiceObj = (opt.choices || []).find(c => c.label === choiceLabel)
      if (choiceObj && choiceObj.priceModifier) {
        customMod += Number(choiceObj.priceModifier) || 0
      }
    })

    return base + qtyMod + qualityMod + styleMod + customMod
  }, [product, effectiveQtyOptions, effectiveQualityOptions, effectiveStyleOptions, effectiveCustomOptions, selectedQty, selectedQuality, selectedStyle, selectedCustomOptions])
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
    if (orderPathway === 'upload' && uploadedFiles.length === 0 && !isGraphicCategory) {
      if (!confirm('You have not attached a custom design file yet. Do you want to continue adding this item to your cart?')) {
        return
      }
    }
    const userId = currentUser ? currentUser.id : null
    const qualityObj = effectiveQualityOptions.find((q) => q.id === selectedQuality)
    const styleObj = effectiveStyleOptions.find((s) => s.id === selectedStyle)
    const customSelectionsList = effectiveCustomOptions.map((opt, idx) => ({
      name: opt.name || 'Option',
      choice: selectedCustomOptions[idx] || (opt.choices?.[0]?.label || '')
    }))
    const itemPayload = {
      productId: product.id || product.numericId || '1',
      title: product.title,
      price: `₹${calculatedTotalPrice.toLocaleString('en-IN')}`,
      numericPrice: calculatedTotalPrice,
      image: uploadedImageUrl || product.image,
      category: categoryKey,
      qtyOption: isGraphicCategory ? '1 Custom Design Service' : selectedQty,
      quality: isGraphicCategory ? (uploadedFiles.length > 0 ? `Uploaded Files (${uploadedFiles.length}): ${uploadedFiles.map(f => f.name).join(', ')}` : 'Custom Artwork Requirement') : (qualityObj ? qualityObj.title : selectedQuality),
      style: isGraphicCategory ? 'Custom Design Requirement' : (styleObj ? styleObj.title : selectedStyle),
      customSelections: customSelectionsList,
      quantity: 1,
      uploadedFile: uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(' | ') : null,
      uploadedFiles: uploadedFiles.map(f => f.name),
      uploadedImageUrl: uploadedImageUrl || null,
      uploadedImageUrls: uploadedImageUrls.filter(Boolean),
      orderPathway: uploadedFiles.length > 0 || orderPathway === 'upload' ? 'Upload Custom Design' : 'Browse Studio Templates'
    }
    addToCart(userId, itemPayload)
    if (userId !== null) {
      addToCart(null, itemPayload)
    }
    showProductToast('Added to Cart! Redirecting...')
    setTimeout(() => {
      router.push('/cart')
    }, 700)
  }

  const handleAddToWishlistAction = () => {
    const userId = currentUser ? currentUser.id : null
    const qualityObj = effectiveQualityOptions.find((q) => q.id === selectedQuality)
    const styleObj = effectiveStyleOptions.find((s) => s.id === selectedStyle)
    const customSelectionsList = effectiveCustomOptions.map((opt, idx) => ({
      name: opt.name || 'Option',
      choice: selectedCustomOptions[idx] || (opt.choices?.[0]?.label || '')
    }))
    addToWishlist(userId, {
      productId: product.id || product.numericId || '1',
      title: product.title,
      price: `₹${calculatedTotalPrice.toLocaleString('en-IN')}`,
      numericPrice: calculatedTotalPrice,
      image: uploadedImageUrl || product.image,
      category: categoryKey,
      qtyOption: selectedQty,
      quality: qualityObj ? qualityObj.title : selectedQuality,
      style: styleObj ? styleObj.title : selectedStyle,
      customSelections: customSelectionsList,
      uploadedFile: uploadedFiles.length > 0 ? uploadedFiles.map(f => f.name).join(' | ') : null,
      uploadedFiles: uploadedFiles.map(f => f.name),
      uploadedImageUrl: uploadedImageUrl || null,
      uploadedImageUrls: uploadedImageUrls.filter(Boolean)
    })
    setIsWishlisted(true)
    showProductToast('Saved to Wishlist!')
  }

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove))
    setUploadedImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      alert(`Opening File Uploader for "${product.title}"...\nSelected Quantity: ${selectedQty}\nQuality ID: ${selectedQuality}\nStyle ID: ${selectedStyle}`)
    }
  }

  const handleOnlineEditor = () => {
    try {
      if (typeof window !== 'undefined') {
        const qualityObj = effectiveQualityOptions.find((q) => q.id === selectedQuality)
        const styleObj = effectiveStyleOptions.find((s) => s.id === selectedStyle)
        const customSelectionsObj = {}
        effectiveCustomOptions.forEach((opt, idx) => {
          const name = opt.name || `Option_${idx}`
          customSelectionsObj[name] = selectedCustomOptions[idx] || (opt.choices?.[0]?.label || '')
        })

        sessionStorage.setItem('a2v_product_options', JSON.stringify({
          productId: product.id || product.numericId || '1',
          productTitle: product.title,
          categoryKey,
          qualityLabel: catInfo.qualityLabel || 'Quality / Stock',
          styleLabel: catInfo.styleLabel || 'Style / Printing',
          effectiveQtyOptions,
          effectiveQualityOptions,
          effectiveStyleOptions,
          effectiveCustomOptions,
          selectedQty,
          selectedQuality: qualityObj ? (qualityObj.title || qualityObj.id) : selectedQuality,
          selectedStyle: styleObj ? (styleObj.title || styleObj.id) : selectedStyle,
          customSelections: customSelectionsObj,
          selectedPrice: calculatedTotalPrice,
          formattedPrice: `₹${calculatedTotalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }))
      }
    } catch (e) {}
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

            <div className="mt-4 mb-6 flex flex-wrap items-center justify-between gap-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#c84b00] block mb-0.5">Calculated Total Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#c84b00] tracking-tight">
                    ₹{calculatedTotalPrice.toLocaleString('en-IN')}
                  </span>
                  {calculatedTotalPrice > (Number(product.numericPrice) || 249) && (
                    <span className="text-xs text-slate-600 font-semibold">(includes selected options)</span>
                  )}
                </div>
              </div>
              <div className="text-right text-xs font-bold text-slate-600">
                <div className="text-emerald-700 flex items-center gap-1 justify-end">
                  <span>✓</span> Live Pricing Active
                </div>
                <div className="text-slate-400 font-medium">Updates with quantity & add-ons</div>
              </div>
            </div>

            <hr className="border-slate-200/80 mb-6" />

            {isGraphicCategory ? (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Upload Custom Design & Requirement Brief (Up to 2 Photos/Files)
                  </label>
                  <span className="text-[11px] font-extrabold text-[#F06800] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {uploadedFiles.length}/2 Photos Added
                  </span>
                </div>
                <div className="bg-slate-50/80 border-2 border-dashed border-[#F06800]/40 rounded-2xl p-6 text-center transition-all hover:border-[#F06800]">
                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {uploadedFiles.map((file, idx) => {
                          const imgUrl = uploadedImageUrls[idx]
                          return (
                            <div key={idx} className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-orange-300 transition-all">
                              <div className="flex items-center gap-3 min-w-0">
                                {imgUrl ? (
                                  <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0 shadow-2xs" />
                                ) : (
                                  <span className="w-12 h-12 rounded-xl bg-orange-100 text-[#F06800] flex items-center justify-center font-bold text-base shrink-0">📄</span>
                                )}
                                <div className="text-left min-w-0 truncate">
                                  <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-100 text-[#F06800] mb-0.5">
                                    {idx === 0 ? 'Photo #1 (Front)' : 'Photo #2 (Back)'}
                                  </span>
                                  <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                                  <p className="text-xs text-emerald-600 font-bold">✓ Attached</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(idx)}
                                className="text-rose-500 hover:text-rose-700 text-xs font-extrabold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                              >
                                Remove
                              </button>
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
                        {uploadedFiles.length < 2 ? (
                          <button
                            type="button"
                            onClick={handleUpload}
                            className="flex items-center gap-1.5 text-xs font-extrabold bg-[#F06800] hover:bg-[#d55c00] text-white px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
                          >
                            <span>+ Add 2nd Photo / File</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            ✓ Maximum 2 photos attached
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFiles([])
                            setUploadedImageUrls([])
                          }}
                          className="text-xs font-extrabold text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={handleUpload}
                      className="cursor-pointer flex flex-col items-center justify-center py-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-orange-100 text-[#F06800] flex items-center justify-center mb-2.5 shadow-2xs">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <span className="text-sm font-extrabold text-slate-800 block">Click or Browse to Upload Up to 2 Photos/Files</span>
                      <span className="text-xs text-slate-500 block mt-1">Supports Front & Back photos, PDF, AI, PSD, PNG, JPG or ZIP requirement brief</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {orderPathway === 'choose' ? (
                  /* STEP 1: CHOOSE PATHWAY (Upload Custom Design vs Browse Studio Templates) */
                  <div className="space-y-4 mb-8">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Choose Your Order Pathway</span>
                      <span className="text-[11px] font-bold text-[#F06800] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">2 Options Available</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* OPTION 1: Upload Custom Design Card */}
                      <div
                        onClick={() => setOrderPathway('upload')}
                        className="group bg-white hover:bg-orange-50/40 border-2 border-slate-200 hover:border-[#F06800] rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg flex flex-col justify-between relative overflow-hidden"
                      >
                        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-orange-100/50 group-hover:bg-orange-200/50 transition-all pointer-events-none" />
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#F06800] to-[#ff520a] text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#F06800] transition-colors">
                            Upload Custom Design
                          </h3>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                            Already have your artwork ready? Upload your print-ready files (PDF, AI, PSD, PNG, JPG), select your quantity and card specifications, and add directly to your cart.
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-extrabold text-xs text-[#F06800]">
                          <span>Select & Upload Artwork</span>
                          <span className="transform group-hover:translate-x-1.5 transition-transform text-sm">→</span>
                        </div>
                      </div>

                      {/* OPTION 2: Browse Studio Templates Card */}
                      <div
                        onClick={handleOnlineEditor}
                        className="group bg-white hover:bg-sky-50/40 border-2 border-slate-200 hover:border-[#0070e0] rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg flex flex-col justify-between relative overflow-hidden"
                      >
                        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-sky-100/50 group-hover:bg-sky-200/50 transition-all pointer-events-none" />
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#0070e0] to-[#38bdf8] text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 73h6m-6 4h6m-6 4h6" />
                            </svg>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0070e0] transition-colors">
                            Browse Studio Templates
                          </h3>
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                            Create or customize your design using our interactive online studio and professional pre-made templates. Review your design and finalize quantity before adding to cart.
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between font-extrabold text-xs text-[#0070e0]">
                          <span>Explore Studio & Templates</span>
                          <span className="transform group-hover:translate-x-1.5 transition-transform text-sm">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* PATHWAY 1: UPLOAD CUSTOM DESIGN FORM (Shows upload area + quantity + all options + Add to Cart) */
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between bg-orange-50/80 border border-orange-200/80 p-4 rounded-2xl">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-[#F06800] text-white flex items-center justify-center font-bold text-sm">1</span>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">Upload Custom Design Mode</h4>
                          <p className="text-[11px] text-slate-600">Attach files below, pick quantity, and add to cart.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOrderPathway('choose')}
                        className="text-xs font-extrabold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
                      >
                        ← Change Option
                      </button>
                    </div>

                    {/* Upload Dropzone & Live Image Preview */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Upload Your Print-Ready Artwork (Up to 2 Photos/Files)*
                        </label>
                        <span className="text-[11px] font-extrabold text-[#F06800] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                          {uploadedFiles.length}/2 Photos Added
                        </span>
                      </div>
                      <div className="bg-slate-50/80 border-2 border-dashed border-[#F06800]/50 rounded-3xl p-6 text-center transition-all hover:border-[#F06800]">
                        {uploadedFiles.length > 0 ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {uploadedFiles.map((file, idx) => {
                                const imgUrl = uploadedImageUrls[idx]
                                return (
                                  <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-orange-300 transition-all">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                      {imgUrl ? (
                                        <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0 shadow-2xs" />
                                      ) : (
                                        <span className="w-14 h-14 rounded-xl bg-orange-100 text-[#F06800] flex items-center justify-center font-black text-xl shrink-0">📄</span>
                                      )}
                                      <div className="text-left min-w-0 truncate">
                                        <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-100 text-[#F06800] mb-1">
                                          {idx === 0 ? 'Photo #1 (Front)' : 'Photo #2 (Back)'}
                                        </span>
                                        <p className="text-sm font-extrabold text-slate-900 truncate">{file.name}</p>
                                        <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                                          <span>✓ Attached</span>
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFile(idx)}
                                      className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-extrabold px-3 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
                              {uploadedFiles.length < 2 ? (
                                <button
                                  type="button"
                                  onClick={handleUpload}
                                  className="flex items-center gap-2 text-xs font-extrabold bg-[#F06800] hover:bg-[#d55c00] text-white px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                                >
                                  <span>+ Add 2nd Photo / File (Optional)</span>
                                </button>
                              ) : (
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                                  ✓ Maximum 2 photos / files added
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setUploadedFiles([])
                                  setUploadedImageUrls([])
                                }}
                                className="text-xs font-extrabold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                              >
                                Clear All
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={handleUpload}
                            className="cursor-pointer flex flex-col items-center justify-center py-6"
                          >
                            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#F06800] flex items-center justify-center mb-3 shadow-sm transform hover:scale-105 transition-transform">
                              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                            </div>
                            <span className="text-base font-extrabold text-slate-900 block">Click or Browse to Upload Up to 2 Photos/Files</span>
                            <span className="text-xs text-slate-500 font-medium block mt-1.5">You can attach 2 photos (Front & Back or reference images). Supports PNG, JPG, PDF, AI, PSD</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Select Quantity
                      </label>
                      <select
                        value={selectedQty}
                        onChange={(e) => setSelectedQty(e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F06800] focus:border-[#F06800] transition-all shadow-xs cursor-pointer"
                      >
                        {effectiveQtyOptions.map((qty, idx) => {
                          const label = typeof qty === 'object' ? qty.label : qty
                          const mod = (typeof qty === 'object' && qty.priceModifier) ? Number(qty.priceModifier) : 0
                          return (
                            <option key={idx} value={label}>
                              {label} {mod > 0 ? `(+₹${mod})` : ''}
                            </option>
                          )
                        })}
                      </select>
                    </div>

                    {/* Dynamic Custom Variables & Selected Details */}
                    {effectiveCustomOptions.length > 0 && (
                      <div className="space-y-6 pt-4 border-t border-slate-200/80">
                        {effectiveCustomOptions.map((opt, optIdx) => (
                          <div key={optIdx}>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span>{opt.name || `Custom Option ${optIdx + 1}`}</span>
                              {opt.required && <span className="text-[10px] text-[#F06800] font-bold">Required</span>}
                            </label>
                            {opt.type === 'dropdown' ? (
                              <select
                                value={selectedCustomOptions[optIdx] || ''}
                                onChange={(e) => setSelectedCustomOptions((prev) => ({ ...prev, [optIdx]: e.target.value }))}
                                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#F06800] focus:border-[#F06800] transition-all cursor-pointer"
                              >
                                {(opt.choices || []).map((c, cIdx) => (
                                  <option key={cIdx} value={c.label}>
                                    {c.label} {c.priceModifier ? `(+₹${c.priceModifier})` : ''}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {(opt.choices || []).map((c, cIdx) => {
                                  const isSelected = selectedCustomOptions[optIdx] === c.label
                                  const mod = Number(c.priceModifier) || 0
                                  return (
                                    <button
                                      key={cIdx}
                                      type="button"
                                      onClick={() => setSelectedCustomOptions((prev) => ({ ...prev, [optIdx]: c.label }))}
                                      className={`p-3 rounded-xl text-center cursor-pointer transition-all duration-200 flex items-center justify-between px-4 border-2 select-none ${
                                        isSelected
                                          ? 'bg-[#fff3ec] border-[#F06800] text-[#c84b00] shadow-xs font-bold'
                                          : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 font-medium'
                                      }`}
                                    >
                                      <span className="text-sm">{c.label}</span>
                                      {mod > 0 ? (
                                        <span className={`text-xs font-extrabold ${isSelected ? 'text-[#F06800]' : 'text-slate-500'}`}>
                                          +₹{mod}
                                        </span>
                                      ) : (
                                        <span className="text-[11px] text-slate-400">Included</span>
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*,.pdf,.ai,.psd,.png,.jpg,.jpeg,.zip,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length > 0) {
                  setUploadedFiles((prevFiles) => {
                    const combined = files.length >= 2 ? files.slice(0, 2) : [...prevFiles, ...files].slice(0, 2)
                    combined.forEach((file, idx) => {
                      if (file.type && file.type.startsWith('image/')) {
                        compressImageForStorage(file, 600, 600, 0.65).then((compressedUrl) => {
                          setUploadedImageUrls((prevUrls) => {
                            const updated = [...(prevUrls || [])]
                            updated[idx] = compressedUrl
                            return updated
                          })
                        })
                      } else {
                        setUploadedImageUrls((prevUrls) => {
                          const updated = [...(prevUrls || [])]
                          updated[idx] = null
                          return updated
                        })
                      }
                    })
                    return combined
                  })
                  const names = files.slice(0, 2).map(f => f.name).join(', ')
                  showProductToast(`Attached "${names}" to your order!`)
                }
              }}
            />

            {isGraphicCategory ? (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleUpload}
                  className="bg-[linear-gradient(90deg,#ff520a_0%,#ff0a6c_100%)] hover:opacity-95 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition-all transform hover:scale-[1.01] active:scale-95 text-sm cursor-pointer w-full sm:flex-1 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {uploadedFiles.length > 0 ? `Add / Change Photos (${uploadedFiles.length}/2)` : 'Upload Custom Design (Up to 2 Photos)'}
                </button>
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
            ) : (
              orderPathway === 'upload' && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="bg-linear-to-r from-[#F06800] via-[#ff520a] to-[#f54278] hover:opacity-95 text-white font-extrabold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 text-base cursor-pointer w-full flex items-center justify-center gap-2.5"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Add to Cart with Uploaded Design</span>
                  </button>
                </div>
              )
            )}

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
                  <li>Standard Size: {effectiveSpecs[2]?.value || '3.5" x 2.0"'}</li>
                  <li>Full-color high resolution printing on front (back optional)</li>
                  <li>Premium base material designed for durability and executive feel</li>
                </ul>
              </div>
            )}

            {activeTab === 'Paper & Specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/60 p-6 sm:p-8 rounded-2xl border border-slate-200/60 animate-fadeIn">
                {effectiveSpecs.map((spec, idx) => (
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
        {activeFaqs && activeFaqs.length > 0 && (
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
              {activeFaqs.map((faq, idx) => {
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
        )}
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
