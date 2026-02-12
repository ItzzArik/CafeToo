# CafeToo - Vercel Deployment Guide

This guide details how to deploy the CafeToo application to Vercel for production use.

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to GitHub (Done).
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Supabase Project**: You need the URL and Anon Key from your Supabase project.

## Steps

### 1. Import Project to Vercel

1.  Log in to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Find `cafetoo` in the list and click **"Import"**.

### 2. Configure Project

Vercel will automatically detect `Next.js`. You don't need to change the Build Command or Output Directory.

### 3. Environment Variables (Critical)

Expand the **"Environment Variables"** section. Add the following keys from your `.env.local` file:

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | *Your Supabase Project URL* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Your Supabase Anon Key* |

> **Note**: You can copy these directly from your local `.env.local` file or Supabase Dashboard -> Settings -> API.

### 4. Deploy

1.  Click **"Deploy"**.
2.  Wait for Vercel to build your application (approx. 1-2 minutes).
3.  Once complete, you will see a "Congratulations!" screen with your live URL (e.g., `https://cafetoo.vercel.app`).

## Post-Deployment Checks

1.  **Visit the URL**: Open your new website on your phone and laptop.
2.  **Test Real-time**:
    -   Open the site on your phone (Student view).
    -   Open `/owner` on your laptop (Owner view).
    -   Place an order on the phone.
    -   Verify it appears instantly on the laptop.
3.  **Test Auth**: Try logging into the Owner Portal with PIN `1234`.

## Troubleshooting

-   **"500 Server Error"**: Usually means Environment Variables are missing. Check Vercel Settings -> Environment Variables.
-   **Styles Missing**: Ensure `npm install` ran correctly during build (Vercel handles this automatically).

---

**Enjoy your live Cyber-Canteen!** 🚀
