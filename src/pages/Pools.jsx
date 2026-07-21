import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import AppScreen from '../components/AppScreen'
import { useAuth } from '../context/AuthContext'
import { getPoolsNearby, joinPool } from '../services/poolService'
import './Pools.css'

function discountPercent(product) {
  if (!product?.singleUnitPrice || !product?.bulkUnitPrice) return null
  const single = Number(product.singleUnitPrice)
  const bulk = Number(product.bulkUnitPrice)
  if (!single) return null
  return Math.round(((single - bulk) / single) * 100)
}

export default function Pools() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pools, setPools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [joiningId, setJoiningId] = useState(null)

  function refetch(cancelledRef) {
    setLoading(true)
    setError('')
    return getPoolsNearby({ cluster: user?.clusterLocation, size: 20 })
      .then((res) => {
        if (!cancelledRef?.current) setPools(res.data?.content || [])
      })
      .catch((err) => {
        if (!cancelledRef?.current) setError(err.message)
      })
      .finally(() => {
        if (!cancelledRef?.current) setLoading(false)
      })
  }

  useEffect(() => {
    const cancelledRef = { current: false }
    refetch(cancelledRef)
    return () => {
      cancelledRef.current = true
    }
  }, [user?.clusterLocation])

  const categories = useMemo(() => {
    const found = [...new Set(pools.map((p) => p.product?.category).filter(Boolean))]
    return ['All', ...found]
  }, [pools])

  const visiblePools = useMemo(() => {
    if (activeCategory === 'All') return pools
    return pools.filter((p) => p.product?.category === activeCategory)
  }, [pools, activeCategory])

  return (
    <AppScreen
      header={
        <div className="app-header">
          <button className="app-header-icon-btn" onClick={() => navigate('/dashboard')} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <span className="app-header-title">Active Pools Near You</span>
          <span style={{ width: 34 }} />
        </div>
      }
    >
      <p className="muted-note" style={{ marginTop: 0 }}>
        {user?.clusterLocation ? `Pools open in ${user.clusterLocation}` : 'Pools open near you'}
      </p>

      {categories.length > 1 && (
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
      )}

      {loading && <p className="muted-note">Loading pools…</p>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && visiblePools.length === 0 && (
        <p className="muted-note">
          No open pools in {user?.clusterLocation || 'your area'} yet. Add something to your cart
          from Products to start one.
        </p>
      )}

      <div className="pool-list">
        {visiblePools.map((pool) => (
          <PoolCard
            key={pool.id}
            pool={pool}
            isJoining={joiningId === pool.id}
            onJoin={(qty) => {
              setJoiningId(pool.id)
              joinPool({ productId: pool.product.id, quantity: qty })
                .then(() => refetch())
                .catch((err) => setError(err.message))
                .finally(() => setJoiningId(null))
            }}
          />
        ))}
      </div>
    </AppScreen>
  )
}

function PoolCard({ pool, isJoining, onJoin }) {
  const [expanded, setExpanded] = useState(false)
  const [qty, setQty] = useState(1)

  const discount = discountPercent(pool.product)
  const shopsJoined = pool.orders?.length ?? 0
  const threshold = pool.product?.bulkThresholdQty
  const progress = threshold ? Math.min(100, Math.round((pool.currentTotalQty / threshold) * 100)) : null
  const locked = pool.status !== 'OPEN'

  return (
    <div className="pool-card">
      <div className="pool-card-top">
        <div>
          <p className="pool-name">{pool.product?.name}</p>
          <p className="pool-meta">{shopsJoined} shop{shopsJoined === 1 ? '' : 's'} joined</p>
          <p className="pool-meta">Total quantity: {pool.currentTotalQty}</p>
        </div>
        {discount !== null && (
          <span className="pool-discount">
            {discount}%<br /><small>DISCOUNT</small>
          </span>
        )}
      </div>

      <span className={`pool-status pool-status-${pool.status?.toLowerCase()}`}>{pool.status}</span>

      {progress !== null && (
        <div className="pool-progress">
          <div className="pool-progress-track">
            <div className="pool-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="pool-progress-label">
            {pool.currentTotalQty} / {threshold} to unlock bulk pricing
          </span>
        </div>
      )}

      {locked ? (
        <button className="btn-primary" disabled>
          Pool Locked
        </button>
      ) : !expanded ? (
        <button className="btn-primary" onClick={() => setExpanded(true)}>
          Join Pool
        </button>
      ) : (
        <div className="pool-join-row">
          <div className="qty-stepper">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
              <Minus size={14} />
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
              <Plus size={14} />
            </button>
          </div>
          <button className="btn-primary" disabled={isJoining} onClick={() => onJoin(qty)}>
            {isJoining ? 'Joining…' : 'Confirm'}
          </button>
        </div>
      )}
    </div>
  )
}
