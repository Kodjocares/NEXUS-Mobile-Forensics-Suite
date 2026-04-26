import { useState } from 'react'
import { PRESETS, TOOLS, CATEGORIES } from '../utils/toolData.js'
import { PageWrapper, Card, Btn, Badge, CommandBlock, SectionHeader, EmptyState } from './UI.jsx'

export default function PresetsView({ onAskTool, onRunTool }) {
  const [active, setActive] = useState(null)
  const [methodology, setMethodology] = useState(null)
  const [loading, setLoading] = useState(false)

  const getTools = (preset) => preset.tools.map(id => TOOLS.find(t => t.id === id)).filter(Boolean)

  const genMethodology = async (preset) => {
    setLoading(true)
    setMethodology(null)
    try {
      const res = await fetch('/api/ai/methodology?preset_id=' + preset.id, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(preset.tools),
      })
      const data = await res.json()
      setMethodology(data.reply)
    } catch {
      setMethodology(`# ${preset.label} — Methodology\n\n**Pre-engagement**\n- Obtain written authorization\n- Document scope and target devices\n- Prepare forensic workstation\n\n**Phase 1: Setup**\n${preset.tools.map(id => `- Install and configure \`${id}\``).join('\n')}\n\n**Phase 2: Execution**\n- Run tools in sequence per engagement goal\n- Capture all output and artifacts\n\n**Phase 3: Analysis**\n- Review collected data\n- Identify IOCs and findings\n\n**Phase 4: Reporting**\n- Document findings with evidence\n- Write executive summary\n- Provide remediation recommendations`)
    }
    setLoading(false)
  }

  return (
    <PageWrapper title="⬡ Mission Presets" subtitle="Curated tool combinations for specific engagement types">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
        {PRESETS.map(preset => {
          const isActive = active?.id === preset.id
          const tools = getTools(preset)
          const cats = [...new Set(tools.map(t => t.category))]

          return (
            <div key={preset.id} style={{
              background:'var(--bg-surface)',
              border:`1px solid ${isActive ? 'var(--accent-blue)' : 'var(--border)'}`,
              borderRadius:'var(--radius-lg)', overflow:'hidden',
              transition:'border-color 0.15s', cursor:'pointer',
            }}
              onClick={() => setActive(isActive ? null : preset)}
            >
              <div style={{ padding:'16px 18px' }}>
                <div style={{ fontFamily:'var(--font-mono)', color:'var(--accent-blue)', fontSize:13, fontWeight:700, marginBottom:6 }}>{preset.label}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:12 }}>{preset.description}</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                  {tools.map(t => (
                    <span key={t.id} style={{
                      background:'var(--accent-blue)18', color:'var(--accent-blue)',
                      fontSize:10, fontFamily:'var(--font-mono)',
                      padding:'2px 8px', borderRadius:3,
                    }}>{t.name}</span>
                  ))}
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  {cats.map(c => <span key={c} style={{ fontSize:10, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{CATEGORIES[c]?.icon}</span>)}
                  <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text-muted)' }}>{tools.length} tools</span>
                </div>
              </div>

              {isActive && (
                <div style={{ borderTop:'1px solid var(--border)', padding:'14px 18px', background:'var(--bg-elevated)', animation:'fade-in 0.2s ease' }}
                  onClick={e => e.stopPropagation()}>
                  {tools.map(tool => {
                    const catColor = CATEGORIES[tool.category]?.color || 'var(--accent-blue)'
                    return (
                      <div key={tool.id} style={{
                        display:'flex', justifyContent:'space-between', alignItems:'center',
                        padding:'8px 0', borderBottom:'1px solid var(--border)',
                      }}>
                        <div>
                          <span style={{ fontFamily:'var(--font-mono)', color:catColor, fontSize:12 }}>{tool.name}</span>
                          <span style={{ color:'var(--text-muted)', fontSize:11, marginLeft:10 }}>{tool.description.slice(0,60)}…</span>
                        </div>
                        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                          <Btn onClick={() => onAskTool(tool)} color='var(--accent-blue)'>Ask AI</Btn>
                          <Btn onClick={() => onRunTool(tool)} color={catColor}>Run</Btn>
                        </div>
                      </div>
                    )
                  })}
                  <div style={{ marginTop:14, display:'flex', gap:8 }}>
                    <Btn onClick={() => genMethodology(preset)} disabled={loading}
                      color='var(--accent-green)' variant='solid'
                      style={{ flex:1, padding:'9px' }}>
                      {loading ? '⟳ Generating...' : '◈ Generate AI Methodology'}
                    </Btn>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Methodology output */}
      {(loading || methodology) && (
        <Card accent='var(--accent-green)'>
          <SectionHeader color='var(--accent-green)'>◈ AI-Generated Methodology</SectionHeader>
          {loading
            ? <div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--text-secondary)', fontSize:13 }}>
                <div style={{ animation:'blink 1s infinite', fontFamily:'var(--font-mono)' }}>▋</div>
                Generating methodology...
              </div>
            : <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>
                {methodology?.split('```').map((part, i) =>
                  i % 2 === 0
                    ? <span key={i}>{part}</span>
                    : <pre key={i} style={{ margin:'10px 0' }}>{part}</pre>
                )}
              </div>
          }
        </Card>
      )}
    </PageWrapper>
  )
}
