from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import analytics, notifications
from .scheduler import start_scheduler, stop_scheduler
from .database import create_indexes
import asyncio
from contextlib import asynccontextmanager
import logging

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler_task = None
    try:
        # Startup
        await create_indexes()
        scheduler_task = await start_scheduler()
        logger.info("Application startup complete")
        yield
    finally:
        # Shutdown
        if scheduler_task and not scheduler_task.done():
            scheduler_task.cancel()
            try:
                await scheduler_task
            except asyncio.CancelledError:
                pass
        await stop_scheduler()
        logger.info("Application shutdown complete")

app = FastAPI(
    title="Fitnics Analytics & Notifications Service",
    description="Microservice for handling analytics and notifications",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 