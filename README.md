# ATELIER — React + Node/Express + MongoDB

A full-stack e-commerce app, converted from a vanilla HTML/JS frontend into a **React (Vite)** single-page app, backed by a modularized **Express + Mongoose (MongoDB)** API. All original functionality is preserved:

- Shop with category filters, sorting, cart, and 3-step checkout
- JWT auth (register/login), customer order dashboard
- Admin panel: stats, product CRUD, order management, user list

## Project structure

```
atelier-react/
├── backend/              Express API (MongoDB via Mongoose)
│   ├── config/db.js
│   ├── models/           User, Product, Order
│   ├── middleware/auth.js
│   ├── routes/           auth, products, orders, admin, seed
│   ├── server.js
│   └── .env
└── frontend/             React app (Vite)
    ├── src/
    │   ├── api/client.js         fetch wrapper
    │   ├── context/               Auth, Cart, Toast (React Context)
    │   ├── components/           Navbar, ProductCard, CartSidebar, AuthModal, CheckoutModal
    │   ├── pages/                 Home, Dashboard, Admin
    │   └── styles/index.css
    └── .env
```

## 1. Backend setup

```bash
cd backend
npm install
cp  .env
```

 `.env`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/atelier?retryWrites=true&w=majority
JWT_SECRET=some-long-random-string
PORT=5000
```

Run it:
```bash
npm run dev      # nodemon, auto-restart
# or
npm start
```

Seed the database (creates an admin user + sample products):
```bash
curl -X POST http://localhost:5000/api/seed
```
This creates `admin@atelier.com` / `admin123` and 12 sample products.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env .env
```

`.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Run it:
```bash
npm run dev
```
Vite serves on `http://localhost:5173` and proxies `/api` to the backend during dev (see `vite.config.js`), so you can leave `VITE_API_URL` unset if you prefer — either works.

Build for production:
```bash
npm run build     # outputs to frontend/dist
```
Deploy `dist/` to any static host (Vercel, Netlify, S3, or served by Express with `express.static`).

## Routes

| Path         | Page                        |
|--------------|-----------------------------|
| `/`          | Shop (products, cart, checkout, auth) |
| `/dashboard` | Customer's order history (requires login) |
| `/admin`     | Admin dashboard (requires `role: admin`) |

## API (unchanged from original)

`/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/products`, `/api/products/:id`, `/api/orders`, `/api/orders/my-orders`, `/api/orders/:id`, `/api/orders/:id/status`, `/api/admin/stats`, `/api/admin/users`, `/api/seed`.

## Notes on this conversion

- All vanilla-JS DOM manipulation (`app.js`, `dashboard.js`, `admin.js`) was rewritten as React components using hooks (`useState`/`useEffect`) and Context for global auth/cart/toast state.
- Cart and auth token still persist in `localStorage`, same as before.
- The Express backend logic is functionally identical to the original `server.js`, just split into `routes/*.js` files with the JWT secret and Mongo URI now read from environment variables (previously the JWT secret was hardcoded — please set a real one in production).
