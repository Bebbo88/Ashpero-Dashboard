# Ashpero Admin Dashboard

React + Tailwind v4 + Redux Toolkit dashboard for the Ashpero backend admin APIs.

## Stack

- React (Vite)
- Tailwind CSS v4
- Redux Toolkit + React Redux
- MUI Data Grid for tables
- Chart.js + react-chartjs-2 for charts

## Run

```bash
npm install
npm run dev
```

Optional env:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

## Implemented Sections

- Admin login (`/admin/login`)
- Overview analytics with cards + variant charts
- Orders management (`/admin/orders`, `/admin/orders/:id/status`)
- Products management (`/admin/products` create/update/delete, stock patch)
- Offers CRUD (`/admin/offers`)
- Coupons CRUD (`/admin/coupons`)
- Tips CRUD (`/admin/tips`)
- Site content update (`/admin/content`)
- Inventory visibility (`/admin/inventory`)

Charts intentionally blend real KPI baselines with synthetic trend-series to present richer analytics storytelling.
