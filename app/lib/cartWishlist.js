'use client'

const CART_PREFIX = 'a2v_cart_'
const WISHLIST_PREFIX = 'a2v_wishlist_'
const DRAFTS_PREFIX = 'a2v_drafts_'

function getKey(prefix, userId) {
  if (!userId) return `${prefix}guest`
  return `${prefix}${userId}`
}

export function compressImageForStorage(fileOrDataUrl, maxWidth = 600, maxHeight = 600, quality = 0.65) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null)
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      let w = img.naturalWidth || img.width || 600
      let h = img.naturalHeight || img.height || 600
      if (w > maxWidth || h > maxHeight) {
        if (w > h) {
          h = Math.round((h / w) * maxWidth)
          w = maxWidth
        } else {
          w = Math.round((w / h) * maxHeight)
          h = maxHeight
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
        ctx.drawImage(img, 0, 0, w, h)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      } else {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : img.src)
      }
    }
    img.onerror = () => {
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : null)
    }
    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl
    } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target.result
      }
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(fileOrDataUrl)
    } else {
      resolve(null)
    }
  })
}

function safeSetStorage(key, dataArray) {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem(key, JSON.stringify(dataArray))
    return true
  } catch (err) {
    console.warn('LocalStorage limit exceeded! Pruning large base64 data URLs to fit local storage quota...', err)
    const prunedArray = dataArray.map((item) => {
      const clone = { ...item }
      if (clone.uploadedImageUrl && typeof clone.uploadedImageUrl === 'string' && clone.uploadedImageUrl.length > 50000) {
        clone.uploadedImageUrl = null
      }
      if (Array.isArray(clone.uploadedImageUrls)) {
        clone.uploadedImageUrls = clone.uploadedImageUrls.map(url => (url && typeof url === 'string' && url.length > 50000) ? null : url)
      }
      if (clone.image && typeof clone.image === 'string' && clone.image.length > 50000 && clone.image.startsWith('data:image')) {
        clone.image = '/assets/images/placeholder.png'
      }
      return clone
    })
    try {
      localStorage.setItem(key, JSON.stringify(prunedArray))
      return true
    } catch (err2) {
      console.error('Failed to save to localStorage even after pruning:', err2)
      return false
    }
  }
}

export function notifyCartWishlistChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-wishlist-change'))
    window.dispatchEvent(new CustomEvent('cart-draft-change'))
  }
}

// CART FUNCTIONS
export function getCart(userId) {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(getKey(CART_PREFIX, userId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addToCart(userId, item) {
  if (typeof window === 'undefined') return []
  const cart = getCart(userId)
  // Check if item with same productId and same options exists
  const existingIndex = cart.findIndex(
    (i) =>
      String(i.productId) === String(item.productId) &&
      i.quality === item.quality &&
      i.style === item.style &&
      i.qtyOption === item.qtyOption &&
      JSON.stringify(i.customSelections || null) === JSON.stringify(item.customSelections || null)
  )

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + (item.quantity || 1)
  } else {
    cart.push({
      id: `${item.productId}_${Date.now()}`,
      quantity: 1,
      ...item,
    })
  }

  safeSetStorage(getKey(CART_PREFIX, userId), cart)
  notifyCartWishlistChange()
  return cart
}

export function updateCartQty(userId, itemId, newQuantity) {
  if (typeof window === 'undefined') return []
  let cart = getCart(userId)
  if (newQuantity <= 0) {
    cart = cart.filter((i) => i.id !== itemId)
  } else {
    const item = cart.find((i) => i.id === itemId)
    if (item) {
      item.quantity = newQuantity
    }
  }
  safeSetStorage(getKey(CART_PREFIX, userId), cart)
  notifyCartWishlistChange()
  return cart
}

export function removeFromCart(userId, itemId) {
  if (typeof window === 'undefined') return []
  const cart = getCart(userId).filter((i) => i.id !== itemId)
  safeSetStorage(getKey(CART_PREFIX, userId), cart)
  notifyCartWishlistChange()
  return cart
}

export function clearCart(userId) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(getKey(CART_PREFIX, userId))
  notifyCartWishlistChange()
}

// DRAFTS FUNCTIONS
export function getDrafts(userId) {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(getKey(DRAFTS_PREFIX, userId))
    if (raw) return JSON.parse(raw)
    // Fallback: migrate old wishlist items if any
    const wishlistRaw = localStorage.getItem(getKey(WISHLIST_PREFIX, userId))
    return wishlistRaw ? JSON.parse(wishlistRaw) : []
  } catch {
    return []
  }
}

