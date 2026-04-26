"""
NEXUS Mobile Forensics Suite - Backend API
FastAPI server providing tool execution, AI proxy, and session management
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import uvicorn
import logging

from routes import tools, ai, sessions, reports

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nexus")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 NEXUS Mobile Forensics Suite starting...")
    yield
    logger.info("🛑 NEXUS shutting down...")

app = FastAPI(
    title="NEXUS Mobile Forensics API",
    description="All-in-one Android & iOS pentesting, forensics, IDS, cloning and monitoring suite",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(tools.router, prefix="/api/tools", tags=["Tools"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {
        "name": "NEXUS Mobile Forensics Suite",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
    }

@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "NEXUS is online"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
