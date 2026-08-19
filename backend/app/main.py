import time
from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.db.session import get_db
from app.modules.shared.auth_router import router as auth_router
from app.modules.shared.settings_router import router as settings_router
from app.modules.shared.audit_router import router as audit_router
from app.modules.shared.cms_router import router as cms_router
from app.modules.tours.router import router as tours_router
from app.modules.fleet.router import router as fleet_router
from app.modules.finance.router import router as finance_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Aarambha Unified Platform API for Tours & Travels and Self-Drive Rentals"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All Routers
app.include_router(auth_router)
app.include_router(settings_router)
app.include_router(audit_router)
app.include_router(cms_router)
app.include_router(tours_router)
app.include_router(fleet_router)
app.include_router(finance_router)

@app.get("/api/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Health check endpoint for Render keep-alive external pinger.
    Verifies DB connection and returns server status.
    """
    db_status = "healthy"
    schemas_found = []
    
    try:
        res = await db.execute(text("SELECT 1"))
        _ = res.scalar()
        
        schemas_res = await db.execute(text(
            "SELECT schema_name FROM information_schema.schemata "
            "WHERE schema_name IN ('tours', 'fleet', 'shared')"
        ))
        schemas_found = [r[0] for r in schemas_res.fetchall()]
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "online",
        "timestamp": time.time(),
        "database": db_status,
        "active_schemas": schemas_found,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Aarambha API",
        "documentation": "/docs",
        "health": "/api/health"
    }