export function saveDraft(userId, item) {
  if (typeof window === 'undefined') return []
  const list = getDrafts(userId)
  const draftId = item.id || `draft_${Date.now()}`
  const existingIndex = list.findIndex((i) => String(i.id) === String(draftId))

  const draftData = {
    id: draftId,
    title: item.title || item.name || 'Custom Studio Design Draft',
    updatedAt: new Date().toISOString(),
    image: item.image || item.previewImage || '/home/visiting-cards/card-stack.png',
    previewImage: item.previewImage || item.image || '/home/visiting-cards/card-stack.png',
    productId: item.productId || `custom_draft_${Date.now()}`,
    templateId: item.templateId || null,
    frontElements: item.frontElements || item.customDesign?.frontElements || [],
    backElements: item.backElements || item.customDesign?.backElements || [],
    frontBackground: item.frontBackground || item.customDesign?.frontBackground || '#ffffff',
    backBackground: item.backBackground || item.customDesign?.backBackground || '#ffffff',
    productOptions: item.productOptions || item.customDesign?.productOptions || {},
    isBackCustomized: item.isBackCustomized ?? item.customDesign?.isBackCustomized ?? false,
    size: item.size || item.productOptions?.size || '91.8mm x 53.8mm',
    price: item.price || 0,
    numericPrice: item.numericPrice || item.price || 0,
  }

  if (existingIndex > -1) {
    list[existingIndex] = { ...list[existingIndex], ...draftData }
  } else {
    list.unshift(draftData)
  }

  safeSetStorage(getKey(DRAFTS_PREFIX, userId), list)
  notifyCartWishlistChange()
  return list
}

export function removeFromDrafts(userId, draftId) {
  if (typeof window === 'undefined') return []
  const list = getDrafts(userId).filter((i) => String(i.id) !== String(draftId))
  safeSetStorage(getKey(DRAFTS_PREFIX, userId), list)
  notifyCartWishlistChange()
  return list
}

export function clearDrafts(userId) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(getKey(DRAFTS_PREFIX, userId))
  notifyCartWishlistChange()
}

export function moveToCartFromDraft(userId, item) {
  if (typeof window === 'undefined') return
  const cartItem = {
    productId: item.productId || `custom_studio_${Date.now()}`,
    title: item.title || 'Custom Studio Design',
    price: item.price || item.numericPrice || 450,
    numericPrice: item.numericPrice || item.price || 450,
    qtyOption: (item.productOptions?.quantity || '250 cards').split(' -')[0],
    quality: item.productOptions?.quality || item.productOptions?.stock || 'Standard Matte (300 gsm)',
    style: item.productOptions?.style || (item.isBackCustomized ? 'Double Sided Custom Print' : 'Single Sided Custom Print'),
    image: item.previewImage || item.image || '/home/visiting-cards/card-stack.png',
    quantity: 1,
    customDesign: {
      frontElements: item.frontElements || [],
      backElements: item.backElements || [],
      frontBackground: item.frontBackground || '#ffffff',
      backBackground: item.backBackground || '#ffffff',
      productOptions: item.productOptions || {},
      isBackCustomized: item.isBackCustomized || false,
    }
  }
  addToCart(userId, cartItem)
  removeFromDrafts(userId, item.id)
}

// WISHLIST LEGACY ALIASES
export const getWishlist = getDrafts
export const addToWishlist = saveDraft
export const removeFromWishlist = removeFromDrafts
export const moveToCart = moveToCartFromDraft

