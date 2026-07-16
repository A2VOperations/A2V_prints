'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categoryTemplateMap, getAllTemplates } from '../../lib/templatesData';

export default function TemplateCategoryClient({ categoryId, initialData }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');
  const [showOnlyFavourites, setShowOnlyFavourites] = useState(false);
  const [favourites, setFavourites] = useState({});

  // "Make it yours" Brand Kit State
  const [makeItYoursActive, setMakeItYoursActive] = useState(false);
  const [brandKitOpenSection, setBrandKitOpenSection] = useState('Text'); // 'Images' | 'Text' | null
  const [brandNameInput, setBrandNameInput] = useState('');
  const [brandTaglineInput, setBrandTaglineInput] = useState('');
  const [uploadedBrandLogo, setUploadedBrandLogo] = useState(null);

  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    color: [],
    orientation: [],
    corners: [],
    stock: [],
    finish: [],
    industry: [],
    style: [],
    logoArea: [],
    useCase: []
  });

  // Accordion state for left sidebar filters
  const [openAccordion, setOpenAccordion] = useState({
    color: true,
    orientation: true,
    corners: true,
    stock: false,
    finish: false,
    industry: true,
    style: true,
    logoArea: false,
    useCase: false
  });

  // Customizer Modal State
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cardSide, setCardSide] = useState('Front'); // 'Front' | 'Back'
  const [isEditingDesign, setIsEditingDesign] = useState(false);
  const [is3dFloating, setIs3dFloating] = useState(true);
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });
  const [customizerForm, setCustomizerForm] = useState({
    companyName: '',
    personName: '',
    jobTitle: '',
    contactInfo: '',
    selectedColor: ''
  });

  // Upload own design modal/file simulation
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [customUploadFile, setCustomUploadFile] = useState(null);

  // Determine current category info or fallback
  const categorySlug = categoryId?.toLowerCase() || 'visiting-cards';
  const categoryInfo = categoryTemplateMap[categorySlug] || {
    name: categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `Browse stunning customizable templates and designs for ${categorySlug.replace(/-/g, ' ')}.`,
    basePrice: '₹200.00',
    unitPriceText: '₹2.00 each / 100 units',
    rating: '4.8 (1,240)',
    filterOptions: categoryTemplateMap['visiting-cards'].filterOptions,
    templates: getAllTemplates().filter(t => t.categorySlug === categorySlug || categorySlug === 'all')
  };

  const allCategoryTemplates = useMemo(() => {
    if (categorySlug === 'all' || !categoryTemplateMap[categorySlug]) {
      return getAllTemplates();
    }
    return categoryInfo.templates || [];
  }, [categorySlug, categoryInfo]);

  const toggleFilter = (section, value) => {
    setActiveFilters(prev => {
      const current = prev[section] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [section]: updated };
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      color: [],
      orientation: [],
      corners: [],
      stock: [],
      finish: [],
      industry: [],
      style: [],
      logoArea: [],
      useCase: []
    });
    setSearchQuery('');
    setShowOnlyFavourites(false);
  };

  const toggleFavourite = (id, e) => {
    if (e) e.stopPropagation();
    setFavourites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleOpenCustomizer = (template) => {
    setSelectedTemplate(template);
    setCardSide('Front');
    setIsEditingDesign(false);
    setCustomizerForm({
      companyName: brandNameInput || '',
      personName: '',
      jobTitle: brandTaglineInput || '',
      contactInfo: '',
      selectedColor: template.colors?.[0] || '#2563EB'
    });
  };

  const handleSaveAndProceed = () => {
    if (!selectedTemplate) return;
    const queryParams = new URLSearchParams({
      templateId: selectedTemplate.id,
      templateTitle: selectedTemplate.title,
      customCompany: customizerForm.companyName,
      customPerson: customizerForm.personName,
      customTitle: customizerForm.jobTitle,
      selectedColor: customizerForm.selectedColor
    });
    router.push(`/${selectedTemplate.categorySlug || categorySlug}/1?${queryParams.toString()}`);
  };

  const filteredTemplates = useMemo(() => {
    let list = allCategoryTemplates.filter(t => {
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = (t.title || '').toLowerCase().includes(q);
        const matchStyle = (t.style || '').toLowerCase().includes(q);
        const matchInd = (t.industry || '').toLowerCase().includes(q);
        if (!matchTitle && !matchStyle && !matchInd) return false;
      }
      // Favourites filter
      if (showOnlyFavourites && !favourites[t.id]) {
        return false;
      }
      // Active facet filters
      if (activeFilters.color.length > 0) {
        // Simple color substring checking or attribute checking
        const matchColor = activeFilters.color.some(c => 
          (t.title || '').toLowerCase().includes(c.toLowerCase()) || 
          (t.colors && t.colors.length > 0)
        );
        if (!matchColor) return false;
      }
      if (activeFilters.orientation.length > 0 && !activeFilters.orientation.includes(t.orientation)) return false;
      if (activeFilters.corners.length > 0 && !activeFilters.corners.includes(t.corners)) return false;
      if (activeFilters.stock.length > 0 && !activeFilters.stock.includes(t.stock)) return false;
      if (activeFilters.finish.length > 0 && !activeFilters.finish.includes(t.finish)) return false;
      if (activeFilters.industry.length > 0 && !activeFilters.industry.includes(t.industry)) return false;
      if (activeFilters.style.length > 0 && !activeFilters.style.includes(t.style)) return false;
      if (activeFilters.logoArea.length > 0 && !activeFilters.logoArea.includes(t.logoArea)) return false;
      if (activeFilters.useCase.length > 0 && !activeFilters.useCase.includes(t.useCase)) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'Price: Low to High') {
      list.sort((a, b) => {
        const pA = parseFloat(String(a.price || '').replace(/[^0-9.]/g, '')) || 0;
        const pB = parseFloat(String(b.price || '').replace(/[^0-9.]/g, '')) || 0;
        return pA - pB;
      });
    } else if (sortBy === 'Price: High to Low') {
      list.sort((a, b) => {
        const pA = parseFloat(String(a.price || '').replace(/[^0-9.]/g, '')) || 0;
        const pB = parseFloat(String(b.price || '').replace(/[^0-9.]/g, '')) || 0;
        return pB - pA;
      });
    } else if (sortBy === 'Popular') {
      list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }
    return list;
  }, [allCategoryTemplates, searchQuery, showOnlyFavourites, favourites, activeFilters, sortBy]);

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-slate-800 font-sans pb-24">
      {/* Top Breadcrumb & Header Section */}
      <div className="bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="mx-auto px-4 sm:px-15 lg:px-20 py-6">
          <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-3">
            <Link href="/" className="hover:text-[#CC3B10] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${categorySlug}`} className="hover:text-[#CC3B10] transition-colors capitalize">
              {categoryInfo.name}
            </Link>
            <span>/</span>
            <span className="text-slate-900">Templates</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {categoryInfo.name} Designs & Templates
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500 text-sm">
                  {'★★★★★'}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  {categoryInfo.rating}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs sm:text-sm text-slate-600">
                  {categoryInfo.description}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-end">
              <Link
                href={`/${categorySlug}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#CC3B10] text-xs font-extrabold border border-orange-200 transition-all shadow-2xs"
              >
                <span>Browse Product Pricing & Options</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Search bar & Favourites Toggle Row */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="relative flex-grow max-w-lg">
              <input
                type="text"
                placeholder={`Search templates in ${categoryInfo.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#CC3B10] focus:bg-white transition-all"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600">
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={() => setShowOnlyFavourites(!showOnlyFavourites)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                showOnlyFavourites
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-base leading-none">{showOnlyFavourites ? '♥' : '♡'}</span>
              <span>Favourites ({Object.values(favourites).filter(Boolean).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Left Sidebar & Right Grid */}
      <div className="mx-auto px-10 sm:px-12 lg:px-20 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            
            {/* "Make it yours" Brand Kit Box */}
            <div className="bg-sky-50/80 border border-sky-100 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100/80">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Make it yours</h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">Add your text & images or Brand Kit</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={makeItYoursActive}
                    onChange={(e) => setMakeItYoursActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7]"></div>
                </label>
              </div>

              {makeItYoursActive && (
                <div className="mt-4 space-y-3 animate-in fade-in duration-200">
                  {/* Images Section Accordion */}
                  <div className="border border-sky-200/60 rounded-2xl bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setBrandKitOpenSection(brandKitOpenSection === 'Images' ? null : 'Images')}
                      className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span>Images / Brand Logo</span>
                      <span className="text-slate-400">{brandKitOpenSection === 'Images' ? '▲' : '▼'}</span>
                    </button>
                    {brandKitOpenSection === 'Images' && (
                      <div className="px-4 pb-4 pt-1 text-center">
                        {uploadedBrandLogo ? (
                          <div className="relative border border-slate-200 rounded-xl p-2 bg-slate-50 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">✓ {uploadedBrandLogo.name}</span>
                            <button onClick={() => setUploadedBrandLogo(null)} className="text-rose-500 text-xs font-bold hover:underline">Remove</button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-sky-300 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-50/50 transition-colors">
                            <span className="text-base text-sky-600 mb-1">+</span>
                            <span className="text-xs font-extrabold text-sky-700">Add image / Logo</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or SVG</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) setUploadedBrandLogo(e.target.files[0]);
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Text Section Accordion */}
                  <div className="border border-sky-200/60 rounded-2xl bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setBrandKitOpenSection(brandKitOpenSection === 'Text' ? null : 'Text')}
                      className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span>Text (Brand Name & Slogan)</span>
                      <span className="text-slate-400">{brandKitOpenSection === 'Text' ? '▲' : '▼'}</span>
                    </button>
                    {brandKitOpenSection === 'Text' && (
                      <div className="px-4 pb-4 pt-1 space-y-2.5">
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Company / Brand Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Apex Studio"
                            value={brandNameInput}
                            onChange={(e) => setBrandNameInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-1">Person Name or Tagline</label>
                          <input
                            type="text"
                            placeholder="e.g. Liam Reynolds / Est. 2026"
                            value={brandTaglineInput}
                            onChange={(e) => setBrandTaglineInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
                          />
                        </div>
                        <p className="text-[10px] text-sky-700 italic pt-1 font-medium">
                          ⚡ Live updating all template previews!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Accordions Main Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Filter By
                </h2>
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-[#CC3B10] hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Dynamic Facet Sections */}
              {Object.entries(categoryInfo.filterOptions || {}).map(([key, options]) => {
                const isOpen = openAccordion[key];
                const activeList = activeFilters[key] || [];
                const labelMap = {
                  color: 'Design Colour',
                  orientation: 'Product Orientation',
                  corners: 'Corners / Cut',
                  stock: 'Stock / Material',
                  finish: 'Finish',
                  industry: 'Industry',
                  style: 'Styles & Themes',
                  logoArea: 'Logo / Photo Area',
                  useCase: 'Use Case'
                };

                return (
                  <div key={key} className="py-4 border-b border-slate-100 last:border-none">
                    <button
                      onClick={() => toggleAccordion(key)}
                      className="w-full flex items-center justify-between text-left focus:outline-none group"
                    >
                      <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#CC3B10] transition-colors">
                        {labelMap[key] || key} {activeList.length > 0 && `(${activeList.length})`}
                      </span>
                      <span className="text-slate-400 text-xs font-bold">{isOpen ? '−' : '+'}</span>
                    </button>

                    {isOpen && (
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                        {options.map((option) => {
                          const isChecked = activeList.includes(option);
                          return (
                            <label
                              key={option}
                              className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer hover:text-slate-900 select-none py-0.5"
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleFilter(key, option)}
                                  className="w-4 h-4 rounded text-[#CC3B10] focus:ring-[#CC3B10] border-slate-300"
                                />
                                <span className="line-clamp-1">{option}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Templates Grid & Results */}
          <div className="lg:col-span-3">
            
            {/* Top Bar showing count and Sort By */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-medium text-slate-600">
                  Showing <strong className="text-slate-900 font-bold">{filteredTemplates.length}</strong> results
                </span>
                {(searchQuery || Object.values(activeFilters).some(a => a.length > 0) || showOnlyFavourites) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-[#CC3B10] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors"
                  >
                    Reset Filters ×
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#CC3B10] cursor-pointer"
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Popular">Popular & Top Rated</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Card 1: Upload your own design */}
              <div
                onClick={() => setShowUploadModal(true)}
                className="group bg-[#FFFBF8] hover:bg-white rounded-3xl p-6 border-2 border-dashed border-[#CC3B10]/40 hover:border-[#CC3B10] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[340px]"
              >
                <div className="w-16 h-16 rounded-full bg-orange-100/80 group-hover:bg-[#CC3B10] text-[#CC3B10] group-hover:text-white flex items-center justify-center mb-4 transition-all duration-300 shadow-sm">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#CC3B10] transition-colors mb-1">
                  Upload your own design
                </h3>
                <p className="text-xs text-slate-600 max-w-[200px] leading-relaxed mb-4">
                  Already have print-ready artwork? Upload PDF, AI, PSD, PNG or JPG files directly.
                </p>
                <div className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                  {categoryInfo.basePrice} <span className="text-[11px] font-normal text-slate-500">({categoryInfo.unitPriceText})</span>
                </div>
              </div>

              {/* Template Cards */}
              {filteredTemplates.map((template) => {
                const isFav = favourites[template.id];
                const displayTitle = makeItYoursActive && brandNameInput ? `${brandNameInput} - ${template.style || 'Custom'} Design` : template.title;
                const displayPerson = makeItYoursActive && brandTaglineInput ? brandTaglineInput : template.personName;

                return (
                  <div
                    key={template.id}
                    onClick={() => handleOpenCustomizer(template)}
                    className="group bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Image Block with Heart & Swatches overlay */}
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                        <img
                          src={template.image}
                          alt={template.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Favourites Button Top Right */}
                        <button
                          onClick={(e) => toggleFavourite(template.id, e)}
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 shadow-md flex items-center justify-center transition-colors"
                        >
                          <span className={`text-sm font-bold ${isFav ? 'text-rose-500' : ''}`}>
                            {isFav ? '♥' : '♡'}
                          </span>
                        </button>

                        {/* Optional Badge Top Left */}
                        {template.badge && (
                          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-slate-900/90 text-white font-extrabold text-[10px] shadow-sm uppercase tracking-wider">
                            {template.badge}
                          </span>
                        )}

                        {/* Live Brand Kit Overlay Preview if makeItYoursActive */}
                        {makeItYoursActive && (brandNameInput || brandTaglineInput) && (
                          <div className="absolute inset-x-0 bottom-0 bg-slate-900/85 backdrop-blur-xs p-2.5 text-center text-white border-t border-white/10 animate-in fade-in duration-200">
                            <span className="text-[10px] uppercase font-bold text-sky-400 block tracking-wider">Live Preview</span>
                            <h4 className="text-xs font-black truncate">{brandNameInput || template.companyName}</h4>
                            {displayPerson && <p className="text-[10px] text-slate-300 truncate">{displayPerson}</p>}
                          </div>
                        )}
                      </div>

                      {/* Color Swatch Dots */}
                      <div className="flex items-center justify-between mb-2.5 px-1">
                        <div className="flex items-center gap-1.5">
                          {(template.colors || ['#2563EB', '#1E293B', '#10B981']).slice(0, 5).map((colorHex, cIdx) => (
                            <span
                              key={cIdx}
                              style={{ backgroundColor: colorHex }}
                              className="w-3.5 h-3.5 rounded-full border border-slate-300/80 shadow-2xs block"
                              title={colorHex}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">
                          {template.orientation || 'Standard'}
                        </span>
                      </div>

                      {/* Title & Pricing */}
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#CC3B10] transition-colors leading-snug line-clamp-2 mb-2">
                        {displayTitle}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-4">
                        <span>{template.price || categoryInfo.basePrice}</span>
                        <span className="text-slate-400 font-normal text-[11px]">
                          ({template.unitPrice || categoryInfo.unitPriceText})
                        </span>
                      </div>
                    </div>

                    {/* Customize Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenCustomizer(template)}
                      className="w-full bg-[#031A30] hover:bg-[#0A2D4E] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>Customize This Template</span>
                      <span>→</span>
                    </button>
                  </div>
                );
              })}

              {/* Promotional Card: Work with a designer */}
              <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[340px]">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-[10px] font-extrabold uppercase tracking-wider mb-4 border border-white/10">
                    Design Services
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black mb-2 leading-tight">
                    Work with a professional designer
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    Need a bespoke 1-on-1 custom design from scratch? Collaborate with our top graphic artists to bring your exact vision to life.
                  </p>
                  
                  {/* Avatar group */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex -space-x-2">
                      <img className="w-8 h-8 rounded-full border-2 border-slate-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Designer 1" />
                      <img className="w-8 h-8 rounded-full border-2 border-slate-800 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Designer 2" />
                      <img className="w-8 h-8 rounded-full border-2 border-slate-800 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Designer 3" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">+ 12 Senior Designers Online</span>
                  </div>
                </div>

                <Link
                  href="/logo-identity-design"
                  className="w-full bg-[#CC3B10] hover:bg-[#E55B2B] text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Get a Design From Scratch</span>
                  <span>From ₹300.00 →</span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Upload Own Design Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Upload Your Print File</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">×</button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#CC3B10] transition-colors bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-orange-100 text-[#CC3B10] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-1">Drag & drop print artwork here</p>
              <p className="text-xs text-slate-500 mb-4">Support PDF, AI, PSD, PNG, JPG (High Resolution 300 DPI)</p>
              
              <label className="inline-block bg-[#031A30] hover:bg-[#0A2D4E] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors">
                Select File from Computer
                <input
                  type="file"
                  accept=".pdf,.ai,.psd,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setCustomUploadFile(e.target.files[0]);
                  }}
                  className="hidden"
                />
              </label>
              {customUploadFile && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                  <span>✓ {customUploadFile.name}</span>
                  <button onClick={() => setCustomUploadFile(null)} className="text-rose-500 hover:underline ml-2">Remove</button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  router.push(`/${categorySlug}/1?uploaded=true&fileName=${encodeURIComponent(customUploadFile?.name || 'Custom Artwork')}`);
                }}
                disabled={!customUploadFile}
                className={`flex-1 px-4 py-3 rounded-xl text-xs font-extrabold text-white transition-all shadow-md ${
                  customUploadFile ? 'bg-[#CC3B10] hover:bg-[#E55B2B]' : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive 3D Card Preview & Customizer Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[580px] relative my-6">
            
            {/* Close Button Top Right */}
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-xl transition-colors shadow-2xs"
            >
              ×
            </button>

            {/* Left Area: 3D Card Visual Studio & Front/Back Controls */}
            <div className="lg:w-[62%] bg-[#F4F6F9] p-6 sm:p-10 flex flex-col justify-between items-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200/80">
              
              {/* Top Bar of Left Preview */}
              <div className="w-full flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-slate-800 text-xs font-black shadow-xs border border-slate-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    3D Preview Mode ({cardSide})
                  </span>
                  <button
                    onClick={() => setIs3dFloating(!is3dFloating)}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-all border ${
                      is3dFloating
                        ? 'bg-[#031A30] text-white border-transparent shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200/60 hover:bg-slate-50'
                    }`}
                  >
                    ✨ {is3dFloating ? '3D Floating Active' : 'Enable 3D Floating'}
                  </button>
                </div>

                <button
                  onClick={() => toggleFavourite(selectedTemplate.id)}
                  className="w-9 h-9 rounded-full bg-white text-slate-600 hover:text-rose-500 shadow-sm flex items-center justify-center text-base transition-all"
                >
                  {favourites[selectedTemplate.id] ? '♥' : '♡'}
                </button>
              </div>

              {/* Center: 3D Perspective Container */}
              <div
                className="w-full max-w-md my-8 sm:my-12 flex items-center justify-center [perspective:1200px]"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 26; // max tilt 26 deg
                  const y = ((e.clientY - rect.top) / rect.height - 0.5) * -26;
                  setCardRotate({ x: y, y: x });
                }}
                onMouseLeave={() => setCardRotate({ x: 0, y: 0 })}
              >
                {/* The 3D Card Box with preserve-3d and flip transition */}
                <div
                  style={{
                    transform: `rotateX(${cardRotate.x + (is3dFloating && cardSide === 'Front' ? Math.sin(Date.now() / 1000) * 3 : 0)}deg) rotateY(${cardRotate.y + (cardSide === 'Back' ? 180 : 0)}deg)`,
                    transition: cardRotate.x === 0 && cardRotate.y === 0 ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.1s ease-out'
                  }}
                  className="w-full aspect-[1.75/1] relative [transform-style:preserve-3d] shadow-2xl rounded-2xl cursor-grab active:cursor-grabbing"
                >
                  {/* FRONT SIDE */}
                  <div
                    style={{ borderColor: customizerForm.selectedColor || '#2563EB' }}
                    className="absolute inset-0 w-full h-full rounded-2xl bg-white border-[6px] shadow-inner flex flex-col justify-between p-6 sm:p-8 [backface-visibility:hidden] overflow-hidden"
                  >
                    {/* Subtle textured background / watermark */}
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: customizerForm.selectedColor || '#2563EB' }} />
                    <img
                      src={selectedTemplate.image}
                      alt={selectedTemplate.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none mix-blend-multiply"
                    />

                    {/* Logo & Company Name */}
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {uploadedBrandLogo ? (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-1 overflow-hidden shadow-xs">
                            <span className="text-[10px] font-bold text-slate-700 text-center truncate">{uploadedBrandLogo.name}</span>
                          </div>
                        ) : (
                          <div 
                            style={{ backgroundColor: customizerForm.selectedColor || '#2563EB' }}
                            className="w-12 h-12 rounded-xl text-white font-black text-xl flex items-center justify-center shadow-md shrink-0"
                          >
                            {(customizerForm.companyName || 'C').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-none">
                            {customizerForm.companyName || selectedTemplate.companyName || 'Company Name'}
                          </h4>
                          <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                            {brandTaglineInput || 'Excellence in Printing'}
                          </p>
                        </div>
                      </div>

                      <span 
                        style={{ backgroundColor: customizerForm.selectedColor || '#2563EB' }}
                        className="px-2.5 py-1 rounded text-[10px] font-extrabold text-white tracking-widest uppercase shadow-2xs"
                      >
                        FRONT
                      </span>
                    </div>

                    {/* Center decorative line */}
                    <div className="w-full h-1.5 rounded-full my-auto opacity-80" style={{ backgroundColor: customizerForm.selectedColor || '#2563EB' }} />

                    {/* Person details & Contact footer */}
                    <div className="relative z-10 flex items-end justify-between gap-4 pt-2">
                      <div>
                        <h5 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                          {customizerForm.personName || selectedTemplate.personName || 'Full Name'}
                        </h5>
                        <p className="text-xs font-bold text-slate-600 mt-0.5">
                          {customizerForm.jobTitle || selectedTemplate.jobTitle || 'Job Designation'}
                        </p>
                      </div>
                      <div className="text-right text-[10px] font-semibold text-slate-500 space-y-0.5 max-w-[170px] truncate">
                        <p>{customizerForm.contactInfo?.split('|')[0]?.trim() || 'email@company.com'}</p>
                        <p>{customizerForm.contactInfo?.split('|')[1]?.trim() || '+91 98765 43210'}</p>
                      </div>
                    </div>

                    {/* Sheen reflection gradient */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/40 pointer-events-none" />
                  </div>

                  {/* BACK SIDE */}
                  <div
                    style={{ 
                      borderColor: customizerForm.selectedColor || '#2563EB',
                      backgroundColor: customizerForm.selectedColor || '#031A30',
                      transform: 'rotateY(180deg)'
                    }}
                    className="absolute inset-0 w-full h-full rounded-2xl border-[6px] shadow-inner flex flex-col items-center justify-center p-6 sm:p-8 text-white text-center [backface-visibility:hidden] overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                    
                    {/* Back side center content */}
                    <div className="relative z-10 space-y-3 max-w-xs mx-auto">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-black shadow-lg">
                        {(customizerForm.companyName || 'C').charAt(0).toUpperCase()}
                      </div>
                      <h4 className="text-lg sm:text-xl font-black tracking-wide">
                        {customizerForm.companyName || selectedTemplate.companyName || 'Company Name'}
                      </h4>
                      <p className="text-xs text-white/80 font-medium leading-relaxed">
                        {customizerForm.contactInfo || 'info@company.com | +91 98765 43210'}
                      </p>
                      <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-4 text-[10px] font-bold tracking-widest uppercase text-white/60">
                        <span>www.company.com</span>
                        <span>•</span>
                        <span>Est. 2026</span>
                      </div>
                    </div>

                    <span className="absolute bottom-4 right-4 text-[9px] font-extrabold uppercase tracking-widest text-white/40">
                      BACK SIDE PREVIEW
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Bar: Front & Back Toggle Buttons right below the card (matching user screenshot) */}
              <div className="z-10 flex flex-col items-center gap-3">
                <div className="inline-flex rounded-xl bg-white border border-slate-200/80 p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setCardSide('Front')}
                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                      cardSide === 'Front'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-black scale-105'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardSide('Back')}
                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                      cardSide === 'Back'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-black scale-105'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Back
                  </button>
                </div>
                <p className="text-[11px] font-semibold text-slate-500">
                  💡 Move mouse over card to tilt in 3D • Click Front/Back to flip 180°
                </p>
              </div>

            </div>

            {/* Right Area: Template Info & Edit Controls (approx 38% width) */}
            <div className="lg:w-[38%] p-6 sm:p-8 flex flex-col justify-between bg-white relative">
              
              {!isEditingDesign ? (
                /* VIEW MODE (Exactly reproducing the reference screenshot!) */
                <div className="flex flex-col justify-between h-full space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug pr-8">
                      {selectedTemplate.title}
                    </h3>
                    
                    <div className="mt-4">
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">
                        {selectedTemplate.price || categoryInfo.basePrice || '₹200.00'}
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {selectedTemplate.unitPrice || categoryInfo.unitPriceText || '₹2.00 each / 100 units'}
                      </p>
                    </div>

                    <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700">
                      <span className="text-base">🚚</span>
                      <span className="font-semibold">Delivery to 110001</span>
                      <a href="#delivery" onClick={(e) => { e.preventDefault(); alert('Delivery across all PIN codes in India takes 2-3 business days standard.'); }} className="underline font-bold text-slate-900 ml-1 hover:text-[#CC3B10]">
                        Review delivery options
                      </a>
                    </div>

                    {/* Swatches Selector */}
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[#031A30] text-white text-[11px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                          {selectedTemplate.colorName || (customizerForm.selectedColor === '#2563EB' ? 'blue' : customizerForm.selectedColor === '#10B981' ? 'green' : customizerForm.selectedColor === '#DC2626' ? 'red' : 'dark')}
                        </span>
                        <span className="text-xs font-bold text-slate-700">color swatches</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {(selectedTemplate.colors || ['#2563EB', '#1E293B', '#10B981', '#DC2626']).map((cHex, idx) => {
                          const isColorSelected = customizerForm.selectedColor === cHex;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCustomizerForm({ ...customizerForm, selectedColor: cHex })}
                              className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all flex items-center justify-center ${
                                isColorSelected ? 'border-slate-900 scale-110 shadow-md' : 'border-slate-300 hover:scale-105'
                              }`}
                            >
                              <span 
                                style={{ backgroundColor: cHex }} 
                                className="w-full h-full rounded-full block" 
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button: Edit my design & Launch Full Studio */}
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingDesign(true)}
                      className="w-full bg-[#40bde8] hover:bg-[#20a8d8] text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Quick Edit Text</span>
                      <span>→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const queryParams = new URLSearchParams({
                          customCompany: customizerForm.companyName,
                          customPerson: customizerForm.personName,
                          customTitle: customizerForm.jobTitle,
                          selectedColor: customizerForm.selectedColor
                        });
                        router.push(`/Editer?${queryParams.toString()}`);
                      }}
                      className="w-full bg-[#031A30] hover:bg-[#0A2D4E] text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                    >
                      <span>🎨 Open Full Online Design Studio</span>
                      <span className="text-yellow-400 font-normal text-[11px]">(Vistaprint Studio Mode)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTemplate(null)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
                    >
                      Back to Templates Gallery
                    </button>
                  </div>
                </div>
              ) : (
                /* EDITING MODE inside modal */
                <div className="flex flex-col justify-between h-full space-y-4 animate-in fade-in duration-200">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <h4 className="text-base font-black text-slate-900">
                        Customize Template Text
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsEditingDesign(false)}
                        className="text-xs font-bold text-sky-600 hover:underline"
                      >
                        ← Back to view
                      </button>
                    </div>

                    <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company / Brand Name</label>
                        <input
                          type="text"
                          value={customizerForm.companyName}
                          onChange={(e) => setCustomizerForm({ ...customizerForm, companyName: e.target.value })}
                          placeholder={selectedTemplate.companyName || "Enter company or brand name"}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Main Header</label>
                        <input
                          type="text"
                          value={customizerForm.personName}
                          onChange={(e) => setCustomizerForm({ ...customizerForm, personName: e.target.value })}
                          placeholder={selectedTemplate.personName || "Enter full name or main header"}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Job Title / Tagline</label>
                        <input
                          type="text"
                          value={customizerForm.jobTitle}
                          onChange={(e) => setCustomizerForm({ ...customizerForm, jobTitle: e.target.value })}
                          placeholder={selectedTemplate.jobTitle || "Enter designation or tagline"}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Contact Info (Email | Phone)</label>
                        <input
                          type="text"
                          value={customizerForm.contactInfo}
                          onChange={(e) => setCustomizerForm({ ...customizerForm, contactInfo: e.target.value })}
                          placeholder="e.g. info@company.com | +91 98765 43210"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save & Continue & Open Studio */}
                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingDesign(false)}
                        className="px-4 py-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAndProceed}
                        className="flex-1 bg-[#CC3B10] hover:bg-[#E55B2B] text-white font-extrabold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>Save & Proceed to Order</span>
                        <span>→</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const queryParams = new URLSearchParams({
                          customCompany: customizerForm.companyName,
                          customPerson: customizerForm.personName,
                          customTitle: customizerForm.jobTitle,
                          selectedColor: customizerForm.selectedColor
                        });
                        router.push(`/Editer?${queryParams.toString()}`);
                      }}
                      className="w-full bg-slate-900 hover:bg-black text-white font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>🎨 Open in Advanced Online Studio Editor</span>
                      <span>↗</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
