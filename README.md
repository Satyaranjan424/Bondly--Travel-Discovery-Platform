# Bondly Travel Discovery Platform

Bondly is a full-stack travel discovery platform built with React + Vite, Tailwind CSS, Hono, NeonDB PostgreSQL, and Redis.

## Features
- Email/password authentication with profile management
- Trip creation with destinations, itinerary planning, and visibility controls
- Explore feed with search, trip saving, and rich trip detail views
- Reviews, comments, and photo uploads on public trips
- Responsive desktop/mobile UI
- NeonDB PostgreSQL persistence with a memory fallback for local demos
- Redis-backed sessions with a memory fallback when Redis is unavailable

## Structure
- `bondly/` frontend
- `api/` backend

## Quick Start
1. `npm install`
2. `cd bondly && npm install`
3. `cd ../api && npm install`
4. Copy `api/.env.example` to `api/.env`
5. Copy `bondly/.env.example` to `bondly/.env`
6. Create a Neon project and paste its pooled connection string into `api/.env` as `DATABASE_URL`
7. Run `api/schema.sql` against your Neon database
8. Start both apps with `npm run dev`

Frontend runs at `http://localhost:5173`
API runs at `http://localhost:3001`

## NeonDB
- Use the Neon pooled Postgres connection string in `DATABASE_URL`
- Keep `sslmode=require` in the URL
- The API auto-enables SSL settings for Neon hosts
- If `DATABASE_URL` is empty or unreachable, the app falls back to in-memory demo data

## Demo Login
- `maya@bondly.app` / `Password123!`
- `alex@bondly.app` / `Password123!`

## 15/04/2026
- All Task completed by this date.
