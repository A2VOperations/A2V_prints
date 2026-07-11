'use client'

const CART_PREFIX = 'a2v_cart_'
const WISHLIST_PREFIX = 'a2v_wishlist_'

function getKey(prefix, userId) {
  if (!userId) return `${prefix}guest`
  return `${prefix}${userId}`
}

export function notifyCartWishlistChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cart-wishlist-change'))
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
      i.qtyOption === item.qtyOption
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

  localStorage.setItem(getKey(CART_PREFIX, userId), JSON.stringify(cart))
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
  localStorage.setItem(getKey(CART_PREFIX, userId), JSON.stringify(cart))
  notifyCartWishlistChange()
  return cart
}

export function removeFromCart(userId, itemId) {
  if (typeof window === 'undefined') return []
  const cart = getCart(userId).filter((i) => i.id !== itemId)
  localStorage.setItem(getKey(CART_PREFIX, userId), JSON.stringify(cart))
  notifyCartWishlistChange()
  return cart
}

export function clearCart(userId) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(getKey(CART_PREFIX, userId))
  notifyCartWishlistChange()
}

// WISHLIST FUNCTIONS
export function getWishlist(userId) {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(getKey(WISHLIST_PREFIX, userId))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addToWishlist(userId, item) {
  if (typeof window === 'undefined') return []
  const list = getWishlist(userId)
  const exists = list.some((i) => String(i.productId) === String(item.productId))
  if (!exists) {
    list.push({
      id: `${item.productId}_${Date.now()}`,
      addedAt: new Date().toISOString(),
      ...item,
    })
    localStorage.setItem(getKey(WISHLIST_PREFIX, userId), JSON.stringify(list))
    notifyCartWishlistChange()
  }
  return list
}

export function removeFromWishlist(userId, itemId) {
  if (typeof window === 'undefined') return []
  const list = getWishlist(userId).filter((i) => i.id !== itemId)
  localStorage.setItem(getKey(WISHLIST_PREFIX, userId), JSON.stringify(list))
  notifyCartWishlistChange()
  return list
}

export function moveToCart(userId, item) {
  if (typeof window === 'undefined') return
  addToCart(userId, item)
  removeFromWishlist(userId, item.id)
}
