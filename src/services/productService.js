import api from './api'

// GET /api/products has no pagination on the backend — it returns the
// full catalog as a plain array, not a Page<T>. Fine while the catalog
// is small, but flag it if the list grows.
export function getAllProducts() {
  return api.get('/products')
}
