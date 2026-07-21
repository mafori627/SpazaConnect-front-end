import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, ShoppingBag, Users, ClipboardList, PiggyBank } from 'lucide-react'
import AppScreen from '../components/AppScreen'
import { useAuth } from '../context/AuthContext'
import { getPoolsNearby } from '../services/poolService'
import './Dashboard.css'

function discountPercent(product) {
  if (!product?.singleUnitPrice || !product?.bulkUnitPrice) return null
  const single = Number(product.singleUnitPrice)
  const bulk = Number(product.bulkUnitPrice)
  if (!single) return null
  return Math.round(((single - bulk) / single) * 100)
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pools, setPools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getPoolsNearby({ cluster: user?.clusterLocation, size: 3 })
      .then((res) => {
        if (!cancelled) setPools(res.data?.content || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user?.clusterLocation])

  const initials = (user?.shopName || user?.username || '?').slice(0, 2).toUpperCase()

  return (
    <AppScreen
      header={
        <div className="app-header">
          <button className="app-header-icon-btn" aria-label="Menu">
            <Menu size={18} />
          </button>
          <span className="app-header-title">SpazaConnect</span>
          <button className="app-header-icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
        </div>
      }
    >
      <div className="shop-summary">
        <div className="shop-avatar">{initials}</div>
        <div>
          <p className="shop-name">{user?.shopName || user?.username}</p>
          <p className="shop-location">{user?.clusterLocation}</p>
        </div>
      </div>

      <div className="savings-card savings-card-pending">
        <div>
          <p className="savings-label">Total Saved This Month</p>
          <p className="savings-pending-note">
            Tracked once pools start completing — not wired up yet.
          </p>
        </div>
        <PiggyBank size={30} />
      </div>

      <div className="section-header">
        <h2>Active Buying Pools Near You</h2>
        <button className="link-green link-plain" onClick={() => navigate('/pools')}>
          See All
        </button>
      </div>

      {loading && <p className="muted-note">Loading pools…</p>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && pools.length === 0 && (
        <p className="muted-note">No open pools in {user?.clusterLocation} yet.</p>
      )}

      <div className="pool-list">
        {pools.map((pool) => {
          const discount = discountPercent(pool.product)
          const shopsJoined = pool.orders?.length ?? 0
          return (
            <div className="pool-card" key={pool.id}>
              <div className="pool-card-top">
                <div>
                  <p className="pool-name">{pool.product?.name}</p>
                  <p className="pool-meta">{shopsJoined} shops joined</p>
                  <p className="pool-meta">Total quantity: {pool.currentTotalQty}</p>
                </div>
                {discount !== null && (
                  <span className="pool-discount">
                    {discount}%<br /><small>DISCOUNT</small>
                  </span>
                )}
              </div>
              <span className={`pool-status pool-status-${pool.status?.toLowerCase()}`}>
                {pool.status}
              </span>
              <button className="btn-primary" onClick={() => navigate('/pools')}>
                Join Pool
              </button>
            </div>
          )
        })}
      </div>

      <div className="section-header">
        <h2>Quick Actions</h2>
      </div>
      <div className="quick-actions">
        <button className="quick-action" onClick={() => navigate('/products')}>
          <span className="quick-action-icon"><ShoppingBag size={20} /></span>
          Browse Products
        </button>
        <button className="quick-action" onClick={() => navigate('/pools')}>
          <span className="quick-action-icon"><Users size={20} /></span>
          Join Pool
        </button>
        <button className="quick-action" onClick={() => navigate('/orders')}>
          <span className="quick-action-icon"><ClipboardList size={20} /></span>
          My Orders
        </button>
      </div>
    </AppScreen>
  )
}
