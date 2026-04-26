import { useState } from 'react'
import { RISK_COLOR, PLATFORM_COLOR } from '../utils/toolData.js'

export function Badge({ type, value }) {
  const colorMap = type === 'platform' ? PLATFORM_COLOR : RISK_COLOR
  const color = colorMap[value] || '#8b949e'
  const label = value.charAt(0).toUpperCase() + value.slice(1)
  return (
    <span style={{
      fontSize:10, fontFamily:'var(--font-mono)',
      background: color + '20', color, border:`1px solid ${color}44`,
      padding:'2px 7px', borderRadius:3, letterSpacing:1,
    }}>{label}</span>
  )
}

export function Btn({ children, onClick, color='var(--accent-green)', variant='outline', disabled, style={} }) {
  const [hover, setHover] = useState(false)
  const base = {
    border: `1px solid ${color}55`,
    color: variant === 'solid' ? 'var(--bg-base)' : color,
    background: variant === 'solid' ? color : hover ? color + '18' : 'transparent',
    padding:'6px 14px', borderRadius:'var(--radius)',
    fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:0.5,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition:'all 0.15s',
    ...style,
  }
  return (
    <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={base}>
      {children}
    </button>
  )
}

export function Card({ children, accent, style={} }) {
  return (
    <div style={{
      background:'var(--bg-surface)',
      border:`1px solid var(--border)`,
      borderLeft: accent ? `3px solid ${accent}` : undefined,
      borderRadius:'var(--radius-lg)',
      padding:20,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function SectionHeader({ children, mono=true, color='var(--text-secondary)', style={} }) {
  return (
    <div style={{
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontSize:11, letterSpacing:1.5, color,
      marginBottom:12, textTransform:'uppercase',
      ...style,
    }}>{children}</div>
  )
}

export function Tag({ label, color }) {
  return (
    <span style={{
      background: color + '18', color,
      fontSize:10, fontFamily:'var(--font-mono)',
      padding:'2px 8px', borderRadius:3,
    }}>{label}</span>
  )
}

export function PageWrapper({ children, title, subtitle }) {
  return (
    <div style={{ padding:'28px 32px', maxWidth:1140, margin:'0 auto', width:'100%', animation:'fade-in 0.3s ease' }}>
      {title && (
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontFamily:'var(--font-mono)', fontSize:18, color:'var(--text-primary)', marginBottom:4 }}>{title}</h1>
          {subtitle && <p style={{ color:'var(--text-secondary)', fontSize:13 }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export function CommandBlock({ command }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div style={{ position:'relative', marginTop:8 }}>
      <div style={{
        background:'var(--bg-base)', borderRadius:'var(--radius)',
        padding:'8px 40px 8px 12px',
        fontFamily:'var(--font-mono)', fontSize:11,
        color:'var(--accent-green)', overflowX:'auto', whiteSpace:'pre',
        border:'1px solid var(--border)',
      }}>{command}</div>
      <button onClick={copy} style={{
        position:'absolute', right:6, top:'50%', transform:'translateY(-50%)',
        background:'transparent', border:'none',
        color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
        fontSize:11, fontFamily:'var(--font-mono)', cursor:'pointer',
      }}>{copied ? '✓' : '⎘'}</button>
    </div>
  )
}

export function EmptyState({ icon='◉', message, sub }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}>
      <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text-secondary)', marginBottom:6 }}>{message}</div>
      {sub && <div style={{ fontSize:12 }}>{sub}</div>}
    </div>
  )
}

export function LoadingDots({ color='var(--accent-green)' }) {
  return (
    <div style={{ display:'flex', gap:4, alignItems:'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:6, height:6, borderRadius:'50%', background:color,
          animation:`pulse-dot 1s ${i*0.2}s infinite`,
        }} />
      ))}
    </div>
  )
}
