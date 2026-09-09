# 36 Montane 🏔️⛺

> Premium Outdoor Camping, Trekking & Adventure Platform with Full-Featured Admin Control Center.

![Project Status](https://img.shields.io/badge/Status-Active-emerald)
![License](https://img.shields.io/badge/License-ISC-blue)
![Architecture](https://img.shields.io/badge/Architecture-Monorepo-orange)

---

## 📖 Overview

**36 Montane** is a modern, responsive full-stack platform built for discovering, booking, and managing mountain trekking, forest camping, and outdoor adventure experiences.

The project is organized as a unified full-stack monorepo featuring a **React (Vite + Tailwind CSS) Frontend**, an **Express + Mongoose Backend API**, and a powerful **Admin Dashboard**.

---

## 🏗️ Repository Architecture

```
36montane/
├── client/                      # Frontend Application & Admin Portal
│   ├── src/
│   │   ├── components/          # Public UI (Home, Detail, Services, Event, Blog, Gallery, Contact)
│   │   ├── layouts/             # MainLayout and AdminLayout
│   │   ├── pages/admin/         # AdminDashboard & AdminLogin
│   │   └── data/                # Fallback mock dataset
│   ├── public/
│   ├── vite.config.js           # Vite dev server with proxy to backend
│   └── package.json
│
├── server/                      # Backend REST API
│   ├── config/                  # Resilient MongoDB database connection
│   ├── controller/              # Controllers (trips, services, bookings, events, articles, gallery, auth)
│   ├── data/                    # Default seed dataset (trips, services, bookings, etc.)
│   ├── middlewares/             # JWT auth & offline development fallback
│   ├── models/                  # Mongoose schemas (Trip, TrekkingService, Booking, Events, Article, Gallery, User, Contact)
│   ├── routes/                  # API routes (/api/*, /api/auth/*)
│   ├── main.js                  # Express server entry point
│   ├── seed.js                  # Standalone database population script
│   └── package.json
│
├── package.json                 # Monorepo root runner (runs client & server together)
├── .gitignore                   # Unified Git ignore rules
└── README.md                    # Project documentation
```

---

## ⚡ Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher)
- *(Optional)* [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas). If MongoDB is not running, the server automatically starts in **Offline Mock Mode** with full functionality!

### 2. Install Dependencies
Install all root, client, and server dependencies with one command:
```bash
npm run install:all
```

### 3. Environment Configuration
Verify environment files:
- **Client**: `client/.env`
  ```env
  VITE_API_URL=http://localhost:5000
  ```
- **Server**: `server/.env`
  ```env
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/36montane
  JWT_SECRET=36montane_super_secret_jwt_key_2026
  initURL=http://localhost:3000
  ```

### 4. Run Locally
Start both backend API and frontend dev server concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Admin Dashboard Access

Access the Admin Portal via [http://localhost:3000/admin](http://localhost:3000/admin) or click the **Admin Portal** link in the website footer.

### Default Credentials:
- **Username**: `admin`
- **Password**: `admin123`
*(Or click the 1-Click Demo Login button on the login screen)*

### Admin Capabilities:
- **Overview Analytics**: 6 KPI metric cards, system health status, recent customer reservations feed.
- **Expeditions & Trips**: Search, add new trip, edit pricing/duration/difficulty, and delete trips.
- **Camping & Trekking Services**: Manage service listings and ratings.
- **Customer Bookings**: View customer details and toggle reservation status (`Confirmed` ⇄ `Pending`).
- **Events**: Post and manage upcoming community trekking summits.
- **Articles & Blog**: Publish travel stories, guides, and packing tips.
- **Gallery**: Manage photography and video showcase links.
- **Inquiries**: Review messages submitted through the website contact form.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Check backend status and database connectivity |
| `/api/auth/login` | POST | Authenticate admin user and receive JWT |
| `/api/auth/me` | GET | Retrieve authenticated profile |
| `/api/featuredtrips` | GET | List all featured trips |
| `/api/gettrip/:id` | GET | Get single trip details by ID |
| `/api/addtrip` | POST | Create new trip |
| `/api/trips/:id` | PUT | Update trip details |
| `/api/trips/:id` | DELETE | Delete trip |
| `/api/services` | GET | List services (supports `?category=` & `?search=`) |
| `/api/services` | POST | Add new service |
| `/api/services/:id` | PUT | Update service |
| `/api/services/:id` | DELETE | Delete service |
| `/api/bookings` | GET | List customer reservations |
| `/api/booking` | POST | Create customer booking |
| `/api/bookings/:id/status` | PATCH | Update booking status (`Confirmed`/`Pending`) |
| `/api/bookings/:id` | DELETE | Cancel & remove booking |
| `/api/events` | GET | List upcoming events |
| `/api/event` | POST | Create new event |
| `/api/events/:id` | DELETE | Delete event |
| `/api/articles` | GET | List blog articles |
| `/api/articles` | POST | Publish article |
| `/api/articles/:id` | DELETE | Delete article |
| `/api/gallery/type` | GET | Filter gallery media by type (`?type=photo` / `?type=video`) |
| `/api/gallery/type` | POST | Add gallery item |
| `/api/gallery/:id` | DELETE | Delete gallery item |
| `/api/contact` | POST | Submit visitor contact inquiry |
| `/api/contacts` | GET | Retrieve all contact form submissions |
| `/api/contacts/:id` | DELETE | Delete contact inquiry |

---

## 🗄️ Database Seeding

To populate MongoDB Atlas or a local MongoDB database with the curated 36 Montane dataset:
```bash
npm run seed
```

---

## 🛠️ Available Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `concurrently ...` | Runs both client and server concurrently |
| `npm run dev:client` | `vite` | Runs only the React frontend on port 3000 |
| `npm run dev:server` | `node --watch main.js` | Runs only the Express backend on port 5000 |
| `npm run build` | `vite build` | Compiles frontend for production |
| `npm run seed` | `node seed.js` | Populates MongoDB database with initial data |
| `npm run install:all` | `npm install ...` | Installs root, server, and client dependencies |

---

## 🚀 Production Deployment

### Frontend (e.g. Vercel, Netlify)
1. Set Root Directory to `client`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add environment variable: `VITE_API_URL=https://your-backend-domain.com`.

### Backend (e.g. Render, Railway, DigitalOcean, VPS)
1. Set Root Directory to `server`.
2. Build command: `npm install`.
3. Start command: `node main.js`.
4. Add environment variables: `PORT=5000`, `MONGODB_URI=...`, `JWT_SECRET=...`, `initURL=https://your-frontend-domain.com`.

