# FLAVOUR — Fashion eCommerce Platform

A complete production-ready fashion eCommerce platform for boys & girls clothing built with modern technologies.

![FLAVOUR](https://picsum.photos/seed/flavour/1200/400)

## 🚀 Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS** v4
- **Framer Motion** — Animations
- **Zustand** — State management
- **Axios** — HTTP client
- **Recharts** — Admin charts
- **React Hot Toast** — Notifications
- **Lucide React** — Icons

### Backend
- **Node.js** + **Express.js**
- **MongoDB Atlas** + **Mongoose**
- **JWT** — Authentication
- **Bcrypt** — Password hashing
- **Multer** + **Cloudinary** — Image uploads
- **Zod** — Validation

## 📁 Project Structure

```
clothing2/
├── backend/
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, error, upload, validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helpers & seeder
│   └── server.js        # Entry point
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/      # Login, Register, Forgot Password
│       │   ├── (store)/     # Home, Shop, Product, Cart, Checkout
│       │   ├── admin/       # Admin Dashboard
│       │   └── profile/     # User Profile
│       ├── components/
│       │   ├── layout/      # Navbar, Footer
│       │   ├── sections/    # Hero, Categories, ProductSection
│       │   └── ui/          # ProductCard, Skeleton, StarRating
│       ├── hooks/           # useDebounce
│       ├── lib/             # axios, utils
│       ├── store/           # Zustand stores
│       └── types/           # TypeScript interfaces
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (optional, for image uploads)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend `.env`:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://YOUR_CONNECTION_STRING
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates:
- **Admin:** admin@flavour.com / admin123
- **User:** john@example.com / password123
- **30 products** across 5 categories
- **3 coupon codes** (WELCOME10, FLAT200, SUMMER25)

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Features

### Customer Features
- 🔐 JWT Authentication (Register/Login/Logout)
- 🏠 Animated Home Page with Hero, Categories, Featured Products
- 🛍️ Shop with Filters (Category, Gender, Size, Price, Color)
- 📄 Product Detail with Image Zoom, Size/Color Picker, Reviews
- 🛒 Cart with Quantity Management
- 💳 Checkout with COD (Cash on Delivery)
- 🎟️ Coupon System
- ❤️ Wishlist
- 👤 User Profile, Addresses, Order History

### Admin Dashboard
- 📊 Dashboard with Revenue Charts, Order Stats
- 📦 Product Management (CRUD with Images, Sizes, Colors)
- 📋 Order Management with Status Updates
- 👥 Customer Management
- 📁 Category Management
- 📈 Analytics (Revenue, Orders, Top Customers)
- 🎫 Coupon Management
- ⚙️ Store Settings

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
```

### Backend → Render
1. Push to GitHub
2. Create new Web Service on Render
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/products | List products |
| GET | /api/products/:slug | Product detail |
| POST | /api/cart | Add to cart |
| POST | /api/orders | Create order |
| GET | /api/analytics/dashboard | Admin stats |

## 📄 License

MIT License — feel free to use for your own projects.
