'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categoryTemplateMap, getAllTemplates, getCategoryTemplates } from '../../lib/templatesData';

const parseAspectRatio = (sizeStr) => {
  if (!sizeStr) return "1.75 / 1";
  const matches = sizeStr.match(/(\d+(?:\.\d+)?)\s*(?:mm)?\s*(?:[xX×*])\s*(\d+(?:\.\d+)?)\s*(?:mm)?/i);
  if (matches && matches[1] && matches[2]) {
    const w = parseFloat(matches[1]);
    const h = parseFloat(matches[2]);
    if (w > 0 && h > 0) {
      return `${w} / ${h}`;
    }
  }
  return "1.75 / 1";
};

const getEditerParams = (templateObj, formState = {}, fallbackCategory = 'visiting-cards') => {
  if (!templateObj) return '';
  const params = new URLSearchParams({
    templateId: templateObj.id || '',
    templateTitle: templateObj.title || '',
    bgImage: templateObj.frontImage || templateObj.image || '',
    backBgImage: templateObj.backImage || templateObj.frontImage || templateObj.image || '',
    size: templateObj.size || '85mm x 55mm',
    orientation: templateObj.orientation || 'Standard',
    category: templateObj.categoryName || templateObj.categorySlug || fallbackCategory,
    price: templateObj.price || '₹200.00',
    unitPrice: templateObj.unitPrice || '₹2.00 each / 100 units',
    customCompany: formState.companyName || templateObj.companyName || '',
    customPerson: formState.personName || templateObj.personName || '',
    customTitle: formState.jobTitle || templateObj.jobTitle || '',
    selectedColor: formState.selectedColor || templateObj.colors?.[0] || '#2563EB'
  });
  return params.toString();
};

