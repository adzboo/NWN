# North West Nitro RC Club - Netlify & Database Deployment Guide

This guide explains how to host your new North West Nitro website and database on **Netlify** with full persistent data storage.

---

## 1. Quick Overview of Architecture

- **Frontend**: Modern React + Vite SPA with responsive mobile design, fast load times, and Tailwind CSS.
- **Backend**: Express API server (for containers/local dev) and **Netlify Functions** (`netlify/functions/api.ts`) for serverless execution on Netlify.
- **Database on Netlify**: 
  - Netlify is a serverless platform (stateless hosting).
  - For production persistent storage that persists forever across deployments and users, the industry standard with Netlify is to connect to a free cloud database like **Supabase** (PostgreSQL) or **Firebase Firestore**, OR deploy the Express container on Cloud Run / Render / Railway.
  - We have also included a 1-click **Export / Backup Database JSON** feature in your Admin portal so you never lose data!

---

## 2. Deploying on Netlify (Step-by-Step)

### Method A: Connect your GitHub repository to Netlify (Recommended)

1. **Push your code to GitHub**:
   - Push your project files to a GitHub repository (e.g. `northwest-nitro-web`).
2. **Log into Netlify**:
   - Go to [https://app.netlify.com](https://app.netlify.com) and click **"Add new site"** -> **"Import an existing project"**.
3. **Select GitHub**:
   - Choose your repository.
4. **Build settings** (Netlify will auto-detect from `netlify.toml`):
   - **Base directory**: (leave blank or `/`)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. Click **"Deploy site"**!
   - Netlify will build the website and deploy your serverless API routes.

---

## 3. Recommended Database Solutions for Netlify

Since Netlify hosting does not have a permanent writeable hard disk, you have 2 easy options:

### Option 1: Supabase (PostgreSQL - Free Tier)
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. In Netlify Site Settings > **Environment variables**, add:
   - `SUPABASE_URL=https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY=your-key`
3. Netlify functions can query Supabase directly for race events, members, and results.

### Option 2: Firebase Firestore (Free Tier)
1. Go to [https://firebase.google.com](https://firebase.google.com) and create a project with Firestore Database.
2. Add your Firebase web configuration keys in Netlify environment variables or client config.

---

## 4. Online Card Payments (Stripe Setup)
When you are ready to accept online card payments for race entries:
1. Create a [Stripe](https://stripe.com) account for North West Nitro RC Club.
2. In Netlify Site Settings > **Environment variables**, set:
   - `STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_SECRET_KEY=sk_live_...`
3. In the website Admin portal, toggle **"Online Card Payments"** to **Active**.
4. Drivers will then be able to pay either **Cash on the Day** or **Pay Online (Card / Apple Pay / Google Pay)**.
