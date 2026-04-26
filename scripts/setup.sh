#!/usr/bin/env bash
# NEXUS Mobile Forensics Suite — Quick Setup Script
set -e

BOLD="\033[1m"; GREEN="\033[0;32m"; BLUE="\033[0;34m"; YELLOW="\033[1;33m"; RESET="\033[0m"

echo -e "${BOLD}${GREEN}"
echo "  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗"
echo "  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝"
echo "  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗"
echo "  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║"
echo "  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║"
echo "  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝"
echo -e "  Mobile Forensics Suite v1.0.0${RESET}"
echo ""

# Check dependencies
command -v docker >/dev/null 2>&1 || { echo "Docker required. Install from https://docker.com"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || docker compose version >/dev/null 2>&1 || { echo "Docker Compose required."; exit 1; }

# Setup .env
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${YELLOW}⚠  .env created from template. Add your ANTHROPIC_API_KEY.${RESET}"
  echo ""
  read -p "Enter your Anthropic API key (or press Enter to skip): " apikey
  if [ -n "$apikey" ]; then
    sed -i "s/sk-ant-your-key-here/$apikey/" .env
    echo -e "${GREEN}✓ API key saved${RESET}"
  fi
fi

# Dev vs Docker
echo ""
echo -e "${BLUE}How do you want to run NEXUS?${RESET}"
echo "  1) Docker (recommended, includes all forensic tools)"
echo "  2) Local dev (requires Python 3.11+ and Node 20+)"
read -p "Choice [1/2]: " choice

if [ "$choice" = "2" ]; then
  echo -e "\n${BLUE}Setting up local dev environment...${RESET}"

  # Backend
  echo -e "${GREEN}▶ Installing Python dependencies...${RESET}"
  cd backend
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
  cd ..

  # Frontend
  echo -e "${GREEN}▶ Installing Node dependencies...${RESET}"
  cd frontend
  npm install
  cd ..

  echo ""
  echo -e "${GREEN}✓ Setup complete!${RESET}"
  echo ""
  echo "  Start backend:   cd backend && source .venv/bin/activate && python main.py"
  echo "  Start frontend:  cd frontend && npm run dev"
  echo ""
  echo -e "  Open: ${BLUE}http://localhost:3000${RESET}"

else
  echo -e "\n${BLUE}Building and starting Docker containers...${RESET}"
  docker-compose up --build -d
  echo ""
  echo -e "${GREEN}✓ NEXUS is running!${RESET}"
  echo ""
  echo -e "  Frontend:  ${BLUE}http://localhost:3000${RESET}"
  echo -e "  API docs:  ${BLUE}http://localhost:8000/docs${RESET}"
  echo ""
  echo "  Logs:    docker-compose logs -f"
  echo "  Stop:    docker-compose down"
fi
