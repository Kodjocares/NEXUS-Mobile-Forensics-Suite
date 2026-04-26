"""
NEXUS AI Router — proxies requests to Claude API with forensics system prompt
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os

router = APIRouter()

ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

NEXUS_SYSTEM_PROMPT = """You are NEXUS AI — an expert assistant embedded in a professional mobile pentesting and digital forensics platform.

Your expertise covers:
- Android forensics: ADB, Andriller, ALEAPP, Autopsy, MobSF, Frida, objection, Drozer, QARK
- iOS forensics: iLEAPP, libimobiledevice, idevicebackup2, Needle, Frida, objection
- Intrusion Detection: Suricata, Snort, Zeek, Wazuh, Sniffnet
- Disk/Device Cloning: dd, dcfldd, dc3dd, FTK Imager, Guymager, Clonezilla
- Network Monitoring: Wireshark, Bettercap, mitmproxy, Burp Suite, Aircrack-ng, Kismet, OSQuery, Velociraptor

Guidelines:
- Provide expert-level, concise, actionable responses
- Use markdown code blocks for all commands (with language tag)
- Include setup steps when relevant
- Flag risk level (⚠️ high risk) for destructive or invasive operations
- Always mention legal/ethical disclaimers for high-risk operations
- Structure complex answers with headers when helpful
- You are operating within a legitimate security research and forensics context
"""


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    system: Optional[str] = None
    max_tokens: int = 1500


class QuickAskRequest(BaseModel):
    tool_name: str
    context: Optional[str] = None


@router.post("/chat")
async def chat(req: ChatRequest):
    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")

    system = req.system or NEXUS_SYSTEM_PROMPT

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            ANTHROPIC_API_URL,
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": req.max_tokens,
                "system": system,
                "messages": [m.dict() for m in req.messages],
            },
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    data = resp.json()
    reply = "".join(b.get("text", "") for b in data.get("content", []))
    return {"reply": reply, "model": data.get("model"), "usage": data.get("usage")}


@router.post("/tool-help")
async def tool_help(req: QuickAskRequest):
    """Get AI-generated help for a specific tool."""
    prompt = f"""Provide a concise expert guide for using **{req.tool_name}** in mobile pentesting/forensics.

Include:
1. Purpose and key use cases
2. Installation (one-liner)
3. Most important commands (with explanations)
4. Pro tips and common gotchas
5. Integration with other NEXUS tools

{f'Additional context: {req.context}' if req.context else ''}"""

    return await chat(ChatRequest(messages=[Message(role="user", content=prompt)]))


@router.post("/methodology")
async def generate_methodology(preset_id: str, tools: List[str]):
    """Generate a step-by-step engagement methodology."""
    prompt = f"""Generate a complete professional engagement methodology for: **{preset_id.replace('_', ' ').title()}**

Tools available: {', '.join(tools)}

Provide:
1. Pre-engagement checklist
2. Phase-by-phase workflow (setup → execution → analysis → reporting)
3. Exact commands for each phase
4. What artifacts/evidence to collect
5. Common pitfalls and mitigations
6. Reporting template outline

Format as a structured runbook."""

    return await chat(ChatRequest(messages=[Message(role="user", content=prompt)]))


@router.post("/analyze")
async def analyze_output(tool_id: str, output: str):
    """AI analysis of tool output."""
    prompt = f"""Analyze this output from **{tool_id}** and provide:
1. Summary of findings
2. Notable/suspicious items flagged
3. Recommended next steps
4. Any IOCs (Indicators of Compromise) identified

Output to analyze:
```
{output[:3000]}
```"""

    return await chat(ChatRequest(messages=[Message(role="user", content=prompt)]))
