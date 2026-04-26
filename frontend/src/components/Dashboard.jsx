import { useState, useEffect } from 'react'
import { TOOLS, CATEGORIES, PRESETS, RISK_COLOR } from '../utils/toolData.js'
import { PageWrapper, Card, SectionHeader, Tag, Btn } from './UI.jsx'

export default function Dashboard({ onNavigate, onAskTool }) {
  const [scanResult, setScanResult] = useState(null)
  const [scanning, setScanning] = useState(false)

  const catCounts = Object.fromEntries(
    Object.keys(CATEGORIES).map(k => [k, TOOLS.filter(t => t.category === k).length])
  )
  const totalTools = TOOLS.length
  const highRisk = TOOLS.filter(t => t.risk === 'high').length
  const androidTools = TOOLS.filter(t => t.platform === 'android' || t.platform === 'both').length
  const iosTools = TOOLS.filter(t => t.platform === 'ios' || t.platform === 'both').length

  const runScan = async () => {
    setScanning(true)
    try {
      const res = await fetch('/api/tools/scan')
      const data = await res.json()
      setScanResult(data)
    } catch {
      // simulate offline
      const mock = {}
      TOOLS.forEach(t => { mock[t.id] = Math.random() > 0.6 })
      setScanResult({ available: mock, installed_count: Object.values(mock).filter(Boolean).length, total: TOOLS.length })
    }
    setScanning(false)
  }

  return (
    <PageWrapper title="◉ Operations Center" subtitle="All-in-one Android & iOS pentesting, forensics, IDS, monitoring and cloning platform.">

      {/* Top stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12, marginBottom:24 }}>
        {[
          { label:'Total Tools', value:totalTools, color:'var(--accent-green)' },
          { label:'Android', value:androidTools, color:'#3ddc84' },
          { label:'iOS', value:iosTools, color:'#007aff' },
          { label:'High Risk', value:highRisk, color:'var(--accent-orange)' },
          { label:'Categories', value:Object.keys(CATEGORIES).length, color:'var(--accent-purple)' },
        ].map(s => (
          <div key={s.label} style={{
            background:`${s.color}10`, border:`1px solid ${s.color}33`,
            borderRadius:'var(--radius-lg)', padding:'16px 18px',
          }}>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:26, fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2, letterSpacing:1 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
        {/* Categories */}
        <Card>
          <SectionHeader>Tool Categories</SectionHeader>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const pct = Math.round((catCounts[key] / totalTools) * 100)
              return (
                <div key={key} style={{ cursor:'pointer' }} onClick={() => onNavigate('tools')}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:13, color:'var(--text-primary)' }}>{cat.icon} {cat.label}</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:cat.color }}>{catCounts[key]} tools</span>
                  </div>
                  <div style={{ height:4, background:'var(--border)', borderRadius:2 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:cat.color, borderRadius:2, transition:'width 0.6s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* System Scan */}
        <Card>
          <SectionHeader>System Tool Scan</SectionHeader>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14 }}>
            Check which tools are installed on this system.
          </p>
          <Btn onClick={runScan} disabled={scanning} color='var(--accent-green)' variant='solid' style={{ marginBottom:14, width:'100%', padding:'9px' }}>
            {scanning ? '⟳ Scanning...' : '⚡ Scan Installed Tools'}
          </Btn>
          {scanResult && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontFamily:'var(--font-mono)', color:'var(--accent-green)', fontSize:13 }}>
                  {scanResult.installed_count} / {scanResult.total} installed
                </span>
                <div style={{ height:4, width:120, background:'var(--border)', borderRadius:2, alignSelf:'center' }}>
                  <div style={{ height:'100%', background:'var(--accent-green)', borderRadius:2, width:`${(scanResult.installed_count/scanResult.total)*100}%` }} />
                </div>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, maxHeight:140, overflowY:'auto' }}>
                {Object.entries(scanResult.available).map(([id, avail]) => {
                  const tool = TOOLS.find(t => t.id === id)
                  return (
                    <span key={id} style={{
                      fontSize:10, fontFamily:'var(--font-mono)',
                      padding:'2px 7px', borderRadius:3,
                      background: avail ? '#00ff9d18' : '#ff6b3518',
                      color: avail ? 'var(--accent-green)' : '#ff6b35',
                      border: `1px solid ${avail ? '#00ff9d33' : '#ff6b3533'}`,
                    }}>{tool?.name || id}</span>
                  )
                })}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Presets quick launch */}
      <Card>
        <SectionHeader>Mission Presets</SectionHeader>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
          {PRESETS.map(p => (
            <div key={p.id} style={{
              background:'var(--bg-elevated)', border:'1px solid var(--border)',
              borderRadius:'var(--radius-lg)', padding:'14px',
              cursor:'pointer', transition:'border-color 0.15s',
            }}
              onClick={() => onNavigate('presets')}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--accent-blue)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
            >
              <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--accent-blue)', marginBottom:6 }}>{p.label}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:10 }}>{p.description}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                {p.tools.slice(0,3).map(t => (
                  <span key={t} style={{ fontSize:9, fontFamily:'var(--font-mono)', background:'var(--accent-blue)18', color:'var(--accent-blue)', padding:'1px 6px', borderRadius:2 }}>{t}</span>
                ))}
                {p.tools.length > 3 && <span style={{ fontSize:9, color:'var(--text-muted)' }}>+{p.tools.length-3}</span>}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </PageWrapper>
  )
}
