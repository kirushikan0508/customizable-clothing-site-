# GENTRIX — Premium Streetwear eCommerce & AI Shopping Assistant

A complete production-ready fashion eCommerce platform tailored for premium streetwear, featuring a cutting-edge AI shopping assistant.

![GENTRIX](https://picsum.photos/seed/gentrix/1200/400)

## 🚀 Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS** v4
- **Framer Motion** — Smooth animations and 3D-oriented aesthetics
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
- **Zod** — Data validation

### AI Agent
- **Python** + **FastAPI**
- **Google GenAI** — Advanced natural language processing for shopping assistance
- **PyMongo** — Direct database queries for product search
- **Pydantic** — Data validation and settings management

## 📁 Project Structure

```
clothing-agent-main/
├── ai-agent/            # FastAPI Python backend for AI Assistant
│   ├── app/             # Agent logic, routes, and tools
│   ├── requirements.txt # Python dependencies
│   └── .env             # AI agent configuration
│
├── backend/             # Express.js Node Backend
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error, upload, validation
│   ├── models/          # Mongoose schemas (User, Product, Order, Review)
│   ├── routes/          # API routes
│   └── server.js        # Entry point
│
├── frontend/            # Next.js React Frontend
│   └── src/
│       ├── app/         # App router (auth, store, admin, profile)
│       ├── components/  # Reusable UI, layout, and section components
│       ├── store/       # Zustand state management
│       └── types/       # TypeScript definitions
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Google Gemini API Key (for AI agent)

### 1. Clone & Install Dependencies

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
```

**AI Agent:**
```bash
cd ai-agent
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
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
NEXT_PUBLIC_AI_AGENT_URL=http://localhost:8000
```

**AI Agent `.env`:**
```env
GEMINI_API_KEY=your_google_genai_api_key
MONGODB_URI=mongodb+srv://YOUR_CONNECTION_STRING
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

### 4. Run Development Servers

You will need three terminal windows to run all services:

```bash
# Terminal 1 — Backend (Node.js)
cd backend
npm run dev

# Terminal 2 — AI Agent (FastAPI)
cd ai-agent
venv\Scripts\activate # or source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 3 — Frontend (Next.js)
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Agent API: http://localhost:8000

## 🎯 Features

### Customer Features
- 🤖 **AI Shopping Assistant**: Natural language product search, personalized recommendations, and direct add-to-cart capabilities.
- 🏠 **Premium UI**: Glassmorphism, 3D-oriented streetwear aesthetics, and dynamic animations.
- 🛍️ **Shop & Filtering**: Browse products by category, gender, size, price, and color.
- ⭐ **Reviews & Ratings**: Real user feedback system displayed dynamically on product pages and home testimonials.
- 🛒 **Advanced Cart**: State management, size/color validation, and seamless checkout flow.
- 🔐 **Authentication**: Secure JWT-based user login and registration.
- 👤 **Profile Management**: Order history, saved addresses, and account settings.

### Admin Dashboard
- 📊 **Analytics**: Real-time revenue charts and order statistics.
- 📦 **Product Management**: Full CRUD operations, variant handling (sizes, colors), and multi-image uploads.
- 📋 **Order Management**: Track and update order statuses.
- 👥 **Customer & Review Management**: Oversee platform interactions.
- 🎫 **Coupon System**: Create and manage discount codes.

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
```

### Backend → Render / Railway
1. Set start command: `npm start`
2. Add necessary environment variables (MongoDB, Cloudinary, JWT).

### AI Agent → Render / Railway
1. Set build command: `pip install -r requirements.txt`
2. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add environment variables (Gemini API Key, MongoDB URI).

## 📄 License

MIT License — feel free to use for your own projects.
