'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useDatabaseData } from '../lib/useDatabaseData';

function AllCategoriesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams ? searchParams.get('category') : null;
  const { graphicCategories, graphicServicesList } = useDatabaseData();

  const allCatalogServices = useMemo(() => [...graphicServicesList], [graphicServicesList]);
  const allCatalogCategories = useMemo(() => [...graphicCategories], [graphicCategories]);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedService, setSelectedService] = useState(null);
  const [packageTier, setPackageTier] = useState('standard');
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
    setSelectedCategory('all');
    setSearchQuery('');
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
  };

  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategory);
  if (initialCategory !== prevInitialCategory) {
    setPrevInitialCategory(initialCategory);
    setSelectedCategory(initialCategory || 'all');
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Base products matched by category and search
  const baseServices = useMemo(() => {
    return allCatalogServices.filter((service) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        service.categorySlug === selectedCategory ||
        service.categoryName.toLowerCase().replace(/\s+/g, '-') === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === '' ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, allCatalogServices]);

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

  // Filter products based on search, selected category, and interactive checkboxes
  const filteredServices = useMemo(() => {
    let list = baseServices.filter((item) => {
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

    if (sortBy === 'price-low') {
      return [...list].sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')));
    }
    if (sortBy === 'price-high') {
      return [...list].sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')));
    }
    return list;
  }, [baseServices, filters, sortBy]);

  return (
    <div className="min-h-screen bg-[#FFFBF8] text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in">
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
          <span className="text-[#CC3B10] font-extrabold">Graphic Design Categories</span>
        </nav>
      </div>

      {/* Pastel Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#FEEFEF] via-[#FCECEE] to-[#F8E7F5] p-6 sm:p-10 lg:p-12 border border-pink-100/60 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
                Explore Our Complete <br />
                <span className="text-[#FF4A17]">Graphic Design Catalog.</span>
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
                Premium graphic design solutions that speak volumes before you even say a word. Choose from 8 specialized categories and over 50+ custom design solutions crafted for excellence.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="#catalog-grid"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF551D] to-[#FF0055] hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all"
                >
                  Explore Templates
                </Link>
                <button
                  onClick={() => showToast('Upload Design feature initiated! Upload your custom artwork.')}
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
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80"
                  alt="Design Catalog"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Filters Sidebar + Results Grid */}
      <main id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Filters Panel */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs h-fit sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">Filters</h2>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-[#CC3B10] transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="py-5 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Category</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="cat"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="text-[#CC3B10] focus:ring-[#CC3B10]"
                    />
                    <span>All Categories ({allCatalogServices.length})</span>
                  </label>
                  {allCatalogCategories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="cat"
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(cat.slug)}
                        className="text-[#CC3B10] focus:ring-[#CC3B10]"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
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
            {/* Search Bar & Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                Showing <strong className="text-slate-900 font-bold">{filteredServices.length}</strong> results
              </span>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#CC3B10] shadow-xs"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#CC3B10] shadow-xs cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, idx) => (
                <div
                  key={`${service.categorySlug}-${service.id}-${idx}`}
                  className="group bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image block with badges */}
                    <Link
                      href={`/${service.categorySlug}/${service.id}`}
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
                    <Link href={`/${service.categorySlug}/${service.id}`}>
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
                    href={`/${service.categorySlug}/${service.id}`}
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

      {/* Quick View Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Header */}
            <div className="relative aspect-[16/9] w-full bg-slate-100">
              <img
                src={selectedService.image}
                alt={selectedService.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="px-3 py-1 rounded-lg bg-[#5348e2] text-white text-xs font-extrabold uppercase tracking-wider">
                    {selectedService.categoryName}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                    {selectedService.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Overview</h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {selectedService.desc}
                </p>
              </div>

              {/* Turnaround & Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-1">Estimated Turnaround</div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#5348e2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedService.turnaround}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500 mb-1">Included Deliverables</div>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {selectedService.deliverables && selectedService.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 font-medium">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Package Selector */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select Design Package</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'basic', label: 'Basic', price: selectedService.price, revs: '2 Revisions' },
                    { id: 'standard', label: 'Standard', price: '₹3,499', revs: 'Unlimited Revisions' },
                    { id: 'premium', label: 'Premium Suite', price: '₹5,999', revs: 'VIP Priority + Source' },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setPackageTier(tier.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        packageTier === tier.id
                          ? 'border-[#5348e2] bg-indigo-50/70 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-slate-900">{tier.label}</div>
                      <div className="text-sm font-black text-[#5348e2] mt-1">{tier.price}</div>
                      <div className="text-[10px] font-medium text-slate-500 mt-0.5">{tier.revs}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal CTA */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const name = selectedService.name;
                    setSelectedService(null);
                    showToast(`Added ${name} (${packageTier.toUpperCase()} Package) to your order!`);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#5348e2] hover:bg-[#4338ca] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Proceed with Order →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AllCategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-bold text-slate-600">Loading Catalog...</span>
          </div>
        </div>
      }
    >
      <AllCategoriesContent />
    </Suspense>
  );
}

