import { useState, useRef, useEffect } from 'react'
import { TOOLS, CATEGORIES } from '../utils/toolData.js'
import { PageWrapper, Btn, SectionHeader } from './UI.jsx'

export default function TerminalView({ initialTool }) {
  const [selectedTool, setSelectedTool] = useState(initialTool || null)
  const [params, setParams] = useState({})
  const [lines, setLines] = useState([])
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [customCmd, setCustomCmd] = useState('')
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [lines])

  useEffect(() => {
    if (initialTool) {
      setSelectedTool(initialTool)
      addLine('system', `Tool loaded: ${initialTool.name}`)
    }
  }, [initialTool])

  const addLine = (type, content) => {
    setLines(l => [...l, { type, content, ts: new Date().toLocaleTimeString('en-GB', { hour12:false }) }])
  }

  const extractParams = (template) => {
    const matches = template.match(/\{(\w+)\}/g) || []
    return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))]
  }

  const buildCmd = (template, params) => {
    let cmd = template
    for (const [k, v] of Object.entries(params)) cmd = cmd.replace(`{${k}}`, v || `<${k}>`)
    return cmd
  }

  const runTool = async () => {
    if (!selectedTool) return
    const cmd = buildCmd(selectedTool.command, params)
    setRunning(true)
    addLine('cmd', `$ ${cmd}`)
    setHistory(h => [cmd, ...h.slice(0, 49)])

    try {
      const res = await fetch('/api/tools/execute', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ tool_id: selectedTool.id, params, timeout:30 }),
      })
      const data = await res.json()
      if (data.stdout) data.stdout.split('\n').forEach(l => l && addLine('out', l))
      if (data.stderr) data.stderr.split('\n').forEach(l => l && addLine('err', l))
      addLine('system', `Exit ${data.return_code} · ${data.duration_ms}ms`)
    } catch {
      // Simulate output when backend not running
      addLine('out', `[NEXUS] Simulated execution of: ${cmd}`)
      addLine('out', `[NEXUS] Backend not connected — command would run on host system`)
      addLine('out', `[NEXUS] Tool: ${selectedTool.name} | Platform: ${selectedTool.platform} | Risk: ${selectedTool.risk}`)
      addLine('system', 'Connect backend to execute real commands')
    }
    setRunning(false)
  }

  const runCustom = async () => {
    if (!customCmd.trim()) return
    const cmd = customCmd.trim()
    addLine('cmd', `$ ${cmd}`)
    setHistory(h => [cmd, ...h.slice(0,49)])
    setCustomCmd('')
    setRunning(true)

    try {
      const res = await fetch('/api/tools/execute', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ tool_id:'custom', params:{ command:cmd }, timeout:30 }),
      })
      const data = await res.json()
      if (data.stdout) data.stdout.split('\n').forEach(l => l && addLine('out', l))
      if (data.stderr) data.stderr.split('\n').forEach(l => l && addLine('err', l))
    } catch {
      addLine('system', '[offline] Backend not connected')
    }
    setRunning(false)
  }

  const lineColor = { cmd:'var(--accent-green)', out:'var(--text-primary)', err:'var(--accent-orange)', system:'var(--text-muted)' }

  return (
    <PageWrapper title="▶ Terminal" subtitle="Execute tools directly from the browser">
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:16, height:'calc(100vh - 180px)' }}>

        {/* Left: tool selector */}
        <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
            <SectionHeader>Select Tool</SectionHeader>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:8 }}>
            {Object.entries(CATEGORIES).map(([catKey, cat]) => (
              <div key={catKey} style={{ marginBottom:8 }}>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:cat.color, padding:'4px 8px', letterSpacing:1 }}>
                  {cat.icon} {cat.label.toUpperCase()}
                </div>
                {TOOLS.filter(t => t.category === catKey).map(tool => (
                  <button key={tool.id} onClick={() => { setSelectedTool(tool); setParams({}) }} style={{
                    width:'100%', textAlign:'left', padding:'7px 10px',
                    background: selectedTool?.id === tool.id ? cat.color + '18' : 'transparent',
                    border:'none', borderLeft:`2px solid ${selectedTool?.id === tool.id ? cat.color : 'transparent'}`,
                    color: selectedTool?.id === tool.id ? cat.color : 'var(--text-secondary)',
                    fontSize:12, fontFamily:'var(--font-mono)', cursor:'pointer',
                    borderRadius:'0 4px 4px 0', transition:'all 0.12s',
                  }}>{tool.name}</button>
                ))}
              </div>
            ))}
          </div>

          {/* Selected tool params */}
          {selectedTool && (
            <div style={{ padding:12, borderTop:'1px solid var(--border)', background:'var(--bg-elevated)' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color: CATEGORIES[selectedTool.category]?.color, marginBottom:8 }}>
                {selectedTool.name}
              </div>
              {extractParams(selectedTool.command).map(param => (
                <div key={param} style={{ marginBottom:6 }}>
                  <div style={{ fontSize:10, color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:3 }}>{param}</div>
                  <input value={params[param] || ''} onChange={e => setParams(p => ({...p, [param]: e.target.value}))}
                    placeholder={`<${param}>`} style={{ fontSize:11, padding:'5px 8px' }} />
                </div>
              ))}
              <Btn onClick={runTool} disabled={running}
                color={CATEGORIES[selectedTool.category]?.color} variant='solid'
                style={{ width:'100%', padding:'8px', marginTop:4 }}>
                {running ? '⟳ Running...' : '▶ Execute'}
              </Btn>
            </div>
          )}
        </div>

        {/* Right: terminal output */}
        <div style={{ display:'flex', flexDirection:'column', background:'var(--bg-base)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
          {/* Terminal topbar */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', background:'var(--bg-elevated)', borderBottom:'1px solid var(--border)' }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#ff5f57' }} />
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#febc2e' }} />
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#28c840' }} />
            <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)', marginLeft:8 }}>NEXUS TERMINAL</span>
            <Btn onClick={() => setLines([])} color='var(--text-muted)' style={{ marginLeft:'auto', padding:'3px 10px' }}>Clear</Btn>
          </div>

          {/* Output */}
          <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', fontFamily:'var(--font-mono)', fontSize:12, lineHeight:1.8 }}>
            {lines.length === 0 && (
              <div style={{ color:'var(--text-muted)', fontSize:11 }}>
                <div>╔══════════════════════════════════════════╗</div>
                <div>║  NEXUS Mobile Forensics Suite v1.0.0      ║</div>
                <div>║  Select a tool and execute, or type below  ║</div>
                <div>╚══════════════════════════════════════════╝</div>
                <div style={{ marginTop:12 }}>Ready.</div>
              </div>
            )}
            {lines.map((l, i) => (
              <div key={i} style={{ color: lineColor[l.type] || 'var(--text-primary)', display:'flex', gap:10 }}>
                <span style={{ color:'var(--text-muted)', flexShrink:0 }}>{l.ts}</span>
                <span>{l.content}</span>
              </div>
            ))}
            {running && (
              <div style={{ color:'var(--accent-green)', display:'flex', gap:6, alignItems:'center' }}>
                <span style={{ animation:'blink 1s infinite' }}>▋</span>
                <span>Executing…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Custom command input */}
          <div style={{ padding:'10px 14px', borderTop:'1px solid var(--border)', display:'flex', gap:8 }}>
            <span style={{ fontFamily:'var(--font-mono)', color:'var(--accent-green)', lineHeight:'34px' }}>$</span>
            <input value={customCmd}
              onChange={e => setCustomCmd(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') runCustom()
                if (e.key === 'ArrowUp') { const idx = Math.min(histIdx+1, history.length-1); setHistIdx(idx); setCustomCmd(history[idx] || '') }
                if (e.key === 'ArrowDown') { const idx = Math.max(histIdx-1, -1); setHistIdx(idx); setCustomCmd(idx < 0 ? '' : history[idx]) }
              }}
              placeholder="Run any command directly…"
              style={{ flex:1, background:'transparent', border:'none', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-primary)' }}
            />
            <Btn onClick={runCustom} disabled={running} color='var(--accent-green)' variant='solid' style={{ padding:'6px 14px' }}>
              {running ? '⟳' : '↵'}
            </Btn>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
