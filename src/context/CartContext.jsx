import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState({}) // { [productId]: { product, quantity } }

  const setQuantity = useCallback((product, quantity) => {
    setItems((prev) => {
      const next = { ...prev }
      if (quantity <= 0) {
        delete next[product.id]
      } else {
        next[product.id] = { product, quantity }
      }
      return next
    })
  }, [])

  const clearCart = useCallback(() => setItems({}), [])

  const itemList = useMemo(() => Object.values(items), [items])
  const totalItems = useMemo(
    () => itemList.reduce((sum, i) => sum + i.quantity, 0),
    [itemList],
  )

  return (
    <CartContext.Provider value={{ items, itemList, totalItems, setQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside a CartProvider')
  return ctx
}
