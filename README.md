# ATELIER

ATELIER is a full-stack e-commerce application built with React, Node.js, Express, and MongoDB. It provides a modern shopping experience with authentication, cart management, order tracking, and an admin dashboard for managing products and orders.

---

## Features

### Customer
- Browse products
- Filter by category
- Sort products
- Shopping cart
- Secure checkout
- User registration & login
- Order history dashboard

### Admin
- Dashboard statistics
- Product management (CRUD)
- Order management
- User management

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## Project Structure

```
atelier-react/
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
└── README.md

### Products

```
GET /api/products
GET /api/products/:id
```

### Orders

```
POST /api/orders
GET  /api/orders/my-orders
PUT  /api/orders/:id/status
```

### Admin

```
GET /api/admin/stats
GET /api/admin/users
```


## Deployment

Frontend and backend can be deployed independently.

- Frontend: Render Static Site, Vercel, Netlify
- Backend: Render Web Service
- Database: MongoDB Atlas

---

## License

This project is created for learning and portfolio purposes.
