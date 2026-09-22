# North West Nitro RC Club - Netlify Native Storage & Deployment Guide

This project is configured to store all data **natively within Netlify** using **Netlify Blobs** (`@netlify/blobs`). No external database (such as Supabase, Firebase, AWS, or PostgreSQL) is needed!

---

## 1. Native Data Storage (Netlify Blobs)

- **100% Hosted on Netlify**: All calendar race events, driver bookings, membership records, and race results are stored directly inside your Netlify site's native object store.
- **Zero Configuration**: Netlify automatically provides store credentials to Netlify Functions in production. You do not need to register for any third-party database service.
- **Strong Consistency**: Uses `@netlify/blobs` with strong consistency so driver entries, membership assignments, and settings updates reflect immediately.
- **Local Fallback**: During local development and testing, data is automatically stored in `data/database.json`.
- **1-Click Backup**: You can export and download a full JSON snapshot anytime from the **Admin Portal** -> **Netlify & Storage** tab.

---

## 2. Deploying to Netlify (Step-by-Step)

### Step 1: Push Your Code to GitHub
1. In Google AI Studio, click the top settings menu and export/push your project to a GitHub repository (e.g. `northwest-nitro-web`).

### Step 2: Connect to Netlify
1. Log into your account at [https://app.netlify.com](https://app.netlify.com).
2. Click **"Add new site"** &rarr; **"Import an existing project"**.
3. Select **GitHub** and choose your repository.
4. Netlify will auto-detect the configuration from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Click **"Deploy site"**.

Netlify will build the website, configure the serverless functions, and initialize Netlify Blobs storage automatically!

---

## 3. Optional: Online Card Payments (Stripe)
The club currently defaults to **Cash on the Day** at race control. If and when the club wants to accept online card payments:
1. Create a [Stripe](https://stripe.com) account.
2. In Netlify Site Settings &rarr; **Environment variables**, set:
   - `STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_SECRET_KEY=sk_live_...`
3. In the website Admin portal, toggle **"Online Card Payments"** to **Active**.
