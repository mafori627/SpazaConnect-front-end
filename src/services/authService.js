import api from './api'

// Matches RegisterRequest on the backend exactly.
export function register({ username, password, email, shopName, clusterLocation }) {
  return api.post('/auth/register', { username, password, email, shopName, clusterLocation })
}

// Matches LoginRequest on the backend. Resolves to the unwrapped
// Response<User> body: { success, message, data: User }.
export function login({ username, password }) {
  return api.post('/auth/login', { username, password })
}
