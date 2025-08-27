// src/utils/cart.js

// Citește coșul din localStorage
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  } catch {
    return []
  }
}

// Salvează coșul în localStorage și notifică alte componente
export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('storage')) // anunță restul aplicației
}

// Adaugă produs în coș
export function addToCart(item) {
  const cart = getCart()
  const index = cart.findIndex(p => p.id === item.id)
  if (index >= 0) {
    cart[index].qty += 1
  } else {
    cart.push({ ...item, qty: 1 })
  }
  saveCart(cart)
}

// Șterge un produs din coș
export function removeFromCart(id) {
  const cart = getCart().filter(p => p.id !== id)
  saveCart(cart)
}

// Golește tot coșul
export function clearCart() {
  saveCart([])
}

// Calculează totalul în RON
export function cartTotal() {
  const cart = getCart()
  return cart.reduce((sum, p) => sum + Number(p.pret || 0) * (p.qty || 1), 0)
}
// ——— qty helpers (nou)
export function setQty(id, qty) {
  const cart = getCart()
  const i = cart.findIndex(p => p.id === id)
  if (i >= 0) {
    cart[i].qty = Math.max(1, Number(qty) || 1)
    saveCart(cart)
  }
}

export function updateQty(id, qty) {
  // alias; păstrăm numele folosit des în componente
  setQty(id, qty)
}
