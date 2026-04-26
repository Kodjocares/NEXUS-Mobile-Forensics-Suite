"""NEXUS Sessions Router"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

router = APIRouter()
_sessions: Dict[str, Any] = {}

class SessionCreate(BaseModel):
    name: str
    target: Optional[str] = None
    platform: Optional[str] = "both"
    notes: Optional[str] = None

class LogEntry(BaseModel):
    session_id: str
    tool_id: str
    command: str
    output: str
    success: bool

@router.post("/")
async def create_session(req: SessionCreate):
    sid = str(uuid.uuid4())[:8]
    _sessions[sid] = {
        "id": sid, "name": req.name, "target": req.target,
        "platform": req.platform, "notes": req.notes,
        "created_at": datetime.utcnow().isoformat(),
        "logs": [], "status": "active",
    }
    return _sessions[sid]

@router.get("/")
async def list_sessions():
    return {"sessions": list(_sessions.values()), "total": len(_sessions)}

@router.get("/{session_id}")
async def get_session(session_id: str):
    s = _sessions.get(session_id)
    if not s: return {"error": "Session not found"}
    return s

@router.post("/log")
async def add_log(entry: LogEntry):
    s = _sessions.get(entry.session_id)
    if not s: return {"error": "Session not found"}
    log = {**entry.dict(), "timestamp": datetime.utcnow().isoformat()}
    s["logs"].append(log)
    return {"logged": True, "entry": log}

@router.delete("/{session_id}")
async def close_session(session_id: str):
    if session_id in _sessions:
        _sessions[session_id]["status"] = "closed"
    return {"closed": session_id}
