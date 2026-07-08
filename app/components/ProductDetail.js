'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import visitingCardsData from '../visiting-cards/products.json'
import bannerPosterData from '../banner-poster/products.json'
import customTshirtsData from '../custom-tshirts/products.json'
import flexBoardData from '../flex-board/products.json'
import packagingLabelingData from '../packaging-labeling/products.json'
import mugsDrinkwareData from '../mugs-drinkware/products.json'
import hoodiesJacketsData from '../hoodies-jackets/products.json'
import { graphicServicesList } from '../lib/graphicServicesData'

const categoryMap = {
  'visiting-cards': {
    name: 'Visiting Cards',
    link: '/visiting-cards',
    products: visitingCardsData?.products || [],
    qualityLabel: 'Paper Quality',
    styleLabel: 'Corner Style',
    defaultQtyOptions: ['100 Cards', '250 Cards', '500 Cards', '1000 Cards'],
    defaultQualityOptions: [
      { id: 'matte', title: 'Premium Matte', subtitle: 'Smooth & Elegant' },
      { id: 'glossy', title: 'Premium Glossy', subtitle: 'Vibrant & Shiny' }
    ],
    defaultStyleOptions: [
      { id: 'standard', title: 'Standard', subtitle: 'Crisp 90° edges' },
      { id: 'rounded', title: 'Rounded', subtitle: 'Smooth 1/4" radius' }
    ],
    defaultSpecs: [
      { label: 'Paper Thickness', value: '300 - 350 GSM Premium Cardstock' },
      { label: 'Finish Options', value: 'Smooth Matte, High-Gloss UV, Spot UV, or Foil Stamping' },
      { label: 'Dimensions', value: 'Standard 3.5" x 2.0" (88.9mm x 50.8mm)' },
      { label: 'Printing', value: 'High-resolution 1200 DPI digital & offset printing' },
      { label: 'Corner Radius', value: 'Standard 90° square corners or 0.25" rounded corners' }
    ]
  },
  'custom-tshirts': {
    name: 'Custom T-Shirts',
    link: '/custom-tshirts',
    products: customTshirtsData?.products || [],
    qualityLabel: 'Fabric Material',
    styleLabel: 'Collar & Sleeve Style',
    defaultQtyOptions: ['1 Piece', '5 Pieces', '10 Pieces', '25 Pieces', '50 Pieces'],
    defaultQualityOptions: [
      { id: 'cotton', title: '180 GSM Bio-Wash', subtitle: '100% Super Combed Cotton' },
      { id: 'pique', title: '220 GSM Pique', subtitle: 'Rich Polo Collar Fabric' }
    ],
    defaultStyleOptions: [
      { id: 'roundneck', title: 'Round Neck', subtitle: 'Classic regular fit' },
      { id: 'polo', title: 'Polo Collar', subtitle: 'Formal ribbed collar & cuffs' }
    ],
    defaultSpecs: [
      { label: 'Fabric Material', value: '100% Super Combed Bio-Washed Cotton' },
      { label: 'Weight / GSM', value: '180 GSM (Regular) or 220 GSM (Pique Polo)' },
      { label: 'Print Technology', value: 'Direct to Garment (DTG) & High-density Screen Printing' },
      { label: 'Wash Care', value: 'Machine wash cold, inside out. Do not iron directly on print.' },
      { label: 'Available Sizes', value: 'S, M, L, XL, XXL, 3XL (Standard Indian & US fits)' }
    ]
  },
  'banner-poster': {
    name: 'Banner & Poster',
    link: '/banner-poster',
    products: bannerPosterData?.products || [],
    qualityLabel: 'Flex Material Grade',
    styleLabel: 'Mounting & Finishing',
    defaultQtyOptions: ['1 Banner', '2 Banners', '5 Banners', '10 Banners'],
    defaultQualityOptions: [
      { id: 'vinyl330', title: '330 GSM Flex Vinyl', subtitle: 'Standard weatherproof display' },
      { id: 'star500', title: '500 GSM Star Flex', subtitle: 'Heavy-duty tear resistant' }
    ],
    defaultStyleOptions: [
      { id: 'eyelets', title: 'Metal Grommets', subtitle: 'Reinforced brass eyelets on corners' },
      { id: 'pockets', title: 'Pole Pockets', subtitle: 'Top & bottom sleeves for hanging' }
    ],
    defaultSpecs: [
      { label: 'Material', value: 'Premium waterproof PVC Flex / Vinyl canvas' },
      { label: 'Printing', value: 'UV resistant solvent & eco-solvent wide-format printing' },
      { label: 'Weather Resistance', value: '100% waterproof and fade-resistant in direct sunlight' },
      { label: 'Finishing', value: 'Welded reinforced hems with rust-proof metal eyelets' }
    ]
  },
  'flex-board': {
    name: 'Flex Board',
    link: '/flex-board',
    products: flexBoardData?.products || [],
    qualityLabel: 'Lighting Type',
    styleLabel: 'Frame Framing Structure',
    defaultQtyOptions: ['1 Board', '2 Boards', '5 Boards'],
    defaultQualityOptions: [
      { id: 'frontlit', title: 'Frontlit Shop Board', subtitle: 'For external illumination' },
      { id: 'backlit', title: 'Backlit Glow Sign', subtitle: 'High light transmission box' }
    ],
    defaultStyleOptions: [
      { id: 'ironframe', title: 'Iron Frame Mounted', subtitle: 'Sturdy square pipe framing' },
      { id: 'sheetonly', title: 'Flex Sheet Only', subtitle: 'Printed roll without frame' }
    ],
    defaultSpecs: [
      { label: 'Board Type', value: 'Frontlit PVC Flex or Translucent Backlit Glow Sign' },
      { label: 'Frame Structure', value: 'Heavy-duty 1x1 inch hollow iron square pipe framing' },
      { label: 'Durability', value: '3+ years outdoor weather and UV resistance' },
      { label: 'Installation', value: 'Wall mount hooks and corner support brackets included' }
    ]
  },
  'packaging-labeling': {
    name: 'Packaging & Labeling',
    link: '/packaging-labeling',
    products: packagingLabelingData?.products || [],
    qualityLabel: 'Box / Board Material',
    styleLabel: 'Lamination & Finish',
    defaultQtyOptions: ['100 Units', '250 Units', '500 Units', '1000 Units'],
    defaultQualityOptions: [
      { id: 'corrugated', title: '3-Ply Corrugated', subtitle: 'Sturdy shipping protection' },
      { id: 'rigid', title: 'Rigid Luxury Box', subtitle: 'Premium magnetic or lid finish' }
    ],
    defaultStyleOptions: [
      { id: 'matte', title: 'Matte Lamination', subtitle: 'Soft touch non-reflective finish' },
      { id: 'gloss', title: 'Gloss & Spot UV', subtitle: 'High shine with raised highlights' }
    ],
    defaultSpecs: [
      { label: 'Material Grade', value: 'High-strength 3-ply / 5-ply corrugated Kraft or 350 GSM Duplex board' },
      { label: 'Printing', value: 'Offset CMYK full color printing with food-grade non-toxic inks' },
      { label: 'Surface Finish', value: 'Thermal matte lamination, gloss lamination, or foil stamping' },
      { label: 'Customization', value: 'Exact die-cut custom dimensions tailored to product size' }
    ]
  },
  'mugs-drinkware': {
    name: 'Mugs & Drinkware',
    link: '/mugs-drinkware',
    products: mugsDrinkwareData?.products || [],
    qualityLabel: 'Drinkware Material',
    styleLabel: 'Branding Method',
    defaultQtyOptions: ['1 Unit', '4 Units', '10 Units', '25 Units', '50 Units'],
    defaultQualityOptions: [
      { id: 'ceramic', title: 'AAA Grade Ceramic', subtitle: 'Glossy white microwave safe' },
      { id: 'stainless', title: '304 Stainless Steel', subtitle: 'Double-wall vacuum insulated' }
    ],
    defaultStyleOptions: [
      { id: 'sublimation', title: 'Wrap Sublimation', subtitle: 'Edge-to-edge photo printing' },
      { id: 'uvlogo', title: 'Laser Engraved / UV', subtitle: 'Permanent tactile logo finish' }
    ],
    defaultSpecs: [
      { label: 'Capacity', value: 'Standard 330 ml (11 oz) Mugs / 500 ml Insulated Bottles' },
      { label: 'Material', value: '100% Non-toxic, BPA-free AAA ceramic or 304 food-grade stainless steel' },
      { label: 'Print Durability', value: 'Fade-proof sublimation printing resistant to 1000+ dishwasher cycles' },
      { label: 'Temperature Retention', value: 'Insulated bottles keep liquids hot for 12 hrs & cold for 24 hrs' }
    ]
  },
  'hoodies-jackets': {
    name: 'Hoodies & Winterwear',
    link: '/hoodies-jackets',
    products: hoodiesJacketsData?.products || [],
    qualityLabel: 'Fleece Material Grade',
    styleLabel: 'Closure & Style Type',
    defaultQtyOptions: ['1 Piece', '5 Pieces', '10 Pieces', '25 Pieces'],
    defaultQualityOptions: [
      { id: 'fleece320', title: '320 GSM Cotton Fleece', subtitle: 'Ultra cozy brushed interior' },
      { id: 'jacket400', title: 'Windproof Softshell', subtitle: 'Water-resistant outer layer' }
    ],
    defaultStyleOptions: [
      { id: 'pullover', title: 'Pullover Hoodie', subtitle: 'Kangaroo pocket & drawstring hood' },
      { id: 'zipper', title: 'Full Zip Jacket', subtitle: 'Premium YKK metal zipper & stand collar' }
    ],
    defaultSpecs: [
      { label: 'Fabric Composition', value: '80% Combed Cotton, 20% Polyester premium fleece' },
      { label: 'Weight / Thickness', value: 'Heavyweight 320 to 360 GSM for superior warmth and structure' },
      { label: 'Branding Options', value: 'High-definition computerized embroidery or DTF heat transfer' },
      { label: 'Fit & Finish', value: 'Pre-shrunk fabric with ribbed spandex cuffs and hem' },
      { label: 'Available Sizes', value: 'S, M, L, XL, XXL, 3XL (Unisex regular & oversized fits)' }
    ]
  }
}

