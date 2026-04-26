"""
NEXUS Executor — safe command execution engine with streaming support
"""

import asyncio
import subprocess
import shutil
import os
from typing import AsyncGenerator, Dict
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class ExecutionResult:
    tool_id: str
    command: str
    stdout: str
    stderr: str
    return_code: int
    duration_ms: float
    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    @property
    def success(self) -> bool:
        return self.return_code == 0


def is_tool_available(check_cmd: str) -> bool:
    """Check if a tool is installed on the system."""
    binary = check_cmd.split()[0]
    return shutil.which(binary) is not None


async def run_command(tool_id: str, command: str, timeout: int = 30) -> ExecutionResult:
    """Execute a command and return the result."""
    start = asyncio.get_event_loop().time()
    try:
        proc = await asyncio.create_subprocess_shell(
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
        except asyncio.TimeoutError:
            proc.kill()
            return ExecutionResult(
                tool_id=tool_id, command=command,
                stdout="", stderr="Command timed out",
                return_code=-1, duration_ms=timeout * 1000,
            )
        duration = (asyncio.get_event_loop().time() - start) * 1000
        return ExecutionResult(
            tool_id=tool_id, command=command,
            stdout=stdout.decode(errors="replace"),
            stderr=stderr.decode(errors="replace"),
            return_code=proc.returncode or 0,
            duration_ms=round(duration, 2),
        )
    except Exception as e:
        return ExecutionResult(
            tool_id=tool_id, command=command,
            stdout="", stderr=str(e),
            return_code=-1, duration_ms=0,
        )


async def stream_command(command: str) -> AsyncGenerator[str, None]:
    """Stream command output line by line."""
    proc = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.STDOUT,
    )
    async for line in proc.stdout:
        yield line.decode(errors="replace")
    await proc.wait()


def scan_available_tools(tool_list) -> Dict[str, bool]:
    """Scan which tools are installed on the current system."""
    return {tool.id: is_tool_available(tool.check_cmd) for tool in tool_list}


def build_command(template: str, params: Dict[str, str]) -> str:
    """Fill in a command template with provided parameters."""
    cmd = template
    for key, val in params.items():
        cmd = cmd.replace(f"{{{key}}}", val)
    return cmd
