import axios from 'axios'

// One shared axios instance. Every service in src/services goes through
// this file rather than importing axios directly, so base URL, headers,
// and error shaping live in exactly one place.
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// The backend always replies with a Response<T> envelope:
// { success, message, data, timestamp } — on both 2xx and error responses.
// This interceptor unwraps that envelope so callers can just deal with
// { message, data } or a plain error message string.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const backendMessage = error.response?.data?.message
    return Promise.reject(
      new Error(backendMessage || 'Could not reach the server. Please try again.'),
    )
  },
)

// TEMPORARY STOPGAP: the backend has no token endpoint, and everything
// except /api/auth/** requires HTTP Basic auth. Until the team adds JWT
// (or agrees on an alternative), we hold the password in memory only —
// never localStorage — just long enough to attach it as a Basic Auth
// header for the rest of the browser session. Lost on refresh/logout by
// design; that's the cost of not having a real token yet.
export function setAuthCredentials(username, password) {
  const token = btoa(`${username}:${password}`)
  api.defaults.headers.common['Authorization'] = `Basic ${token}`
}

export function clearAuthCredentials() {
  delete api.defaults.headers.common['Authorization']
}

export default api