const categoryFaqs = {
  'visiting-cards': [
    { question: 'What is the standard turnaround time for visiting cards?', answer: 'Standard printing takes 2–3 business days after proof approval. Express priority dispatch is also available at checkout for 1–2 day delivery.' },
    { question: 'Can I print on both sides of my business card?', answer: 'Yes! Full-color double-sided printing is available. You can configure front and back artwork in our online design studio.' },
    { question: 'What file formats are accepted for uploading designs?', answer: 'We accept PDF, AI, EPS, PSD, high-res PNG, and JPG files. Please ensure artwork is set to 300 DPI with a 3mm (0.125") bleed margin.' },
    { question: 'What is the difference between Matte and Gloss finishes?', answer: 'Premium Matte gives a smooth, non-reflective executive look, while Gloss provides a vibrant, shiny coating that makes colors and images pop.' }
  ],
  'custom-tshirts': [
    { question: 'What fabric composition is used for apparel printing?', answer: 'We use 100% super combed bio-washed cotton (180 GSM) for round-neck t-shirts and premium 220 GSM pique fabric for polo collar shirts.' },
    { question: 'Will the customized print fade or crack after washing?', answer: 'No, our advanced Direct-to-Garment (DTG) and high-density screen printing inks bond directly with fabric fibers, ensuring durability across 50+ wash cycles.' },
    { question: 'Can I order different sizes within a single bulk order?', answer: 'Absolutely! When placing a bulk order or requesting a corporate quote, you can specify an exact size breakdown across S, M, L, XL, XXL, and 3XL.' },
    { question: 'What are the wash and care instructions?', answer: 'Machine wash cold inside out with like colors. Tumble dry on low or hang dry. Do not iron directly over the printed graphics.' }
  ],
  'logo-design': [
    { question: 'What deliverables will I receive with my logo design package?', answer: 'You will receive full high-resolution vector source files (AI, EPS, SVG, PDF) along with transparent PNGs and high-res JPEG files optimized for print and digital use.' },
    { question: 'How many revisions are included in the process?', answer: 'We offer unlimited revisions on our standard and premium tiers until you are 100% satisfied with your new brand identity.' },
    { question: 'Who owns the copyright to the finalized logo?', answer: 'Upon final approval and payment, 100% full commercial copyright ownership is transferred directly to you or your company.' },
    { question: 'What is the average delivery time for initial logo concepts?', answer: 'You will receive your first round of custom design concepts within 48 to 72 hours of submitting your design brief.' }
  ],
  'banner-poster': [
    { question: 'Are your banners weatherproof and suitable for outdoor use?', answer: 'Yes! Our 330 GSM flex vinyl and 500 GSM star flex banners are 100% waterproof and UV fade-resistant, designed to withstand severe sunlight and rain.' },
    { question: 'Do banners come with metal eyelets (grommets) for hanging?', answer: 'Yes, all custom banners come standard with welded reinforced hems and rust-proof brass eyelets placed every 2–3 feet for easy mounting.' },
    { question: 'Can I order a banner in a custom size not listed on the site?', answer: 'Yes, we offer wide-format custom sizing up to any dimensions. Please contact our support team for a custom dimension quote.' },
    { question: 'How should I store my flex banner when not in use?', answer: 'Roll the banner loosely with the printed side facing outward. Avoid folding or creasing the canvas to prevent permanent fold marks.' }
  ],
  'flex-board': [
    { question: 'What is the difference between frontlit and backlit flex boards?', answer: 'Frontlit boards are designed for external shop lighting (like spotlights), while translucent backlit boards allow internal LED lights to shine through for illuminated glow signs.' },
    { question: 'Is the iron framing structure included with the board?', answer: 'You can choose between "Iron Frame Mounted" (which includes heavy-duty 1x1 inch square pipe framing) or "Flex Sheet Only" for replacing existing signage.' },
    { question: 'How long will an outdoor shop board last?', answer: 'Our heavy-duty outdoor boards are rated for 3+ years of continuous weather and UV resistance without fading or peeling.' },
    { question: 'Do you provide installation accessories with the board?', answer: 'Yes, all frame-mounted boards come with sturdy wall brackets and mounting hardware for straightforward shop installation.' }
  ],
  'packaging-labeling': [
    { question: 'What grade of board is used for corrugated boxes?', answer: 'We use high-strength 3-ply and 5-ply corrugated Kraft board for shipping cartons, and premium 350 GSM Duplex board for retail product cartons.' },
    { question: 'Are the printing inks food-safe and non-toxic?', answer: 'Yes, we use eco-friendly, food-grade non-toxic CMYK offset printing inks suitable for food, cosmetic, and pharmaceutical packaging.' },
    { question: 'Can I get custom die-cut shapes for product labels and stickers?', answer: 'Yes! We offer exact custom die-cutting in any shape (circles, ovals, rounded rectangles, or custom outline contours) to fit your product bottles and boxes.' },
    { question: 'What is the minimum order quantity (MOQ) for custom boxes?', answer: 'Our standard MOQ starts at just 100 units, making it accessible for small businesses and product launches.' }
  ],
  'mugs-drinkware': [
    { question: 'Are the printed ceramic mugs microwave and dishwasher safe?', answer: 'Yes! Our AAA grade ceramic mugs use permanent sublimation printing that is 100% microwave safe and resistant to over 1,000 dishwasher cycles.' },
    { question: 'What is the capacity and material of the custom water bottles?', answer: 'Our bottles are 500 ml double-wall vacuum insulated 304 food-grade stainless steel, keeping beverages hot for 12 hours and cold for 24 hours.' },
    { question: 'Is edge-to-edge photo printing available on mugs?', answer: 'Yes, our full-wrap sublimation option allows your photos, logos, or artwork to wrap around the entire circumference of the mug.' },
    { question: 'What are the best branding methods for metallic drinkware?', answer: 'For stainless steel bottles, we recommend precision laser engraving for a permanent, tactile finish or high-gloss UV screen printing for colorful logos.' }
  ],
  'hoodies-jackets': [
    { question: 'What fabric thickness and fleece quality do you use for winterwear?', answer: 'Our hoodies are made from heavyweight 320 to 360 GSM combed cotton fleece (80% cotton, 20% polyester) with a super cozy brushed interior.' },
    { question: 'Can I choose between embroidery and print branding?', answer: 'Yes! We offer both high-definition computerized embroidery (ideal for left chest logos) and durable DTF heat transfer printing for large back designs.' },
    { question: 'Are the hoodies pre-shrunk?', answer: 'Yes, all our fleece apparel undergoes pre-shrinking treatments to ensure your hoodies maintain their exact fit and shape after washing.' },
    { question: 'Are unisex fit options available?', answer: 'Yes, our hoodies and jackets feature standard relaxed unisex fits, with sizing ranging from S up to 3XL.' }
  ]
}

