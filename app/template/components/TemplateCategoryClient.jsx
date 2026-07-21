'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categoryTemplateMap, getAllTemplates, getCategoryTemplates } from '../../lib/templatesData';
import { useDatabaseData } from '../../lib/useDatabaseData';

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

const getEditerParams = (templateObj, formState = {}, fallbackCategory = 'visiting-cards', categoryInfo = null) => {
  if (!templateObj) return '';
  const bgImg = templateObj.frontImage || templateObj.image || '';
  const backBgImg = templateObj.backImage || templateObj.frontImage || templateObj.image || '';

  try {
    if (typeof window !== 'undefined') {
      const existingOptsRaw = sessionStorage.getItem('a2v_product_options');
      let existingOpts = {};
      try { existingOpts = existingOptsRaw ? JSON.parse(existingOptsRaw) : {}; } catch(e) {}
      
      const mergedOpts = {
        ...existingOpts,
        productId: templateObj.id || existingOpts.productId || '1',
        categoryKey: fallbackCategory || existingOpts.categoryKey || 'visiting-cards',
        qualityLabel: existingOpts.qualityLabel || categoryInfo?.qualityLabel || 'Quality / Stock',
        styleLabel: existingOpts.styleLabel || categoryInfo?.styleLabel || 'Style / Printing',
        effectiveQtyOptions: existingOpts.effectiveQtyOptions && existingOpts.effectiveQtyOptions.length > 0 ? existingOpts.effectiveQtyOptions : (Array.isArray(categoryInfo?.defaultQtyOptions) ? categoryInfo.defaultQtyOptions : []),
        effectiveQualityOptions: existingOpts.effectiveQualityOptions && existingOpts.effectiveQualityOptions.length > 0 ? existingOpts.effectiveQualityOptions : (Array.isArray(categoryInfo?.defaultQualityOptions) ? categoryInfo.defaultQualityOptions : []),
        effectiveStyleOptions: existingOpts.effectiveStyleOptions && existingOpts.effectiveStyleOptions.length > 0 ? existingOpts.effectiveStyleOptions : (Array.isArray(categoryInfo?.defaultStyleOptions) ? categoryInfo.defaultStyleOptions : []),
        effectiveCustomOptions: existingOpts.effectiveCustomOptions && existingOpts.effectiveCustomOptions.length > 0 ? existingOpts.effectiveCustomOptions : (Array.isArray(categoryInfo?.customOptions) ? categoryInfo.customOptions : [])
      };
      sessionStorage.setItem('a2v_product_options', JSON.stringify(mergedOpts));

      sessionStorage.setItem('a2v_editor_session', JSON.stringify({
        templateId: templateObj.id || '',
        frontBackground: bgImg,
        backBackground: '#ffffff',
        templateBackBackground: backBgImg,
        templateBackElements: templateObj.backElements || [],
        productOptions: {
          size: templateObj.size || existingOpts.selectedSize || '85mm x 55mm',
          orientation: templateObj.orientation || existingOpts.selectedOrientation || 'Standard',
          category: templateObj.categoryName || templateObj.categorySlug || fallbackCategory,
          quantity: existingOpts.selectedQty || (templateObj.price ? `${templateObj.unitPrice || ''} - ${templateObj.price}` : (mergedOpts.effectiveQtyOptions?.[0]?.label || undefined)),
          stock: existingOpts.selectedQuality || undefined,
          style: existingOpts.selectedStyle || undefined,
          customSelections: existingOpts.customSelections || undefined
        }
      }));
    }
  } catch (e) {}

  const paramsObj = {
    templateId: templateObj.id || '',
    templateTitle: templateObj.title || '',
    size: templateObj.size || '85mm x 55mm',
    orientation: templateObj.orientation || 'Standard',
    category: templateObj.categoryName || templateObj.categorySlug || fallbackCategory,
    price: templateObj.price || '₹200.00',
    unitPrice: templateObj.unitPrice || '₹2.00 each / 100 units',
    customCompany: formState.companyName || templateObj.companyName || '',
    customPerson: formState.personName || templateObj.personName || '',
    customTitle: formState.jobTitle || templateObj.jobTitle || '',
    selectedColor: formState.selectedColor || templateObj.colors?.[0] || '#2563EB'
  };

  if (bgImg && bgImg.length < 500 && !bgImg.startsWith('data:')) {
    paramsObj.bgImage = bgImg;
  }
  if (backBgImg && backBgImg.length < 500 && !backBgImg.startsWith('data:')) {
    paramsObj.backBgImage = backBgImg;
  }

  const params = new URLSearchParams(paramsObj);
  return params.toString();
};

