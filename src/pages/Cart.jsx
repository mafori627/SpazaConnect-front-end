import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import AppScreen from '../components/AppScreen'
import { useCart } from '../context/CartContext'
import { joinPool } from '../services/poolService'
import './ProductCatalogue.css'
import './Dashboard.css'
import './Cart.css'

function formatRand(value) {
  return `R${Number(value).toFixed(2)}`
}

export default function Cart() {
  const navigate = useNavigate()
  const { itemList, setQuantity, clearCart } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState(false)

  const subtotal = itemList.reduce(
    (sum, { product, quantity }) => sum + Number(product.singleUnitPrice) * quantity,
    0,
  )

  // Honest framing: this is what you'd save per item IF its pool reaches
  // bulkThresholdQty and unlocks bulk pricing — not a guaranteed discount,
  // since a pool can stay OPEN indefinitely. Items without a bulk price
  // just contribute 0.
  const potentialSavings = itemList.reduce((sum, { product, quantity }) => {
    if (!product.bulkUnitPrice) return sum
    const perUnit = Number(product.singleUnitPrice) - Number(product.bulkUnitPrice)
    return sum + Math.max(0, perUnit) * quantity
  }, 0)

  async function handleCheckout() {
    setCheckingOut(true)
    setErrors([])
    const failures = []

    // Each cart line becomes its own /api/pools/join call — the backend
    // finds (or creates) the OPEN pool for that product in your cluster
    // and adds your order to it. There's no multi-item "order" concept on
    // the backend, so this has to run one request per product.
    for (const { product, quantity } of itemList) {
      try {
        await joinPool({ productId: product.id, quantity })
      } catch (err) {
        failures.push(`${product.name}: ${err.message}`)
      }
    }

    if (failures.length === 0) {
      clearCart()
      setSuccess(true)
    } else {
      setErrors(failures)
    }
    setCheckingOut(false)
  }

  if (success) {
    return (
      <AppScreen
        header={
          <div className="app-header">
            <button className="app-header-icon-btn" onClick={() => navigate('/dashboard')} aria-label="Back">
              <ArrowLeft size={18} />
            </button>
            <span className="app-header-title">My Cart</span>
            <span style={{ width: 34 }} />
          </div>
        }
      >
        <div className="cart-success">
          <CheckCircle2 size={40} />
          <p className="cart-success-title">You've joined the pool{itemList.length === 1 ? '' : 's'}!</p>
          <p className="muted-note" style={{ textAlign: 'center' }}>
            Your order is counted toward each product's buying pool. Bulk pricing kicks in once a
            pool reaches its threshold — check Active Pools to track progress.
          </p>
          <button className="btn-primary" onClick={() => navigate('/pools')}>
            View Active Pools
          </button>
        </div>
      </AppScreen>
    )
  }

  return (
    <AppScreen
      header={
        <div className="app-header">
          <button className="app-header-icon-btn" onClick={() => navigate('/products')} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <span className="app-header-title">My Cart</span>
          <span style={{ width: 34 }} />
        </div>
      }
    >
      {itemList.length === 0 && (
        <p className="muted-note" style={{ marginTop: 24, textAlign: 'center' }}>
          Your cart is empty — add something from Products.
        </p>
      )}

      <div className="product-list">
        {itemList.map(({ product, quantity }) => (
          <div className="product-row" key={product.id}>
            <div className="product-icon">{product.name?.[0] ?? '?'}</div>
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <p className="product-price">{formatRand(product.singleUnitPrice)} each</p>
            </div>
            <div className="product-actions">
              <div className="qty-stepper">
                <button onClick={() => setQuantity(product, quantity - 1)} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(product, quantity + 1)} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
              <button className="btn-add-cart" onClick={() => setQuantity(product, 0)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {itemList.length > 0 && (
        <>
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <strong>{formatRand(subtotal)}</strong>
          </div>

          {potentialSavings > 0 && (
            <div className="cart-savings-note">
              You could save {formatRand(potentialSavings)} once these pools unlock bulk pricing —
              not guaranteed, and only if the pool reaches its threshold.
            </div>
          )}

          {errors.length > 0 && (
            <div className="alert alert-error">
              {errors.length === itemList.length
                ? 'Could not join any pools:'
                : 'Some items failed to join:'}
              <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="btn-primary" disabled={checkingOut} onClick={handleCheckout}>
            {checkingOut ? 'Joining pools…' : 'Join Buying Pool & Checkout'}
          </button>
        </>
      )}
    </AppScreen>
  )
}
