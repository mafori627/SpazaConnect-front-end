import api from './api'

// GET /api/pools?cluster=&page=&size=&sortBy= — a real Page<BuyingPool>.
// Requires an authenticated request (SecurityConfig doesn't permitAll this
// path), so this only works once the frontend is sending real credentials
// on every request — see the note in api.js.
export function getPoolsNearby({ cluster, page = 0, size = 5, sortBy = 'id' }) {
  return api.get('/pools', { params: { cluster, page, size, sortBy } })
}

export function joinPool({ productId, quantity }) {
  return api.post('/pools/join', { productId, quantity })
}
