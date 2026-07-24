'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getDrafts, removeFromDrafts, moveToCartFromDraft, clearDrafts } from '../lib/cartWishlist'

export default function DraftsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [drafts, setDrafts] = useState([])
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 2800)
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        const fetchedUser = data?.user || null
        setUser(fetchedUser)
        setDrafts(getDrafts(fetchedUser?.id || null))
      } catch (err) {
        setUser(null)
        setDrafts(getDrafts(null))
      } finally {
        setLoadingAuth(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const updateList = () => setDrafts(getDrafts(user?.id || null))
    window.addEventListener('cart-draft-change', updateList)
    window.addEventListener('cart-wishlist-change', updateList)
    return () => {
      window.removeEventListener('cart-draft-change', updateList)
      window.removeEventListener('cart-wishlist-change', updateList)
    }
  }, [user])

  const handleRemove = (id) => {
    const uid = user?.id || null
    const updated = removeFromDrafts(uid, id)
    setDrafts(updated)
    showToast('Draft removed successfully')
  }

  const handleAddToCart = (draft) => {
    const uid = user?.id || null
    moveToCartFromDraft(uid, draft)
    setDrafts(getDrafts(uid))
    showToast('Draft added to cart!')
  }

  const handleClearAll = () => {
    const uid = user?.id || null
    clearDrafts(uid)
    setDrafts([])
    showToast('All drafts cleared')
  }

  if (loadingAuth) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-sky-50/50 via-white to-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading your Saved Drafts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8 select-none">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 flex items-center gap-2 border border-slate-700">
          <span>💾</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-[#38bdf8] flex items-center justify-center font-black text-lg">
                💾
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                My Saved Drafts
              </h1>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Your customized editor designs, modified templates, and print drafts saved for quick editing and ordering.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/Editer"
              className="flex-1 sm:flex-initial text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F06800] via-[#f54278] to-[#9842dc] text-white font-bold text-xs sm:text-sm shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              + Create New Design
            </Link>

            {drafts.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {drafts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-sky-50 text-[#38bdf8] rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner">
              🎨
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                You have no saved drafts yet
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                Customize any business card, mug, t-shirt, or banner template in our Editor and click <strong className="text-slate-700">&quot;Save Draft&quot;</strong> to preserve your design progress here.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/Editer"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-black text-sm shadow-md transition-all cursor-pointer"
              >
                Open Studio Editor
              </Link>
              <Link
                href="/printing-categories"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all cursor-pointer"
              >
                Browse Templates & Products
              </Link>
            </div>
          </div>
        ) : (
          /* Grid of Saved Drafts */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => {
              const frontCount = draft.frontElements?.length || 0
              const backCount = draft.backElements?.length || 0
              const isDoubleSided = draft.isBackCustomized || backCount > 0

              return (
                <div
                  key={draft.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                >
                  {/* Draft Canvas Preview Box */}
                  <div className="relative bg-slate-100 p-6 flex items-center justify-center min-h-[220px] border-b border-slate-100 overflow-hidden">
                    <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-700 border border-slate-200 shadow-2xs">
                      {isDoubleSided ? 'Double Sided Design' : 'Single Sided Design'}
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <button
                        type="button"
                        onClick={() => handleRemove(draft.id)}
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                        title="Delete draft"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Preview Thumbnail */}
                    {draft.previewImage || draft.image ? (
                      <img
                        src={draft.previewImage || draft.image}
                        alt={draft.title}
                        className="max-h-[160px] object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/home/visiting-cards/card-stack.png'
                        }}
                      />
                    ) : (
                      <div className="w-48 h-28 rounded-xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">Custom Canvas</span>
                        <span className="text-xs font-bold text-slate-700 truncate">{draft.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Draft Info & Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">
                        {draft.title || 'Custom Studio Draft'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>Card Size: <strong className="text-slate-700">{draft.size || '91.8mm x 53.8mm'}</strong></span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Saved: {draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <Link
                        href={`/Editer?draftId=${draft.id}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-extrabold text-xs sm:text-sm text-center block shadow-xs transition-all cursor-pointer"
                      >
                        ✏️ Edit in Studio
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(draft)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm text-center block transition-all cursor-pointer"
                      >
                        🛒 Add to Cart & Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
