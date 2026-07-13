'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setSubscribed(true)
      setEmail('')
    } else {
      alert('Please enter a valid email address.')
    }
  }

  const categoryLinks = [
    { name: 'Visiting Cards', href: '/visiting-cards' },
    { name: 'Logo Design Packages', href: '/logo-design' },
    { name: 'Banners & Posters', href: '/banner-poster' },
    { name: 'Custom T-Shirts & Apparel', href: '/custom-tshirts' },
    { name: 'Flex Boards & Signages', href: '/flex-board' },
    { name: 'Packaging & Labeling', href: '/packaging-labeling' },
    { name: 'Mugs & Drinkware', href: '/mugs-drinkware' },
    { name: 'Hoodies & Winterwear', href: '/hoodies-jackets' },
  ]

  const quickLinks = [
    { name: 'About A2V Prints', href: '#' },
    { name: 'How Custom Printing Works', href: '#' },
    { name: 'Online Design Studio & Templates', href: '#' },
    { name: 'Request Bulk Quote / Corporate B2B', href: '#' },
    { name: 'Print Sample Kit Request', href: '#' },
    { name: 'Customer Testimonials & Reviews', href: '#' },
    { name: 'Print Bleed & Artwork Guidelines', href: '#' },
    { name: 'Career Opportunities', href: '#' },
  ]

  const supportLinks = [
    { name: '24/7 Help Center & FAQ', href: '#' },
    { name: 'Order Tracking & Live Status', href: '#' },
    { name: 'Shipping & Delivery Timelines', href: '#' },
    { name: '100% Reprint & Refund Guarantee', href: '#' },
    { name: 'File Preparation & DPI Check', href: '#' },
    { name: 'Contact Customer Care', href: '#' },
    { name: 'Terms & Conditions of Service', href: '#' },
    { name: 'Privacy & Data Security Policy', href: '#' },
  ]

  if (pathname && pathname.startsWith('/admin')) return null;

  return (
    <footer className="w-full bg-[#0a0f1d] text-slate-300 pt-12 border-t border-slate-800/80 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F06800]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#5348e2]/10 rounded-full blur-3xl pointer-events-none translate-y-1/3" />


      {/* Main Footer Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand Info & Socials (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            <Link href="/" className=" mb-6 inline-block group hover:scale-105 transition-transform duration-300">
              <img src="/A2V  Groups Logo.png" alt="A2V Prints" className="w-35 h-auto object-contain" />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mb-6 font-normal">
              Your premier destination for high-definition custom printing, branding materials, corporate apparel, and promotional signage solutions. Powered by precision digital technology and passionate design.
            </p>

            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transform hover:-translate-y-1 transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="#" aria-label="Twitter X" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-black hover:border-slate-700 transform hover:-translate-y-1 transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] hover:border-transparent transform hover:-translate-y-1 transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transform hover:-translate-y-1 transition-all duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Print Categories (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F06800]"></span>
              <span>Print Catalog</span>
            </h4>
            <ul className="space-y-3">
              {categoryLinks.map((cat, idx) => (
                <li key={idx}>
                  <Link
                    href={cat.href}
                    className="text-sm font-medium text-slate-400 hover:text-[#ff8633] hover:translate-x-1 transition-all inline-block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-extrabold text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5348e2]"></span>
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-slate-400 hover:text-[#ff8633] hover:translate-x-1 transition-all inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Support & Contact (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-extrabold text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Support & Help</span>
            </h4>
            <ul className="space-y-3 mb-8">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-slate-400 hover:text-[#ff8633] hover:translate-x-1 transition-all inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Direct Contact Pill */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Need Urgent Assistance?
              </p>
              <a href="tel:+918001234567" className="text-sm font-extrabold text-[#ff8633] hover:underline flex items-center gap-1.5 mt-1">
                <span>📞 +91 800 123 4567</span>
              </a>
              <p className="text-[11px] text-slate-500 mt-1">
                Mon - Sat: 9:00 AM to 8:00 PM IST
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges & Payment Section */}
      <div className="border-t border-slate-800/80 bg-[#060a12] py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-wrap justify-center md:justify-start text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Quality Guaranteed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>256-Bit SSL Secure Checkout</span>
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span>Pan-India Express Shipping</span>
            </span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-3 opacity-80">
            <span className="bg-white/10 px-2.5 py-1 rounded text-[11px] font-bold text-white tracking-wider">VISA</span>
            <span className="bg-white/10 px-2.5 py-1 rounded text-[11px] font-bold text-white tracking-wider">MASTERCARD</span>
            <span className="bg-white/10 px-2.5 py-1 rounded text-[11px] font-bold text-white tracking-wider">UPI / PAYTM</span>
            <span className="bg-white/10 px-2.5 py-1 rounded text-[11px] font-bold text-white tracking-wider">NET BANKING</span>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="bg-[#04070c] py-6 text-xs text-slate-500 border-t border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} A2V Prints & Groups. All rights reserved. Crafted with precision for businesses & creators.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookie Preferences</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
