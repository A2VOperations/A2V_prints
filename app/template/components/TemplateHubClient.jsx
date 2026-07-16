'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { categoryTemplateMap, getAllTemplates } from '../../lib/templatesData';

export default function TemplateHubClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const allTemplates = getAllTemplates();
  const categoriesList = Object.entries(categoryTemplateMap).map(([slug, data]) => ({
    slug,
    ...data
  }));

  const industries = [
    'All',
    'Corporate & Executive',
    'Creative & Design',
    'Medical & Healthcare',
    'Food & Restaurant',
    'Salon & Spa',
    'Real Estate',
    'Tech Startup & SaaS',
    'E-Commerce Storefront'
  ];

  const filteredFeaturedTemplates = allTemplates.filter(t => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = (t.title || '').toLowerCase().includes(q);
      const matchCat = (t.categoryName || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCat) return false;
    }
    if (selectedIndustry !== 'All') {
      if (!t.industry || !t.industry.includes(selectedIndustry)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFBF8] text-slate-800 font-sans pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-white to-[#FFFBF8] border-b border-slate-200/80 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#CC3B10] text-xs font-extrabold tracking-wide uppercase border border-orange-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#CC3B10] animate-pulse" />
            Design & Template Gallery
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight max-w-4xl mx-auto">
            Professional Templates for Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CC3B10] to-[#E55B2B]">Business Category</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-4">
            Select a category below or search our thousands of high-definition, customizable design templates ready to print or download immediately.
          </p>

          {/* Global Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search visiting cards, t-shirts, banners, boxes, logos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#CC3B10] shadow-lg"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600">
                Clear
              </button>
            )}
          </div>

          {/* Industry Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                  selectedIndustry === ind
                    ? 'bg-[#031A30] text-white shadow-md scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Explore Templates by Category</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Choose a product or service category to view dedicated design templates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesList.map((cat) => (
            <Link
              key={cat.slug}
              href={`/template/${cat.slug}`}
              className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                  <img
                    src={cat.templates?.[0]?.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 text-[#CC3B10] font-extrabold text-[11px] shadow-sm">
                    {cat.templates?.length || 8}+ Designs
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#CC3B10] transition-colors mb-1.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              <div className="w-full bg-[#FDFBF9] group-hover:bg-[#031A30] text-slate-800 group-hover:text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 group-hover:border-transparent">
                <span>View Templates</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Templates Across All Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Featured & Bestselling Designs</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Handpicked designs currently trending across our entire catalog</p>
          </div>
          <span className="text-xs font-bold text-slate-500">Showing {filteredFeaturedTemplates.length} templates</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFeaturedTemplates.slice(0, 9).map((t) => (
            <Link
              key={t.id}
              href={`/template/${t.categorySlug}`}
              className="group bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                  <img
                    src={t.image}
                    alt={t.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/90 text-white font-extrabold text-[10px] uppercase shadow-sm">
                    {t.categoryName}
                  </span>
                  {t.badge && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white text-[#CC3B10] font-extrabold text-[10px] shadow-sm">
                      {t.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mb-2 px-1">
                  {(t.colors || ['#2563EB', '#1E293B', '#10B981']).slice(0, 4).map((cHex, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: cHex }}
                      className="w-3 h-3 rounded-full border border-slate-300 block"
                    />
                  ))}
                  <span className="text-[11px] text-slate-400 font-semibold ml-auto">{t.style || 'Modern'}</span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#CC3B10] transition-colors leading-snug line-clamp-1 mb-1.5">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mb-4">
                  {t.price} <span className="font-normal text-[11px] text-slate-400">({t.unitPrice})</span>
                </p>
              </div>

              <div className="w-full bg-[#031A30] group-hover:bg-[#CC3B10] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors">
                <span>Customize in {t.categoryName}</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
