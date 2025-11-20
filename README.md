
# Mini E-Commerce Backend API

A robust Backend API for a Mini E-Commerce application built using **Node.js**, **Hapi.js**, and **PostgreSQL**. This project provides a complete RESTful API architecture featuring JWT authentication, product management, shopping carts, order processing, and an analytical dashboard for administrators.

## 🛠 Tech Stack

* **Runtime:** Node.js (v20-alpine)
* **Framework:** [@hapi/hapi](https://hapi.dev/) (v21.4.2)
* **Database:** PostgreSQL
* **Authentication:** @hapi/jwt & Bcrypt
* **Validation:** Joi
* **Migration:** node-pg-migrate
* **Utilities:** Nanoid, Dotenv

## 📂 Database Structure

The application utilizes a relational database schema with the following tables:

* `users`: Stores user credentials and roles (admin/customer).
* `authentications`: Stores refresh tokens for session management.
* `categories`: Product categories.
* `products`: Product details, stock, and pricing.
* `carts`: User shopping carts.
* `cart_items`: Specific items within a cart.
* `orders`: Order transaction records.
* `order_items`: Detailed items for each order.

## 🚀 Installation & Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd mini-e-commerce-backend
npm install
````

### 2\. Environment Configuration (.env)

Copy the example environment file and configure your local credentials:

```bash
cp .env.example .env
```

```

### 3\. Database Migration

Run the migration scripts to create the necessary tables in your PostgreSQL database:

```bash
npm run migrate:up
```

### 4\. Running the Server

  * **Development Mode (with Nodemon):**
    ```bash
    npm run start:dev
    ```
  * **Production Mode:**
    ```bash
    npm run start
    ```

The server will start at `http://localhost:3001` (or the port defined in your `.env`).

-----

## 📡 API Endpoint Documentation

Below is the comprehensive list of available endpoints, including required payloads and authentication levels.

### 🔐 Authentication & Registration

| Method | Endpoint | Description | Body Payload (JSON) | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | `email`, `name`, `password` | Public |
| `POST` | `/authentications` | User Login | `name`, `password` | Public |
| `PUT` | `/authentications` | Refresh Access Token | `refreshToken` | Public |
| `DELETE` | `/authentications` | User Logout | `refreshToken` | Public |

### 👤 Users (Admin Only)

| Method | Endpoint | Description | Body / Params | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/users` | Create new user | Body: `name`, `email`, `password`, `role` | 🔒 Admin |
| `GET` | `/users` | List all users | - | 🔒 Admin |
| `GET` | `/users/{name}` | Find user by name | Param: `name` | 🔒 Admin |
| `PUT` | `/users/{id}` | Update user data | Body: `name`, `email`, `password`, `role` | 🔒 Admin |
| `DELETE` | `/users/{id}` | Delete user | Param: `id` | 🔒 Admin |

### 📦 Categories (Admin Managed)

| Method | Endpoint | Description | Body / Params | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/categories` | Create category | Body: `name`, `description` | 🔒 Admin |
| `GET` | `/categories` | List categories | Query: `?name=` (optional) | Public |
| `GET` | `/categories/{id}` | Get category detail | Param: `id` | Public |
| `PUT` | `/categories/{id}` | Update category | Body: `name`, `description` | 🔒 Admin |
| `DELETE` | `/categories/{id}` | Delete category | Param: `id` | 🔒 Admin |

### 🛍️ Products

| Method | Endpoint | Description | Body / Params | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/products` | Add new product | Body: `name`, `description`, `price`, `category_id`, `stock`, `image_url` | 🔒 Admin |
| `GET` | `/products` | List products | Query: `?name=` (optional) | Public |
| `GET` | `/products/{id}` | Get product detail | Param: `id` | Public |
| `PUT` | `/products/{id}` | Update product | Body: `name`, `description`, `price`, `category_id`, `stock`, `image_url` | 🔒 Admin |
| `DELETE` | `/products/{id}` | Delete product | Param: `id` | 🔒 Admin |

### 🛒 Shopping Cart

| Method | Endpoint | Description | Body Payload (JSON) | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/carts` | Initialize cart | `user_id` | 🔒 User |
| `POST` | `/cart-items` | Add item to cart | `productId`, `cartId`, `quantity` | 🔒 User |
| `GET` | `/carts/{id}` | View cart details | - | 🔒 User |
| `GET` | `/users/{uid}/carts` | Get cart by User ID | - | 🔒 User |
| `DELETE` | `/carts/{id}` | Clear cart | - | 🔒 User |
| `DELETE` | `/cart-items/{id}` | Remove specific item | - | 🔒 User |

### 🧾 Orders

| Method | Endpoint | Description | Body Payload (JSON) | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/orders` | Checkout (Create Order) | `userId`, `shippingAddress` | 🔒 User |
| `GET` | `/orders/{id}` | Get Order details | - | 🔒 User |
| `PUT` | `/orders/{id}` | Update Order status | `status` | 🔒 User |

### 📊 Dashboard (Analytics)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/data` | Fetch all dashboard data | 🔒 Admin |
| `GET` | `/dashboard/summary` | Summary (Revenue, Orders) | 🔒 Admin |
| `GET` | `/dashboard/products-sold` | Top selling products | 🔒 Admin |
| `GET` | `/dashboard/daily-sales` | Daily sales chart data | 🔒 Admin |
| `GET` | `/dashboard/total-profit` | Total accumulated profit | 🔒 Admin |

-----

## 🐳 Docker Deployment

1.  **Build the Image:**

    ```bash
    docker build -t mini-ecommerce-backend .
    ```

2.  **Run the Container:**

    ```bash
    docker run -p 3001:3001 --env-file .env mini-ecommerce-backend
    ```

## 📄 License

This project is licensed under the **MIT License**.

Copyright © 2025 RapzzKY

```
```
