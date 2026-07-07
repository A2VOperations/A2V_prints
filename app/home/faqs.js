'use client'

import React, { useState } from 'react'

const faqCategories = [
  'All Questions',
  'Ordering & Design',
  'Shipping & Delivery',
  'Quality & Pricing'
]

const faqsData = [
  {
    category: 'Ordering & Design',
    question: 'What services and print categories does A2V Prints offer?',
    answer: 'We offer end-to-end custom printing and branding solutions, including corporate visiting cards, apparel & t-shirt printing, wide-format flex banners, retail packaging & labels, ceramic mugs, corporate winterwear, and custom logo design packages.'
  },
  {
    category: 'Ordering & Design',
    question: 'How does the online design and ordering process work?',
    answer: 'Simply select your product, configure specifications (like quantity, paper GSM, or fabric type), and choose to either upload your ready-to-print artwork file or customize one of our professional templates using our online design studio.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'What is your standard turnaround and shipping timeline?',
    answer: 'Standard orders are produced and dispatched within 2 to 3 business days after design approval. We also offer express priority dispatch at checkout with 1–2 business day delivery across major metro cities.'
  },
  {
    category: 'Quality & Pricing',
    question: 'Do you offer bulk discounts or corporate B2B pricing?',
    answer: 'Yes! We specialize in corporate bulk orders and recurring business print needs. Our volume tiered discounts automatically apply as your order quantity increases. You can also request a custom quote for enterprise orders.'
  },
  {
    category: 'Ordering & Design',
    question: 'How do I ensure my uploaded artwork prints clearly?',
    answer: 'We recommend submitting high-resolution vector files (AI, EPS, PDF) or 300 DPI transparent PNG/JPG files in CMYK color mode with a standard 3mm (0.125") bleed margin. Our pre-press team checks every file before printing!'
  },
  {
    category: 'Quality & Pricing',
    question: 'What is your quality guarantee and reprint policy?',
    answer: 'We stand by a 100% satisfaction guarantee. If your order arrives with any printing defect, color mismatch, or physical transit damage, we will reprint and ship a replacement order immediately at zero extra cost to you.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'How can I track my print order status once placed?',
    answer: 'As soon as your order moves to our production floor, you will receive real-time SMS and email updates. Once dispatched, a live courier tracking link is provided so you can monitor delivery to your doorstep.'
  }
]

export default function HomeFaqs() {
  const [selectedCategory, setSelectedCategory] = useState('All Questions')
  const [openIdx, setOpenIdx] = useState(0)

  const filteredFaqs = selectedCategory === 'All Questions'
    ? faqsData
    : faqsData.filter(f => f.category === selectedCategory)

  return (
    <section className="w-full bg-[#f8f9fa] py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 select-none relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#F06800]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#5348e2]/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#F06800]/10 border border-[#F06800]/30 text-[#c84b00] text-xs font-extrabold tracking-wider uppercase mb-3 shadow-xs">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
            Everything you need to know about ordering custom prints, artwork submission guidelines, bulk pricing, and pan-India delivery with A2V Prints.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {faqCategories.map((cat, idx) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat)
                  setOpenIdx(0) // Reset open index when category changes
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer select-none shadow-xs ${
                  isActive
                    ? 'bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] text-white shadow-md scale-105'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Accordion Questions Grid */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md group"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#c84b00] transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#F06800] text-white rotate-180 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 shadow-xs group-hover:border-slate-300'
                    }`}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30 animate-fadeIn font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom Support CTA Box */}
        <div className="mt-14 bg-[linear-gradient(135deg,#0f172a_0%,#1e1b4b_100%)] rounded-3xl p-8 sm:p-10 text-center text-white border border-white/10 shadow-xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Still have a specific question?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Our print specialists are available 24/7 to help you with custom quotes and artwork checks.
            </p>
          </div>
          <a
            href="tel:+918001234567"
            className="bg-[linear-gradient(90deg,#F06800_0%,hsla(328,100%,51%,1)_100%)] hover:opacity-95 text-white font-extrabold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            📞 Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}
