# SpazaConnect — Frontend

React app for SpazaConnect, a platform letting spaza shop owners in the
same area form buying pools to purchase stock in bulk at a lower price.
This repo covers the UI: registration, login, and (coming next) the
product and buying-pool screens.

## Running it

1. Make sure the backend is running on `http://localhost:8085`
   (see the `-backend` repo).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173`. API calls to `/api/*` are proxied to the
   backend automatically (see `vite.config.js`), so there's nothing else
   to configure.

## What's here so far

- `/login` — log in, stores the session in memory + localStorage
- `/register` — create an account (username, email, password, shop name,
  cluster location)
- `/dashboard` — placeholder landing page after login, route-protected

## Structure

- `src/services/api.js` — single axios instance; unwraps the backend's
  `Response<T>` envelope so callers just get `{ message, data }`
- `src/services/authService.js` — calls to `/api/auth/register` and
  `/api/auth/login`
- `src/context/AuthContext.jsx` — holds the logged-in user, exposes
  `login()` / `logout()`
- `src/pages/` — screens
- `src/components/` — shared layout, form field, route guard
