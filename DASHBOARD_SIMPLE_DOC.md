# Dashboard Simple Docs (Ashpero Admin)

## 1) Stack

- React + Vite
- Tailwind CSS v4
- Redux Toolkit
- MUI Data Grid
- Chart.js / react-chartjs-2
- React Router (`react-router-dom`)

## 2) Quick Start

In `client/Dashboard`:

```bash
npm install
npm run dev
```

Optional env:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## 3) App Architecture

The dashboard is now route-based SPA:

- `Sidebar` and `TopBar` are layout-level components.
- Feature pages render inside `Outlet`.

Main routes:

- `/dashboard/overview`
- `/dashboard/orders`
- `/dashboard/products`
- `/dashboard/offers`
- `/dashboard/coupons`
- `/dashboard/tips`
- `/dashboard/content`

Default redirects to `/dashboard/overview`.

## 4) Auth in Dashboard

### Login

- Uses `POST /admin/login`.
- Stores in localStorage:
  - `ashpero_admin_token`
  - `ashpero_admin_refresh_token`
  - `ashpero_admin_profile`

### Auto Refresh

When API returns `401` for protected requests:

1. Dashboard calls `POST /admin/refresh` automatically.
2. Saves new access + refresh token.
3. Retries the original request.
4. If refresh fails, clears auth storage and logs user out.

This solves `Invalid token` after access-token expiry.

## 5) Redux Slices

### `authSlice`

- `loginAdmin`
- `refreshAdminToken`
- `logoutAdmin`

### `adminSlice`

Manages snapshot + all dashboard CRUD operations for:

- orders
- products
- offers
- coupons
- tips
- site content

Also stores mutation status, global messages, and admin errors.

## 6) UI Sections

### Overview

- KPI cards + executive cards
- Real-data charts (no fake series)
- Recent orders table

### Orders

- status update inline
- details panel

### Products

- bilingual fields required
- file uploads for images/share image
- inline stock update

### Offers

- bilingual titles required
- product selection from real product list (multi-select)

### Coupons

- create/update/delete

### Tips

- bilingual text
- image file upload

### Content

- hero and banner file uploads
- marketing sections text list

## 7) Styling Notes

- Unified table action buttons via shared CSS classes.
- File inputs use a consistent custom visual style.
- Button cursors are standardized (`pointer`, `not-allowed` when disabled).

## 8) Key Files

- `src/App.jsx` route definitions + layout wiring
- `src/main.jsx` BrowserRouter bootstrap
- `src/components/layout/Sidebar.jsx` route nav links
- `src/components/layout/TopBar.jsx` top controls + welcome text
- `src/features/auth/authSlice.js` login + refresh token state
- `src/utils/apiClient.js` API calls + auto token refresh

## 9) Build

```bash
npm run build
```

Build currently passes; bundle-size warning is informational.
