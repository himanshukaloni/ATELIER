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
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/ATELIER.git
cd ATELIER
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend:

```bash
npm run dev
```

or

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

---

## Production Build

```bash
cd frontend
npm run build
```

The production build will be generated inside the `dist` folder.

---

## API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

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

---

## Environment Variables

### Backend

```
MONGODB_URI
JWT_SECRET
PORT
```

### Frontend

```
VITE_API_URL
```

---

## Deployment

Frontend and backend can be deployed independently.

- Frontend: Render Static Site, Vercel, Netlify
- Backend: Render Web Service
- Database: MongoDB Atlas

---

## License

This project is created for learning and portfolio purposes.