const defaultGeneralFaqs = [
  { question: 'How do I submit my custom design or artwork?', answer: 'You can either upload your ready-to-print file (PDF, AI, PSD, PNG, JPG) using the "Upload Design" button or create a design from scratch using our online template studio.' },
  { question: 'What is the standard turnaround and shipping time?', answer: 'Standard production takes 2 to 3 business days after digital proof approval. Express dispatch is also available at checkout for 1–2 day priority delivery.' },
  { question: 'Can I request a custom sample before placing a bulk order?', answer: 'Yes! We offer single-unit sample orders and print sample kits so you can inspect the paper quality, fabric GSM, and color accuracy before ordering in bulk.' },
  { question: 'What is your refund and reprint guarantee policy?', answer: 'We stand by a 100% satisfaction guarantee. If there is any print defect or damage during transit, we will reprint and ship your order immediately at zero extra cost.' }
]

function ProductDetailInner({ category: propCategory, id: propId }) {
  const params = useParams()
  const searchParams = useSearchParams()

  const categoryKey = propCategory || params?.category || 'visiting-cards'
  const productId = propId || params?.id || searchParams?.get('product') || categoryKey || '1'

  const matchedGraphicService = graphicServicesList.find(
    (s) =>
      String(s.id).toLowerCase() === String(productId).toLowerCase() ||
      String(s.id).toLowerCase() === String(categoryKey).toLowerCase()
  )

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

  const catInfo = dynamicCatInfo || categoryMap[categoryKey] || categoryMap['visiting-cards']
  const productList = catInfo.products || []
  const product = matchedGraphicService
    ? {
        id: matchedGraphicService.id,
        title: matchedGraphicService.name,
        price: matchedGraphicService.price,
        description: matchedGraphicService.desc,
        image: matchedGraphicService.image,
        badge: matchedGraphicService.badge || 'Popular'
      }
    : productList.find((p) => String(p.id) === String(productId)) || productList[0] || {
        id: 1,
        title: 'Standard Visiting Cards',
        price: 'From ₹249',
        description: 'Make a lasting impression with premium quality cards. Printed on high-grade cardstock with crisp color fidelity.',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
      }

  const [selectedQty, setSelectedQty] = useState(catInfo.defaultQtyOptions[0])
  const [selectedQuality, setSelectedQuality] = useState(catInfo.defaultQualityOptions[0].id)
  const [selectedStyle, setSelectedStyle] = useState(catInfo.defaultStyleOptions[0].id)
  const [activeTab, setActiveTab] = useState('Description')
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setActiveImageIndex(0)
    setIsWishlisted(false)
  }, [productId])

  const getProductGallery = (prod) => {
    if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
      return prod.images
    }
    const mainImg = prod.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
    
    // Curated high-resolution product showcase images for gallery
    const extraImages = [
      mainImg,
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    ]
    return Array.from(new Set(extraImages)).slice(0, 5)
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

  const handleUpload = () => {
    alert(`Opening File Uploader for "${product.title}"...\nSelected Quantity: ${selectedQty}\nQuality ID: ${selectedQuality}\nStyle ID: ${selectedStyle}`)
  }

  const handleOnlineEditor = () => {
    alert(`Launching Online Editor & Templates for "${product.title}"...\nSelected Quantity: ${selectedQty}\nQuality ID: ${selectedQuality}\nStyle ID: ${selectedStyle}`)
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
                onClick={() => setIsWishlisted(!isWishlisted)}
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
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer shrink-0 transition-all p-0.5 bg-gray-100 flex items-center justify-center relative ${
                        isActiveImg
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
                      className={`p-3.5 rounded-xl text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center border-2 select-none ${
                        isSelected
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
            <div className="mb-2">
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
                      className={`p-3.5 rounded-xl text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center border-2 select-none ${
                        isSelected
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
          </div>
        </div>

        {/* Middle Section: "The Choice is Yours" */}
        <div className="my-16 pt-12 border-t border-slate-100">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 text-center tracking-tight">
            The Choice is Yours
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 text-center mb-10 font-normal">
            How would you like to provide your design?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Card 1: Upload File */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 flex flex-col items-center justify-between text-center shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-xs shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                  Upload Your Ready-to-Print File
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed max-w-xs mx-auto font-normal">
                  Already have a complete design? Upload your PDF, JPG, or PNG directly.
                </p>
              </div>
              <button
                type="button"
                onClick={handleUpload}
                className="bg-[linear-gradient(90deg,#ff520a_0%,#ff0a6c_100%)] hover:opacity-95 text-white font-bold py-3.5 px-8 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm cursor-pointer w-full sm:w-auto min-w-[210px]"
              >
                Upload Design
              </button>
            </div>

            {/* Card 2: Create Online */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 flex flex-col items-center justify-between text-center shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-[#0070f3] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
                  Create Design Online
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed max-w-xs mx-auto font-normal">
                  Start from scratch or customize one of our professional templates using our online editor.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOnlineEditor}
                className="bg-[#221712] hover:bg-black text-white font-bold py-3.5 px-8 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm cursor-pointer w-full sm:w-auto min-w-[210px]"
              >
                Browse Templates
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs (Description, Paper & Specs, Shipping Info) */}
        <div className="mt-16 pt-8 border-t border-slate-200/80 max-w-5xl">
          {/* Tab Headers */}
          <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {['Description', 'Paper & Specs', 'Shipping Info'].map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm sm:text-base pb-3 -mb-px transition-all whitespace-nowrap cursor-pointer select-none ${
                    isActive
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
                <p className="leading-relaxed text-slate-600 font-normal">
                  {product.description} Our {product.title || 'custom prints'} are the perfect networking and branding tool. Printed on high-quality, durable materials, they offer a professional look and feel that leaves a lasting impression. Choose between matte or glossy finishes to perfectly match your brand&apos;s aesthetic. The crisp printing ensures your text is legible and your colors pop, making every connection count.
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
            {(categoryFaqs[categoryKey] || defaultGeneralFaqs).map((faq, idx) => {
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-300 ${
                        isOpen
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
