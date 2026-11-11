"""
DHARA — Intelligence & Decision Support Service
Digital Hub for Acquisition, Rehabilitation & Administration
FastAPI application entry point
Port: 8000
"""

import os
import time
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="DHARA Intelligence Service",
    description=(
        "DHARA — Digital Hub for Acquisition, Rehabilitation & Administration — "
        "National Land Acquisition Predictive Intelligence & Decision Support Service"
    ),
    version="1.0.0-sih",
    docs_url="/docs",
    redoc_url="/redoc",
)

# SEC-15 FIXED: CORS origins now read from environment variable instead of
# wildcard allow_origins=["*"]. In production, set CORS_ORIGINS to the
# explicit list of allowed frontend origins.
# Default to localhost for local development only.
_cors_origins_raw = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
_allowed_origins = [o.strip() for o in _cors_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

START_TIME = time.time()


class HealthDetails(BaseModel):
    service: str
    status: str
    uptime_seconds: float
    timestamp: str
    version: str
    engine: str


@app.get("/", tags=["Root"])
def read_root():
    return {
        "service": "DHARA Intelligence Service",
        "tagline": "National Land Acquisition Predictive Intelligence & Decision Support",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0-sih",
    }


@app.get("/health", response_model=HealthDetails, tags=["Health"])
def health_check():
    return HealthDetails(
        service="dhara-intelligence",
        status="healthy",
        uptime_seconds=round(time.time() - START_TIME, 2),
        timestamp=datetime.now(timezone.utc).isoformat(),
        version="1.0.0-sih",
        engine="heuristic-scoring-v1",
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    # Production: do not set reload=True — it enables the file watcher
    # which is a development-only feature.
    reload_mode = os.environ.get("NODE_ENV", "production") != "production"
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=reload_mode)
