# ⚡ NEXUS Mobile Forensics Suite

> All-in-one Android & iOS pentesting, forensics, IDS, cloning, and device monitoring platform — powered by Claude AI.

![NEXUS Dashboard](docs/screenshot.png)

---

## 🧰 What's Inside

**34 professional tools** across 4 categories:

| Category | Tools |
|----------|-------|
| 🔬 **Mobile Forensics** | ADB, Andriller, ALEAPP, iLEAPP, Frida, objection, MobSF, Autopsy, QARK, libimobiledevice |
| 🛡️ **Intrusion Detection** | Suricata, Snort, Zeek, Wazuh, Drozer, Needle, Sniffnet |
| 💾 **Cloning & Imaging** | dcfldd, FTK Imager, Guymager, dc3dd, ADB Backup, idevicebackup2, Clonezilla |
| 📡 **Device Monitoring** | Wireshark, Bettercap, mitmproxy, Burp Suite, Aircrack-ng, Kismet, OSQuery, Velociraptor, Charles Proxy |

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended)

```bash
git clone https://github.com/Kodjocares/nexus-mobile-forensics
cd nexus-mobile-forensics
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
docker-compose up --build
```

Open **http://localhost:3000**

### Option 2 — Local Dev

```bash
# Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py              # runs on http://localhost:8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev                 # runs on http://localhost:3000
```

### Option 3 — Setup Script

```bash
bash scripts/setup.sh
```

---

## 🗂️ Project Structure

```
nexus-mobile-forensics/
├── backend/
│   ├── main.py                  # FastAPI app entrypoint
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── core/
│   │   ├── tool_registry.py     # All 34 tools with metadata
│   │   └── executor.py          # Command execution engine
│   └── routes/
│       ├── tools.py             # Tool list, execute, stream (WebSocket)
│       ├── ai.py                # Claude AI proxy + tool help + methodology
│       ├── sessions.py          # Engagement session tracking
│       └── reports.py           # Report generation
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root app with routing
│   │   ├── components/
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   ├── Dashboard.jsx    # Overview + system scan
│   │   │   ├── ToolsView.jsx    # Browse, filter, copy all tools
│   │   │   ├── PresetsView.jsx  # Mission presets + AI methodology
│   │   │   ├── TerminalView.jsx # Live command execution terminal
│   │   │   ├── AIAssistant.jsx  # Claude-powered chat assistant
│   │   │   ├── SessionsView.jsx # Engagement session manager
│   │   │   └── UI.jsx           # Shared component library
│   │   ├── utils/
│   │   │   ├── api.js           # API client + WebSocket helpers
│   │   │   └── toolData.js      # Offline tool data (frontend fallback)
│   │   └── styles/globals.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── scripts/setup.sh
```

---

## ✨ Features

### 🖥️ Dashboard
- Live stats: total tools, Android/iOS/both counts, risk breakdown
- Category progress bars
- System tool scanner — detects what's installed
- Quick-launch preset cards

### ⚙️ Tools Browser
- Filter by category, platform (Android / iOS / Both), and free-text search
- Expandable tool cards with command templates, risk level, root requirements
- One-click **Copy command** and **Ask AI** buttons

### ⬡ Mission Presets
- 7 curated engagement packs (Android Pentest, iOS Pentest, DFIR Lab, Network Monitoring, RF/Wireless, Android Forensics, iOS Forensics)
- Expand any preset to see all tools and run them
- **Generate AI Methodology** — Claude writes a full step-by-step runbook

### ▶ Terminal
- Select any tool from the sidebar, fill in parameters, execute
- Streaming WebSocket output (real-time)
- Custom command input with history (↑/↓ arrows)
- Clear button, exit code display

### ◈ AI Assistant
- Powered by **Claude** via Anthropic API
- Quick-prompt chips for common questions
- Full markdown rendering with syntax-highlighted code blocks
- Copyable code blocks
- Remembers conversation context

### ◷ Sessions
- Create named engagement sessions with target + platform
- Log tool executions to sessions
- Open / close session lifecycle

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | Claude API key from console.anthropic.com |
| `NEXUS_HOST` | ❌ | Backend host (default: 0.0.0.0) |
| `NEXUS_PORT` | ❌ | Backend port (default: 8000) |
| `VITE_API_URL` | ❌ | Frontend API base URL |
| `VITE_WS_URL` | ❌ | WebSocket base URL |

---

## ⚠️ Legal Disclaimer

NEXUS Mobile Forensics Suite is intended for **authorized security testing, digital forensics, and research only**.

- Always obtain **written authorization** before testing any device or network
- Some tools (Bettercap, Aircrack-ng, Frida, Drozer) can be illegal if used without permission
- The authors are not responsible for misuse of this software
- This tool is designed for security professionals, forensic investigators, and researchers

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-tool`)
3. Add your tool to `backend/core/tool_registry.py` and `frontend/src/utils/toolData.js`
4. Submit a PR

### Adding a new tool

```python
# backend/core/tool_registry.py
Tool(
    id="my_tool",
    name="My Tool",
    category="forensics",  # forensics | ids | cloning | monitoring
    platform="both",       # android | ios | both
    description="What it does",
    command_template="mytool --target {target} --output {output}",
    install_cmd="pip install mytool",
    check_cmd="mytool --version",
    docs_url="https://mytool.io/docs",
    tags=["forensics","android"],
    risk_level="low",      # low | medium | high
    requires_root=False,
)
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

Built with ⚡ FastAPI + React + Claude AI