export default function TemplateCategoryClient({ categoryId, initialData }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recommended');
  const [showOnlyFavourites, setShowOnlyFavourites] = useState(false);
  const [favourites, setFavourites] = useState({});
  const [dbTemplates, setDbTemplates] = useState([]);

  React.useEffect(() => {
    const fetchDbTemplates = async () => {
      try {
        const res = await fetch('/api/templates?limit=500');
        if (res.ok) {
          const data = await res.json();
          setDbTemplates(data.data || []);
        }
      } catch (err) {
        console.error('Failed fetching live templates:', err);
      }
    };
    fetchDbTemplates();
  }, []);

  // "Make it yours" Brand Kit State
  const [makeItYoursActive, setMakeItYoursActive] = useState(false);

  const [brandNameInput, setBrandNameInput] = useState('');
  const [brandTaglineInput, setBrandTaglineInput] = useState('');

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
    const fallbackList = getCategoryTemplates(categorySlug);
    const matchingDb = dbTemplates.filter(t => categorySlug === 'all' || t.categorySlug === categorySlug);
    return [...matchingDb, ...fallbackList];
  }, [categorySlug, dbTemplates]);

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
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${showOnlyFavourites
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
                      <div
                        style={{ aspectRatio: parseAspectRatio(template.size) }}
                        className="relative w-full rounded-2xl overflow-hidden bg-slate-100 mb-4 flex items-center justify-center max-h-[220px]"
                      >
                        <img
                          src={template.frontImage || template.image}
                          alt={template.title}
                          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
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

                      <div className="flex flex-col gap-0.5 text-xs font-bold text-slate-800 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-semibold text-[11px]">Base Price:</span>
                          <span className="font-black text-slate-900">{template.price || categoryInfo.basePrice || '₹200.00'}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-[#CC3B10] font-extrabold text-[11px]">Pricing As Per Unit:</span>
                          <span className="text-[#CC3B10] font-black text-xs">
                            {template.unitPrice || categoryInfo.unitPriceText || '₹2.00 each / 100 units'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                          <span>Template Size:</span>
                          <span className="font-extrabold text-slate-800 truncate max-w-[140px]">{template.size || '85mm x 55mm'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customize Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const queryString = getEditerParams(template, {
                          companyName: brandNameInput || '',
                          personName: '',
                          jobTitle: brandTaglineInput || '',
                          selectedColor: template.colors?.[0] || '#2563EB'
                        }, categoryInfo?.name || categorySlug);
                        router.push(`/Editer?${queryString}`);
                      }}
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
                    <span className="text-xs font-semibold text-slate-300">+ 12 Senior Designers</span>
                  </div>
                </div>

                <Link
                  href="/logo-identity-design"
                  className="w-full bg-[#CC3B10] hover:bg-[#E55B2B] text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Get a Design From Scratch</span>
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
                className={`flex-1 px-4 py-3 rounded-xl text-xs font-extrabold text-white transition-all shadow-md ${customUploadFile ? 'bg-[#CC3B10] hover:bg-[#E55B2B]' : 'bg-slate-300 cursor-not-allowed'
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
            <div className="lg:w-[62%] bg-[#d4d2c0] p-6 sm:p-10 flex flex-col justify-between items-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200/80">

              {/* Top Bar of Left Preview */}
              <div className="w-full flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-slate-800 text-xs font-black shadow-xs border border-slate-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {categorySlug === 'visiting-cards' || selectedTemplate.hasBackSide ? `3D Preview Mode (${cardSide})` : '3D Design Preview Mode'}
                  </span>
                  <button
                    onClick={() => setIs3dFloating(!is3dFloating)}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-all border ${is3dFloating
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
                {/* The 3D Card Box with preserve-3d and dynamic aspect ratio based on mm size */}
                <div
                  style={{
                    transform: `rotateX(${cardRotate.x + (is3dFloating && cardSide === 'Front' ? Math.sin(Date.now() / 1000) * 3 : 0)}deg) rotateY(${cardRotate.y + ((cardSide === 'Back' && (categorySlug === 'visiting-cards' || selectedTemplate.hasBackSide)) ? 180 : 0)}deg)`,
                    transition: cardRotate.x === 0 && cardRotate.y === 0 ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.1s ease-out',
                    aspectRatio: parseAspectRatio(selectedTemplate.size)
                  }}
                  className="w-full relative transform-3d shadow-2xl cursor-grab active:cursor-grabbing bg-white max-w-md mx-auto"
                >
                  {/* FRONT SIDE */}
                  <div
                    style={{ borderColor: customizerForm.selectedColor || '#2563EB' }}
                    className="absolute inset-0 w-full h-full shadow-inner flex flex-col justify-between backface-hidden overflow-hidden bg-white"
                  >
                    <img
                      src={selectedTemplate.frontImage || selectedTemplate.image}
                      alt={`${selectedTemplate.title} - Front`}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                  </div>

                  {/* BACK SIDE */}
                  <div
                    style={{
                      transform: 'rotateY(180deg)',
                      borderColor: customizerForm.selectedColor || '#2563EB'
                    }}
                    className="absolute inset-0 w-full h-full shadow-inner flex flex-col items-center justify-center backface-hidden overflow-hidden bg-white"
                  >
                    <img
                      src={selectedTemplate.backImage || selectedTemplate.frontImage || selectedTemplate.image}
                      alt={`${selectedTemplate.title} - Back`}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Bar: Conditional Front & Back Toggle Buttons (Only for Visiting Cards) */}
              <div className="z-10 flex flex-col items-center gap-3">
                {(categorySlug === 'visiting-cards' || selectedTemplate.hasBackSide) ? (
                  <>
                    <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-2 shadow-lg">
                      <button
                        type="button"
                        onClick={() => setCardSide('Front')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cardSide === 'Front'
                            ? 'bg-[#031A30] text-white shadow-md font-black scale-105'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                          }`}
                      >
                        <div className="w-6 h-4 rounded overflow-hidden border border-slate-300/60 bg-slate-100 shrink-0">
                          <img src={selectedTemplate.frontImage || selectedTemplate.image} alt="Front thumb" className="w-full h-full object-contain" />
                        </div>
                        <span>Front Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardSide('Back')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cardSide === 'Back'
                            ? 'bg-[#031A30] text-white shadow-md font-black scale-105'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                          }`}
                      >
                        <div className="w-6 h-4 rounded overflow-hidden border border-slate-300/60 bg-slate-100 shrink-0">
                          <img src={selectedTemplate.backImage || selectedTemplate.frontImage || selectedTemplate.image} alt="Back thumb" className="w-full h-full object-contain" />
                        </div>
                        <span>Back Image</span>
                      </button>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500">
                      💡 Move mouse over card to tilt in 3D • Click Front/Back to flip 180°
                    </p>
                  </>
                ) : (
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 px-4 py-2 shadow-lg text-xs font-bold text-slate-700">
                    💡 Move mouse over design to tilt and inspect in 3D perspective
                  </div>
                )}
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

                    <div className="mt-4 bg-orange-50/60 border border-orange-100 rounded-2xl p-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Base Package Price</div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">
                        {selectedTemplate.price || categoryInfo.basePrice || '₹200.00'}
                      </div>
                      <div className="mt-3 pt-3 border-t border-orange-200/60 flex items-center justify-between text-xs font-black text-[#CC3B10]">
                        <span>Pricing As Per Unit:</span>
                        <span>{selectedTemplate.unitPrice || categoryInfo.unitPriceText || '₹2.00 each / 100 units'}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-orange-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Template Size (Dimensions):</span>
                        <span className="font-black text-slate-900 text-right">{selectedTemplate.size || '85mm x 55mm'}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-700">
                      <span className="text-base">🚚</span>
                      <span className="font-semibold">Delivery to 110001</span>
                      <a href="#delivery" onClick={(e) => { e.preventDefault(); alert('Delivery across all PIN codes in India takes 2-3 business days standard.'); }} className="underline font-bold text-slate-900 ml-1 hover:text-[#CC3B10]">
                        Review delivery options
                      </a>
                    </div>
                  </div>

                  {/* Bottom Action Button: Edit my design & Launch Full Studio */}
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        const queryString = getEditerParams(selectedTemplate, customizerForm, categoryInfo?.name || categorySlug);
                        router.push(`/Editer?${queryString}`);
                      }}
                      className="w-full bg-[#031A30] hover:bg-[#0A2D4E] text-white font-extrabold py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                    >
                      <span>Edit my Design</span>
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
                        const queryString = getEditerParams(selectedTemplate, customizerForm, categoryInfo?.name || categorySlug);
                        router.push(`/Editer?${queryString}`);
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
