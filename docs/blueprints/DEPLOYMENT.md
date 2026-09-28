# 🚀 Aarambha Tours & Travels — Production Deployment Guide

This guide provides step-by-step instructions to deploy the entire full-stack Aarambha platform to **Render** (Backend Node.js API) and **Vercel** (Customer Website & CRM Admin Portal).

---

## 🏗️ Architecture Breakdown

| Component | Technology | Recommended Host | Production URL Example |
| :--- | :--- | :--- | :--- |
| **Backend API** | Express + TypeScript + Mongoose | **Render** (Web Service) | `https://api.aarambhatravels.in` or `https://aarambha-api.onrender.com` |
| **Customer Website** | Next.js 14 App Router | **Vercel** (Next.js Project) | `https://aarambhatravels.in` or `https://aarambha.vercel.app` |
| **CRM Admin Portal** | Vite + React 18 + React Router 6 | **Vercel** (Vite Project) | `https://admin.aarambhatravels.in` or `https://aarambha-crm.vercel.app` |

---

## 1. Deploying the Backend API to Render

### Step 1: Create a Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `Aarambha-Tours-and-Travels`.
4. Configure the service settings:
   - **Name**: `aarambha-backend-api`
   - **Region**: `Singapore` (or nearest to your audience)
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free` or `Starter`

### Step 2: Configure Backend Environment Variables
In the Render Web Service settings under **Environment**:
| Variable Name | Value Description | Example |
| :--- | :--- | :--- |
| `PORT` | `8000` | `8000` |
| `NODE_ENV` | `production` | `production` |
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://user:pass@cluster0.mongodb.net/aarambha_db?retryWrites=true&w=majority` |
| `SECRET_KEY` | Strong random secret for JWT | `aarambha-secure-jwt-key-2026` |
| `RAZORPAY_TOURS_KEY_ID` | Razorpay Live/Test Key ID | `rzp_live_...` |
| `RAZORPAY_TOURS_KEY_SECRET` | Razorpay Live/Test Secret | `your_secret` |
| `RAZORPAY_FLEET_KEY_ID` | Razorpay Fleet Key ID | `rzp_live_...` |
| `RAZORPAY_FLEET_KEY_SECRET` | Razorpay Fleet Secret | `your_secret` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `1066267337029-....apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-...` |
| `CORS_ORIGIN` | Allowed domains | `*` or comma-separated URLs |

### Step 3: Verify Backend Deployment
Once deployed, verify by opening:
`https://<your-render-app-name>.onrender.com/api/health`
Expected Response:
```json
{
  "status": "online",
  "database": "healthy",
  "version": "1.0.0",
  "framework": "Node.js Express + TypeScript + Mongoose"
}
```

---

## 2. Deploying Customer Website to Vercel

### Step 1: Import Website Project to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your repository `Aarambha-Tours-and-Travels`.
4. In the configuration screen:
   - **Project Name**: `aarambha-website`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select `frontend/website`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables on Vercel
Under **Environment Variables**, add:
| Variable Name | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Your Render Backend URL (e.g. `https://aarambha-api.onrender.com`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | `1066267337029-0fkfosb6tt2h22m5m5fa2jafkpd7biho.apps.googleusercontent.com` |

### Step 3: Deploy
Click **Deploy**. Vercel will build and deploy the Next.js site in ~1 minute.

---

## 3. Deploying CRM Admin Portal to Vercel

### Step 1: Import CRM Project to Vercel
1. In Vercel, click **Add New...** → **Project**.
2. Select the same repository `Aarambha-Tours-and-Travels`.
3. In the configuration screen:
   - **Project Name**: `aarambha-crm`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend/crm`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables
| Variable Name | Value |
| :--- | :--- |
| `VITE_API_URL` | Your Render Backend URL (e.g. `https://aarambha-api.onrender.com`) |

*(Note: `frontend/crm/vercel.json` is already configured with SPA rewrite rules so routes like `/bookings`, `/fleet`, `/staff` work seamlessly on reload without 404s).*

### Step 3: Deploy
Click **Deploy**.

---

## 4. Local Development

To run all 3 applications simultaneously on your local machine:
```bash
# 1. Install root dependencies
npm install

# 2. Run Backend, Website, and CRM with one command
npm run dev
```

- **Backend API**: `http://127.0.0.1:8000`
- **Customer Website**: `http://localhost:3000`
- **CRM Admin Portal**: `http://localhost:5173`
- **SuperAdmin Default Login**: `admin@aarambhatravels.in` / `admin123`
