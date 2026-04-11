---
description: Deploy Fullstack Application (Frontend + Backend)
---

# Deployment Workflow

## Prerequisites
1. Ensure you have Docker installed locally.
2. Have a cloud provider account (e.g., Render, Railway, Fly.io, or any VPS).
3. Git repository with both `frontend/` and `backend/` directories.

## Steps
1. **Create Dockerfiles**
   - **Frontend** (`frontend/Dockerfile`):
     ```dockerfile
     # Use an official Node runtime as a parent image
     FROM node:20-alpine AS build
     WORKDIR /app
     COPY package*.json ./
     RUN npm ci
     COPY . .
     RUN npm run build

     # Serve with a lightweight server
     FROM nginx:alpine
     COPY --from=build /app/build /usr/share/nginx/html
     EXPOSE 80
     CMD ["nginx", "-g", "daemon off;"]
     ```
   - **Backend** (`backend/Dockerfile`):
     ```dockerfile
     FROM node:20-alpine
     WORKDIR /app
     COPY package*.json ./
     RUN npm ci
     COPY . .
     EXPOSE 8000
     CMD ["npm", "start"]
     ```

2. **Create Docker Compose** (`docker-compose.yml`):
   ```yaml
   version: "3.8"
   services:
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - NODE_ENV=production
   ```

3. **Test Locally**
   ```bash
   docker compose up --build
   ```
   - Visit `http://localhost` for the frontend.
   - API calls should be proxied to `http://localhost:8000`.

4. **Push to Repository**
   ```bash
   git add .
   git commit -m "Add Docker deployment files"
   git push origin main
   ```

5. **Deploy to Cloud** (example using Render):
   - Create a new **Web Service** for the **frontend**:
     - Set **Dockerfile Path** to `frontend/Dockerfile`.
     - Set **Build Command** to `docker build -t frontend .` (Render auto-detects).
   - Create a new **Web Service** for the **backend**:
     - Dockerfile Path: `backend/Dockerfile`.
   - Ensure the backend service URL is added to the frontend environment (e.g., in `.env` or via Render's environment variables).

6. **Configure CORS** in the backend to allow requests from the frontend domain.

7. **Optional: Use CI/CD**
   - Add a GitHub Actions workflow (`.github/workflows/deploy.yml`) to automatically build and push Docker images to a registry (Docker Hub, GitHub Packages) and trigger the cloud provider.

## Verification
- After deployment, open the frontend URL and perform a few API calls to ensure the backend responds correctly.
- Check logs on the cloud provider for any errors.

---

*This workflow provides a generic Docker‑based deployment strategy that works on most cloud platforms. Adjust the provider‑specific steps as needed.*
