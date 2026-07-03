from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import (
    api_keys,
    assistant,
    auth,
    integrations,
    monitoring,
    pricing,
    settings as settings_routes,
    team,
    templates,
    workflows,
)
from app.core.config import settings
from app.db.database import SessionLocal, init_db
from app.seed import seed_if_empty

app = FastAPI(
    title=settings.app_name,
    description="Backend API for NodeCraft — an AI workflow automation platform.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": exc.errors()},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": "Internal server error"})


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "app": settings.app_name}


app.include_router(auth.router)
app.include_router(workflows.router)
app.include_router(templates.router)
app.include_router(monitoring.router)
app.include_router(team.router)
app.include_router(settings_routes.router)
app.include_router(api_keys.router)
app.include_router(integrations.router)
app.include_router(pricing.router)
app.include_router(assistant.router)
