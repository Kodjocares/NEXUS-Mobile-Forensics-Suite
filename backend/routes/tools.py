"""
NEXUS Tools Router — list, query, execute and scan tools
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Optional, Dict
import json

from core.tool_registry import TOOL_REGISTRY, CATEGORIES, PRESETS, get_tool, get_tools_by_category, get_tools_by_platform
from core.executor import run_command, scan_available_tools, build_command, stream_command

router = APIRouter()


class ExecuteRequest(BaseModel):
    tool_id: str
    params: Dict[str, str] = {}
    timeout: int = 30


@router.get("/")
async def list_tools(category: Optional[str] = None, platform: Optional[str] = None):
    tools = TOOL_REGISTRY
    if category:
        tools = [t for t in tools if t.category == category]
    if platform and platform != "all":
        tools = [t for t in tools if t.platform == platform or t.platform == "both"]
    return {"tools": [t.dict() for t in tools], "total": len(tools)}


@router.get("/categories")
async def list_categories():
    return {"categories": CATEGORIES}


@router.get("/presets")
async def list_presets():
    return {"presets": PRESETS}


@router.get("/scan")
async def scan_tools():
    """Scan which tools are installed on the system."""
    available = scan_available_tools(TOOL_REGISTRY)
    count = sum(1 for v in available.values() if v)
    return {"available": available, "installed_count": count, "total": len(TOOL_REGISTRY)}


@router.get("/{tool_id}")
async def get_tool_detail(tool_id: str):
    tool = get_tool(tool_id)
    if not tool:
        raise HTTPException(status_code=404, detail=f"Tool '{tool_id}' not found")
    return tool.dict()


@router.post("/execute")
async def execute_tool(req: ExecuteRequest):
    tool = get_tool(req.tool_id)
    if not tool:
        raise HTTPException(status_code=404, detail=f"Tool '{req.tool_id}' not found")

    command = build_command(tool.command_template, req.params)
    result = await run_command(tool.id, command, timeout=req.timeout)

    return {
        "tool": tool.name,
        "command": result.command,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "return_code": result.return_code,
        "success": result.success,
        "duration_ms": result.duration_ms,
        "timestamp": result.timestamp,
    }


@router.websocket("/stream/{tool_id}")
async def stream_tool(websocket: WebSocket, tool_id: str):
    """WebSocket endpoint for streaming command output in real time."""
    await websocket.accept()
    tool = get_tool(tool_id)
    if not tool:
        await websocket.send_text(json.dumps({"error": f"Tool '{tool_id}' not found"}))
        await websocket.close()
        return

    try:
        data = await websocket.receive_text()
        params = json.loads(data).get("params", {})
        command = build_command(tool.command_template, params)

        await websocket.send_text(json.dumps({"type": "start", "command": command, "tool": tool.name}))

        async for line in stream_command(command):
            await websocket.send_text(json.dumps({"type": "output", "line": line}))

        await websocket.send_text(json.dumps({"type": "done"}))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_text(json.dumps({"type": "error", "message": str(e)}))
