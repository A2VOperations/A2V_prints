'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { graphicCategories, graphicServicesList } from '../lib/graphicServicesData';
import { printingCategories, printingServicesList } from '../lib/printingServicesData';
import ProductDetail from '../components/ProductDetail';

export default function DynamicCategoryOrServicePage() {
  const params = useParams();
  const slug = params?.category;

  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const [filters, setFilters] = useState({
    turnaround24: false,
    turnaround23: false,
    turnaround35: false,
    vector: false,
    printReady: false,
    sourceFile: false,
    bestseller: false,
    popular: false,
    trending: false,
  });

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAll = () => {
    setFilters({
      turnaround24: false,
      turnaround23: false,
      turnaround35: false,
      vector: false,
      printReady: false,
      sourceFile: false,
      bestseller: false,
      popular: false,
      trending: false,
    });
    setSearchQuery('');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check if slug matches a graphic category
  const matchedGraphicCategory = useMemo(() => {
    return graphicCategories.find(
      (c) =>
        c.slug.toLowerCase() === slug?.toLowerCase() ||
        c.id.toLowerCase() === slug?.toLowerCase()
    );
  }, [slug]);

  // Check if slug matches a printing category
  const matchedPrintingCategory = useMemo(() => {
    return printingCategories.find(
      (c) =>
        c.slug.toLowerCase() === slug?.toLowerCase() ||
        c.id.toLowerCase() === slug?.toLowerCase()
    );
  }, [slug]);

  const matchedCategory = matchedGraphicCategory || matchedPrintingCategory;
  const isPrintingCategory = !!matchedPrintingCategory && !matchedGraphicCategory;

  // Check if slug matches a specific graphic service
  const matchedService = useMemo(() => {
    if (matchedCategory) return null;
    return graphicServicesList.find(
      (s) => s.id.toLowerCase() === slug?.toLowerCase()
    );
  }, [matchedCategory, slug]);

  // Get base services for this category
  const baseServices = useMemo(() => {
    // Printing category → filter from printingServicesList
    if (isPrintingCategory && matchedPrintingCategory) {
      return printingServicesList
        .filter((s) => s.categorySlug === matchedPrintingCategory.slug)
        .filter(
          (s) =>
            searchQuery.trim() === '' ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    // Graphic category → filter from graphicServicesList
    if (matchedGraphicCategory) {
      return graphicServicesList
        .filter(
          (s) =>
            s.categorySlug === matchedGraphicCategory.slug ||
            s.categoryName === matchedGraphicCategory.name
        )
        .filter(
          (s) =>
            searchQuery.trim() === '' ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    // No category matched → show all graphic services
    return graphicServicesList.filter(
      (s) =>
        searchQuery.trim() === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [matchedGraphicCategory, matchedPrintingCategory, isPrintingCategory, searchQuery]);

  const matchesTurnaround = (item, key) => {
    const t = (item.turnaround || '').toLowerCase();
    if (key === 'turnaround24') return t.includes('24') || t.includes('hour');
    if (key === 'turnaround23') return t.includes('2-3') || t.includes('48');
    if (key === 'turnaround35') return t.includes('3-5') || t.includes('4-5') || t.includes('day');
    return false;
  };

  const matchesDeliverable = (item, key) => {
    const dList = item.deliverables || [];
    const text = dList.join(' ').toLowerCase();
    if (key === 'vector') return text.includes('vector') || text.includes('ai') || text.includes('eps') || text.includes('svg');
    if (key === 'printReady') return text.includes('print') || text.includes('pdf') || text.includes('cmyk');
    if (key === 'sourceFile') return text.includes('source') || text.includes('psd') || text.includes('figma') || text.includes('word') || text.includes('docx');
    return false;
  };

  const matchesBadge = (item, key) => {
    const b = (item.badge || '').toLowerCase();
    if (key === 'bestseller') return b.includes('best');
    if (key === 'popular') return b.includes('popular');
    if (key === 'trending') return b.includes('trending') || b.includes('new');
    return false;
  };

  const getCount = (type, key) => {
    return baseServices.filter((item) => {
      if (type === 'turnaround') return matchesTurnaround(item, key);
      if (type === 'deliverable') return matchesDeliverable(item, key);
      if (type === 'badge') return matchesBadge(item, key);
      return true;
    }).length;
  };

  const categoryServices = useMemo(() => {
    return baseServices.filter((item) => {
      const isTurnaroundFiltered = filters.turnaround24 || filters.turnaround23 || filters.turnaround35;
      const matchT = !isTurnaroundFiltered ||
        (filters.turnaround24 && matchesTurnaround(item, 'turnaround24')) ||
        (filters.turnaround23 && matchesTurnaround(item, 'turnaround23')) ||
        (filters.turnaround35 && matchesTurnaround(item, 'turnaround35'));

      const isDeliverableFiltered = filters.vector || filters.printReady || filters.sourceFile;
      const matchD = !isDeliverableFiltered ||
        (filters.vector && matchesDeliverable(item, 'vector')) ||
        (filters.printReady && matchesDeliverable(item, 'printReady')) ||
        (filters.sourceFile && matchesDeliverable(item, 'sourceFile'));

      const isBadgeFiltered = filters.bestseller || filters.popular || filters.trending;
      const matchB = !isBadgeFiltered ||
        (filters.bestseller && matchesBadge(item, 'bestseller')) ||
        (filters.popular && matchesBadge(item, 'popular')) ||
        (filters.trending && matchesBadge(item, 'trending'));

      return matchT && matchD && matchB;
    });
  }, [baseServices, filters]);

  // If viewing a specific service detail page, render full ProductDetail jaisa baaki products ka hai
  if (matchedService) {
    return <ProductDetail category={matchedService.categorySlug} id={matchedService.id} />;
  }

  const heroHeadingMap = {
    'logo-identity-design': { main: 'Build a Powerful', accent: 'Brand Identity.' },
    'graphic-design': { main: 'Creative & Professional', accent: 'Graphic Design.' },
    'web-design': { main: 'High-Converting', accent: 'Web & UI Design.' },
    'digital-marketing': { main: 'Grow Your Business With', accent: 'Digital Marketing.' },
    'outdoor-signage': { main: 'High Impact', accent: 'Outdoor Signage.' },
    'print-design': { main: 'Make a Lasting', accent: 'Impression.' },
    'Product-Merchandize': { main: 'Custom Branded', accent: 'Merchandise.' },
    'Art-Illustration': { main: 'Unique Creative', accent: 'Illustrations.' },
    // Printing categories
    'visiting-cards': { main: 'Make a Lasting', accent: 'First Impression.' },
    'custom-tshirts': { main: 'Wear Your Brand,', accent: 'Own Your Style.' },
    'flex-board': { main: 'High-Visibility', accent: 'Signage & Displays.' },
    'banner-poster': { main: 'Bold, Beautiful', accent: 'Banners & Posters.' },
    'packaging-labeling': { main: 'Package Your Brand', accent: 'Perfectly.' },
    'mugs-drinkware': { main: 'Custom Mugs &', accent: 'Drinkware Gifts.' },
    'hoodies-jackets': { main: 'Premium Custom', accent: 'Hoodies & Jackets.' },
  };

  const currentHero = heroHeadingMap[matchedCategory?.slug] || {
    main: 'Make a Lasting',
    accent: 'Impression.',
  };

  const title = matchedCategory ? matchedCategory.name : 'Business Cards & Design';
  const description = matchedCategory
    ? matchedCategory.description
    : 'Premium design and printing solutions that speak volumes before you even say a word. Choose from a variety of luxurious options, unique styles, and striking finishes to craft a product that is unmistakably yours.';

  const heroImg =
    matchedCategory?.image ||
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-[#FFFBF8] text-slate-800">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#CC3B10] transition-colors">
            Home
          </Link>
          <span className="text-slate-400">›</span>
          <span className="text-[#CC3B10] font-extrabold">{title}</span>
        </nav>
      </div>

      {/* Pastel Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#FEEFEF] via-[#FCECEE] to-[#F8E7F5] p-6 sm:p-10 lg:p-12 border border-pink-100/60 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
                {currentHero.main} <br />
                <span className="text-[#FF4A17]">{currentHero.accent}</span>
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                {description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="#results-grid"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF551D] to-[#FF0055] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
                >
                  Explore Templates
                </Link>
                <button
                  onClick={() => showToast('Upload Design feature initiated! Upload your PDF/AI file.')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm shadow-sm border border-slate-200/80 transition-all cursor-pointer"
                >
                  Upload Design
                </button>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="lg:col-span-5">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-lg bg-white border border-white/60">
                <img
                  src={heroImg}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Filters Sidebar + Results Grid */}
      <main id="results-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Filters Panel */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs h-fit sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">Filters</h2>
                <button
                  onClick={clearAll}
                  className="text-xs font-bold text-slate-400 hover:text-[#CC3B10] transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Turnaround Time Filter */}
              <div className="py-5 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Turnaround Time</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.turnaround24}
                        onChange={() => toggleFilter('turnaround24')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>24 Hours Express</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('turnaround', 'turnaround24')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.turnaround23}
                        onChange={() => toggleFilter('turnaround23')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>2-3 Days Standard</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('turnaround', 'turnaround23')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.turnaround35}
                        onChange={() => toggleFilter('turnaround35')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>3-5+ Days Extended</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('turnaround', 'turnaround35')})</span>
                  </label>
                </div>
              </div>

              {/* Deliverables Included Filter */}
              <div className="py-5 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Deliverables Included</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.vector}
                        onChange={() => toggleFilter('vector')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Vector Source (AI / EPS)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('deliverable', 'vector')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.printReady}
                        onChange={() => toggleFilter('printReady')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Print-Ready High-Res PDF</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('deliverable', 'printReady')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.sourceFile}
                        onChange={() => toggleFilter('sourceFile')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Source Files (PSD / DOCX)</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('deliverable', 'sourceFile')})</span>
                  </label>
                </div>
              </div>

              {/* Service Popularity Filter */}
              <div className="pt-5">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Service Tier</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.bestseller}
                        onChange={() => toggleFilter('bestseller')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Best Seller</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('badge', 'bestseller')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.popular}
                        onChange={() => toggleFilter('popular')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>Popular Choice</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('badge', 'popular')})</span>
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={filters.trending}
                        onChange={() => toggleFilter('trending')}
                        className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                      />
                      <span>New & Trending</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">({getCount('badge', 'trending')})</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Results Header & Grid */}
          <div className="lg:col-span-3">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                Showing <strong className="text-slate-900 font-bold">{categoryServices.length}</strong> results
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Sort by:</span>
                <select className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#CC3B10] shadow-xs cursor-pointer">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Popularity</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryServices.map((service, idx) => (
                <div
                  key={`${service.categorySlug}-${service.id}-${idx}`}
                  className="group bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image block with badges */}
                    <Link
                      href={`/${matchedCategory ? matchedCategory.slug : service.categorySlug}/${service.numericId ?? service.id}`}
                      className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 block mb-4"
                    >
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Price Tag Badge Top Right */}
                      <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white text-[#CC3B10] font-extrabold text-[11px] shadow-sm">
                        {service.price.startsWith('From') ? service.price : `From ${service.price}`}
                      </span>

                      {/* Optional Popular/Trending Badge Top Left */}
                      {service.badge && (
                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-white/95 text-slate-700 font-bold text-[10px] shadow-sm">
                          {service.badge}
                        </span>
                      )}
                    </Link>

                    {/* Title & Description */}
                    <Link href={`/${matchedCategory ? matchedCategory.slug : service.categorySlug}/${service.numericId ?? service.id}`}>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#CC3B10] transition-colors leading-snug mb-1.5">
                        {service.name}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-5">
                      {service.desc}
                    </p>
                  </div>

                  {/* Dark Navy CTA Button */}
                  <Link
                    href={`/${matchedCategory ? matchedCategory.slug : service.categorySlug}/${service.numericId ?? service.id}`}
                    className="w-full bg-[#031A30] hover:bg-[#0A2D4E] text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Start Designing</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
