import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, ShoppingCart, Minus, Plus } from 'lucide-react'
import AppScreen from '../components/AppScreen'
import { getAllProducts } from '../services/productService'
import { useCart } from '../context/CartContext'
import './ProductCatalogue.css'

function formatRand(value) {
  if (value === null || value === undefined) return ''
  return `R${Number(value).toFixed(2)}`
}

export default function ProductCatalogue() {
  const navigate = useNavigate()
  const { items, totalItems, setQuantity } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    getAllProducts()
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const found = [...new Set(products.map((p) => p.category).filter(Boolean))]
    return ['All', ...found]
  }, [products])

  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, search])

  return (
    <AppScreen
      header={
        <div className="app-header">
          <button className="app-header-icon-btn" onClick={() => navigate('/dashboard')} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <span className="app-header-title">All Products</span>
          <button
            className="app-header-icon-btn"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button className="app-header-icon-btn" onClick={() => navigate('/cart')} aria-label="Cart">
            <ShoppingCart size={18} />
            {totalItems > 0 && <span className="app-header-badge">{totalItems}</span>}
          </button>
        </div>
      }
    >
      {searchOpen && (
        <input
          className="catalogue-search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      )}

      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={'category-tab' + (activeCategory === cat ? ' active' : '')}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="muted-note">Loading products…</p>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && visibleProducts.length === 0 && (
        <p className="muted-note">No products match that filter.</p>
      )}

      <div className="product-list">
        {visibleProducts.map((product) => {
          const cartQty = items[product.id]?.quantity ?? 0
          return (
            <ProductRow
              key={product.id}
              product={product}
              cartQty={cartQty}
              onAdd={(qty) => setQuantity(product, qty)}
            />
          )
        })}
      </div>
    </AppScreen>
  )
}

function ProductRow({ product, cartQty, onAdd }) {
  const [qty, setQty] = useState(cartQty || 1)

  return (
    <div className="product-row">
      <div className="product-icon">{product.name?.[0] ?? '?'}</div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-category">{product.category}</p>
        <p className="product-price">{formatRand(product.singleUnitPrice)}</p>
        {product.bulkThresholdQty && product.bulkUnitPrice && (
          <p className="product-bulk-price">
            {formatRand(product.bulkUnitPrice)} each at {product.bulkThresholdQty}+ in a pool
          </p>
        )}
      </div>
      <div className="product-actions">
        <div className="qty-stepper">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus size={14} />
          </button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
            <Plus size={14} />
          </button>
        </div>
        <button className="btn-add-cart" onClick={() => onAdd(qty)}>
          {cartQty > 0 ? 'Update' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
