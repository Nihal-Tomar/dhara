# DEPLOYMENT_GUIDE.md
## DHARA — Digital Hub for Acquisition, Rehabilitation & Administration
**Version:** 1.0.0-sih
**Last updated:** November 11, 2026

---

## ⚠️ Pre-Deployment Requirements

Before deploying to any production environment, resolve all CRITICAL and HIGH security findings in `PRE_DEPLOYMENT_AUDIT.md`. In particular:

1. Remove the master-password backdoor from `DataStoreService.verifyPassword()`
2. Remove or protect the OTP demo bypass endpoints
3. Ensure `JWT_SECRET` has no hardcoded fallback — fail fast at startup if absent
4. Add a `FORCE_REAL_DB=true` check that crashes the application if PostgreSQL is unreachable instead of silently falling back
5. Untrack and `.gitignore` `apps/api/data/db/`
6. Fix the TypeScript build errors in the API

---

## 1. Architecture Overview

```
Internet
   │
   ▼
 Nginx (80/443) — SSL termination, reverse proxy
   │
   ├──▶ Next.js Web (port 3000) — Officer portal + public transparency
   │
   ├──▶ NestJS API (port 3001) — Domain engine, authentication, data
   │         │
   │         ├──▶ PostgreSQL/PostGIS (port 5432) — Persistent relational data
   │         ├──▶ Redis (port 6379) — Cache + sessions
   │         └──▶ MinIO (port 9000) — Document object storage
   │
   └──▶ FastAPI Intelligence (port 8000) — Predictive analytics
             │
             └──▶ PostgreSQL (shared — same instance as API)
```

---

## 2. Deployment Options

### Option A: Docker Compose (Recommended for initial deployment)

Use `infra/docker-compose.prod.yml` for a self-hosted production stack.

