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
│   └── server.js
│   
└── frontend/             React app (Vite)
       ├── src/
       ├── api/client.js         fetch wrapper
       ├── context/               Auth, Cart, Toast (React Context)
       ├── components/           Navbar, ProductCard, CartSidebar, AuthModal, CheckoutModal
       ├── pages/                 Home, Dashboard, Admin
       └── styles/index.css
