"""NEXUS Reports Router"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter()
_reports: dict = {}

class ReportCreate(BaseModel):
    session_id: str
    title: str
    findings: List[dict] = []
    severity: str = "medium"

@router.post("/")
async def create_report(req: ReportCreate):
    rid = str(uuid.uuid4())[:8]
    report = {
        "id": rid, "session_id": req.session_id,
        "title": req.title, "findings": req.findings,
        "severity": req.severity,
        "generated_at": datetime.utcnow().isoformat(),
    }
    _reports[rid] = report
    return report

@router.get("/")
async def list_reports():
    return {"reports": list(_reports.values())}

@router.get("/{report_id}")
async def get_report(report_id: str):
    r = _reports.get(report_id)
    if not r: return {"error": "Report not found"}
    return r
