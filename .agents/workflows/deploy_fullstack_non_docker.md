---
description: Deploy Frontend & Backend Separately (No Docker)
---

# Deployment Workflow (Docker‑free)

## Overview
This guide shows how to publish the **frontend** (React) as a static site (Vercel, Netlify, or Cloudflare Pages) and the **backend** (Node.js/Express) as a server‑side service (Render, Railway, Fly.io, or Heroku). No Docker images are required.

## Prerequisites
1. **Git repository** with both `frontend/` and `backend/` directories.
2. **Node.js (v20+)** installed locally for building the frontend.
3. Accounts on the chosen hosting platforms.
4. Optional: CI/CD (GitHub Actions) for automated builds.

## 1️⃣ Frontend Deployment (Static Site)
### A. Vercel (recommended for React)
1. **Push code** to a Git provider (GitHub, GitLab, Bitbucket).
2. In Vercel dashboard, click **New Project** → **Import Git Repository**.
3. Select the repo and set:
   - **Framework Preset**: `Create React App` (or `Next.js` if you use it).
   - **Build Command**: `npm ci && npm run build`
   - **Output Directory**: `build`
4. Add an environment variable for the backend URL:
   - `REACT_APP_BACKEND_URL=https://<backend‑service>.example.com`
5. Deploy – Vercel will build and host the static files at a URL like `https://my‑cricket‑frontend.vercel.app`.

### B. Netlify (alternative)
1. Connect the repo in Netlify.
2. **Build command**: `npm ci && npm run build`
3. **Publish directory**: `build`
4. Add the same `REACT_APP_BACKEND_URL` env var in **Site Settings → Build & Deploy → Environment**.
5. Deploy.

### C. Cloudflare Pages (alternative)
1. Create a new Pages project linked to the repo.
2. **Build command**: `npm ci && npm run build`
3. **Build output directory**: `build`
4. Set `REACT_APP_BACKEND_URL` in **Settings → Environment Variables**.
5. Deploy.

## 2️⃣ Backend Deployment (Node.js Service)
### A. Render (Web Service)
1. In Render dashboard, click **New** → **Web Service**.
2. Connect the same repo (or a separate repo containing only `backend/`).
3. **Root Directory**: `backend`
4. **Build Command**: `npm ci`
5. **Start Command**: `npm start` (ensure `package.json` has a `"start": "node server.js"` script).
6. Add any required env vars (DB credentials, API keys) under **Environment**.
7. Deploy – Render will give you a URL like `https://cricket-backend.onrender.com`.

### B. Railway (Service)
1. Create a new project and link the repo.
2. Choose **Node.js** as the language.
3. Set **Start Command**: `npm start`.
4. Add env vars.
5. Deploy – you’ll receive a public URL.

### C. Fly.io (VM‑based)
1. Install Fly CLI locally.
2. Run `fly launch` inside `backend/`.
3. Choose **Dockerfile**? *Skip* – select **Static Dockerfile** “none” and let Fly use a buildpack.
4. Set `PORT` env var (Fly automatically forwards to the port your app listens on, usually 8080). Update `server.js` to use `process.env.PORT || 8000`.
5. Deploy with `fly deploy`.

### D. Heroku (legacy)
1. Create a new Heroku app.
2. Connect the repo via GitHub integration.
3. Ensure a `Procfile` exists: `web: npm start`.
4. Add env vars in **Settings → Config Vars**.
5. Deploy.

## 3️⃣ Connect Frontend ↔ Backend
1. **Set the backend URL** in the frontend environment variable (`REACT_APP_BACKEND_URL`).
   - For Vercel: Settings → Environment Variables → Production.
   - For Netlify/Cloudflare: similar UI.
2. **CORS configuration** in the backend (Express example):
```js
const cors = require('cors');
app.use(cors({ origin: ['https://my-cricket-frontend.vercel.app'] }));
```
   Adjust the origin list to match all domains you’ll use.
3. **Deploy order**: Deploy backend first, obtain its URL, then set that URL in the frontend env var and redeploy the frontend.

## 4️⃣ Optional CI/CD (GitHub Actions)
Create `.github/workflows/deploy.yml` to automatically build and push the frontend to Vercel and the backend to Render on every push to `main`.
```yaml
name: Deploy Fullstack (No Docker)

on:
  push:
    branches: [main]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install deps & build
        working-directory: ./frontend
        run: |
          npm ci
          npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          prod: true

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install deps
        working-directory: ./backend
        run: npm ci
      - name: Deploy to Render
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        run: |
          curl -X POST "https://api.render.com/v1/services/<service-id>/deploys" \
            -H "Authorization: Bearer $RENDER_API_KEY" \
            -H "Content-Type: application/json"
```
Replace `<service-id>` with your Render backend service ID.

## 5️⃣ Local Development (no Docker)
```bash
# Frontend
cd frontend
npm ci
npm start   # runs on http://localhost:3000

# Backend
cd ../backend
npm ci
npm start   # runs on http://localhost:8000
```
Make sure the frontend `.env` contains:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```
Then you can test the full stack locally.

---
*This workflow removes all Docker dependencies and leverages modern serverless/static‑site platforms for a clean, production‑ready deployment.*
