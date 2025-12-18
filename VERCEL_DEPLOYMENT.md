# Vercel Deployment Guide - Cyber Mercenary

This project is fully optimized for deployment on [Vercel](https://vercel.com). Follow these steps to get your neon-drenched RPG live.

## 1. Environment Variables
You MUST set the following environment variables in your Vercel Project Settings under **Settings > Environment Variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anonymous Key | `eyJhbGciOiJIUzI1Ni...` |

## 2. Build Commands
Vercel should automatically detect the Vite project, but ensure these settings are used if prompted:

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build` (or `tsc && vite build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 3. Note on Multiplayer (Socket.io)
The `server/` directory contains a Prototype Socket.io server. **Vercel Serverless Functions do not support persistent WebSockets.**

If you wish to use the multiplayer features:
- Host the `server/` folder on a persistent hosting provider like **Render**, **Railway**, or **Fly.io**.
- Update your client connection strings to point to that external URL.
- The core single-player experience and Supabase persistence work out-of-the-box on Vercel.

## 4. Troubleshooting
If you see a "System Critical Failure" screen:
- Ensure your Supabase Database is active and the Schema (specifically the `profiles` table) is correctly set up.
- Check the browser console for specific error logs.
