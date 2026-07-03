# Deployment Guide

## Production Environment
1. Setup a VPS with Docker and Docker Compose installed.
2. Clone this repository.
3. Configure `.env` files in `backend/` and `frontend/`.
4. Run `docker-compose up -d --build`.

## GitHub Pages (Frontend Only)
To deploy the frontend to GitHub Pages:
1. Ensure `vite.config.ts` has the correct `base` path.
2. Use the GitHub Action `.github/workflows/deploy.yml`.
