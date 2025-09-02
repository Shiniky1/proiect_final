// src/utils/cart.js

// emite un eveniment custom atunci când se schimbă coșul
function notifyCartChange() {
  window.dispatchEvent(new Event('cart-storage'))
}

// citește coșul din localStorage
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  } catch {
    return []
  }
}

// scrie coșul și emite notificare
function setCart(list) {
  localStorage.setItem('cart', JSON.stringify(list))
  notifyCartChange()
}

// adaugă produs
export function addToCart(item) {
  const list = getCart()
  const i = list.findIndex(p => p.id === item.id)
  if (i !== -1) {
    list[i].qty = (list[i].qty || 1) + (item.qty || 1)
  } else {
    list.push({ ...item, qty: item.qty || 1 })
  }
  setCart(list)
}

// șterge produs
export function removeFromCart(id) {
  const list = getCart().filter(p => p.id !== id)
  setCart(list)
}

// setează cantitate
export function setQty(id, qty) {
  const list = getCart()
  const i = list.findIndex(p => p.id === id)
  if (i !== -1) {
    list[i].qty = Math.max(1, Number(qty) || 1)
    setCart(list)
  }
}

// alias pentru compatibilitate
export const updateQty = setQty

// golește coșul
export function clearCart() {
  setCart([])
}

// număr total produse
export function cartCount() {
  return getCart().reduce((s, p) => s + (p.qty || 1), 0)
}

// total RON
export function cartTotal() {
  return getCart().reduce((s, p) => s + Number(p.pret || 0) * (p.qty || 1), 0)
}
