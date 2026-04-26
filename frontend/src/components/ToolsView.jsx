import { useState, useMemo } from 'react'
import { TOOLS, CATEGORIES } from '../utils/toolData.js'
import { PageWrapper, Badge, Btn, CommandBlock, SectionHeader, EmptyState } from './UI.jsx'

export default function ToolsView({ onAskTool, onRunTool }) {
  const [activeCategory, setActiveCategory] = useState('forensics')
  const [platform, setPlatform] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = useMemo(() => {
    return TOOLS.filter(t => {
      const matchCat = t.category === activeCategory
      const matchPlat = platform === 'all' || t.platform === platform || t.platform === 'both'
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchPlat && matchSearch
    })
  }, [activeCategory, platform, search])

  const cat = CATEGORIES[activeCategory]

  return (
    <PageWrapper title="⚙ Tools" subtitle={`${TOOLS.length} professional pentesting and forensics tools`}>
      {/* Category tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {Object.entries(CATEGORIES).map(([key, c]) => {
          const count = TOOLS.filter(t => t.category === key).length
          const active = activeCategory === key
          return (
            <button key={key} onClick={() => setActiveCategory(key)} style={{
              padding:'8px 16px', borderRadius:'var(--radius)', cursor:'pointer',
              fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:0.5,
              border:`1px solid ${active ? c.color : 'var(--border)'}`,
              background: active ? c.color + '18' : 'transparent',
              color: active ? c.color : 'var(--text-secondary)',
              transition:'all 0.15s',
            }}>
              {c.icon} {c.label.toUpperCase()} <span style={{ opacity:0.6 }}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:18, alignItems:'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search tools by name or description..."
          style={{ maxWidth:300 }}
        />
        <div style={{ display:'flex', gap:6 }}>
          {['all','android','ios'].map(p => (
            <Btn key={p} onClick={() => setPlatform(p)}
              color={platform === p ? cat.color : 'var(--text-muted)'}
              style={{ padding:'6px 14px' }}>
              {p.toUpperCase()}
            </Btn>
          ))}
        </div>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)', marginLeft:'auto' }}>
          {filtered.length} TOOLS
        </span>
      </div>

      {/* Tool list */}
      {filtered.length === 0
        ? <EmptyState icon='⚙' message='No tools match your filter' sub='Try adjusting your search or platform filter' />
        : filtered.map(tool => (
          <div key={tool.id} style={{
            background:'var(--bg-surface)',
            border:`1px solid var(--border)`,
            borderLeft:`3px solid ${cat.color}`,
            borderRadius:'var(--radius-lg)',
            marginBottom:10,
            overflow:'hidden',
            transition:'border-color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor=cat.color}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
          >
            {/* Header row */}
            <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}
              onClick={() => setExpanded(expanded === tool.id ? null : tool.id)}>
              <div style={{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 }}>
                <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:cat.color, fontSize:14 }}>{tool.name}</span>
                <Badge type='platform' value={tool.platform} />
                <Badge type='risk' value={tool.risk} />
                <span style={{ color:'var(--text-secondary)', fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tool.description}</span>
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0, marginLeft:12 }}>
                <Btn onClick={e => { e.stopPropagation(); onAskTool(tool) }} color='var(--accent-blue)'>Ask AI</Btn>
                <Btn onClick={e => { e.stopPropagation(); onRunTool(tool) }} color={cat.color}>Run</Btn>
                <span style={{ color:'var(--text-muted)', fontSize:14, padding:'0 4px' }}>{expanded === tool.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Expanded detail */}
            {expanded === tool.id && (
              <div style={{ padding:'0 16px 16px', borderTop:'1px solid var(--border)', paddingTop:14, animation:'fade-in 0.2s ease' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div>
                    <SectionHeader color='var(--text-muted)'>Command Template</SectionHeader>
                    <CommandBlock command={tool.command} />
                  </div>
                  <div>
                    <SectionHeader color='var(--text-muted)'>Details</SectionHeader>
                    <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:2 }}>
                      <div><span style={{ color:'var(--text-muted)' }}>Platform:</span> {tool.platform}</div>
                      <div><span style={{ color:'var(--text-muted)' }}>Risk:</span> <span style={{ color: tool.risk === 'high' ? 'var(--accent-orange)' : tool.risk === 'medium' ? 'var(--accent-yellow)' : 'var(--accent-green)' }}>{tool.risk}</span></div>
                      <div><span style={{ color:'var(--text-muted)' }}>Root required:</span> {tool.rootRequired ? '⚠️ Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      }
    </PageWrapper>
  )
}
