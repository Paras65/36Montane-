# 🚀 Production Deployment Guide: Render & Vercel

This guide walks you step-by-step through deploying **36 Montane**:
- **Backend API**: Deployed to [Render](https://render.com) (Node.js Web Service)
- **Frontend Client**: Deployed to [Vercel](https://vercel.com) (React + Vite SPA)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Free cloud cluster)

```
┌─────────────────────────┐          API Requests          ┌─────────────────────────┐
│     Vercel Frontend     │ ─────────────────────────────> │     Render Backend      │
│  https://*.vercel.app   │ <───────────────────────────── │ https://*.onrender.com  │
└─────────────────────────┘      JSON Data & JWT Auth      └────────────┬────────────┘
                                                                        │ Mongoose
                                                                        ▼
                                                           ┌─────────────────────────┐
                                                           │   MongoDB Atlas Cloud   │
                                                           └─────────────────────────┘
```

---

## 📋 Prerequisites

1. A [GitHub](https://github.com) account with your project pushed to a repository.
2. A free account on [Render](https://render.com).
3. A free account on [Vercel](https://vercel.com).
4. *(Recommended)* A free account on [MongoDB Atlas](https://www.mongodb.com/atlas). *(If skipped, the backend will automatically run in mock offline fallback mode).*

---

## Step 1: Set Up Cloud Database (MongoDB Atlas)

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a free **M0 Cluster** (Shared).
3. Under **Security > Database Access**:
   - Add a new database user (e.g. `montane_admin`) with a secure password.
4. Under **Security > Network Access**:
   - Add an IP access rule: `0.0.0.0/0` (Allow access from anywhere, required for Render's dynamic IPs).
5. Click **Connect > Drivers**:
   - Copy your connection string. It will look like:
     ```
     mongodb+srv://montane_admin:<password>@cluster0.abcde.mongodb.net/36montane?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password.

---

## Step 2: Deploy Backend to Render

### Option A: Using the Render Blueprint (`render.yaml`) — Recommended ⚡

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your repository (`Paras65/36Montane-`).
4. Render will detect the [`render.yaml`](./render.yaml) file automatically:
   - Service name: `36montane-backend`
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
5. Render will prompt you for missing environment variables:
   - `MONGODB_URI`: Paste your MongoDB Atlas connection string from Step 1.
   - `CLIENT_URL`: You can leave this blank for now, or update it after creating your Vercel frontend.
   - `JWT_SECRET`: Render will auto-generate a secure random value.
6. Click **Apply**. Render will deploy your backend service.

---

### Option B: Manual Web Service Setup on Render

If you prefer to configure manually without Blueprint:

1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `36montane-backend`
   - **Region**: Nearest to your users (e.g. `Frankfurt`, `Oregon`, or `Singapore`)
   - **Branch**: `main`
   - **Root Directory**: `server` ⚠️ *(Crucial!)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production mode |
   | `PORT` | `10000` | Standard Render port |
   | `MONGODB_URI` | `mongodb+srv://...` | From Step 1 (or leave unset for mock mode) |
   | `JWT_SECRET` | `a_strong_random_secret_string_32chars` | For signing auth tokens |
   | `CLIENT_URL` | `https://your-frontend.vercel.app` | Can be added after Step 3 |
5. Click **Create Web Service**.
6. Once deployed, note down your Render service URL (e.g., `https://36montane-backend.onrender.com`).
7. Test the health check endpoint in your browser:
   `https://36montane-backend.onrender.com/api/health`
   You should see: `{"status":"ok", "service":"36 Montane Backend API", ...}`

---

## Step 3: Deploy Frontend to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository (`Paras65/36Montane-`).
4. In the **Configure Project** screen:
   - **Project Name**: `36montane` (or your preferred name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and choose `client` ⚠️ *(Crucial!)*
5. Expand the **Environment Variables** section:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://36montane-backend.onrender.com` (Your Render backend URL from Step 2) |
   > ⚠️ *Make sure there is no trailing slash at the end of the URL.*
6. Click **Deploy**.
7. Vercel will build and deploy your frontend in ~1 minute.
8. When completed, note down your Vercel live domain (e.g., `https://36montane.vercel.app`).

---

## Step 4: Final Link & Verification

1. Return to your **Render Dashboard** > **36montane-backend** > **Environment**.
2. Add or update the `CLIENT_URL` variable:
   ```env
   CLIENT_URL=https://36montane.vercel.app
   ```
3. Click **Save Changes** (Render will automatically redeploy).
4. Open your live Vercel URL in your browser:
   - Browse trips, treks, and services.
   - Test search and category filtering.
   - Go to [https://your-app.vercel.app/admin](https://your-app.vercel.app/admin) and log in with:
     - **Username**: `admin`
     - **Password**: `admin123`
   - Verify the admin control center loads trips, bookings, and health statistics from the backend.

---

## 🛠️ Key Architectural Details

### 1. CORS Configuration
The backend (`server/main.js`) is pre-configured to automatically allow:
- Explicit `CLIENT_URL` or `FRONTEND_URL`
- Any `*.vercel.app` deployment (including branch previews and production domains)
- Local development origins (`localhost:3000`, `localhost:5173`)

### 2. Client-Side Routing (SPA)
Vercel is configured via [`client/vercel.json`](./client/vercel.json) with rewrite rules:
```json
{
  "rewrites": [
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ]
}
```
This ensures refreshing pages like `/admin`, `/detail`, or `/tripdetail/123` correctly delegates to React Router instead of throwing a Vercel 404 error.

### 3. Render Free Tier Cold Starts
Render spins down free web services after 15 minutes of inactivity. The first request after sleep may take ~30–50 seconds to boot up. The client includes built-in fallback mock data and loading spinners to handle this seamlessly.