export default function TemplateCategoryClient({ categoryId, initialData }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
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

  const [userProductSelection, setUserProductSelection] = useState(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem('a2v_product_options');
        if (raw) setUserProductSelection(JSON.parse(raw) || null);
      } catch (e) {}
    }
  }, []);

  // Determine current category info or fallback
  const { printingCategories, graphicCategories, printingServicesList, graphicServicesList } = useDatabaseData();

  const categorySlug = categoryId?.toLowerCase() || 'visiting-cards';

  const matchedService = useMemo(() => {
    const allServices = [...(printingServicesList || []), ...(graphicServicesList || [])];
    return allServices.find(s => 
      String(s.categorySlug || s.categoryName || s.id || '').toLowerCase() === categorySlug.toLowerCase() ||
      String(s.title || '').toLowerCase() === categorySlug.replace(/-/g, ' ').toLowerCase()
    ) || null;
  }, [printingServicesList, graphicServicesList, categorySlug]);

  const matchedCategoryDb = useMemo(() => {
    const allCategories = [...(printingCategories || []), ...(graphicCategories || [])];
    return allCategories.find(c => 
      String(c.slug || c.name || c.id || '').toLowerCase() === categorySlug.toLowerCase() ||
      (matchedService && String(c.slug || c.name || '').toLowerCase() === String(matchedService.categorySlug || matchedService.categoryName || '').toLowerCase())
    ) || null;
  }, [printingCategories, graphicCategories, categorySlug, matchedService]);

  const dynamicPricing = useMemo(() => {
    const baseCat = categoryTemplateMap[categorySlug] || {};
    const qtyOptions = matchedService?.quantityTiers || matchedService?.defaultQtyOptions || matchedCategoryDb?.defaultQtyOptions || baseCat.defaultQtyOptions || [];
    let derivedBasePrice = baseCat.basePrice || matchedService?.price || matchedService?.startingPrice || matchedCategoryDb?.startingPrice || '₹200.00';
    let derivedUnitPrice = baseCat.unitPriceText || matchedService?.unitPrice || '₹2.00 each / 100 units';

    if (Array.isArray(qtyOptions) && qtyOptions.length > 0) {
      const firstOpt = qtyOptions[0];
      const labelStr = typeof firstOpt === 'string' ? firstOpt : (firstOpt?.label || '');
      const priceMatch = labelStr.match(/₹([0-9,.]+)/);
      if (priceMatch) {
        derivedBasePrice = `₹${priceMatch[1]}`;
      }
      const parts = labelStr.split(' - ');
      if (parts.length >= 2 && parts[0] && parts[1]) {
        const countMatch = parts[0].match(/([0-9,]+)/);
        const count = countMatch ? parseFloat(countMatch[1].replace(/,/g, '')) : 100;
        const priceNum = parseFloat(parts[1].replace(/[^0-9.]/g, '')) || 200;
        if (count > 0) {
          derivedUnitPrice = `₹${(priceNum / count).toFixed(2)} each / ${parts[0]}`;
        }
      }
    }
    return {
      basePrice: derivedBasePrice,
      unitPriceText: derivedUnitPrice,
      qtyOptions: Array.isArray(qtyOptions) ? qtyOptions : []
    };
  }, [categorySlug, matchedService, matchedCategoryDb]);

  const categoryInfo = useMemo(() => {
    const baseCat = categoryTemplateMap[categorySlug] || {};
    return {
      ...baseCat,
      name: baseCat.name || matchedService?.title || matchedCategoryDb?.name || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: baseCat.description || matchedService?.description || matchedCategoryDb?.description || `Browse stunning customizable templates and designs for ${categorySlug.replace(/-/g, ' ')}.`,
      basePrice: dynamicPricing.basePrice,
      unitPriceText: dynamicPricing.unitPriceText,
      rating: baseCat.rating || '4.8 (1,240)',
      filterOptions: baseCat.filterOptions || categoryTemplateMap['visiting-cards'].filterOptions,
      defaultQtyOptions: dynamicPricing.qtyOptions.length > 0 ? dynamicPricing.qtyOptions : (baseCat.defaultQtyOptions || []),
      defaultQualityOptions: matchedService?.qualityOptions || matchedCategoryDb?.defaultQualityOptions || baseCat.defaultQualityOptions || [],
      defaultStyleOptions: matchedService?.styleOptions || matchedCategoryDb?.defaultStyleOptions || baseCat.defaultStyleOptions || [],
      customOptions: matchedService?.customOptions || matchedCategoryDb?.customOptions || baseCat.customOptions || [],
      templates: getAllTemplates().filter(t => t.categorySlug === categorySlug || categorySlug === 'all')
    };
  }, [categorySlug, dynamicPricing, matchedService, matchedCategoryDb]);

  const allCategoryTemplates = useMemo(() => {
    const fallbackList = getCategoryTemplates(categorySlug) || [];
    const initialList = Array.isArray(initialData?.templates)
      ? initialData.templates
      : (Array.isArray(initialData?.data)
        ? initialData.data
        : (Array.isArray(initialData) ? initialData : []));

    const matchesCategory = (t) => {
      if (categorySlug === 'all') return true;
      const target = categorySlug.toLowerCase().trim();
      const tSlug = String(t?.categorySlug || '').toLowerCase().trim();
      const tName = String(t?.categoryName || t?.category || '').toLowerCase().trim().replace(/\s+/g, '-');
      const tId = String(t?.categoryId || '').toLowerCase().trim();
      return tSlug === target || tName === target || tId === target || tSlug.replace(/\s+/g, '-') === target;
    };

    const matchingDb = (dbTemplates || []).filter(matchesCategory);
    const matchingInitial = initialList.filter(matchesCategory);

    const combined = [...matchingDb, ...matchingInitial, ...fallbackList];
    const seen = new Set();
    const deduplicated = [];

    for (const t of combined) {
      if (!t) continue;
      const key = t.id || t._id || t.numericId || t.title;
      if (key && !seen.has(String(key))) {
        seen.add(String(key));
        deduplicated.push(t);
      } else if (!key) {
        deduplicated.push(t);
      }
    }

    return deduplicated.map(t => ({
      ...t,
      price: t.price || categoryInfo.basePrice || '₹200.00',
      unitPrice: t.unitPrice || categoryInfo.unitPriceText || '₹2.00 each / 100 units'
    }));
  }, [categorySlug, dbTemplates, initialData, categoryInfo]);

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

    
    return list;
  }, [allCategoryTemplates, searchQuery,activeFilters]);

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

          {/* Search bar Toggle Row */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="relative grow max-w-lg">
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
                {(searchQuery || Object.values(activeFilters).some(a => a.length > 0)) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-[#CC3B10] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors"
                  >
                    Reset Filters ×
                  </button>
                )}
              </div>

              
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">  

              {/* Template Cards */}
              {filteredTemplates.map((template) => {
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


                      {/* Title & Pricing */}
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-[#CC3B10] transition-colors leading-snug line-clamp-2 mb-2">
                        {displayTitle}
                      </h3>

                      <div className="flex flex-col gap-0.5 text-xs font-bold text-slate-800 mb-4">
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                          <span>Template Size:</span>
                          <span className="font-extrabold text-slate-800 truncate max-w-35">{template.size || '85mm x 55mm'}</span>
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
                        }, categoryInfo?.name || categorySlug, categoryInfo);
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
              <div className="bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#334155] rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between min-h-85">
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
                  href="/graphic-design"
                  className="w-full bg-[#CC3B10] hover:bg-[#E55B2B] text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Get a Design From Scratch</span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Interactive 3D Card Preview & Customizer Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-145 relative my-6">

            {/* Close Button Top Right */}
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-xl transition-colors shadow-2xs"
            >
              ×
            </button>
            {/* Left Area: 3D Card Visual Studio & Front/Back Controls */}
            <div className="lg:w-[62%] bg-[#d4d2c0] p-6 sm:p-10 flex flex-col justify-between items-center relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200/80">
              {/* Center: 3D Perspective Container */}
              <div
                className="w-full max-w-md my-8 sm:my-12 flex items-center justify-center perspective-distant"
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
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {userProductSelection?.productTitle || selectedTemplate.title || 'Base Package Price'}
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">
                        {userProductSelection?.formattedPrice || (userProductSelection?.selectedPrice ? `₹${Number(userProductSelection.selectedPrice).toFixed(2)}` : (selectedTemplate.price || categoryInfo.basePrice || '₹200.00'))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-orange-200/60 flex items-center justify-between text-xs font-black text-[#CC3B10]">
                        <span>{userProductSelection?.selectedQty ? 'Selected Quantity:' : 'Pricing As Per Unit:'}</span>
                        <span>{userProductSelection?.selectedQty || selectedTemplate.unitPrice || categoryInfo.unitPriceText || '₹2.00 each / 100 units'}</span>
                      </div>
                      {userProductSelection?.selectedQuality && (
                        <div className="mt-2 pt-2 border-t border-orange-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>{userProductSelection.qualityLabel || 'Quality / Stock'}:</span>
                          <span className="font-black text-slate-900 text-right">{userProductSelection.selectedQuality}</span>
                        </div>
                      )}
                      {userProductSelection?.selectedStyle && (
                        <div className="mt-2 pt-2 border-t border-orange-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>{userProductSelection.styleLabel || 'Style / Printing'}:</span>
                          <span className="font-black text-slate-900 text-right">{userProductSelection.selectedStyle}</span>
                        </div>
                      )}
                      {userProductSelection?.customSelections && Object.entries(userProductSelection.customSelections).map(([k, v], idx) => (
                        <div key={idx} className="mt-2 pt-2 border-t border-orange-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>{k}:</span>
                          <span className="font-black text-slate-900 text-right">{v}</span>
                        </div>
                      ))}
                      <div className="mt-2 pt-2 border-t border-orange-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Template Size (Dimensions):</span>
                        <span className="font-black text-slate-900 text-right">{selectedTemplate.size || categoryInfo.size || '85mm x 55mm'}</span>
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
                        const queryString = getEditerParams(selectedTemplate, customizerForm, categoryInfo?.name || categorySlug, categoryInfo);
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

                    <div className="space-y-3.5 max-h-95 overflow-y-auto pr-1">
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
                        const queryString = getEditerParams(selectedTemplate, customizerForm, categoryInfo?.name || categorySlug, categoryInfo);
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