**Prerequisites:**
- A Linux server (Ubuntu 22.04+ recommended) with Docker + Docker Compose v2
- Domain name with DNS pointing to the server
- SSL certificate (Let's Encrypt or organisation-issued)
- Minimum: 4 vCPU, 8 GB RAM, 100 GB SSD

### Option B: Cloud-Managed Services (Recommended for resilience)

| Component | Recommended Service |
|---|---|
| **Web frontend** | Vercel (best Next.js support) |
| **NestJS API** | Render.com (Web Service, Docker) or Railway |
| **PostgreSQL** | Render Managed PostgreSQL or Supabase (PostGIS available) |
| **Redis** | Render Managed Redis or Upstash |
| **MinIO / Object Storage** | AWS S3, Cloudflare R2, or Backblaze B2 |
| **Intelligence service** | Render.com (Docker, Python runtime) |

---

## 3. Environment Variables

### 3.1 NestJS API (`apps/api`)

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | No | Defaults to `3001` |
| `DATABASE_URL` | **Yes** | Full PostgreSQL connection string with PostGIS: `postgresql://USER:PASS@HOST:5432/DB?schema=public` |
| `REDIS_URL` | No | Redis connection URL (e.g., `redis://HOST:6379`). If absent, Redis features degrade gracefully |
| `REDIS_PASSWORD` | No | Redis password if auth enabled |
| `JWT_SECRET` | **Yes** | Minimum 64-character cryptographically random string. **Generate fresh for production — never use the placeholder.** |
| `JWT_ACCESS_EXPIRY` | No | Defaults to `15m` |
| `JWT_REFRESH_EXPIRY` | No | Defaults to `7d` |
| `CORS_ORIGINS` | **Yes** | Comma-separated list of allowed frontend origins (e.g., `https://dhara.gov.in,https://www.dhara.gov.in`) |
| `MINIO_ENDPOINT` | No | MinIO/S3 host (e.g., `s3.amazonaws.com` or `minio.yourdomain.com`) |
| `MINIO_PORT` | No | Defaults to `9000` |
| `MINIO_ACCESS_KEY` | No | S3/MinIO access key ID |
| `MINIO_SECRET_KEY` | No | S3/MinIO secret access key |
| `MINIO_BUCKET` | No | Bucket name for document uploads |
| `MINIO_USE_SSL` | No | Set to `true` for HTTPS MinIO |
| `INTELLIGENCE_SERVICE_URL` | No | URL for the Python service (e.g., `http://intelligence:8000`) |
| `GEMINI_API_KEY` | No | Optional — enables LLM-enhanced AI responses |

### 3.2 Next.js Web Frontend (`apps/web`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | Full URL of the NestJS API (e.g., `https://api.dhara.gov.in` or `https://dhara.onrender.com`). Do NOT include `/api/v1` — the client adds that. |
| `NEXT_PUBLIC_APP_VERSION` | No | Application version string |
| `NEXT_PUBLIC_DEMO_MODE` | **Yes** | Set to `false` for production. When `true`, the UI may show demo-only features |

### 3.3 PostgreSQL Database

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_USER` | Yes | Database user (e.g., `dhara_prod`) |
| `POSTGRES_PASSWORD` | Yes | Strong, randomly generated password |
| `POSTGRES_DB` | Yes | Database name (e.g., `dhara_production`) |

### 3.4 Python Intelligence Service (`apps/intelligence`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Defaults to `8000` |
| `DATABASE_URL` | No | Currently unused by the service — no DB queries implemented yet |

---

## 4. Build Commands

### Web Frontend

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build
pnpm --filter @bhumitra/web build

# Start (production)
pnpm --filter @bhumitra/web start
```

### NestJS API

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Generate Prisma client (MUST run before build)
pnpm --filter @bhumitra/api run db:generate

# Build
pnpm --filter @bhumitra/api build

# Start (production)
node apps/api/dist/main
```

### Python Intelligence Service

```bash
# Install dependencies
pip install -r requirements.txt

# Start (production — no reload flag)
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 5. Database Setup and Migrations

### Initial Setup (first deployment only)

```bash
# 1. Ensure PostgreSQL/PostGIS is running and DATABASE_URL is set in environment

# 2. Run database migrations
pnpm --filter @bhumitra/api run db:migrate:deploy

# 3. Seed reference data (roles, permissions, demo projects, parcels)
#    IMPORTANT: In production, you MUST set SEED_PASSWORD to a strong unique
#    password. The seeder refuses to run in production without it.
#    The seed script will generate a fresh bcrypt hash (cost 12) from your password.
#
#    SEED_PASSWORD must:
#      - Be at least 16 characters
#      - Not be "Bhumitra@2026" or any other known demo value
#      - Be rotated (changed) immediately after seeding
#
#    Example (generate a strong password first):
#      openssl rand -base64 24   # generates a 32-char random password
#
#    Then run:
SEED_PASSWORD=<your-strong-unique-password> NODE_ENV=production pnpm db:seed
#
#    After seeding, have each officer change their password via the
#    POST /auth/change-password endpoint before their first login.
```

**Development / SIH demo seeding** (no SEED_PASSWORD needed):
```bash
# Uses the demo password hash (Bhumitra@2026) — development only
pnpm --filter @bhumitra/api run db:seed
```

### Subsequent Deployments

```bash
# Apply pending migrations only (no seed)
pnpm --filter @bhumitra/api run db:migrate:deploy
```

### PostGIS Requirement

The database schema uses `Json` fields for GeoJSON geometries. The PostGIS extension is required for spatial queries. When provisioning PostgreSQL, ensure PostGIS is installed:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
```

Render Managed PostgreSQL and Supabase both support PostGIS natively.

---

## 6. Docker Deployment

### Build Images

```bash
# Build API image
docker build -f apps/api/Dockerfile -t dhara/api:latest .

# Build Web image
docker build -f apps/web/Dockerfile -t dhara/web:latest .

# Build Intelligence image
docker build -f apps/intelligence/Dockerfile -t dhara/intelligence:latest apps/intelligence/
```

### Create `.env` file for production compose

Create a `.env` file in the `infra/` directory (never commit this):

```
NODE_ENV=production
POSTGRES_USER=dhara_prod
POSTGRES_PASSWORD=<strong_random_password>
POSTGRES_DB=dhara_production
DATABASE_URL=postgresql://dhara_prod:<password>@postgres:5432/dhara_production?schema=public
REDIS_PASSWORD=<strong_random_redis_password>
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
MINIO_ACCESS_KEY=<random_access_key>
MINIO_SECRET_KEY=<strong_random_secret>
MINIO_BUCKET=dhara-documents
MINIO_ENDPOINT=minio
MINIO_PORT=9000
JWT_SECRET=<minimum_64_char_cryptographically_random_string>
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_DEMO_MODE=false
```

### Run Production Stack

```bash
cd infra
docker compose -f docker-compose.prod.yml up -d

# Run migrations after startup
docker exec dhara_prod_api npx prisma migrate deploy
```

---

## 7. Render.com Deployment Guide

### 7.1 PostgreSQL Database

1. Create a **Render Managed PostgreSQL** instance.
2. Enable PostGIS via the Render dashboard or by running `CREATE EXTENSION postgis;`.
3. Copy the **External Database URL** from the Render dashboard.

### 7.2 NestJS API (Web Service)

1. Create a **Render Web Service**.
2. Connect your GitHub repository.
3. Set:
   - **Build command:** `pnpm install --frozen-lockfile && pnpm --filter @bhumitra/api run db:generate && pnpm --filter @bhumitra/api build`
   - **Start command:** `node apps/api/dist/main`
   - **Health check path:** `/api/v1/health`
4. Add all environment variables from Section 3.1.
5. Set `DATABASE_URL` to the Render PostgreSQL external URL.

### 7.3 Next.js Web Frontend

**Option A: Vercel (recommended)**

1. Import the GitHub repo in Vercel.
2. Set **Root Directory** to `apps/web`.
3. Set **Build command** to `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @bhumitra/web build`
4. Add `NEXT_PUBLIC_API_URL` pointing to the Render API service URL.
5. Add `NEXT_PUBLIC_DEMO_MODE=false`.

**Option B: Render Static/Web Service**

1. Create a Render Web Service.
2. Build command: `pnpm install && pnpm --filter @bhumitra/web build`
3. Start command: `pnpm --filter @bhumitra/web start`

### 7.4 Python Intelligence Service

1. Create a **Render Web Service** using Python runtime or Docker.
2. Connect to the same repository.
3. Set **Root Directory** to `apps/intelligence`.
4. Set **Build command:** `pip install -r requirements.txt`
5. Set **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 8. CORS Configuration

The `CORS_ORIGINS` environment variable on the API must include all domains from which the frontend will make requests.

**Example for production:**
```
CORS_ORIGINS=https://dhara.gov.in,https://www.dhara.gov.in
```

The Next.js frontend's `next.config.ts` rewrites `/api/*` to the API URL, so browser requests go through Next.js to the API. The `CORS_ORIGINS` list must still include the Next.js deployment URL.

---

## 9. Health Check Endpoints

| Service | Endpoint | Expected Response |
|---|---|---|
| NestJS API | `GET /api/v1/health` | `200 OK` with `{ status: "ok" }` |
| Next.js Web | `GET /api/health` | `200 OK` with `{ status: "ok" }` |
| Intelligence | `GET /health` | `200 OK` with `{ status: "healthy" }` |

---

## 10. Post-Deployment Verification Checklist

```
[ ] 1. Access https://your-domain.com — DHARA home page loads
[ ] 2. Navigate to /login — login form renders correctly
[ ] 3. Submit login with valid credentials — redirected to /dashboard
[ ] 4. API health check returns 200: GET https://api.your-domain.com/api/v1/health
[ ] 5. Swagger docs accessible: GET https://api.your-domain.com/api/docs
[ ] 6. Intelligence service health: GET https://intelligence.your-domain.com/health
[ ] 7. Confirm DATABASE_URL points to real PostgreSQL (not embedded fallback)
[ ] 8. Check API logs confirm "Connected to PostgreSQL + PostGIS database" (not embedded fallback warning)
[ ] 9. Create a test project via API to confirm DB writes work
[ ] 10. Upload a test document to confirm MinIO/S3 connectivity (if MinIO configured)
[ ] 11. Confirm JWT tokens expire after 15 minutes
[ ] 12. Verify CORS rejects requests from non-allowlisted origins
```

---

## 11. Deployment Order

Deploy in this order to satisfy dependencies:

1. **PostgreSQL** — must be running before API
2. **Redis** — must be running before API
3. **MinIO** — should be running before API (non-blocking)
4. **NestJS API** — run migrations before marking healthy
5. **Python Intelligence** — optional for initial launch
6. **Next.js Web** — deploy last (depends on API URL)
7. **Nginx** — configure after all services are healthy
