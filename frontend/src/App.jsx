import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import ToolsView from './components/ToolsView.jsx'
import PresetsView from './components/PresetsView.jsx'
import TerminalView from './components/TerminalView.jsx'
import AIAssistant from './components/AIAssistant.jsx'
import SessionsView from './components/SessionsView.jsx'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeToolForAI, setActiveToolForAI] = useState(null)
  const [activeToolForTerminal, setActiveToolForTerminal] = useState(null)

  const navigateToAI = (tool) => {
    setActiveToolForAI(tool)
    setPage('ai')
  }

  const navigateToTerminal = (tool) => {
    setActiveToolForTerminal(tool)
    setPage('terminal')
  }

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} onAskTool={navigateToAI} />,
    tools:     <ToolsView onAskTool={navigateToAI} onRunTool={navigateToTerminal} />,
    presets:   <PresetsView onAskTool={navigateToAI} onRunTool={navigateToTerminal} />,
    terminal:  <TerminalView initialTool={activeToolForTerminal} />,
    ai:        <AIAssistant initialTool={activeToolForAI} onClearTool={() => setActiveToolForAI(null)} />,
    sessions:  <SessionsView />,
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg-base)' }}>
      <Sidebar page={page} onNavigate={setPage} open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <main style={{
        flex:1, overflow:'auto', display:'flex', flexDirection:'column',
        marginLeft: sidebarOpen ? 220 : 60, transition:'margin-left 0.2s ease',
      }}>
        {pages[page] || pages.dashboard}
      </main>
    </div>
  )
}
