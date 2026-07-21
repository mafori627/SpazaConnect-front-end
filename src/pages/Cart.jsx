import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import AppScreen from '../components/AppScreen'
import { useCart } from '../context/CartContext'
import './ProductCatalogue.css'
import './Dashboard.css'

function formatRand(value) {
  return `R${Number(value).toFixed(2)}`
}

export default function Cart() {
  const navigate = useNavigate()
  const { itemList, setQuantity } = useCart()

  const subtotal = itemList.reduce(
    (sum, { product, quantity }) => sum + Number(product.singleUnitPrice) * quantity,
    0,
  )

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
          <p className="muted-note">
            Checkout isn't wired up yet — the backend only has a "join pool"
            endpoint, no cart/order model. Next step is deciding whether
            checkout should call /api/pools/join per item, or the backend
            adds a proper order flow.
          </p>
        </>
      )}
    </AppScreen>
  )
}
