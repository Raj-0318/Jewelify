# Jewelify - Premium E-commerce Platform

Jewelify is a modern, full-stack e-commerce application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js). It features a premium, glassmorphic design and comprehensive functionality for both users and administrators.

![Jewelify Favicon](client/src/favicon.png)

## 🚀 Features

### User Features
-   **Browse Products**: View a wide range of tech products with detailed descriptions, images, and ratings.
-   **Search & Filter**: Powerful search functionality and category filtering to find products easily.
-   **Shopping Cart**: Add items to cart, update quantities, and proceed to checkout.
-   **Ordering System**: Secure checkout process with multiple payment method options.
-   **Order History**: detailed order timeline with visual progress bars (Pending -> Processing -> Shipped -> Delivered).
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.

### Admin Features
-   **Dashboard**: Overview of platform performance.
-   **Product Management**: Add, edit, and delete products (CRUD operations).
-   **Order Management**: View all orders, filter by status, and update order statuses (e.g., mark as Shipped/Delivered).
-   **Premium UI**: Glassmorphic admin interface with receipts-style order details.

## 🛠️ Tech Stack

-   **Frontend**: Angular 17+, Tailwind CSS
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **Authentication**: JSON Web Tokens (JWT)

## 📂 Project Structure

```
Jewelify/
├── client/                 # Angular Frontend
│   ├── src/
│   │   ├── app/           # Components, Services, Models
│   │   ├── assets/        # Static assets
│   │   └── ...
│   └── ...
├── server/                 # Node.js/Express Backend
│   ├── models/            # Mongoose Models (User, Product, Order)
│   ├── routes/            # API Routes
│   ├── middleware/        # Auth & Admin Middleware
│   └── ...
├── data/                   # Seed Data
│   ├── products.json      # Initial product catalog
│   └── users.json         # Initial user accounts
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
-   Node.js (v18+ recommended)
-   MongoDB (Local or Atlas connection string)
-   Angular CLI (`npm install -g @angular/cli`)

### 1. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Start the backend server:
```bash
npm start
```
*The server typically runs on `http://localhost:5000`*

### 2. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the Angular development server:
```bash
npm start
```
*The application should now be running on `http://localhost:4200`*

## 🌱 Seeding Data

To populate your database with initial products and users:
1.  Ensure your MongoDB connection is active.
2.  Use the JSON files in the `data/` folder.
3.  You can write a simple seed script or use MongoDB Compass to import `products.json` and `users.json`.

> **Note:** The `data/products.json` file has been cleaned of auto-generated IDs for easy importing.

## 🔐 Authentication

**Important Note for Development:**
The project is currently configured to store and compare passwords in **plain text** for simplicity during testing.

### Default Credentials
You can use the following accounts to log in immediately:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@jewelify.com` | `Admin@123` |
| **User** | `suraj@gmail.com` | `Suraj@0228` |

## 📡 API Endpoints

### Auth
-   `POST /api/auth/register` - Register new user
-   `POST /api/auth/login` - Login user

### Products
-   `GET /api/products` - Get all products
-   `GET /api/products/:id` - Get single product
-   `POST /api/products` - Add product (Admin)
-   `PUT /api/products/:id` - Update product (Admin)
-   `DELETE /api/products/:id` - Delete product (Admin)

### Orders
-   `GET /api/orders` - Get all orders (Admin)
-   `POST /api/orders` - Create order
-   `GET /api/orders/user/:userId` - Get user orders
-   `PUT /api/orders/:id/status` - Update order status (Admin)

---
*Built with ❤️ for Jewelify*
